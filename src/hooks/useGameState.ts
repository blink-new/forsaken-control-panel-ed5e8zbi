import { useReducer } from 'react'

export type EntityRole = 'Survivor' | 'Killer' | 'Boss' | 'Glitched Entity'
export type EntityTeam = 'Killer' | 'Survivor' | 'Neutral'
export type EntityForm = 'Corrupted' | 'Reformed' | 'Alpha' | 'Base'
export type EntityState = 'Active' | 'Downed' | 'Phased' | 'Glitched' | 'Dead'

export interface EntityStats {
  health: number
  maxHealth: number
  stamina: number
  maxStamina: number
  sanity: number
  maxSanity: number
  energy: number
  maxEnergy: number
  movementSpeed: number
}

export interface Ability {
  id: string
  name: string
  description: string
  staminaCost: number
  cooldown: number
  tags: string[]
  effectLogic: string
  visualFX: string
  audioFX: string
  isActive: boolean
  remainingCooldown: number
}

export interface GameEntity {
  id: string
  name: string
  role: EntityRole
  team: EntityTeam
  form: EntityForm
  state: EntityState
  stats: EntityStats
  description: string
  subDescription: string
  portraitUrl?: string
  abilities: Ability[]
  createdAt: Date
  lastModified: Date
}

export interface EnvironmentZone {
  id: string
  name: string
  description: string
  modifiers: string[]
  loreTags: string[]
  ambientMusic?: string
  backgroundImage?: string
  hazards: string[]
  spawnSuggestions: string[]
}

export interface GameSession {
  id: string
  name: string
  createdAt: Date
  lastSaved: Date
  currentZone: EnvironmentZone
  activeTimers: Array<{
    id: string
    name: string
    remaining: number
    total: number
  }>
  sessionNotes: string
  combatLog: string[]
}

export interface GameState {
  entities: GameEntity[]
  selectedEntity: GameEntity | null
  currentZone: EnvironmentZone
  session: GameSession
  combatActive: boolean
  globalModifiers: string[]
  aiSuggestions: string[]
}

type GameAction = 
  | { type: 'ADD_ENTITY'; entity: GameEntity }
  | { type: 'UPDATE_ENTITY'; id: string; updates: Partial<GameEntity> }
  | { type: 'DELETE_ENTITY'; id: string }
  | { type: 'SELECT_ENTITY'; entity: GameEntity | null }
  | { type: 'UPDATE_ZONE'; zone: EnvironmentZone }
  | { type: 'START_COMBAT' }
  | { type: 'END_COMBAT' }
  | { type: 'ADD_COMBAT_LOG'; message: string }
  | { type: 'UPDATE_SESSION'; updates: Partial<GameSession> }
  | { type: 'USE_ABILITY'; entityId: string; abilityId: string }
  | { type: 'UPDATE_STATS'; entityId: string; stats: Partial<EntityStats> }
  | { type: 'SET_AI_SUGGESTIONS'; suggestions: string[] }

const defaultZone: EnvironmentZone = {
  id: 'default',
  name: 'The Void Chamber',
  description: 'A dark, twisted space where reality bends and glitches manifest',
  modifiers: ['Sanity Drain', 'Glitch Interference'],
  loreTags: ['void', 'corruption', 'data_rot'],
  hazards: ['Memory Leak', 'Null Pointer Trap'],
  spawnSuggestions: ['Shadow Fragments', 'Corrupted Data Streams']
}

const defaultSession: GameSession = {
  id: 'session-1',
  name: 'Forsaken Session Alpha',
  createdAt: new Date(),
  lastSaved: new Date(),
  currentZone: defaultZone,
  activeTimers: [],
  sessionNotes: '',
  combatLog: []
}

const initialState: GameState = {
  entities: [],
  selectedEntity: null,
  currentZone: defaultZone,
  session: defaultSession,
  combatActive: false,
  globalModifiers: [],
  aiSuggestions: []
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_ENTITY':
      return {
        ...state,
        entities: [...state.entities, action.entity]
      }
    
    case 'UPDATE_ENTITY':
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.id 
            ? { ...entity, ...action.updates, lastModified: new Date() }
            : entity
        ),
        selectedEntity: state.selectedEntity?.id === action.id
          ? { ...state.selectedEntity, ...action.updates, lastModified: new Date() }
          : state.selectedEntity
      }
    
    case 'DELETE_ENTITY':
      return {
        ...state,
        entities: state.entities.filter(entity => entity.id !== action.id),
        selectedEntity: state.selectedEntity?.id === action.id ? null : state.selectedEntity
      }
    
    case 'SELECT_ENTITY':
      return {
        ...state,
        selectedEntity: action.entity
      }
    
    case 'UPDATE_ZONE':
      return {
        ...state,
        currentZone: action.zone,
        session: {
          ...state.session,
          currentZone: action.zone
        }
      }
    
    case 'START_COMBAT':
      return {
        ...state,
        combatActive: true
      }
    
    case 'END_COMBAT':
      return {
        ...state,
        combatActive: false
      }
    
    case 'ADD_COMBAT_LOG':
      return {
        ...state,
        session: {
          ...state.session,
          combatLog: [...state.session.combatLog, action.message]
        }
      }
    
    case 'UPDATE_SESSION':
      return {
        ...state,
        session: {
          ...state.session,
          ...action.updates,
          lastSaved: new Date()
        }
      }
    
    case 'USE_ABILITY':
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.entityId
            ? {
                ...entity,
                abilities: entity.abilities.map(ability =>
                  ability.id === action.abilityId
                    ? { ...ability, isActive: true, remainingCooldown: ability.cooldown }
                    : ability
                )
              }
            : entity
        )
      }
    
    case 'UPDATE_STATS':
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.entityId
            ? { ...entity, stats: { ...entity.stats, ...action.stats } }
            : entity
        ),
        selectedEntity: state.selectedEntity?.id === action.entityId
          ? { ...state.selectedEntity, stats: { ...state.selectedEntity.stats, ...action.stats } }
          : state.selectedEntity
      }
    
    case 'SET_AI_SUGGESTIONS':
      return {
        ...state,
        aiSuggestions: action.suggestions
      }
    
    default:
      return state
  }
}

export function useGameState() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState)
  
  return { gameState, dispatch }
}