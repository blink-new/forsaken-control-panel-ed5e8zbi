import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { GameState, GameAction, EnvironmentZone } from "@/hooks/useGameState"
import { 
  MapPin, 
  Zap, 
  Skull, 
  Plus, 
  X,
  Shuffle,
  AlertTriangle,
  Settings
} from "lucide-react"

interface EnvironmentEditorProps {
  gameState: GameState
  dispatch: (action: GameAction) => void
}

export function EnvironmentEditor({ gameState, dispatch }: EnvironmentEditorProps) {
  const [newModifier, setNewModifier] = useState('')
  const [newLoreTag, setNewLoreTag] = useState('')
  const [newHazard, setNewHazard] = useState('')

  const predefinedZones = [
    {
      id: 'void-chamber',
      name: 'The Void Chamber',
      description: 'A dark, twisted space where reality bends and glitches manifest',
      modifiers: ['Sanity Drain', 'Glitch Interference'],
      loreTags: ['void', 'corruption', 'data_rot'],
      hazards: ['Memory Leak', 'Null Pointer Trap'],
      spawnSuggestions: ['Shadow Fragments', 'Corrupted Data Streams']
    },
    {
      id: 'level-7b',
      name: 'Level 7B: Data Rot Tunnel',
      description: 'Endless corridors of corrupted data where lost souls wander',
      modifiers: ['Fog Active', 'Sanity Loss x2', 'Speed Reduction'],
      loreTags: ['backrooms', 'data_corruption', 'lost_souls'],
      hazards: ['Phantom Entities', 'Data Corruption Pools', 'Echo Chambers'],
      spawnSuggestions: ['Wandering Spirits', 'Glitch Hounds', 'Memory Fragments']
    },
    {
      id: 'corruption-core',
      name: 'The Corruption Core',
      description: 'The heart of the digital nightmare where 1x1x1x1 once dwelt',
      modifiers: ['Extreme Corruption', 'Reality Distortion', 'Power Amplification'],
      loreTags: ['1x1x1x1', 'corruption', 'nightmare', 'power'],
      hazards: ['Reality Tears', 'Corruption Storms', 'Void Portals'],
      spawnSuggestions: ['Nightmare Entities', 'Corruption Avatars', 'Void Spawns']
    }
  ]

  const handleZoneUpdate = (updates: Partial<EnvironmentZone>) => {
    const updatedZone = { ...gameState.currentZone, ...updates }
    dispatch({ type: 'UPDATE_ZONE', zone: updatedZone })
  }

  const addModifier = () => {
    if (newModifier.trim()) {
      const updatedModifiers = [...gameState.currentZone.modifiers, newModifier.trim()]
      handleZoneUpdate({ modifiers: updatedModifiers })
      setNewModifier('')
    }
  }

  const removeModifier = (index: number) => {
    const updatedModifiers = gameState.currentZone.modifiers.filter((_, i) => i !== index)
    handleZoneUpdate({ modifiers: updatedModifiers })
  }

  const addLoreTag = () => {
    if (newLoreTag.trim()) {
      const updatedTags = [...gameState.currentZone.loreTags, newLoreTag.trim()]
      handleZoneUpdate({ loreTags: updatedTags })
      setNewLoreTag('')
    }
  }

  const removeLoreTag = (index: number) => {
    const updatedTags = gameState.currentZone.loreTags.filter((_, i) => i !== index)
    handleZoneUpdate({ loreTags: updatedTags })
  }

  const addHazard = () => {
    if (newHazard.trim()) {
      const updatedHazards = [...gameState.currentZone.hazards, newHazard.trim()]
      handleZoneUpdate({ hazards: updatedHazards })
      setNewHazard('')
    }
  }

  const removeHazard = (index: number) => {
    const updatedHazards = gameState.currentZone.hazards.filter((_, i) => i !== index)
    handleZoneUpdate({ hazards: updatedHazards })
  }

  const loadPredefinedZone = (zone: EnvironmentZone) => {
    dispatch({ type: 'UPDATE_ZONE', zone })
    dispatch({ type: 'ADD_COMBAT_LOG', message: `Environment changed to: ${zone.name}` })
  }

  const generateAIThreat = () => {
    const threats = [
      "A shadow figure materializes in the corner, watching silently",
      "The walls begin to glitch and distort, revealing glimpses of the void",
      "Corrupted data streams flow through the air like liquid mercury",
      "An echo of distant screaming bounces off invisible walls",
      "The temperature drops suddenly as phantom entities draw near",
      "Reality hiccups - for a moment, everything exists in two places at once",
      "A low, mechanical humming fills the air, growing louder",
      "The floor beneath begins to pixelate and break apart"
    ]
    const randomThreat = threats[Math.floor(Math.random() * threats.length)]
    dispatch({ type: 'ADD_COMBAT_LOG', message: `Environmental Event: ${randomThreat}` })
  }

  const generateAISpawnSuggestion = () => {
    const suggestions = [
      "A pack of Glitch Hounds emerges from corrupted data streams",
      "Memory Fragments coalesce into a hostile entity",
      "A Shadow Walker phases through the walls",
      "Corrupted code manifests as a living virus entity",
      "The void tears open, releasing nightmare creatures",
      "A lost soul, driven mad by corruption, attacks frantically",
      "Digital parasites swarm from hidden data caches",
      "A phantom echo of 1x1x1x1 appears briefly"
    ]
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    const updatedSuggestions = [...gameState.currentZone.spawnSuggestions, randomSuggestion]
    handleZoneUpdate({ spawnSuggestions: updatedSuggestions })
  }

  return (
    <div className="space-y-6">
      {/* Current Zone Display */}
      <Card className="bg-black/40 border-green-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-green-400 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Current Environment
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-300"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Zone
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {gameState.currentZone.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                {gameState.currentZone.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-green-400 mb-2 block">
                  Active Modifiers
                </Label>
                <div className="flex flex-wrap gap-2">
                  {gameState.currentZone.modifiers.map((modifier, index) => (
                    <Badge key={index} variant="outline" className="text-yellow-400 border-yellow-500/30">
                      <Zap className="h-3 w-3 mr-1" />
                      {modifier}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-green-400 mb-2 block">
                  Environmental Hazards
                </Label>
                <div className="flex flex-wrap gap-2">
                  {gameState.currentZone.hazards.map((hazard, index) => (
                    <Badge key={index} variant="outline" className="text-red-400 border-red-500/30">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {hazard}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-green-400 mb-2 block">
                  Lore Tags
                </Label>
                <div className="flex flex-wrap gap-2">
                  {gameState.currentZone.loreTags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-purple-400 border-purple-500/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-green-400 mb-2 block">
                  Recent Spawn Suggestions
                </Label>
                <div className="max-h-20 overflow-y-auto">
                  {gameState.currentZone.spawnSuggestions.slice(-3).map((suggestion, index) => (
                    <div key={index} className="text-xs text-gray-400 mb-1">
                      • {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Environment Controls */}
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-purple-400">Environment Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="text-red-400 border-red-500/30"
                  onClick={generateAIThreat}
                >
                  <Skull className="h-4 w-4 mr-2" />
                  Generate Threat
                </Button>
                <Button
                  variant="outline"
                  className="text-green-400 border-green-500/30"
                  onClick={generateAISpawnSuggestion}
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  AI Spawn Idea
                </Button>
              </div>

              {/* Zone Name & Description */}
              <div className="space-y-3">
                <div>
                  <Label>Zone Name</Label>
                  <Input
                    value={gameState.currentZone.name}
                    onChange={(e) => handleZoneUpdate({ name: e.target.value })}
                    className="bg-gray-900/50 border-purple-500/30"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={gameState.currentZone.description}
                    onChange={(e) => handleZoneUpdate({ description: e.target.value })}
                    className="bg-gray-900/50 border-purple-500/30"
                    rows={3}
                  />
                </div>
              </div>

              {/* Modifiers */}
              <div className="space-y-3">
                <Label>Zone Modifiers</Label>
                <div className="flex gap-2">
                  <Input
                    value={newModifier}
                    onChange={(e) => setNewModifier(e.target.value)}
                    placeholder="Add modifier..."
                    className="bg-gray-900/50 border-purple-500/30"
                    onKeyPress={(e) => e.key === 'Enter' && addModifier()}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addModifier}
                    className="border-purple-500/30"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {gameState.currentZone.modifiers.map((modifier, index) => (
                    <Badge key={index} variant="outline" className="text-yellow-400 border-yellow-500/30">
                      {modifier}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-3 w-3 p-0 hover:bg-red-500/20"
                        onClick={() => removeModifier(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Hazards */}
              <div className="space-y-3">
                <Label>Environmental Hazards</Label>
                <div className="flex gap-2">
                  <Input
                    value={newHazard}
                    onChange={(e) => setNewHazard(e.target.value)}
                    placeholder="Add hazard..."
                    className="bg-gray-900/50 border-purple-500/30"
                    onKeyPress={(e) => e.key === 'Enter' && addHazard()}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addHazard}
                    className="border-purple-500/30"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {gameState.currentZone.hazards.map((hazard, index) => (
                    <Badge key={index} variant="outline" className="text-red-400 border-red-500/30">
                      {hazard}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-3 w-3 p-0 hover:bg-red-500/20"
                        onClick={() => removeHazard(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Lore Tags */}
              <div className="space-y-3">
                <Label>Lore Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newLoreTag}
                    onChange={(e) => setNewLoreTag(e.target.value)}
                    placeholder="Add lore tag..."
                    className="bg-gray-900/50 border-purple-500/30"
                    onKeyPress={(e) => e.key === 'Enter' && addLoreTag()}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addLoreTag}
                    className="border-purple-500/30"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {gameState.currentZone.loreTags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-purple-400 border-purple-500/30">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-3 w-3 p-0 hover:bg-red-500/20"
                        onClick={() => removeLoreTag(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predefined Zones */}
        <Card className="bg-black/40 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-blue-400">Predefined Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predefinedZones.map((zone) => (
                <div key={zone.id} className="p-4 border border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{zone.name}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPredefinedZone(zone)}
                      className="border-blue-500/30 text-blue-300"
                    >
                      Load
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{zone.description}</p>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {zone.modifiers.slice(0, 3).map((modifier, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-yellow-400 border-yellow-500/30">
                          {modifier}
                        </Badge>
                      ))}
                      {zone.modifiers.length > 3 && (
                        <Badge variant="outline" className="text-xs text-gray-400">
                          +{zone.modifiers.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {zone.hazards.slice(0, 2).map((hazard, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-red-400 border-red-500/30">
                          {hazard}
                        </Badge>
                      ))}
                      {zone.hazards.length > 2 && (
                        <Badge variant="outline" className="text-xs text-gray-400">
                          +{zone.hazards.length - 2} hazards
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}