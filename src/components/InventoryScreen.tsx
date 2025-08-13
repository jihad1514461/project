import React, { useState } from 'react';
import { Player, Item } from '../types/game';
import { Package, ArrowLeft, Trash2, Eye, Zap } from 'lucide-react';

interface InventoryScreenProps {
  player: Player;
  onUseItem: (item: Item) => void;
  onBack: () => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({ 
  player, 
  onUseItem, 
  onBack 
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const getItemTypeColor = (type: string) => {
    const colors = {
      weapon: 'text-red-400',
      armor: 'text-blue-400',
      accessory: 'text-purple-400',
      consumable: 'text-green-400',
      quest: 'text-yellow-400'
    };
    return colors[type as keyof typeof colors] || 'text-gray-400';
  };

  const getItemTypeIcon = (type: string) => {
    const icons = {
      weapon: '⚔',
      armor: '🛡',
      accessory: '💍',
      consumable: '🧪',
      quest: '📜'
    };
    return icons[type as keyof typeof icons] || '📦';
  };

  const groupedItems = player.inventory.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as { [key: string]: Item[] });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Game</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inventory List */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
              <div className="flex items-center mb-6">
                <Package className="w-8 h-8 text-yellow-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Inventory</h2>
                <span className="ml-auto text-gray-400">
                  {player.inventory.length} items
                </span>
              </div>

              {player.inventory.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Your inventory is empty</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Find items during your adventures!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedItems).map(([type, items]) => (
                    <div key={type}>
                      <h3 className={`text-lg font-semibold mb-3 ${getItemTypeColor(type)} capitalize`}>
                        {getItemTypeIcon(type)} {type}s
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((item, index) => (
                          <div
                            key={`${item.id}-${index}`}
                            className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 ${
                              selectedItem?.id === item.id && selectedItem === item
                                ? 'border-yellow-500 bg-yellow-500/20'
                                : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                            }`}
                            onClick={() => setSelectedItem(item)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">{item.name}</h4>
                              {item.stackable && item.quantity && item.quantity > 1 && (
                                <span className="text-gray-400 text-sm">
                                  x{item.quantity}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-yellow-600 text-sm">
                                💰 {item.value} gold
                              </span>
                              {item.type === 'consumable' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUseItem(item);
                                  }}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center space-x-1"
                                >
                                  <Zap className="w-3 h-3" />
                                  <span>Use</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Selected Item Details */}
            {selectedItem && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-blue-400 mr-2" />
                  <h3 className="text-xl font-bold text-white">Item Details</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className={`text-lg font-semibold ${getItemTypeColor(selectedItem.type)}`}>
                      {getItemTypeIcon(selectedItem.type)} {selectedItem.name}
                    </h4>
                    <p className="text-gray-400 text-sm capitalize">
                      {selectedItem.type}
                    </p>
                  </div>

                  <p className="text-gray-300">
                    {selectedItem.description}
                  </p>

                  {selectedItem.effects && Object.keys(selectedItem.effects).length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-400 mb-2">Effects:</h5>
                      <div className="space-y-1">
                        {Object.entries(selectedItem.effects).map(([stat, value]) => (
                          <div key={stat} className="text-sm text-green-400">
                            {value > 0 ? '+' : ''}{value} {stat.charAt(0).toUpperCase() + stat.slice(1)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedItem.requirements && Object.keys(selectedItem.requirements).length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-400 mb-2">Requirements:</h5>
                      <div className="space-y-1">
                        {Object.entries(selectedItem.requirements).map(([stat, value]) => (
                          <div key={stat} className="text-sm text-yellow-400">
                            {stat.charAt(0).toUpperCase() + stat.slice(1)} {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-600 font-semibold">
                        💰 {selectedItem.value} gold
                      </span>
                      {selectedItem.stackable && selectedItem.quantity && (
                        <span className="text-gray-400">
                          Quantity: {selectedItem.quantity}
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedItem.type === 'consumable' && (
                    <button
                      onClick={() => onUseItem(selectedItem)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Use Item</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Player Stats Summary */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Character Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-400">⚔ Strength:</span>
                  <span className="text-white font-medium">{player.stats.strength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-400">🧠 Intelligence:</span>
                  <span className="text-white font-medium">{player.stats.intelligence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">✨ Magic:</span>
                  <span className="text-white font-medium">{player.stats.magic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">❤ Vitality:</span>
                  <span className="text-white font-medium">{player.stats.vitality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-400">🎯 Dexterity:</span>
                  <span className="text-white font-medium">{player.stats.dexterity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">💨 Agility:</span>
                  <span className="text-white font-medium">{player.stats.agility}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">🍀 Luck:</span>
                  <span className="text-white font-medium">{player.stats.luck}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-400">💫 Charm:</span>
                  <span className="text-white font-medium">{player.stats.charm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">👑 Reputation:</span>
                  <span className="text-white font-medium">{player.stats.reputation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">💰 Gold:</span>
                  <span className="text-white font-medium">{player.stats.gold}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};