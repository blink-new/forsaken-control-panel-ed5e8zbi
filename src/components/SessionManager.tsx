import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { GameState, GameAction } from "@/hooks/useGameState"
import { 
  Save, 
  Upload, 
  Clock, 
  MapPin, 
  FileText, 
  Download, 
  RotateCcw, 
  Timer,
  Database,
  Plus,
  X,
  Calendar
} from "lucide-react"

interface SessionManagerProps {
  gameState: GameState
  dispatch: (action: GameAction) => void
}

export function SessionManager({ gameState, dispatch }: SessionManagerProps) {
  const [newTimerName, setNewTimerName] = useState('')
  const [newTimerDuration, setNewTimerDuration] = useState(60)
  const [sessionNotes, setSessionNotes] = useState(gameState.session.sessionNotes)

  const formatDate = (date: Date) => {
    return date.toLocaleString()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const addTimer = () => {
    if (newTimerName.trim()) {
      const newTimer = {
        id: `timer-${Date.now()}`,
        name: newTimerName.trim(),
        remaining: newTimerDuration,
        total: newTimerDuration
      }
      
      const updatedTimers = [...gameState.session.activeTimers, newTimer]
      dispatch({ 
        type: 'UPDATE_SESSION', 
        updates: { activeTimers: updatedTimers }
      })
      
      setNewTimerName('')
      setNewTimerDuration(60)
    }
  }

  const removeTimer = (timerId: string) => {
    const updatedTimers = gameState.session.activeTimers.filter(timer => timer.id !== timerId)
    dispatch({ 
      type: 'UPDATE_SESSION', 
      updates: { activeTimers: updatedTimers }
    })
  }

  const updateTimerRemaining = (timerId: string, newRemaining: number) => {
    const updatedTimers = gameState.session.activeTimers.map(timer =>
      timer.id === timerId 
        ? { ...timer, remaining: Math.max(0, newRemaining) }
        : timer
    )
    dispatch({ 
      type: 'UPDATE_SESSION', 
      updates: { activeTimers: updatedTimers }
    })
  }

  const saveSessionNotes = () => {
    dispatch({ 
      type: 'UPDATE_SESSION', 
      updates: { sessionNotes }
    })
  }

  const saveSession = () => {
    // Simulate saving session
    const sessionData = {
      ...gameState.session,
      lastSaved: new Date()
    }
    
    dispatch({ 
      type: 'UPDATE_SESSION', 
      updates: { lastSaved: new Date() }
    })
    
    dispatch({ 
      type: 'ADD_COMBAT_LOG', 
      message: `Session "${sessionData.name}" saved successfully` 
    })
  }

  const loadSession = () => {
    // Simulate loading a session
    dispatch({ 
      type: 'ADD_COMBAT_LOG', 
      message: 'Session loading functionality would be implemented here' 
    })
  }

  const exportSession = () => {
    const sessionData = {
      session: gameState.session,
      entities: gameState.entities,
      currentZone: gameState.currentZone,
      globalModifiers: gameState.globalModifiers,
      exportedAt: new Date()
    }
    
    const dataStr = JSON.stringify(sessionData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `forsaken-session-${gameState.session.name.replace(/\s+/g, '-').toLowerCase()}.json`
    link.click()
    
    URL.revokeObjectURL(url)
    
    dispatch({ 
      type: 'ADD_COMBAT_LOG', 
      message: 'Session exported successfully' 
    })
  }

  const getSessionStats = () => {
    return {
      totalEntities: gameState.entities.length,
      activeEntities: gameState.entities.filter(e => e.state === 'Active').length,
      downedEntities: gameState.entities.filter(e => e.state === 'Downed').length,
      deadEntities: gameState.entities.filter(e => e.state === 'Dead').length,
      survivors: gameState.entities.filter(e => e.team === 'Survivor').length,
      killers: gameState.entities.filter(e => e.team === 'Killer').length,
      neutrals: gameState.entities.filter(e => e.team === 'Neutral').length
    }
  }

  const stats = getSessionStats()

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <Card className="bg-black/40 border-blue-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-blue-400 flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Session Overview
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={saveSession}
                className="border-green-500/30 text-green-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Session
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadSession}
                className="border-blue-500/30 text-blue-300"
              >
                <Upload className="h-4 w-4 mr-2" />
                Load Session
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportSession}
                className="border-purple-500/30 text-purple-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Session Details */}
            <div className="space-y-4">
              <div>
                <Label>Session Name</Label>
                <Input
                  value={gameState.session.name}
                  onChange={(e) => dispatch({ 
                    type: 'UPDATE_SESSION', 
                    updates: { name: e.target.value }
                  })}
                  className="bg-gray-900/50 border-blue-500/30"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-blue-400">Created</Label>
                  <div className="text-sm text-gray-300 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(gameState.session.createdAt)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-blue-400">Last Saved</Label>
                  <div className="text-sm text-gray-300 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatDate(gameState.session.lastSaved)}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-blue-400">Current Zone</Label>
                <div className="text-sm text-gray-300 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {gameState.currentZone.name}
                </div>
              </div>
            </div>

            {/* Session Stats */}
            <div className="space-y-4">
              <Label className="text-sm text-blue-400">Session Statistics</Label>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-lg font-bold text-green-400">{stats.totalEntities}</div>
                  <div className="text-xs text-gray-400">Total Entities</div>
                </div>
                <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-lg font-bold text-blue-400">{stats.activeEntities}</div>
                  <div className="text-xs text-gray-400">Active</div>
                </div>
                <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-400">{stats.downedEntities}</div>
                  <div className="text-xs text-gray-400">Downed</div>
                </div>
                <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-lg font-bold text-red-400">{stats.deadEntities}</div>
                  <div className="text-xs text-gray-400">Dead</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-400">Survivors</span>
                  <Badge variant="outline" className="text-green-400 border-green-500/30">
                    {stats.survivors}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-400">Killers</span>
                  <Badge variant="outline" className="text-red-400 border-red-500/30">
                    {stats.killers}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Neutrals</span>
                  <Badge variant="outline" className="text-gray-400 border-gray-500/30">
                    {stats.neutrals}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Active Timers */}
        <Card className="bg-black/40 border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-orange-400 flex items-center">
              <Timer className="h-5 w-5 mr-2" />
              Active Timers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add Timer */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={newTimerName}
                    onChange={(e) => setNewTimerName(e.target.value)}
                    placeholder="Timer name..."
                    className="bg-gray-900/50 border-orange-500/30"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={newTimerDuration}
                      onChange={(e) => setNewTimerDuration(parseInt(e.target.value) || 60)}
                      min={1}
                      max={3600}
                      className="bg-gray-900/50 border-orange-500/30"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addTimer}
                      className="border-orange-500/30"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timer List */}
              <div className="space-y-3">
                {gameState.session.activeTimers.length === 0 ? (
                  <div className="text-center text-gray-400 py-4">
                    No active timers
                  </div>
                ) : (
                  gameState.session.activeTimers.map((timer) => (
                    <div key={timer.id} className="p-3 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{timer.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-orange-400">
                            {formatDuration(timer.remaining)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimer(timer.id)}
                            className="h-6 w-6 p-0 hover:bg-red-500/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <Progress 
                        value={(timer.remaining / timer.total) * 100} 
                        className="h-2 mb-2"
                      />
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTimerRemaining(timer.id, timer.remaining - 10)}
                          className="text-xs border-red-500/30 text-red-300"
                        >
                          -10s
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTimerRemaining(timer.id, timer.remaining + 10)}
                          className="text-xs border-green-500/30 text-green-300"
                        >
                          +10s
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTimerRemaining(timer.id, timer.total)}
                          className="text-xs border-blue-500/30 text-blue-300"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Notes */}
        <Card className="bg-black/40 border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-gray-400 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Session Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Add session notes, important events, or reminders..."
                className="bg-gray-900/50 border-gray-500/30 min-h-[150px]"
              />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Auto-saved on session save
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveSessionNotes}
                  className="border-gray-500/30"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Notes
                </Button>
              </div>

              <Separator />

              {/* Combat Log Preview */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Recent Combat Log</Label>
                <ScrollArea className="h-32 w-full border border-gray-700 rounded p-2">
                  <div className="space-y-1">
                    {gameState.session.combatLog.slice(-10).map((log, index) => (
                      <div key={index} className="text-xs text-gray-300">
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