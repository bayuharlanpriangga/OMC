export interface SolarSeal {
  number: number;
  name: string;
  mayaName: string;
  color: 'Red' | 'White' | 'Blue' | 'Yellow';
  action: string;
  power: string;
  essence: string;
  symbol: string;
}

export interface GalacticTone {
  number: number;
  name: string;
  creativePower: string;
  action: string;
  ray: string;
}

export interface TzolkinKin {
  kinNumber: number;
  seal: SolarSeal;
  tone: GalacticTone;
  affirmation: string;
}

export interface TzolkinCalculationResult {
  destinyKin: TzolkinKin;
  wavespellSeal: SolarSeal;
  wavespellDay: number;
  oracle: {
    guide: TzolkinKin;
    antipode: TzolkinKin;
    analog: TzolkinKin;
    occult: TzolkinKin;
  };
  castle: string;
  colorDirection: string;
}
