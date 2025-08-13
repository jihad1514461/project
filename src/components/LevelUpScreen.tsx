import React, { useState } from 'react';
import { Player, PlayerStats } from '../types/game';
import { TrendingUp, Plus, Minus } from 'lucide-react';

interface LevelUpScreenProps {
  player: Player;
  onApplyLevelUp: (statIncreases: { [key in keyof PlayerStats]?: number }) => void;
}

export const LevelUpScreen: React.FC<LevelUpScreenProps> = ({ player, onApplyLevelUp }) => {
  const [statIncreases, setStatIncreases] = useState<{ [key in keyof PlayerStats]?: number }>({});
  
  const availablePoints = 3; // Player gets 3 stat points per level
  const usedPoints = Object.values(statIncreases).reduce((sum, val) => sum + (val || 0), 0);
  const remainingPoints = availablePoints - usedPoints;

  const handleStatChange = (stat: keyof PlayerStats, change: number) => {
    const currentIncrease = statIncreases[stat] || 0;
    const newIncrease = Math.max(0, currentIncrease + change);
    
    if (change > 0 && remainingPoints <= 0) return;
    
    setStatIncreases(prev => ({
      ...prev,
      [stat]: newIncrease === 0 ? undefined : newIncrease
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(statIncreases).length > 0) {
      onApplyLevelUp(statIncreases);
    }
  };

  const getStatColor = (stat: keyof PlayerStats) => {
    const colors = {
      strength: 'text-red-400',
      intelligence: 'text-blue-400',
      magic: 'text-purple-400',
      vitality: 'text-green-400',
      luck: 'text-yellow-400',
      charm: 'text-pink-400',
      reputation: 'text-cyan-400',
      gold: 'text-yellow-400',
    };
    return colors[stat];
  };

  const getStatIcon = (stat: keyof PlayerStats) => {
    const icons = {
      strength: '⚔️',
      intelligence: '🧠',
      magic: '✨',
      vitality: '❤️',
      luck: '🍀',
      charm: '💫',
      reputation: '👑',
      gold: '💰',
    };
    return icons[stat];
  };

  const getStatDescription = (stat: keyof PlayerStats) => {
    const descriptions = {
      strength: 'Physical power and combat prowess',
      intelligence: 'Mental acuity and problem-solving ability',
      magic: 'Magical power and spellcasting ability',
      vitality: 'Health, endurance, and life force',
      luck: 'Fortune and chance in all endeavors',
      charm: 'Personal magnetism and social appeal',
      reputation: 'Social standing and influence',
      gold: 'Wealth and material resources',
    };
    return descriptions[stat];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <TrendingUp className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-2">Level Up!</h2>
            <p className="text-gray-400 text-lg">
              Congratulations! You've reached level {player.level + 1}
            </p>
            <p className="text-yellow-400 font-semibold mt-2 text-xl">
              You have {remainingPoints} stat points to distribute
            </p>
          </div>

          <div className="space-y-6">
            {(['strength', 'intelligence', 'vitality', 'magic', 'dexterity', 'agility', 'luck', 'charm'] as Array<keyof PlayerStats>).map((stat) => {
              const currentValue = player.stats[stat];
              const increase = statIncreases[stat] || 0;
              const newValue = currentValue + increase;

              return (
                <div
                  key={stat}
                  className="flex items-center justify-between p-6 bg-slate-700/50 rounded-xl border border-slate-600 hover:border-slate-500 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <span className={`text-3xl ${getStatColor(stat)}`}>
                      {getStatIcon(stat)}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg capitalize">
                        {stat}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {getStatDescription(stat)}
                      </p>
                      <p className="text-gray-300 text-sm mt-1">
                        Current: {currentValue} → New: {newValue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleStatChange(stat, -1)}
                      disabled={!statIncreases[stat]}
                      className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-200 transform hover:scale-110 disabled:transform-none"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <div className="text-center min-w-[3rem]">
                      <span className="text-white font-bold text-xl">
                        +{increase}
                      </span>
                    </div>

                    <button
                      onClick={() => handleStatChange(stat, 1)}
                      disabled={remainingPoints <= 0}
                      className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-200 transform hover:scale-110 disabled:transform-none"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center space-y-4">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <h3 className="text-white font-semibold mb-3">Level Up Bonuses:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-green-400">
                  ❤️ +1 Max Hearts (if Vitality increased)
                </div>
                <div className="text-blue-400">
                  ✨ +1 Max Mana (if Magic increased)
                </div>
                <div className="text-yellow-400">
                  🎯 +{player.level + 1} XP to next level threshold
                </div>
                <div className="text-purple-400">
                  🔮 Spell/Skill unlock at level {Math.ceil((player.level + 1) / 5) * 5}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={remainingPoints > 0}
              className="px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg text-lg"
            >
              {remainingPoints > 0 
                ? `Distribute ${remainingPoints} more point${remainingPoints === 1 ? '' : 's'}`
                : 'Confirm Level Up'
              }
            </button>
          </div>

          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>💡 Tip: Balance your stats based on your preferred playstyle!</p>
            <p className="mt-1">🎮 Your choices here will affect available story options and combat effectiveness</p>
          </div>
        </div>
      </div>
    </div>
  );
};