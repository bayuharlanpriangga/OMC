/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { m3Theme } from './theme/m3Theme';
import { BirthProfile, CreateBirthProfileDto } from './types/birth-data';
import { AstrologyChartTypeId, BaseChartResult, GenerationConfig, SystemId } from './types/systems';
import { BirthDataStorage } from './services/birth-data-storage';
import { supabase } from './services/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { GenerationOrchestrator } from './services/generation-orchestrator';
import { METAPHYSICAL_SYSTEMS } from './systems/registry';

// Layout & Navigation
import { Navbar } from './components/layout/Navbar';

// Major Views
import { HomePage } from './features/home/HomePage';
import { LibraryPage } from './features/library/LibraryPage';
import { ResultPageRouter } from './features/results/ResultPageRouter';
import { GenerationLoadingScreen } from './features/generation/GenerationLoadingScreen';

// Modals
import { BirthProfileManagerModal } from './features/birth-data/BirthProfileManagerModal';
import { GenerationWizardModal } from './features/generation/GenerationWizardModal';
import { SettingsModal } from './features/settings/SettingsModal';
import { AuthModal } from './features/auth/AuthModal';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'library' | 'result'>('home');
  const [libraryInitialCategory, setLibraryInitialCategory] = useState<SystemId | 'all'>('all');

  // Supabase Auth State
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Modals Visibility
  const [birthDataModalOpen, setBirthDataModalOpen] = useState(false);
  const [generationWizardOpen, setGenerationWizardOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Generation Wizard State & Prefill
  const [initialGenerationSystemId, setInitialGenerationSystemId] = useState<SystemId | undefined>(undefined);
  const [initialAstrologyChartTypeId, setInitialAstrologyChartTypeId] = useState<AstrologyChartTypeId | undefined>(undefined);
  const [wizardInitialStep, setWizardInitialStep] = useState(0);
  const [wizardInitialSettings, setWizardInitialSettings] = useState<Record<string, any> | undefined>(undefined);

  // Calculation Execution & Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationContext, setGenerationContext] = useState<{
    systemName: string;
    chartTypeName?: string;
    profile?: BirthProfile;
  } | null>(null);
  const [activeCalculationResult, setActiveCalculationResult] = useState<BaseChartResult | null>(null);

  // Stored Profiles Repository State
  const [profiles, setProfiles] = useState<BirthProfile[]>([]);
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);

  // Initialize Auth & Profiles on mount
  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      loadProfiles();
    });

    // 2. Listen to Supabase auth events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      loadProfiles();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfiles = async () => {
    // Immediate local cache
    const initialList = BirthDataStorage.getAll();
    setProfiles(initialList);
    if (initialList.length > 0 && selectedProfileIds.length === 0) {
      setSelectedProfileIds([initialList[0].id]);
    }

    // Cloud Supabase sync
    try {
      const cloudList = await BirthDataStorage.syncFromSupabase();
      if (cloudList && cloudList.length > 0) {
        setProfiles(cloudList);
        if (selectedProfileIds.length === 0) {
          setSelectedProfileIds([cloudList[0].id]);
        }
      }
    } catch (e) {
      console.warn('Sync note:', e);
    }
  };

  const handleSaveProfile = (dto: CreateBirthProfileDto, editingId?: string) => {
    if (editingId) {
      BirthDataStorage.update({ ...dto, id: editingId });
    } else {
      const created = BirthDataStorage.create(dto);
      setSelectedProfileIds([created.id]);
    }
    loadProfiles();
  };

  const handleDeleteProfile = (id: string) => {
    BirthDataStorage.delete(id);
    setSelectedProfileIds((prev) => prev.filter((pId) => pId !== id));
    loadProfiles();
  };

  const handleResetProfiles = () => {
    BirthDataStorage.clearAll();
    setSelectedProfileIds([]);
    loadProfiles();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      loadProfiles();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Launch Generation Wizard
  const handleStartCalculation = (systemId?: SystemId) => {
    setInitialGenerationSystemId(systemId);
    setInitialAstrologyChartTypeId(undefined);
    setWizardInitialStep(systemId ? 3 : 0);
    setWizardInitialSettings(undefined);
    setGenerationWizardOpen(true);
  };

  // Execute Generation with Loading Screen Transition
  const handleExecuteGeneration = async (config: GenerationConfig, selectedProfilesList: BirthProfile[]) => {
    const primaryProfile = selectedProfilesList[0];
    const systemName = METAPHYSICAL_SYSTEMS[config.systemId]?.name || config.systemId;
    const chartTypeName = config.astrologyChartTypeId
      ? `${config.astrologyChartTypeId.toUpperCase()} Chart`
      : undefined;

    setGenerationContext({
      systemName,
      chartTypeName,
      profile: primaryProfile,
    });
    setIsGenerating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const startTime = Date.now();

    try {
      const result = await GenerationOrchestrator.execute(config, selectedProfilesList);

      // Natural smooth transition minimum duration (~1300ms)
      const elapsed = Date.now() - startTime;
      const minDuration = 1300;
      if (elapsed < minDuration) {
        await new Promise((res) => setTimeout(res, minDuration - elapsed));
      }

      setActiveCalculationResult(result);
      setIsGenerating(false);
      setCurrentTab('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Calculation error:', err);
      setIsGenerating(false);
      alert(err.message || 'Terjadi kesalahan saat kalkulasi.');
      setGenerationWizardOpen(true);
    }
  };

  // Reconfigure from Result Page
  const handleReconfigure = () => {
    if (activeCalculationResult) {
      setInitialGenerationSystemId(activeCalculationResult.systemId);
      setInitialAstrologyChartTypeId(activeCalculationResult.chartTypeId as AstrologyChartTypeId);
      setWizardInitialStep(3); // open at configuration step
      setWizardInitialSettings(activeCalculationResult.data?.settings);
      setGenerationWizardOpen(true);
    }
  };

  const handleCalculateOtherSystem = () => {
    setWizardInitialStep(1); // open at system selection step
    setGenerationWizardOpen(true);
  };

  const handleNavigateToLibrary = (category?: SystemId) => {
    setLibraryInitialCategory(category || 'all');
    setCurrentTab('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={m3Theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#000000',
          color: '#EDF1F7',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Universal Top Application Bar */}
        <Navbar
          currentTab={currentTab === 'library' ? 'library' : 'home'}
          user={user}
          profiles={profiles}
          selectedProfileIds={selectedProfileIds}
          onSelectProfile={(id) => setSelectedProfileIds([id])}
          onNavigate={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenBirthData={() => setBirthDataModalOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onStartCalculation={() => handleStartCalculation()}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main Content Router */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          {isGenerating ? (
            <GenerationLoadingScreen
              systemName={generationContext?.systemName || 'Metafisika'}
              chartTypeName={generationContext?.chartTypeName}
              profile={generationContext?.profile}
            />
          ) : currentTab === 'result' && activeCalculationResult ? (
            <ResultPageRouter
              result={activeCalculationResult}
              onBackToHome={() => {
                setCurrentTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onReconfigure={handleReconfigure}
              onCalculateOtherSystem={handleCalculateOtherSystem}
              onNavigateToLibrary={handleNavigateToLibrary}
            />
          ) : currentTab === 'library' ? (
            <LibraryPage
              initialCategory={libraryInitialCategory}
              onStartCalculationForSystem={(sysId) => handleStartCalculation(sysId)}
            />
          ) : (
            <HomePage
              profiles={profiles}
              onStartCalculation={handleStartCalculation}
              onNavigateToLibrary={handleNavigateToLibrary}
              onOpenBirthData={() => setBirthDataModalOpen(true)}
            />
          )}
        </Box>

        {/* Profile Menu -> Birth Data Manager Modal */}
        <BirthProfileManagerModal
          open={birthDataModalOpen}
          onClose={() => setBirthDataModalOpen(false)}
          profiles={profiles}
          selectedProfileIds={selectedProfileIds}
          onSelectProfiles={setSelectedProfileIds}
          onSaveProfile={handleSaveProfile}
          onDeleteProfile={handleDeleteProfile}
        />

        {/* Core Multi-System Generation Wizard Modal */}
        <GenerationWizardModal
          open={generationWizardOpen}
          onClose={() => setGenerationWizardOpen(false)}
          profiles={profiles}
          initialSystemId={initialGenerationSystemId}
          initialAstrologyChartTypeId={initialAstrologyChartTypeId}
          initialStep={wizardInitialStep}
          initialSettings={wizardInitialSettings}
          onSaveProfile={handleSaveProfile}
          onOpenBirthDataManager={() => {
            setGenerationWizardOpen(false);
            setBirthDataModalOpen(true);
          }}
          onExecuteGeneration={handleExecuteGeneration}
        />

        {/* Settings Modal */}
        <SettingsModal
          open={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          onResetProfiles={handleResetProfiles}
        />

        {/* Supabase Authentication Modal */}
        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={loadProfiles}
        />
      </Box>
    </ThemeProvider>
  );
}
