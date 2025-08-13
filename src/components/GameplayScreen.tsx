import React, { useState } from 'react';
import { Player, StoryNode, Choice } from '../types/game';
import { Dice6, Heart, ArrowLeft, Home } from 'lucide-react';
import { canMakeChoice, rollDice, replaceVariables, getTotalPlayerStats } from '../utils/gameLogic';

interface GameplayScreenProps {
  player: Player;
  currentNode: StoryNode;
  onMakeChoice: (choice: Choice) => void;
  onBack: () => void;
  onOpenInventory: () => void;
  onOpenEquipment: () => void;
  onOpenShop: (shopId: string) => void;
  onStartCombat: (monsterId: string) => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({ 
  player, 
  currentNode, 
  onMakeChoice, 
  onBack,
  onOpenInventory,
  onOpenEquipment,
  onOpenShop,
  onStartCombat
}) => {
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showDiceOption, setShowDiceOption] = useState(false);

  const totalStats = getTotalPlayerStats(player);
  const handleDiceRoll = async () => {
    setIsRolling(true);
    
    // Animate dice roll
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceRoll(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalRoll = rollDice(false); // Remove luck advantage for simplicity
        setDiceRoll(finalRoll);
        setIsRolling(false);
      }
    }, 100);
  };

  const handleSkipDice = () => {
    setShowDiceOption(false);
    setDiceRoll(0); // Set to 0 to indicate dice was skipped
  };

  const handleChoiceClick = (choice: Choice) => {
    // Check for combat encounters
    if ((currentNode.type === 'combat' || currentNode.battle) && currentNode.monster) {
      // Start combat - the result will determine which choice to follow
      onStartCombat(currentNode.monster);
      return;
    }

    // If the choice leads to a shop node, open the shop
    if (choice.next_node && currentNode.choices) {
      const nextNode = currentNode.choices.find(c => c.next_node === choice.next_node);
      if (nextNode && nextNode.next_node && nextNode.next_node === 'shop' && currentNode.shop?.shopId) {
        onOpenShop(currentNode.shop.shopId);
        return;
      }
    }

    onMakeChoice(choice);
    setDiceRoll(null);
    setShowDiceOption(false);
  };

  const getVisibleChoices = () => {
    return currentNode.choices.filter(choice => 
      canMakeChoice(choice, player, diceRoll === null ? undefined : diceRoll)
    );
  };

  // Show dice option when entering a battle node
  React.useEffect(() => {
    if ((currentNode.type === 'combat' || currentNode.battle) && diceRoll === null) {
      setShowDiceOption(true);
    }
  }, [currentNode.type, currentNode.battle]);

  const storyText = replaceVariables(currentNode.text, player);
  const visibleChoices = getVisibleChoices();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Story Selection</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Story Content */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  {storyText}
                </p>
              </div>

              {/* Battle Section */}
              {(currentNode.type === 'combat' || currentNode.battle) && (
                <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                    <span className="mr-2">⚔</span>
                    Battle Encounter!
                  </h3>
                  
                  <p className="text-gray-300 mb-4">
                    A fierce battle awaits! Prepare yourself for combat.
                  </p>
                  
                  {currentNode.monster && (
                    <div className="mb-4">
                      <button
                        onClick={() => onStartCombat(currentNode.monster!)}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        ⚔️ Enter Battle
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Shop Section */}
              {currentNode.type === 'shop' && currentNode.shop?.shopId && (
                <div className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                    <span className="mr-2">🏪</span>
                    Shop Encounter!
                  </h3>
                  
                  <div className="mb-4">
                    <button
                      onClick={() => onOpenShop(currentNode.shop!.shopId)}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Enter Shop
                    </button>
                  </div>
                </div>
              )}

              {/* Choices */}
              <div className="space-y-4">
                {!(currentNode.type === 'combat' || currentNode.battle) && (
                  <h3 className="text-xl font-semibold text-white mb-4">What do you do?</h3>
                )}
                
                {(currentNode.type === 'combat' || currentNode.battle) ? (
                  <div className="text-center text-gray-400">
                    <p>Click "Enter Battle" above to begin combat.</p>
                    <p className="text-sm mt-2">The outcome will determine your next path.</p>
                  </div>
                ) : visibleChoices.length > 0 ? (
                  visibleChoices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleChoiceClick(choice)}
                      className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 hover:border-slate-500 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    >
                      <span className="text-white font-medium">{choice.text}</span>
                      {choice.require && Object.keys(choice.require).length > 0 && (
                        <div className="mt-2 text-sm text-yellow-400">
                          Requirements: {Object.entries(choice.require).map(([stat, value]) => 
                            `${stat.charAt(0).toUpperCase() + stat.slice(1)} ${value}`
                          ).join(', ')}
                        </div>
                      )}
                      {choice.itemRequirements && choice.itemRequirements.length > 0 && (
                        <div className="mt-1 text-sm text-orange-400">
                          Items Required: {choice.itemRequirements.join(', ')}
                        </div>
                      )}
                      {choice.dice_requirement && (
                        <div className="mt-1 text-sm text-orange-400">
                          Dice Roll Required: {choice.dice_requirement}+
                        </div>
                      )}
                      {choice.effects && Object.keys(choice.effects).length > 0 && (
                        <div className="mt-2 text-sm text-green-400">
                          Effects: {Object.entries(choice.effects).map(([stat, value]) => 
                            `${stat.charAt(0).toUpperCase() + stat.slice(1)} ${value > 0 ? '+' : ''}${value}`
                          ).join(', ')}
                        </div>
                      )}
                      {choice.itemRewards && choice.itemRewards.length > 0 && (
                        <div className="mt-1 text-sm text-blue-400">
                          Item Rewards: {choice.itemRewards.join(', ')}
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 italic">
                    No actions available. Your journey may have reached an impasse.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Player Stats Panel */}
          <div className="space-y-6">
            {/* Character Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Character</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Race:</span>
                  <span className="text-white">{player.race}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Class:</span>
                  <span className="text-white">{player.classes.map(c => c.name).join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Level:</span>
                  <span className="text-white font-bold">{player.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">XP:</span>
                  <span className="text-white">{player.xp} / {player.level * 100}</span>
                </div>
              </div>
              {player.xp >= player.level * 100 && (
                <div className="mt-2 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                  <p className="text-yellow-400 text-sm font-medium">Ready to Level Up!</p>
                </div>
              )}
            </div>

            {/* Health */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Heart className="w-5 h-5 text-red-400 mr-2" />
                Health
              </h3>
              <div className="flex items-center space-x-2">
                {Array.from({ length: player.maxHearts }, (_, i) => (
                  <Heart
                    key={i}
                    className={`w-6 h-6 ${
                      i < player.hearts ? 'text-red-500 fill-red-500' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {player.hearts} / {player.maxHearts} hearts
              </p>
            </div>

            {/* Inventory Button */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
              <div className="space-y-3">
              <button
                onClick={onOpenInventory}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>📦</span>
                <span>Inventory ({player.inventory.length})</span>
              </button>
              <button
                onClick={onOpenEquipment}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>⚔️</span>
                <span>Equipment</span>
              </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-400 flex items-center">
                    <span className="mr-2">⚔️</span>
                    Strength
                  </span>
                  <span className="text-white font-bold">
                    {totalStats.strength}
                    {totalStats.strength !== player.stats.strength && (
                      <span className="text-green-400 text-sm ml-1">
                        (+{totalStats.strength - player.stats.strength})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 flex items-center">
                    <span className="mr-2">🧠</span>
                    Intelligence
                  </span>
                  <span className="text-white font-bold">
                    {totalStats.intelligence}
                    {totalStats.intelligence !== player.stats.intelligence && (
                      <span className="text-green-400 text-sm ml-1">
                        (+{totalStats.intelligence - player.stats.intelligence})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-400 flex items-center">
                    <span className="mr-2">✨</span>
                    Magic
                  </span>
                  <span className="text-white font-bold">
                    {totalStats.magic}
                    {totalStats.magic !== player.stats.magic && (
                      <span className="text-green-400 text-sm ml-1">
                        (+{totalStats.magic - player.stats.magic})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 flex items-center">
                    <span className="mr-2">❤️</span>
                    Vitality
                  </span>
                  <span className="text-white font-bold">
                    {totalStats.vitality}
                    {totalStats.vitality !== player.stats.vitality && (
                      <span className="text-green-400 text-sm ml-1">
                        (+{totalStats.vitality - player.stats.vitality})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-400 flex items-center">
                    <span className="mr-2">🎯</span>
                    Dexterity
                  </span>
                  <span className="text-white font-bold">
                    {totalStats.dexterity}
                    {totalStats.dexterity !== player.stats.dexterity && (
                      <span className="text-green-400 text-sm ml-1">
                        (+{totalStats.dexterity - player.stats.dexterity})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 flex items-center">
                    <span className="mr-2">💨</span>
                    Agility
                  </span>
                  <span className="text-white font-bold">
                    {totalStats.agility}
                    {totalStats.agility !== player.stats.agility && (
                      <span className="text-green-400 text-sm ml-1">
                        (+{totalStats.agility - player.stats.agility})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400 flex items-center">
                    <span className="mr-2">💰</span>
                    Gold
                  </span>
                  <span className="text-white font-bold">
                    {totalStats.gold}
                    {totalStats.gold !== player.stats.gold && (
                      <span className="text-green-400 text-sm ml-1">
                        (+{totalStats.gold - player.stats.gold})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 flex items-center">
                    <span className="mr-2">👑</span>
                    Reputation
                  </span>
                  <span className="text-white font-bold">
                    {totalStats.reputation}
                    {totalStats.reputation !== player.stats.reputation && (
                      <span className="text-green-400 text-sm ml-1">
                        (+{totalStats.reputation - player.stats.reputation})
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Derived Stats */}
              <div className="mt-4 pt-4 border-t border-slate-600">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Derived Stats:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Physical Damage:</span>
                    <span className="text-red-300">{Math.floor(totalStats.strength / 2) + 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Magical Damage:</span>
                    <span className="text-purple-300">{Math.floor(totalStats.magic / 2) + 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Crit Chance:</span>
                    <span className="text-orange-300">{5 + Math.max(0, totalStats.dexterity - 10)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Escape Chance:</span>
                    <span className="text-cyan-300">{25 + Math.max(0, totalStats.agility - 10)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Health:</span>
                    <span className="text-green-300">{totalStats.vitality * 2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Mana:</span>
                    <span className="text-blue-300">{totalStats.magic * 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Luck Bonus:</span>
                    <span className="text-yellow-300">{Math.floor(totalStats.luck / 2) + 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Social Influence:</span>
                    <span className="text-cyan-300">{Math.floor((totalStats.charm + totalStats.reputation) / 2) + 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};