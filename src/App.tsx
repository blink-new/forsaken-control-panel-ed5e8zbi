import { useState } from 'react';
import { NavLink, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Skull, Users, Zap, Gamepad2, Settings, Bot } from 'lucide-react';
import { CharacterCreator } from './components/CharacterCreator';
import { EntityList } from './components/EntityList';
import { Character } from './lib/types';

const navItems = [
  { to: '/characters', icon: Users, label: 'Characters' },
  { to: '/combat', icon: Zap, label: 'Combat' },
  { to: '/environment', icon: Gamepad2, label: 'Environment' },
  { to: '/sessions', icon: Settings, label: 'Sessions' },
  { to: '/ai', icon: Bot, label: 'AI Tools' },
];

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleSaveCharacter = (character: Character) => {
    setCharacters(prev => [...prev.filter(c => c.id !== character.id), character]);
    setSelectedCharacter(null); // Deselect after saving
  };

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
  };

  const CharacterPage = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <CharacterCreator onSave={handleSaveCharacter} character={selectedCharacter} />
      </div>
      <div>
        <EntityList characters={characters} onSelectCharacter={handleSelectCharacter} />
      </div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/characters" replace />} />
            <Route path="/characters" element={<CharacterPage />} />
            <Route path="/combat" element={<div className='text-2xl'>Combat Manager</div>} />
            <Route path="/environment" element={<div className='text-2xl'>Environment Editor</div>} />
            <Route path="/sessions" element={<div className='text-2xl'>Session Manager</div>} />
            <Route path="/ai" element={<div className='text-2xl'>AI Tools</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const Sidebar = () => (
  <aside className="w-64 bg-gray-950/50 border-r border-purple-500/20 flex flex-col">
    <div className="p-6 border-b border-purple-500/20 flex items-center space-x-3">
      <Skull className="h-10 w-10 text-red-500 animate-glitch" />
      <div>
        <h1 className="text-lg font-bold text-red-400">FORSAKEN</h1>
        <p className="text-xs text-purple-300">CONTROL PANEL</p>
      </div>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ` +
            (isActive
              ? 'bg-purple-500/20 text-purple-200'
              : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-300')
          }
        >
          <item.icon className="h-5 w-5 mr-3" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default App;