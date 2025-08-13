import React, { useState } from 'react';
import { Player, Shop, ShopItem, Item } from '../types/game';
import { ShoppingCart, ArrowLeft, Coins, Package } from 'lucide-react';

interface ShopScreenProps {
  player: Player;
  shop: Shop;
  onBuyItem: (item: ShopItem) => void;
  onSellItem: (item: Item) => void;
  onBack: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({ 
  player, 
  shop, 
  onBuyItem, 
  onSellItem, 
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

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

  const canAfford = (item: ShopItem) => {
    const price = Math.floor(item.value * shop.buyMultiplier);
    return player.stats.gold >= price;
  };

  const getSellPrice = (item: Item) => {
    return Math.floor((item.sellValue || item.value * 0.5) * shop.sellMultiplier);
  };

  const sellableItems = player.inventory.filter(item => 
    item.type !== 'quest' && item.sellValue !== undefined
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
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

        <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          {/* Shop Header */}
          <div className="text-center p-8 border-b border-gray-800">
            <ShoppingCart className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">{shop.name}</h2>
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-yellow-600" />
                <span>Your Gold: {player.stats.gold}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 px-6 py-4 text-center transition-all duration-300 ${
                activeTab === 'buy'
                  ? 'bg-gray-800/50 border-b-2 border-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Buy Items</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`flex-1 px-6 py-4 text-center transition-all duration-300 ${
                activeTab === 'sell'
                  ? 'bg-gray-800/50 border-b-2 border-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Package className="w-5 h-5" />
                <span className="font-medium">Sell Items</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'buy' ? (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Shop Inventory</h3>
                {shop.items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Shop is currently out of stock</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shop.items.map((item, index) => {
                      const price = Math.floor(item.value * shop.buyMultiplier);
                      const affordable = canAfford(item);
                      const inStock = !item.stock || item.stock > 0;

                      return (
                        <div
                          key={`${item.id}-${index}`}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                            getRarityColor(item.rarity)
                          } ${!affordable || !inStock ? 'opacity-50' : 'hover:scale-105 cursor-pointer'}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-bold text-lg">{item.name}</h4>
                            {item.rarity && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                item.rarity === 'common' ? 'bg-gray-700 text-gray-300' :
                                item.rarity === 'uncommon' ? 'bg-green-700 text-green-300' :
                                item.rarity === 'rare' ? 'bg-blue-700 text-blue-300' :
                                item.rarity === 'epic' ? 'bg-purple-700 text-purple-300' :
                                'bg-yellow-700 text-yellow-300'
                              }`}>
                                {item.rarity}
                              </span>
                            )}
                          </div>

                          <p className="text-gray-300 text-sm mb-4">
                            {item.description}
                          </p>

                          {item.effects && Object.keys(item.effects).length > 0 && (
                            <div className="mb-4">
                              <h5 className="text-sm font-semibold text-gray-400 mb-2">Effects:</h5>
                              <div className="space-y-1">
                                {Object.entries(item.effects).map(([stat, value]) => (
                                  <div key={stat} className="text-green-400 text-sm">
                                    +{value} {stat.charAt(0).toUpperCase() + stat.slice(1)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {item.requirements && Object.keys(item.requirements).length > 0 && (
                            <div className="mb-4">
                              <h5 className="text-sm font-semibold text-gray-400 mb-2">Requirements:</h5>
                              <div className="space-y-1">
                                {Object.entries(item.requirements).map(([stat, value]) => (
                                  <div key={stat} className="text-yellow-400 text-sm">
                                    {stat.charAt(0).toUpperCase() + stat.slice(1)} {value}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="text-yellow-600 font-bold">
                              💰 {price} gold
                            </div>
                            {item.stock !== undefined && (
                              <div className="text-gray-400 text-sm">
                                Stock: {item.stock}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => onBuyItem(item)}
                            disabled={!affordable || !inStock}
                            className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
                          >
                            {!inStock ? 'Out of Stock' : !affordable ? 'Cannot Afford' : 'Buy'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Sell Items</h3>
                {sellableItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No items to sell</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sellableItems.map((item, index) => {
                      const sellPrice = getSellPrice(item);

                      return (
                        <div
                          key={`${item.id}-${index}`}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${getRarityColor(item.rarity)}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-bold text-lg">{item.name}</h4>
                            {item.quantity && item.quantity > 1 && (
                              <span className="text-gray-400 text-sm">x{item.quantity}</span>
                            )}
                          </div>

                          <p className="text-gray-300 text-sm mb-4">
                            {item.description}
                          </p>

                          <div className="text-yellow-600 font-bold mb-4">
                            💰 {sellPrice} gold
                          </div>

                          <button
                            onClick={() => onSellItem(item)}
                            className="w-full px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            Sell
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};