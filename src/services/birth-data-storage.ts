import { BirthProfile, CreateBirthProfileDto, UpdateBirthProfileDto } from '../types/birth-data';
import { supabase } from './supabase';

const STORAGE_KEY = 'metaphysica_birth_profiles_v2';

function mapRowToProfile(row: any): BirthProfile {
  return {
    id: row.id,
    name: row.name,
    relationship: row.relationship,
    birthDate: row.birth_date || row.birthDate,
    birthTime: row.is_time_unknown ? null : (row.birth_time || row.birthTime || null),
    isTimeUnknown: Boolean(row.is_time_unknown ?? row.isTimeUnknown),
    birthPlace: row.birth_place || row.birthPlace,
    country: row.country,
    latitude: Number(row.latitude) || 0,
    longitude: Number(row.longitude) || 0,
    timezone: row.timezone || 'UTC',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
  };
}

export class BirthDataStorage {
  /**
   * Retrieves all user birth profiles.
   * Returns empty array if no profiles have been created yet.
   */
  public static getAll(): BirthProfile[] {
    try {
      // Clear legacy hardcoded seed storage if present
      if (localStorage.getItem('metaphysica_birth_profiles_v1')) {
        localStorage.removeItem('metaphysica_birth_profiles_v1');
      }

      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data) as BirthProfile[];
      return parsed.map((p) => ({
        ...p,
        birthTime: p.isTimeUnknown ? null : p.birthTime,
      }));
    } catch {
      return [];
    }
  }

  public static getById(id: string): BirthProfile | undefined {
    return this.getAll().find((p) => p.id === id);
  }

  /**
   * Syncs and fetches birth profiles from Supabase if authenticated
   */
  public static async syncFromSupabase(): Promise<BirthProfile[]> {
    try {
      const { data: authData } = await supabase.auth.getSession();
      const user = authData?.session?.user;
      if (!user) {
        return this.getAll();
      }

      const { data, error } = await supabase
        .from('birth_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase query note (using local cache):', error.message);
        return this.getAll();
      }

      if (data && Array.isArray(data)) {
        const cloudProfiles = data.map(mapRowToProfile);
        this.saveAll(cloudProfiles);
        return cloudProfiles;
      }
    } catch (e) {
      console.warn('Supabase sync skipped, continuing with local store:', e);
    }
    return this.getAll();
  }

  public static create(dto: CreateBirthProfileDto): BirthProfile {
    const profiles = this.getAll();
    const newProfile: BirthProfile = {
      ...dto,
      id: `profile-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      birthTime: dto.isTimeUnknown ? null : dto.birthTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    profiles.unshift(newProfile);
    this.saveAll(profiles);

    // Asynchronously push to Supabase in background
    this.asyncPushCreate(newProfile);

    return newProfile;
  }

  public static update(dto: UpdateBirthProfileDto): BirthProfile {
    const profiles = this.getAll();
    const index = profiles.findIndex((p) => p.id === dto.id);
    if (index === -1) {
      throw new Error(`Profile with id ${dto.id} not found`);
    }

    const current = profiles[index];
    const isUnknown = dto.isTimeUnknown !== undefined ? dto.isTimeUnknown : current.isTimeUnknown;
    const updated: BirthProfile = {
      ...current,
      ...dto,
      isTimeUnknown: isUnknown,
      birthTime: isUnknown ? null : (dto.birthTime !== undefined ? dto.birthTime : current.birthTime),
      updatedAt: new Date().toISOString(),
    };

    profiles[index] = updated;
    this.saveAll(profiles);

    // Asynchronously push to Supabase in background
    this.asyncPushUpdate(updated);

    return updated;
  }

  public static delete(id: string): boolean {
    const profiles = this.getAll();
    const filtered = profiles.filter((p) => p.id !== id);
    if (filtered.length !== profiles.length) {
      this.saveAll(filtered);
      // Asynchronously delete from Supabase
      this.asyncPushDelete(id);
      return true;
    }
    return false;
  }

  public static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('metaphysica_birth_profiles_v1');
  }

  private static async asyncPushCreate(profile: BirthProfile) {
    try {
      const { data: authData } = await supabase.auth.getSession();
      const user = authData?.session?.user;
      if (user) {
        await this.syncToSupabaseUpsert(profile, user.id);
      }
    } catch (e) {
      console.warn('Background Supabase create note:', e);
    }
  }

  private static async asyncPushUpdate(profile: BirthProfile) {
    try {
      const { data: authData } = await supabase.auth.getSession();
      const user = authData?.session?.user;
      if (user) {
        await this.syncToSupabaseUpsert(profile, user.id);
      }
    } catch (e) {
      console.warn('Background Supabase update note:', e);
    }
  }

  private static async asyncPushDelete(id: string) {
    try {
      const { data: authData } = await supabase.auth.getSession();
      const user = authData?.session?.user;
      if (user) {
        await supabase.from('birth_profiles').delete().eq('id', id);
      }
    } catch (e) {
      console.warn('Background Supabase delete note:', e);
    }
  }

  private static async syncToSupabaseUpsert(profile: BirthProfile, userId: string) {
    await supabase.from('birth_profiles').upsert({
      id: profile.id,
      user_id: userId,
      name: profile.name,
      relationship: profile.relationship,
      birth_date: profile.birthDate,
      birth_time: profile.isTimeUnknown ? null : profile.birthTime,
      is_time_unknown: profile.isTimeUnknown,
      birth_place: profile.birthPlace,
      country: profile.country,
      latitude: profile.latitude,
      longitude: profile.longitude,
      timezone: profile.timezone,
      updated_at: profile.updatedAt,
    });
  }

  private static saveAll(profiles: BirthProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error('Error saving profiles to localStorage', e);
    }
  }
}
