import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Item } from '../types/game';

interface AdminItemsProps {
  items: { [key: string]: Item };
  onUpdateItems: (items: { [key: string]: Item }) => void;
}

export const AdminItems: React.FC<AdminItemsProps> = ({ items, onUpdateItems }) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItemId, setNewItemId] = useState('');
  const [itemData, setItemData] = useState<Item>({
    id: '',
    name: '',
    type: 'weapon',
    description: '',
    value: 0,
    sellValue: 0,
    rarity: 'common'
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
    setNewItemId(itemId);
    setItemData({ ...items[itemId] });
  };

  const handleSave = () => {
    if (!newItemId.trim()) return;
    
    const updatedItems = { ...items };
    
    if (editingItem && editingItem !== newItemId) {
      delete updatedItems[editingItem];
    }
    
    updatedItems[newItemId] = { ...itemData, id: newItemId };
    onUpdateItems(updatedItems);
    
    setEditingItem(null);
    setIsCreating(false);
    setNewItemId('');
    setItemData({
      id: '',
      name: '',
      type: 'weapon',
      description: '',
      value: 0,
      sellValue: 0,
      rarity: 'common'
    });
  };

  const handleDelete = (itemId: string) => {
    if (confirm(`Are you sure you want to delete "${items[itemId].name}"?`)) {
      const updatedItems = { ...items };
      delete updatedItems[itemId];
      onUpdateItems(updatedItems);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
    setNewItemId('');
    setItemData({
      id: '',
      name: '',
      type: 'weapon',
      description: '',
      value: 0,
      sellValue: 0,
      rarity: 'common'
    });
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewItemId('');
    setItemData({
      id: '',
      name: '',
      type: 'weapon',
      description: '',
      value: 0,
      sellValue: 0,
      rarity: 'common'
    });
  };

  const handleEffectChange = (stat: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setItemData(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [stat]: numValue === 0 ? undefined : numValue
      }
    }));
  };

  const handleRequirementChange = (stat: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setItemData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [stat]: numValue === 0 ? undefined : numValue
      }
    }));
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-500 bg-gray-900/50',
      uncommon: 'border-green-500 bg-green-900/20',
      rare: 'border-blue-500 bg-blue-900/20',
      epic: 'border-purple-500 bg-purple-900/20',
      legendary: 'border-yellow-500 bg-yellow-900/20'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Package className="w-8 h-8 text-blue-400 mr-3" />
          Item Management
        </h3>
        <button
          onClick={startCreating}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingItem) && (
        <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">
            {isCreating ? 'Create New Item' : `Edit ${items[editingItem!]?.name}`}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Item ID
              </label>
              <input
                type="text"
                value={newItemId}
                onChange={(e) => setNewItemId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="unique_item_id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={itemData.name}
                onChange={(e) => setItemData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <select
                value={itemData.type}
                onChange={(e) => setItemData(prev => ({ ...prev, type: e.target.value as Item['type'] }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weapon">Weapon</option>
                <option value="armor">Armor</option>
                <option value="accessory">Accessory</option>
                <option value="consumable">Consumable</option>
                <option value="quest">Quest Item</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sub Type
              </label>
              <select
                value={itemData.subType || ''}
                onChange={(e) => setItemData(prev => ({ ...prev, subType: e.target.value as Item['subType'] || undefined }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                <option value="main_weapon">Main Weapon</option>
                <option value="side_weapon">Side Weapon</option>
                <option value="head">Head</option>
                <option value="body">Body</option>
                <option value="legs">Legs</option>
                <option value="shoes">Shoes</option>
                <option value="ring">Ring</option>
                <option value="necklace">Necklace</option>
                <option value="potion">Potion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rarity
              </label>
              <select
                value={itemData.rarity || 'common'}
                onChange={(e) => setItemData(prev => ({ ...prev, rarity: e.target.value as Item['rarity'] }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Value (Gold)
              </label>
              <input
                type="number"
                value={itemData.value}
                onChange={(e) => setItemData(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sell Value (Gold)
              </label>
              <input
                type="number"
                value={itemData.sellValue || 0}
                onChange={(e) => setItemData(prev => ({ ...prev, sellValue: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={itemData.description}
              onChange={(e) => setItemData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter item description"
            />
          </div>

          {/* Effects */}
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-300 mb-3">Effects</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(['strength', 'intelligence', 'magic', 'vitality', 'luck', 'charm', 'reputation', 'gold'] as const).map((stat) => (
                <div key={stat}>
                  <label className="block text-xs text-gray-400 mb-1 capitalize">
                    {stat}
                  </label>
                  <input
                    type="number"
                    value={itemData.effects?.[stat] || 0}
                    onChange={(e) => handleEffectChange(stat, e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-300 mb-3">Requirements</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(['strength', 'intelligence', 'magic', 'vitality', 'luck', 'charm', 'reputation', 'gold'] as const).map((stat) => (
                <div key={stat}>
                  <label className="block text-xs text-gray-400 mb-1 capitalize">
                    {stat}
                  </label>
                  <input
                    type="number"
                    value={itemData.requirements?.[stat] || 0}
                    onChange={(e) => handleRequirementChange(stat, e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(items).map(([itemId, item]) => (
          <div key={itemId} className={`rounded-xl p-4 border-2 ${getRarityColor(item.rarity || 'common')}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-white">{item.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(itemId)}
                  className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(itemId)}
                  className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{item.description}</p>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white">{item.type} {item.subType && `(${item.subType})`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Value:</span>
                <span className="text-yellow-600">💰 {item.value}</span>
              </div>
              {item.sellValue && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Sell:</span>
                  <span className="text-orange-400">💰 {item.sellValue}</span>
                </div>
              )}
              {item.effects && Object.keys(item.effects).length > 0 && (
                <div>
                  <span className="text-gray-400">Effects:</span>
                  <div className="mt-1 space-y-1">
                    {Object.entries(item.effects).map(([stat, value]) => (
                      <div key={stat} className="text-green-400">
                        +{value} {stat}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};