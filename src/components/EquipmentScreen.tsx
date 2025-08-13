import React, { useState } from 'react';
import { Player, Item, Equipment } from '../types/game';
import { Shield, ArrowLeft, Zap, X } from 'lucide-react';
import { canEquipItem, equipItem, unequipItem, getEquippedStats } from '../utils/gameLogic';

interface EquipmentScreenProps {
  player: Player;
  onEquipItem: (item: Item) => void;
  onUnequipItem: (slot: keyof Equipment) => void;
  onBack: () => void;
}

export const EquipmentScreen: React.FC<EquipmentScreenProps> = ({ 
  player, 
  onEquipItem, 
  onUnequipItem, 
  onBack 
}) => {
  const [selectedSlot, setSelectedSlot] = useState<keyof Equipment | null>(null);

  const equipmentSlots: Array<{
    key: keyof Equipment;
    name: string;
    icon: string;
    position: string;
  }> = [
    { key: 'mainWeapon', name: 'Main Weapon', icon: '⚔️', position: 'col-start-1 row-start-2' },
    { key: 'sideWeapon', name: 'Side Weapon', icon: '🗡️', position: 'col-start-3 row-start-2' },
    { key: 'head', name: 'Helmet', icon: '⛑️', position: 'col-start-2 row-start-1' },
    { key: 'necklace', name: 'Necklace', icon: '📿', position: 'col-start-2 row-start-2' },
    { key: 'body', name: 'Armor', icon: '🛡️', position: 'col-start-2 row-start-3' },
    { key: 'ring1', name: 'Ring 1', icon: '💍', position: 'col-start-1 row-start-3' },
    { key: 'ring2', name: 'Ring 2', icon: '💍', position: 'col-start-3 row-start-3' },
    { key: 'legs', name: 'Leg Armor', icon: '🦵', position: 'col-start-2 row-start-4' },
    { key: 'shoes', name: 'Boots', icon: '👢', position: 'col-start-2 row-start-5' },
    { key: 'quickPotion', name: 'Quick Potion', icon: '🧪', position: 'col-start-4 row-start-2' },
  ];

  const getEquippableItems = () => {
    return player.inventory.filter(item => 
      item.subType && canEquipItem(player, item)
    );
  };

  const getRarityColor = (rarity?: string) => {
    const colors = {
      common: 'border-gray-500 bg-gray-900/50',
      uncommon: 'border-green-500 bg-green-900/20',
      rare: 'border-blue-500 bg-blue-900/20',
      epic: 'border-purple-500 bg-purple-900/20',
      legendary: 'border-yellow-500 bg-yellow-900/20'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const equipmentStats = getEquippedStats(player.equipment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
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
          {/* Equipment Slots */}
          <div className="lg:col-span-2">
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-800">
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-yellow-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Equipment</h2>
              </div>

              {/* Equipment Grid */}
              <div className="grid grid-cols-4 grid-rows-5 gap-4 max-w-md mx-auto mb-8">
                {equipmentSlots.map((slot) => {
                  const equippedItem = player.equipment[slot.key];
                  return (
                    <div
                      key={slot.key}
                      className={`${slot.position} aspect-square`}
                    >
                      <div
                        className={`w-full h-full rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                          equippedItem 
                            ? `${getRarityColor(equippedItem.rarity)} hover:border-yellow-400` 
                            : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
                        }`}
                        onClick={() => setSelectedSlot(slot.key)}
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center p-2">
                          {equippedItem ? (
                            <>
                              <span className="text-2xl mb-1">{slot.icon}</span>
                              <span className="text-xs text-white text-center font-medium truncate w-full">
                                {equippedItem.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-2xl text-gray-600 mb-1">{slot.icon}</span>
                              <span className="text-xs text-gray-500 text-center">
                                {slot.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Equipment Stats */}
              {Object.keys(equipmentStats).length > 0 && (
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-3">Equipment Bonuses</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {Object.entries(equipmentStats).map(([stat, value]) => (
                      <div key={stat} className="text-green-400">
                        +{value} {stat.charAt(0).toUpperCase() + stat.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Inventory & Item Details */}
          <div className="space-y-6">
            {/* Selected Slot Details */}
            {selectedSlot && (
              <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {equipmentSlots.find(s => s.key === selectedSlot)?.name}
                  </h3>
                  <button
                    onClick={() => setSelectedSlot(null)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {player.equipment[selectedSlot] ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border-2 ${getRarityColor(player.equipment[selectedSlot]?.rarity)}`}>
                      <h4 className="text-white font-semibold mb-2">
                        {player.equipment[selectedSlot]?.name}
                      </h4>
                      <p className="text-gray-300 text-sm mb-3">
                        {player.equipment[selectedSlot]?.description}
                      </p>
                      {player.equipment[selectedSlot]?.effects && (
                        <div className="space-y-1">
                          {Object.entries(player.equipment[selectedSlot]!.effects!).map(([stat, value]) => (
                            <div key={stat} className="text-green-400 text-sm">
                              +{value} {stat.charAt(0).toUpperCase() + stat.slice(1)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        onUnequipItem(selectedSlot);
                        setSelectedSlot(null);
                      }}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      Unequip
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-400">No item equipped in this slot</p>
                )}
              </div>
            )}

            {/* Equippable Items */}
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Equippable Items</h3>
              
              {getEquippableItems().length === 0 ? (
                <p className="text-gray-400">No equippable items in inventory</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {getEquippableItems().map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 ${getRarityColor(item.rarity)}`}
                      onClick={() => onEquipItem(item)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <Zap className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        {item.description}
                      </p>
                      {item.effects && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(item.effects).map(([stat, value]) => (
                            <span key={stat} className="text-green-400 text-xs">
                              +{value} {stat}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.requirements && (
                        <div className="mt-2 text-yellow-400 text-xs">
                          Requires: {Object.entries(item.requirements).map(([stat, req]) => 
                            `${stat} ${req}`
                          ).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};