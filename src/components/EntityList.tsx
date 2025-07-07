import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Trash2, Edit, Eye, Skull, Shield, Brain, Zap, Gauge } from 'lucide-react'
import { GameState, GameEntity } from '../hooks/useGameState'
import { motion } from 'framer-motion'

interface EntityListProps {
  gameState: GameState
  dispatch: (action: { type: string; [key: string]: unknown }) => void
}

export function EntityList({ gameState, dispatch }: EntityListProps) {
  const handleSelectEntity = (entity: GameEntity) => {
    dispatch({ type: 'SELECT_ENTITY', entity })
  }

  const handleDeleteEntity = (id: string) => {
    dispatch({ type: 'DELETE_ENTITY', id })
  }

  const getTeamColor = (team: string) => {
    switch (team) {
      case 'Survivor': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'Killer': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'Neutral': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'Active': return 'bg-green-500/20 text-green-300'
      case 'Downed': return 'bg-yellow-500/20 text-yellow-300'
      case 'Phased': return 'bg-blue-500/20 text-blue-300'
      case 'Glitched': return 'bg-purple-500/20 text-purple-300'
      case 'Dead': return 'bg-red-500/20 text-red-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  return (
    <Card className="bg-black/40 border-purple-500/30 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-purple-400" />
          <span>Entity List</span>
        </CardTitle>
        <CardDescription className="text-purple-300">
          Active entities in the current session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <div className="space-y-3">
            {gameState.entities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Skull className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No entities created yet</p>
                <p className="text-sm">Create your first entity to begin</p>
              </div>
            ) : (
              gameState.entities.map((entity, index) => (
                <motion.div
                  key={entity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    gameState.selectedEntity?.id === entity.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-purple-500/30 bg-black/60 hover:bg-black/80'
                  }`}
                  onClick={() => handleSelectEntity(entity)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-purple-300">{entity.name}</h3>
                        <Badge variant="outline" className={getTeamColor(entity.team)}>
                          {entity.team}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {entity.role}
                        </Badge>
                        <Badge variant="secondary" className={`text-xs ${getStateColor(entity.state)}`}>
                          {entity.state}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {entity.form}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{entity.description}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-purple-400 hover:bg-purple-500/20"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteEntity(entity.id)
                        }}
                        className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats Display */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <Skull className="h-3 w-3 text-red-400" />
                      <span className="text-gray-400">HP:</span>
                      <span className="text-white">{entity.stats.health}/{entity.stats.maxHealth}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-3 w-3 text-blue-400" />
                      <span className="text-gray-400">Stamina:</span>
                      <span className="text-white">{entity.stats.stamina}/{entity.stats.maxStamina}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Brain className="h-3 w-3 text-purple-400" />
                      <span className="text-gray-400">Sanity:</span>
                      <span className="text-white">{entity.stats.sanity}/{entity.stats.maxSanity}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-3 w-3 text-yellow-400" />
                      <span className="text-gray-400">Energy:</span>
                      <span className="text-white">{entity.stats.energy}/{entity.stats.maxEnergy}</span>
                    </div>
                  </div>

                  {/* Health Bar */}
                  <div className="mt-2 space-y-1">
                    <Progress 
                      value={(entity.stats.health / entity.stats.maxHealth) * 100} 
                      className="h-2 bg-black/60"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Health</span>
                      <span>{Math.round((entity.stats.health / entity.stats.maxHealth) * 100)}%</span>
                    </div>
                  </div>

                  {/* Abilities Count */}
                  {entity.abilities.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-purple-500/30">
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Gauge className="h-3 w-3" />
                        <span>{entity.abilities.length} abilities</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}