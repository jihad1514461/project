import React, { useState } from 'react';
import { Player, GameData } from '../types/game';
import { Sword, ArrowLeft, Star, CheckCircle } from 'lucide-react';
import { canUnlockClass } from '../utils/gameLogic';

interface ClassSelectionProps {
  player: Player;
  gameData: GameData;
  onSelectClass: (className: string) => void;
  onBack: () => void;
}

export const ClassSelection: React.FC<ClassSelectionProps> = ({ 
  player, 
  gameData, 
  onSelectClass, 
  onBack 
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('');

  const availableClasses = Object.keys(gameData.classRequirements).filter(className =>
    canUnlockClass(player, className, gameData.classRequirements)
  );

  const handleSelectClass = () => {
    if (selectedClass) {
      onSelectClass(selectedClass);
    }
  };

  const getClassColor = (className: string) => {
    const colors: { [key: string]: string } = {
      'Knight': 'from-blue-600 to-blue-800',
      'Barbarian': 'from-red-600 to-red-800',
      'Archmage': 'from-purple-600 to-purple-800',
      'Assassin': 'from-gray-600 to-gray-800'
    };
    return colors[className] || 'from-gray-600 to-gray-800';
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
            <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Choose Additional Class</h2>
            <p className="text-gray-400">
              You've reached level {player.level}! Select a new class to expand your abilities.
            </p>
            <p className="text-yellow-400 font-semibold mt-2">
              Current Classes: {player.classes.map(c => c.name).join(', ')}
            </p>
          </div>

          {availableClasses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg mb-4">
                No new classes available at your current level and stats.
              </p>
              <p className="text-gray-500 text-sm">
                Continue adventuring to improve your stats and unlock new classes!
              </p>
              <button
                onClick={onBack}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Continue Adventure
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {availableClasses.map((className) => {
                  const requirement = gameData.classRequirements[className];
                  const classStats = gameData.classes[className];
                  const isSelected = selectedClass === className;

                  return (
                    <div
                      key={className}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        isSelected
                          ? 'border-yellow-500 bg-yellow-500/20 shadow-lg'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                      onClick={() => setSelectedClass(className)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white flex items-center">
                          <Sword className="w-5 h-5 mr-2" />
                          {className}
                        </h3>
                        {isSelected && <CheckCircle className="w-6 h-6 text-yellow-400" />}
                      </div>

                      <p className="text-gray-300 text-sm mb-4">
                        {requirement.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-semibold text-gray-400">Requirements Met:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-green-400">
                            ✓ Level {requirement.requiredLevel}
                          </div>
                          {Object.entries(requirement.requiredStats).map(([stat, required]) => (
                            <div key={stat} className="text-green-400">
                              ✓ {stat.charAt(0).toUpperCase() + stat.slice(1)} {required}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-400">Class Bonuses:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(classStats || {}).map(([stat, bonus]) => (
                            <div key={stat} className="text-blue-400">
                              +{bonus} {stat.charAt(0).toUpperCase() + stat.slice(1)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <button
                  onClick={handleSelectClass}
                  disabled={!selectedClass}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
                >
                  {selectedClass ? `Unlock ${selectedClass}` : 'Select a Class'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};