import React, { useState } from 'react';
import { Skull, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Monster, Element } from '../types/game';
import { SearchableSelect } from './SearchableSelect';

interface AdminMonstersProps {
  monsters: { [key: string]: Monster };
  items: { [key: string]: any };
  spells: { [key: string]: any };
  classes: { [key: string]: any };
  onUpdateMonsters: (monsters: { [key: string]: Monster }) => void;
}

export const AdminMonsters: React.FC<AdminMonstersProps> = ({ 
  monsters, 
  items, 
  spells, 
  classes, 
  onUpdateMonsters 
}) => {
  const [editingMonster, setEditingMonster] = useState<string | null>(null);
  const [newMonsterId, setNewMonsterId] = useState('');
  const [monsterData, setMonsterData] = useState<Monster>({
    id: '',
    name: '',
    description: '',
    stats: {
      health: 50,
      attack: 10,
      defense: 5,
      mana: 20
    },
    element: 'Neutral',
    spells: [],
    ai: {
      threatThreshold: 30,
      elementalPreference: true,
      resourceThreshold: 20
    },
    dropTable: {
      items: [],
      equipment: []
    },
    classRewards: [],
    spellUnlocks: []
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (monsterId: string) => {
    setEditingMonster(monsterId);
    setNewMonsterId(monsterId);
    setMonsterData({ ...monsters[monsterId] });
  };

  const handleSave = () => {
    if (!newMonsterId.trim()) return;
    
    const updatedMonsters = { ...monsters };
    
    if (editingMonster && editingMonster !== newMonsterId) {
      delete updatedMonsters[editingMonster];
    }
    
    updatedMonsters[newMonsterId] = { ...monsterData, id: newMonsterId };
    onUpdateMonsters(updatedMonsters);
    
    setEditingMonster(null);
    setIsCreating(false);
    setNewMonsterId('');
    setMonsterData({
      id: '',
      name: '',
      description: '',
      stats: {
        health: 50,
        attack: 10,
        defense: 5,
        mana: 20
      },
      element: 'Neutral',
      spells: [],
      ai: {
        threatThreshold: 30,
        elementalPreference: true,
        resourceThreshold: 20
      },
      dropTable: {
        items: [],
        equipment: []
      },
      classRewards: [],
      spellUnlocks: []
    });
  };

  const handleDelete = (monsterId: string) => {
    if (confirm(`Are you sure you want to delete "${monsters[monsterId].name}"?`)) {
      const updatedMonsters = { ...monsters };
      delete updatedMonsters[monsterId];
      onUpdateMonsters(updatedMonsters);
    }
  };

  const handleCancel = () => {
    setEditingMonster(null);
    setIsCreating(false);
    setNewMonsterId('');
    setMonsterData({
      id: '',
      name: '',
      description: '',
      stats: {
        health: 50,
        attack: 10,
        defense: 5,
        mana: 20
      },
      element: 'Neutral',
      spells: [],
      ai: {
        threatThreshold: 30,
        elementalPreference: true,
        resourceThreshold: 20
      },
      dropTable: {
        items: [],
        equipment: []
      },
      classRewards: [],
      spellUnlocks: []
    });
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewMonsterId('');
    setMonsterData({
      id: '',
      name: '',
      description: '',
      stats: {
        health: 50,
        attack: 10,
        defense: 5,
        mana: 20
      },
      element: 'Neutral',
      spells: [],
      ai: {
        threatThreshold: 30,
        elementalPreference: true,
        resourceThreshold: 20
      },
      dropTable: {
        items: [],
        equipment: []
      },
      classRewards: [],
      spellUnlocks: []
    });
  };

  const addDropItem = () => {
    setMonsterData(prev => ({
      ...prev,
      dropTable: {
        ...prev.dropTable,
        items: [
          ...prev.dropTable.items,
          { itemId: '', chance: 0.1, quantity: 1 }
        ]
      }
    }));
  };

  const updateDropItem = (index: number, field: string, value: any) => {
    setMonsterData(prev => ({
      ...prev,
      dropTable: {
        ...prev.dropTable,
        items: prev.dropTable.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const removeDropItem = (index: number) => {
    setMonsterData(prev => ({
      ...prev,
      dropTable: {
        ...prev.dropTable,
        items: prev.dropTable.items.filter((_, i) => i !== index)
      }
    }));
  };

  const addEquipmentDrop = () => {
    setMonsterData(prev => ({
      ...prev,
      dropTable: {
        ...prev.dropTable,
        equipment: [
          ...prev.dropTable.equipment,
          { itemId: '', chance: 0.1 }
        ]
      }
    }));
  };

  const updateEquipmentDrop = (index: number, field: string, value: any) => {
    setMonsterData(prev => ({
      ...prev,
      dropTable: {
        ...prev.dropTable,
        equipment: prev.dropTable.equipment.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const removeEquipmentDrop = (index: number) => {
    setMonsterData(prev => ({
      ...prev,
      dropTable: {
        ...prev.dropTable,
        equipment: prev.dropTable.equipment.filter((_, i) => i !== index)
      }
    }));
  };

  const addClassReward = () => {
    setMonsterData(prev => ({
      ...prev,
      classRewards: [
        ...prev.classRewards,
        { className: '', bonusXP: 10, bonusReputation: 1 }
      ]
    }));
  };

  const updateClassReward = (index: number, field: string, value: any) => {
    setMonsterData(prev => ({
      ...prev,
      classRewards: prev.classRewards.map((reward, i) => 
        i === index ? { ...reward, [field]: value } : reward
      )
    }));
  };

  const removeClassReward = (index: number) => {
    setMonsterData(prev => ({
      ...prev,
      classRewards: prev.classRewards.filter((_, i) => i !== index)
    }));
  };

  const itemOptions = Object.values(items).map(item => ({
    id: item.id,
    name: item.name
  }));

  const spellOptions = Object.values(spells).map(spell => ({
    id: spell.id,
    name: spell.name
  }));

  const classOptions = Object.keys(classes).map(className => ({
    id: className,
    name: className
  }));

  const elementOptions: Array<{ id: Element; name: Element }> = [
    { id: 'Light', name: 'Light' },
    { id: 'Fire', name: 'Fire' },
    { id: 'Water', name: 'Water' },
    { id: 'Earth', name: 'Earth' },
    { id: 'Air', name: 'Air' },
    { id: 'Dark', name: 'Dark' },
    { id: 'Neutral', name: 'Neutral' }
  ];

  const getElementColor = (element: Element) => {
    const colors = {
      Light: 'border-yellow-500 bg-yellow-900/20',
      Fire: 'border-red-500 bg-red-900/20',
      Water: 'border-blue-500 bg-blue-900/20',
      Earth: 'border-green-500 bg-green-900/20',
      Air: 'border-cyan-500 bg-cyan-900/20',
      Dark: 'border-purple-500 bg-purple-900/20',
      Neutral: 'border-gray-500 bg-gray-900/20'
    };
    return colors[element];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Skull className="w-8 h-8 text-red-400 mr-3" />
          Monster Management
        </h3>
        <button
          onClick={startCreating}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Monster</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingMonster) && (
        <div className="bg-black/50 rounded-xl p-6 border border-gray-700 max-h-[80vh] overflow-y-auto">
          <h4 className="text-lg font-semibold text-white mb-4">
            {isCreating ? 'Create New Monster' : `Edit ${monsters[editingMonster!]?.name}`}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monster ID
              </label>
              <input
                type="text"
                value={newMonsterId}
                onChange={(e) => setNewMonsterId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="unique_monster_id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monster Name
              </label>
              <input
                type="text"
                value={monsterData.name}
                onChange={(e) => setMonsterData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter monster name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Element
              </label>
              <SearchableSelect
                options={elementOptions}
                value={monsterData.element}
                onChange={(value) => setMonsterData(prev => ({ ...prev, element: value as Element }))}
                placeholder="Select element"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={monsterData.description}
              onChange={(e) => setMonsterData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter monster description"
            />
          </div>

          {/* Stats */}
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-300 mb-3">Stats</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Health</label>
                <input
                  type="number"
                  value={monsterData.stats.health}
                  onChange={(e) => setMonsterData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, health: parseInt(e.target.value) || 50 }
                  }))}
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Attack</label>
                <input
                  type="number"
                  value={monsterData.stats.attack}
                  onChange={(e) => setMonsterData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, attack: parseInt(e.target.value) || 10 }
                  }))}
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Defense</label>
                <input
                  type="number"
                  value={monsterData.stats.defense}
                  onChange={(e) => setMonsterData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, defense: parseInt(e.target.value) || 5 }
                  }))}
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Mana</label>
                <input
                  type="number"
                  value={monsterData.stats.mana}
                  onChange={(e) => setMonsterData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, mana: parseInt(e.target.value) || 20 }
                  }))}
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-300 mb-3">AI Behavior</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Threat Threshold (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={monsterData.ai.threatThreshold}
                  onChange={(e) => setMonsterData(prev => ({
                    ...prev,
                    ai: { ...prev.ai, threatThreshold: parseInt(e.target.value) || 30 }
                  }))}
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Resource Threshold</label>
                <input
                  type="number"
                  value={monsterData.ai.resourceThreshold}
                  onChange={(e) => setMonsterData(prev => ({
                    ...prev,
                    ai: { ...prev.ai, resourceThreshold: parseInt(e.target.value) || 20 }
                  }))}
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={monsterData.ai.elementalPreference}
                    onChange={(e) => setMonsterData(prev => ({
                      ...prev,
                      ai: { ...prev.ai, elementalPreference: e.target.checked }
                    }))}
                    className="rounded"
                  />
                  <span className="text-gray-300 text-sm">Elemental Preference</span>
                </label>
              </div>
            </div>
          </div>

          {/* Spells */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Spells
            </label>
            <SearchableSelect
              options={spellOptions}
              value=""
              onChange={() => {}}
              multiple={true}
              values={monsterData.spells}
              onMultiChange={(values) => setMonsterData(prev => ({ ...prev, spells: values }))}
              placeholder="Select spells"
            />
          </div>

          {/* Drop Table - Items */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">Item Drops</label>
              <button
                onClick={addDropItem}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
              >
                Add Item Drop
              </button>
            </div>

            <div className="space-y-3">
              {monsterData.dropTable.items.map((drop, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Item Drop {index + 1}</span>
                    <button
                      onClick={() => removeDropItem(index)}
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
                        value={drop.itemId}
                        onChange={(value) => updateDropItem(index, 'itemId', value)}
                        placeholder="Select item"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Drop Chance (0-1)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={drop.chance}
                        onChange={(e) => updateDropItem(index, 'chance', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={drop.quantity || 1}
                        onChange={(e) => updateDropItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drop Table - Equipment */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">Equipment Drops</label>
              <button
                onClick={addEquipmentDrop}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
              >
                Add Equipment Drop
              </button>
            </div>

            <div className="space-y-3">
              {monsterData.dropTable.equipment.map((drop, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Equipment Drop {index + 1}</span>
                    <button
                      onClick={() => removeEquipmentDrop(index)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Equipment</label>
                      <SearchableSelect
                        options={itemOptions.filter(item => items[item.id]?.type !== 'consumable')}
                        value={drop.itemId}
                        onChange={(value) => updateEquipmentDrop(index, 'itemId', value)}
                        placeholder="Select equipment"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Drop Chance (0-1)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={drop.chance}
                        onChange={(e) => updateEquipmentDrop(index, 'chance', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Rewards */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">Class Rewards</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const newRewards = [...monsterData.classRewards];
                    newRewards.push({ className: 'all', bonusXP: 50, bonusReputation: 1 });
                    setMonsterData(prev => ({ ...prev, classRewards: newRewards }));
                  }}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
                >
                  Add All Classes
                </button>
              <button
                onClick={addClassReward}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
              >
                Add Class Reward
              </button>
              </div>
            </div>

            <div className="space-y-3">
              {monsterData.classRewards.map((reward, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Class Reward {index + 1}</span>
                    <button
                      onClick={() => removeClassReward(index)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Class</label>
                      {reward.className === 'all' ? (
                        <div className="px-2 py-1 bg-blue-600/20 border border-blue-600/50 rounded text-blue-400 text-sm">
                          All Classes
                        </div>
                      ) : (
                        <SearchableSelect
                          options={[{ id: 'all', name: 'All Classes' }, ...classOptions]}
                          value={reward.className}
                          onChange={(value) => updateClassReward(index, 'className', value)}
                          placeholder="Select class"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Bonus XP</label>
                      <input
                        type="number"
                        min="0"
                        value={reward.bonusXP}
                        onChange={(e) => updateClassReward(index, 'bonusXP', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Bonus Reputation</label>
                      <input
                        type="number"
                        min="0"
                        value={reward.bonusReputation || 0}
                        onChange={(e) => updateClassReward(index, 'bonusReputation', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spell Unlocks */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Spell Unlocks (on defeat)
            </label>
            <SearchableSelect
              options={spellOptions}
              value=""
              onChange={() => {}}
              multiple={true}
              values={monsterData.spellUnlocks}
              onMultiChange={(values) => setMonsterData(prev => ({ ...prev, spellUnlocks: values }))}
              placeholder="Select spells to unlock"
            />
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

      {/* Monsters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(monsters).map(([monsterId, monster]) => (
          <div key={monsterId} className={`rounded-xl p-4 border-2 ${getElementColor(monster.element)}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-white">{monster.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(monsterId)}
                  className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(monsterId)}
                  className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{monster.description}</p>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Element:</span>
                <span className="text-white font-medium">{monster.element}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Health:</span>
                <span className="text-red-400">{monster.stats.health}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Attack:</span>
                <span className="text-orange-400">{monster.stats.attack}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Defense:</span>
                <span className="text-blue-400">{monster.stats.defense}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Spells:</span>
                <span className="text-purple-400">{monster.spells.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Drops:</span>
                <span className="text-green-400">{monster.dropTable.items.length + monster.dropTable.equipment.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};