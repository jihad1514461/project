import React, { useState } from 'react';
import { Player, GameData, Spell, Skill } from '../types/game';
import { Sparkles, ArrowLeft, Zap, Star } from 'lucide-react';

interface SpellSkillChoiceProps {
  player: Player;
  gameData: GameData;
  onChoice: (type: 'spell' | 'skill', id: string) => void;
  onBack: () => void;
}

export const SpellSkillChoice: React.FC<SpellSkillChoiceProps> = ({
  player,
  gameData,
  onChoice,
  onBack
}) => {
  const [selectedType, setSelectedType] = useState<'spell' | 'skill'>('spell');
  const [selectedId, setSelectedId] = useState<string>('');

  const getAvailableSpells = (): Spell[] => {
    return Object.values(gameData.spells).filter(spell => {
      // Check if already known
      if (player.spells.includes(spell.id) || player.unlockedSpells.includes(spell.id)) {
        return false;
      }

      // Check level requirement
      if (player.level < spell.requirements.level) {
        return false;
      }

      // Check stat requirements
      if (spell.requirements.stats) {
        for (const [stat, required] of Object.entries(spell.requirements.stats)) {
          if (player.stats[stat as keyof typeof player.stats] < required) {
            return false;
          }
        }
      }

      // Check class requirements
      if (spell.requirements.classes) {
        const hasRequiredClass = spell.requirements.classes.some(className =>
          player.classes.some(c => c.name === className)
        );
        if (!hasRequiredClass) {
          return false;
        }
      }

      return true;
    });
  };

  const getAvailableSkills = (): Skill[] => {
    return Object.values(gameData.skills).filter(skill => {
      // Check if already known
      if (player.skills.includes(skill.id) || player.unlockedSkills.includes(skill.id)) {
        return false;
      }

      // Check level requirement
      if (player.level < skill.requirements.level) {
        return false;
      }

      // Check stat requirements
      if (skill.requirements.stats) {
        for (const [stat, required] of Object.entries(skill.requirements.stats)) {
          if (player.stats[stat as keyof typeof player.stats] < required) {
            return false;
          }
        }
      }

      // Check class requirements
      if (skill.requirements.classes) {
        const hasRequiredClass = skill.requirements.classes.some(className =>
          player.classes.some(c => c.name === className)
        );
        if (!hasRequiredClass) {
          return false;
        }
      }

      return true;
    });
  };

  const availableSpells = getAvailableSpells();
  const availableSkills = getAvailableSkills();

  const handleConfirm = () => {
    if (selectedId) {
      onChoice(selectedType, selectedId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Game</span>
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Level {player.level} Reward!</h2>
            <p className="text-gray-400">Choose a new spell or skill to learn</p>
          </div>

          {/* Type Selection */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-700/50 rounded-lg p-1 flex">
              <button
                onClick={() => {
                  setSelectedType('spell');
                  setSelectedId('');
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  selectedType === 'spell'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Zap className="w-5 h-5" />
                <span>Spells ({availableSpells.length})</span>
              </button>
              <button
                onClick={() => {
                  setSelectedType('skill');
                  setSelectedId('');
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  selectedType === 'skill'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Star className="w-5 h-5" />
                <span>Skills ({availableSkills.length})</span>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="mb-8">
            {selectedType === 'spell' ? (
              <div>
                {availableSpells.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No new spells available at your current level</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableSpells.map((spell) => (
                      <div
                        key={spell.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          selectedId === spell.id
                            ? 'border-purple-500 bg-purple-500/20 shadow-lg'
                            : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                        }`}
                        onClick={() => setSelectedId(spell.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-bold">{spell.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            spell.type === 'Attack' ? 'bg-red-600 text-red-200' :
                            spell.type === 'Heal' ? 'bg-green-600 text-green-200' :
                            'bg-blue-600 text-blue-200'
                          }`}>
                            {spell.type}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{spell.description}</p>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Mana: {spell.manaCost}</span>
                          <span>Power: {spell.power}</span>
                          {spell.element && <span>Element: {spell.element}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {availableSkills.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No new skills available at your current level</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          selectedId === skill.id
                            ? 'border-orange-500 bg-orange-500/20 shadow-lg'
                            : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                        }`}
                        onClick={() => setSelectedId(skill.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-bold">{skill.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            skill.type === 'passive' ? 'bg-blue-600 text-blue-200' : 'bg-green-600 text-green-200'
                          }`}>
                            {skill.type}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{skill.description}</p>
                        <div className="text-xs text-gray-400">
                          Effects: {Object.entries(skill.effects).map(([stat, value]) => 
                            `+${value} ${stat}`
                          ).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <div className="text-center">
            <button
              onClick={handleConfirm}
              disabled={!selectedId}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
            >
              {selectedId 
                ? `Learn ${selectedType === 'spell' ? 'Spell' : 'Skill'}` 
                : 'Select an option'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};