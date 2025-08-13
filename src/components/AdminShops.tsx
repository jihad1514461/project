import React, { useState } from 'react';
import { ShoppingCart, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Shop, ShopItem } from '../types/game';
import { SearchableSelect } from './SearchableSelect';

interface AdminShopsProps {
  shops: { [key: string]: Shop };
  items: { [key: string]: any };
  onCreateShop: (shopData: any) => void;
  onUpdateShop: (shopId: string, shopData: any) => void;
  onDeleteShop: (shopId: string) => void;
}

export const AdminShops: React.FC<AdminShopsProps> = ({ shops, items, onCreateShop, onUpdateShop, onDeleteShop }) => {
  const [editingShop, setEditingShop] = useState<string | null>(null);
  const [newShopId, setNewShopId] = useState('');
  const [shopData, setShopData] = useState<Shop>({
    id: '',
    name: '',
    categories: [],
    items: [],
    buyMultiplier: 1.0,
    sellMultiplier: 0.5
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (shopId: string) => {
    setEditingShop(shopId);
    setNewShopId(shopId);
    setShopData({ ...shops[shopId] });
  };

  const handleSave = () => {
    if (!newShopId.trim()) return;
    
    const finalShopData = { ...shopData, id: newShopId };

    if (editingShop) {
      if (editingShop !== newShopId) {
        // ID changed - delete old and create new
        onDeleteShop(editingShop);
        onCreateShop(finalShopData);
      } else {
        // Same ID - update existing
        onUpdateShop(editingShop, finalShopData);
      }
    } else {
      // Creating new shop
      onCreateShop(finalShopData);
    }
    
    setEditingShop(null);
    setIsCreating(false);
    setNewShopId('');
    setShopData({
      id: '',
      name: '',
      categories: [],
      items: [],
      buyMultiplier: 1.0,
      sellMultiplier: 0.5
    });
  };

  const handleDelete = (shopId: string) => {
    if (confirm(`Are you sure you want to delete "${shops[shopId].name}"?`)) {
      onDeleteShop(shopId);
    }
  };

  const handleCancel = () => {
    setEditingShop(null);
    setIsCreating(false);
    setNewShopId('');
    setShopData({
      id: '',
      name: '',
      categories: [],
      items: [],
      buyMultiplier: 1.0,
      sellMultiplier: 0.5
    });
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewShopId('');
    setShopData({
      id: '',
      name: '',
      categories: [],
      items: [],
      buyMultiplier: 1.0,
      sellMultiplier: 0.5
    });
  };

  const addShopItem = () => {
    setShopData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          ...Object.values(items)[0],
          stock: 10,
          category: 'weapons'
        } as ShopItem
      ]
    }));
  };

  const updateShopItem = (index: number, field: keyof ShopItem, value: any) => {
    setShopData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeShopItem = (index: number) => {
    setShopData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const itemOptions = Object.values(items).map(item => ({
    id: item.id,
    name: item.name
  }));

  const categoryOptions = [
    { id: 'weapons', name: 'Weapons' },
    { id: 'armor', name: 'Armor' },
    { id: 'potions', name: 'Potions' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'consumables', name: 'Consumables' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <ShoppingCart className="w-8 h-8 text-green-400 mr-3" />
          Shop Management
        </h3>
        <button
          onClick={startCreating}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shop</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingShop) && (
        <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">
            {isCreating ? 'Create New Shop' : `Edit ${shops[editingShop!]?.name}`}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Shop ID
              </label>
              <input
                type="text"
                value={newShopId}
                onChange={(e) => setNewShopId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="unique_shop_id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Shop Name
              </label>
              <input
                type="text"
                value={shopData.name}
                onChange={(e) => setShopData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter shop name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buy Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                value={shopData.buyMultiplier}
                onChange={(e) => setShopData(prev => ({ ...prev, buyMultiplier: parseFloat(e.target.value) || 1.0 }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sell Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                value={shopData.sellMultiplier}
                onChange={(e) => setShopData(prev => ({ ...prev, sellMultiplier: parseFloat(e.target.value) || 0.5 }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categories
            </label>
            <SearchableSelect
              options={categoryOptions}
              value=""
              onChange={() => {}}
              multiple={true}
              values={shopData.categories}
              onMultiChange={(values) => setShopData(prev => ({ ...prev, categories: values }))}
              placeholder="Select categories"
            />
          </div>

          {/* Shop Items */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">Shop Items</label>
              <button
                onClick={addShopItem}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
              >
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {shopData.items.map((item, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">Item {index + 1}</span>
                    <button
                      onClick={() => removeShopItem(index)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Item</label>
                      <SearchableSelect
                        options={itemOptions}
                        value={item.id}
                        onChange={(value) => {
                          const selectedItem = items[value];
                          if (selectedItem) {
                            updateShopItem(index, 'id', value);
                            updateShopItem(index, 'name', selectedItem.name);
                            updateShopItem(index, 'type', selectedItem.type);
                            updateShopItem(index, 'description', selectedItem.description);
                            updateShopItem(index, 'value', selectedItem.value);
                          }
                        }}
                        placeholder="Select item"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Stock</label>
                      <input
                        type="number"
                        value={item.stock || 0}
                        onChange={(e) => updateShopItem(index, 'stock', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Category</label>
                      <SearchableSelect
                        options={categoryOptions}
                        value={item.category}
                        onChange={(value) => updateShopItem(index, 'category', value)}
                        placeholder="Select category"
                      />
                    </div>
                  </div>
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

      {/* Shops List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(shops).map(([shopId, shop]) => (
          <div key={shopId} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-white">{shop.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(shopId)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(shopId)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Categories:</span>
                <span className="text-white">{shop.categories.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Items:</span>
                <span className="text-white">{shop.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Buy Rate:</span>
                <span className="text-green-400">{shop.buyMultiplier}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sell Rate:</span>
                <span className="text-orange-400">{shop.sellMultiplier}x</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};