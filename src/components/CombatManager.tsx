import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GameState, GameAction, GameEntity, EntityState } from "@/hooks/useGameState"
import { 
  Zap, 
  Heart, 
  Battery, 
  Brain, 
  Target, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Dices
} from "lucide-react"

interface CombatManagerProps {
  gameState: GameState
  dispatch: (action: GameAction) => void
}

export function CombatManager({ gameState, dispatch }: CombatManagerProps) {
  const [actionResult, setActionResult] = useState<string>('')
  const [damageAmount, setDamageAmount] = useState<number>(0)

  const activeCombatants = gameState.entities.filter(entity => 
    entity.state === 'Active' || entity.state === 'Downed'
  )

  const handleUseAbility = (entityId: string, abilityId: string) => {
    const entity = gameState.entities.find(e => e.id === entityId)
    const ability = entity?.abilities.find(a => a.id === abilityId)
    
    if (entity && ability) {
      // Check if entity has enough stamina
      if (entity.stats.stamina >= ability.staminaCost) {
        dispatch({ type: 'USE_ABILITY', entityId, abilityId })
        dispatch({ 
          type: 'UPDATE_STATS', 
          entityId, 
          stats: { stamina: entity.stats.stamina - ability.staminaCost }
        })
        dispatch({ 
          type: 'ADD_COMBAT_LOG', 
          message: `${entity.name} used ${ability.name} - ${ability.description}` 
        })
      }
    }
  }

  const handleDirectDamage = (entityId: string, amount: number) => {
    const entity = gameState.entities.find(e => e.id === entityId)
    if (entity) {
      const newHealth = Math.max(0, entity.stats.health - amount)
      dispatch({ 
        type: 'UPDATE_STATS', 
        entityId, 
        stats: { health: newHealth }
      })
      dispatch({ 
        type: 'ADD_COMBAT_LOG', 
        message: `${entity.name} takes ${amount} damage (${newHealth}/${entity.stats.maxHealth} HP remaining)` 
      })
      
      // Check if entity is downed
      if (newHealth <= 0 && entity.state !== 'Dead') {
        dispatch({ type: 'UPDATE_ENTITY', id: entityId, updates: { state: 'Downed' } })
        dispatch({ 
          type: 'ADD_COMBAT_LOG', 
          message: `${entity.name} is downed!` 
        })
      }
    }
  }

  const handleStatusChange = (entityId: string, newState: EntityState) => {
    const entity = gameState.entities.find(e => e.id === entityId)
    if (entity) {
      dispatch({ type: 'UPDATE_ENTITY', id: entityId, updates: { state: newState } })
      dispatch({ 
        type: 'ADD_COMBAT_LOG', 
        message: `${entity.name} state changed to ${newState}` 
      })
    }
  }

  const generateAIResult = () => {
    const results = [
      "The attack hits with devastating force, causing additional bleeding damage.",
      "The ability triggers a chain reaction, affecting nearby entities.",
      "A critical success! Double damage and the target is stunned.",
      "The attack fails spectacularly, causing the attacker to become vulnerable.",
      "A glitch occurs - reality warps around the combatants.",
      "The environment reacts violently to the ability usage.",
      "Sanity loss spreads to all nearby entities.",
      "The void whispers secrets, granting temporary power boost."
    ]
    const randomResult = results[Math.floor(Math.random() * results.length)]
    setActionResult(randomResult)
    dispatch({ type: 'ADD_COMBAT_LOG', message: `AI Result: ${randomResult}` })
  }

  const StatSlider = ({ 
    entity, 
    statName, 
    statKey, 
    icon: Icon, 
    color 
  }: { 
    entity: GameEntity
    statName: string
    statKey: keyof typeof entity.stats
    icon: React.ElementType
    color: string 
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <Label className="text-sm font-medium">{statName}</Label>
        </div>
        <span className="text-sm text-gray-400">
          {entity.stats[statKey]}/{entity.stats[`max${statName}` as keyof typeof entity.stats]}
        </span>
      </div>
      <Slider
        value={[entity.stats[statKey] as number]}
        max={entity.stats[`max${statName}` as keyof typeof entity.stats] as number}
        step={1}
        onValueChange={(value) => {
          dispatch({ 
            type: 'UPDATE_STATS', 
            entityId: entity.id, 
            stats: { [statKey]: value[0] } 
          })
        }}
        className="w-full"
      />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Combat Status Bar */}
      <Card className="bg-black/40 border-red-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-red-400 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Combat Status
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={gameState.combatActive ? "destructive" : "secondary"}>
                {gameState.combatActive ? "COMBAT ACTIVE" : "STANDBY"}
              </Badge>
              <Button
                variant={gameState.combatActive ? "destructive" : "default"}
                size="sm"
                onClick={() => 
                  gameState.combatActive 
                    ? dispatch({ type: 'END_COMBAT' })
                    : dispatch({ type: 'START_COMBAT' })
                }
              >
                {gameState.combatActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    End Combat
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Combat
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {activeCombatants.filter(e => e.state === 'Active').length}
              </div>
              <div className="text-sm text-gray-400">Active Combatants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {activeCombatants.filter(e => e.state === 'Downed').length}
              </div>
              <div className="text-sm text-gray-400">Downed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {gameState.currentZone.modifiers.length}
              </div>
              <div className="text-sm text-gray-400">Zone Modifiers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Entity Stats & Control */}
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-purple-400">Entity Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Select Entity</Label>
                <Select 
                  value={gameState.selectedEntity?.id || ''} 
                  onValueChange={(value) => {
                    const entity = gameState.entities.find(e => e.id === value)
                    dispatch({ type: 'SELECT_ENTITY', entity: entity || null })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an entity to manage" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameState.entities.map(entity => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name} - {entity.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {gameState.selectedEntity && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {gameState.selectedEntity.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {gameState.selectedEntity.state}
                    </Badge>
                  </div>

                  {/* Stats Sliders */}
                  <div className="space-y-3">
                    <StatSlider 
                      entity={gameState.selectedEntity} 
                      statName="Health" 
                      statKey="health" 
                      icon={Heart} 
                      color="text-red-400" 
                    />
                    <StatSlider 
                      entity={gameState.selectedEntity} 
                      statName="Stamina" 
                      statKey="stamina" 
                      icon={Battery} 
                      color="text-yellow-400" 
                    />
                    <StatSlider 
                      entity={gameState.selectedEntity} 
                      statName="Sanity" 
                      statKey="sanity" 
                      icon={Brain} 
                      color="text-blue-400" 
                    />
                    <StatSlider 
                      entity={gameState.selectedEntity} 
                      statName="Energy" 
                      statKey="energy" 
                      icon={Zap} 
                      color="text-purple-400" 
                    />
                  </div>

                  {/* Status Actions */}
                  <div className="space-y-2">
                    <Label>Change Status</Label>
                    <div className="flex flex-wrap gap-2">
                      {(['Active', 'Downed', 'Phased', 'Glitched', 'Dead'] as EntityState[]).map(status => (
                        <Button
                          key={status}
                          variant={gameState.selectedEntity.state === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(gameState.selectedEntity.id, status)}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Abilities */}
                  <div className="space-y-2">
                    <Label>Abilities</Label>
                    <div className="space-y-2">
                      {gameState.selectedEntity.abilities.map(ability => (
                        <div key={ability.id} className="flex items-center justify-between p-2 bg-gray-900/50 rounded">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{ability.name}</div>
                            <div className="text-xs text-gray-400">
                              Cost: {ability.staminaCost} | CD: {ability.cooldown}s
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={gameState.selectedEntity.stats.stamina < ability.staminaCost}
                            onClick={() => handleUseAbility(gameState.selectedEntity.id, ability.id)}
                          >
                            Use
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Combat Actions */}
        <Card className="bg-black/40 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-red-400">Combat Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="text-red-400 border-red-500/30"
                  onClick={() => {
                    if (gameState.selectedEntity) {
                      handleDirectDamage(gameState.selectedEntity.id, damageAmount || 10)
                    }
                  }}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Deal Damage
                </Button>
                <Button
                  variant="outline"
                  className="text-green-400 border-green-500/30"
                  onClick={() => {
                    if (gameState.selectedEntity) {
                      const healAmount = 20
                      const newHealth = Math.min(
                        gameState.selectedEntity.stats.maxHealth,
                        gameState.selectedEntity.stats.health + healAmount
                      )
                      dispatch({ 
                        type: 'UPDATE_STATS', 
                        entityId: gameState.selectedEntity.id, 
                        stats: { health: newHealth }
                      })
                      dispatch({ 
                        type: 'ADD_COMBAT_LOG', 
                        message: `${gameState.selectedEntity.name} heals for ${healAmount} HP` 
                      })
                    }
                  }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Heal
                </Button>
              </div>

              {/* Damage Input */}
              <div className="space-y-2">
                <Label>Damage Amount</Label>
                <Input
                  type="number"
                  value={damageAmount}
                  onChange={(e) => setDamageAmount(parseInt(e.target.value) || 0)}
                  placeholder="Enter damage amount"
                />
              </div>

              {/* AI Action Generator */}
              <div className="space-y-2">
                <Label>AI Action Generator</Label>
                <Button
                  variant="outline"
                  className="w-full text-purple-400 border-purple-500/30"
                  onClick={generateAIResult}
                >
                  <Dices className="h-4 w-4 mr-2" />
                  Generate AI Result
                </Button>
                {actionResult && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {actionResult}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Combat Log */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Combat Log</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch({ type: 'UPDATE_SESSION', updates: { combatLog: [] } })}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-40 w-full border border-gray-700 rounded p-2">
                  <div className="space-y-1">
                    {gameState.session.combatLog.map((log, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}