/**
 * Domain Models for Metaphysica Birth Data
 *
 * CRITICAL RULE:
 * Unknown birth time MUST be represented explicitly as null/unknown.
 * Never convert unknown birth time to "00:00".
 * 00:00 = known midnight.
 * null = unknown time.
 */

export type ProfileRelationship = 
  | 'Myself' 
  | 'Someone Else' 
  | 'Family' 
  | 'Partner' 
  | 'Friend' 
  | 'Other';

export interface BirthLocation {
  placeName: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface BirthProfile {
  id: string;
  name: string;
  relationship: ProfileRelationship;
  birthDate: string; // ISO date string: YYYY-MM-DD
  birthTime: string | null; // HH:mm format OR null for unknown. NEVER '00:00' unless known midnight!
  isTimeUnknown: boolean;
  birthPlace: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBirthProfileDto {
  name: string;
  relationship: ProfileRelationship;
  birthDate: string;
  birthTime: string | null;
  isTimeUnknown: boolean;
  birthPlace: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface UpdateBirthProfileDto extends Partial<CreateBirthProfileDto> {
  id: string;
}
