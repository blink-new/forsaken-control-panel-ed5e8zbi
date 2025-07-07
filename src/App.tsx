import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skull, Users, Gamepad2, Zap, Settings, Save, Database, Eye, Sparkles } from 'lucide-react'
import { CharacterCreator } from './components/CharacterCreator'
import { CombatManager } from './components/CombatManager'
import { EnvironmentEditor } from './components/EnvironmentEditor'
import { SessionManager } from './components/SessionManager'
import { EntityList } from './components/EntityList'
import { AIPromptPanel } from './components/AIPromptPanel'
import { useGameState } from './hooks/useGameState'
import { motion } from 'framer-motion'

function App() {
  const [activeTab, setActiveTab] = useState('entities')
  const { gameState, dispatch } = useGameState()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Skull className="h-8 w-8 text-red-500" />
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                      FORSAKEN CONTROL PANEL
                    </h1>
                    <p className="text-sm text-purple-300">Dynamic Horror Game Management System</p>
                  </div>
                </div>
                <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30">
                  GLITCH ACTIVE
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
                  <Save className="h-4 w-4 mr-2" />
                  Save Session
                </Button>
                <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
                  <Database className="h-4 w-4 mr-2" />
                  Load
                </Button>
                <div className="flex items-center space-x-2 text-sm text-purple-300">
                  <Eye className="h-4 w-4" />
                  <span>Entities: {gameState.entities.length}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-black/40 border border-purple-500/30">
              <TabsTrigger value="entities" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                <Users className="h-4 w-4 mr-2" />
                Entities
              </TabsTrigger>
              <TabsTrigger value="combat" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300">
                <Zap className="h-4 w-4 mr-2" />
                Combat
              </TabsTrigger>
              <TabsTrigger value="environment" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Environment
              </TabsTrigger>
              <TabsTrigger value="session" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                <Settings className="h-4 w-4 mr-2" />
                Session
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Generator
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <TabsContent value="entities" className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 xl:grid-cols-3 gap-6"
                >
                  <div className="xl:col-span-2">
                    <CharacterCreator dispatch={dispatch} />
                  </div>
                  <div>
                    <EntityList gameState={gameState} dispatch={dispatch} />
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="combat" className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CombatManager gameState={gameState} dispatch={dispatch} />
                </motion.div>
              </TabsContent>

              <TabsContent value="environment" className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <EnvironmentEditor gameState={gameState} dispatch={dispatch} />
                </motion.div>
              </TabsContent>

              <TabsContent value="session" className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <SessionManager gameState={gameState} dispatch={dispatch} />
                </motion.div>
              </TabsContent>

              <TabsContent value="ai" className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AIPromptPanel gameState={gameState} dispatch={dispatch} />
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default App