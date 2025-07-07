export type Role = 'Survivor' | 'Killer' | 'Boss' | 'Glitched Entity';
export type Team = 'Killer' | 'Survivor' | 'Neutral';
export type Form = 'Corrupted' | 'Reformed' | 'Alpha' | 'Omega';
export type State = 'Active' | 'Downed' | 'Phased' | 'Glitched' | 'Destroyed';

export interface Stats {
  health: number;
  stamina: number;
  sanity: number;
  energy: number;
  movementSpeed: number;
}

export interface Ability {
  id: string;
  name: string;
  staminaCost: number;
  cooldown: number;
  tags: string[];
  effectLogic: string;
  description: string;
  visualFX: string;
  audioFX: string;
}

export interface Character {
  id: string;
  name:string;
  role: Role;
  description: string;
  subDescription: string;
  visualIdUrl: string; // URL to portrait
  stats: Stats;
  abilities: Ability[];
  team: Team;
  form: Form;
  state: State;
  tags: string[];
}

export interface Environment {
    zone: string;
    modifiers: string[];
    loreTags: string[];
    ambientTrackUrl?: string;
}

export interface Session {
    id: string;
    name: string;
    characters: Character[];
    environment: Environment;
    activeTimers: Record<string, unknown>[];
    activeFX: Record<string, unknown>[];
}

export interface GameState {
    characters: Character[];
    environment: Environment;
    session: Session | null;
    activeCombatants: string[]; // array of character IDs
}