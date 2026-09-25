import React from 'react';
import { BaseChartResult, SystemId } from '../../types/systems';
import { AstrologyResultPage } from './AstrologyResultPage';
import { HumanDesignResultPage } from './HumanDesignResultPage';
import { NumerologyResultPage } from './NumerologyResultPage';
import { BaZiResultPage } from './BaZiResultPage';
import { ZiWeiResultPage } from './ZiWeiResultPage';
import { TzolkinResultPage } from './TzolkinResultPage';

interface ResultPageRouterProps {
  result: BaseChartResult;
  onBackToHome: () => void;
  onReconfigure: () => void;
  onCalculateOtherSystem: () => void;
  onNavigateToLibrary: (systemId?: SystemId) => void;
}

export const ResultPageRouter: React.FC<ResultPageRouterProps> = ({
  result,
  onBackToHome,
  onReconfigure,
  onCalculateOtherSystem,
  onNavigateToLibrary,
}) => {
  switch (result.systemId) {
    case 'astrology':
      return (
        <AstrologyResultPage
          result={result as any}
          onBackToHome={onBackToHome}
          onReconfigure={onReconfigure}
          onCalculateOtherSystem={onCalculateOtherSystem}
          onNavigateToLibrary={() => onNavigateToLibrary('astrology')}
        />
      );

    case 'human-design':
      return (
        <HumanDesignResultPage
          result={result as any}
          onBackToHome={onBackToHome}
          onReconfigure={onReconfigure}
          onCalculateOtherSystem={onCalculateOtherSystem}
          onNavigateToLibrary={() => onNavigateToLibrary('human-design')}
        />
      );

    case 'numerology':
      return (
        <NumerologyResultPage
          result={result as any}
          onBackToHome={onBackToHome}
          onReconfigure={onReconfigure}
          onCalculateOtherSystem={onCalculateOtherSystem}
          onNavigateToLibrary={() => onNavigateToLibrary('numerology')}
        />
      );

    case 'bazi':
      return (
        <BaZiResultPage
          result={result as any}
          onBackToHome={onBackToHome}
          onReconfigure={onReconfigure}
          onCalculateOtherSystem={onCalculateOtherSystem}
          onNavigateToLibrary={() => onNavigateToLibrary('bazi')}
        />
      );

    case 'zi-wei-dou-shu':
      return (
        <ZiWeiResultPage
          result={result as any}
          onBackToHome={onBackToHome}
          onReconfigure={onReconfigure}
          onCalculateOtherSystem={onCalculateOtherSystem}
          onNavigateToLibrary={() => onNavigateToLibrary('zi-wei-dou-shu')}
        />
      );

    case 'tzolkin':
      return (
        <TzolkinResultPage
          result={result as any}
          onBackToHome={onBackToHome}
          onReconfigure={onReconfigure}
          onCalculateOtherSystem={onCalculateOtherSystem}
          onNavigateToLibrary={() => onNavigateToLibrary('tzolkin')}
        />
      );

    default:
      return null;
  }
};
