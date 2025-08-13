import React, { useState } from 'react';
import { User, ArrowLeft } from 'lucide-react';
import { GameData } from '../types/game';

interface PlayerCreationProps {
  gameData: GameData;
  onPlayerCreated: (name: string, gender: 'male' | 'female' | 'other', race: string, playerClass: string) => void;
  onBack: () => void;
}

export default function PlayerCreation({ gameData, onPlayerCreated, onBack }: PlayerCreationProps) {
  const [playerName, setPlayerName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && selectedRace && selectedClass) {
      onPlayerCreated(playerName.trim(), gender, selectedRace, selectedClass);
    }
  };

  const getStatColor = (stat: string) => {
    const colors: { [key: string]: string } = {
      strength: 'text-red-400',
      intelligence: 'text-blue-400',
      magic: 'text-purple-400',
      vitality: 'text-green-400',
      luck: 'text-yellow-400',
      charm: 'text-pink-400',
      reputation: 'text-cyan-400',
      gold: 'text-yellow-600'
    };
    return colors[stat] || 'text-gray-400';
  };

  const getStatIcon = (stat: string) => {
    const icons: { [key: string]: string } = {
      strength: '⚔️',
      intelligence: '🧠',
      magic: '✨',
      vitality: '❤️',
      luck: '🍀',
      charm: '💫',
      reputation: '👑',
      gold: '💰'
    };
    return icons[stat] || '📊';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <User className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Create Your Character</h1>
            <p className="text-gray-400">Choose your character's attributes to begin your adventure</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Character Name */}
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-2">
                Character Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your character's name"
                required
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Gender</label>
              <div className="grid grid-cols-3 gap-4">
                {(['male', 'female', 'other'] as const).map((genderOption) => (
                  <button
                    key={genderOption}
                    type="button"
                    onClick={() => setGender(genderOption)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 capitalize ${
                      gender === genderOption
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-slate-600 bg-slate-700/50 text-gray-300 hover:border-slate-500'
                    }`}
                  >
                    {genderOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Race Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Race</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(gameData.races).map(([raceName, raceStats]) => (
                  <button
                    key={raceName}
                    type="button"
                    onClick={() => setSelectedRace(raceName)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedRace === raceName
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <h3 className="text-white font-semibold mb-2">{raceName}</h3>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {Object.entries(raceStats).map(([stat, value]) => (
                        <div key={stat} className={`${getStatColor(stat)}`}>
                          {getStatIcon(stat)} +{value} {stat}
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Class</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(gameData.classes)
                  .filter(([_, classData]) => classData.tier === 0) // Only show starting classes
                  .map(([className, classData]) => (
                    <button
                      key={className}
                      type="button"
                      onClick={() => setSelectedClass(className)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                        selectedClass === className
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                    >
                      <h3 className="text-white font-semibold mb-2">{classData.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{classData.description}</p>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {Object.entries(classData.baseStats).map(([stat, value]) => (
                          <div key={stat} className={`${getStatColor(stat)}`}>
                            {getStatIcon(stat)} +{value} {stat}
                          </div>
                        ))}
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!playerName.trim() || !selectedRace || !selectedClass}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
            >
              Create Character
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}