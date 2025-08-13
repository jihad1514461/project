import React, { useState } from 'react';
import { Crown, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Villain, Element } from '../types/game';
import { SearchableSelect } from './SearchableSelect';

interface AdminVillainsProps {
  villains: { [key: string]: Villain };
  items: { [key: string]: any };
  spells: { [key: string]: any };
  classes: { [key: string]: any };
  onCreateVillain: (villainData: any) => void;
  onUpdateVillain: (villainId: string, villainData: any) => void;
  onDeleteVillain: (villainId: string) => void;
}

export const AdminVillains: React.FC<AdminVillainsProps> = ({ 
  villains, 
  items, 
  spells, 
  classes, 
  onCreateVillain,
  onUpdateVillain,
  onDeleteVillain
}) => {
  const [editingVillain, setEditingVillain] = useState<string | null>(null);
  const [newVillainId, setNewVillainId] = useState('');
  const [villainData, setVillainData] = useState<Villain>({
    id: '',
    name: '',
    description: '',
    backstory: '',
    stats: {
      health: 100,
      attack: 20,
      defense: 15,
      mana: 50
    },
    element: 'Dark',
    spells: [],
    weaknesses: [],
    immunities: [],
    ai: {
      threatThreshold: 50,
      elementalPreference: true,
      resourceThreshold: 30
    },
    dropTable: {
      items: [],
      equipment: []
    },
    classRewards: [],
    spellUnlocks: []
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (villainId: string) => {
    setEditingVillain(villainId);
    setNewVillainId(villainId);
    setVillainData({ ...villains[villainId] });
  };

  const handleSave = () => {
    if (!newVillainId.trim()) return;
    
    const finalVillainData = { ...villainData, id: newVillainId };

    if (editingVillain) {
      if (editingVillain !== newVillainId) {
        // ID changed - delete old and create new
        onDeleteVillain(editingVillain);
        onCreateVillain(finalVillainData);
      } else {
        // Same ID - update existing
        onUpdateVillain(editingVillain, finalVillainData);
      }
    } else {
      // Creating new villain
      onCreateVillain(finalVillainData);
    }
    
    setEditingVillain(null);
    setIsCreating(false);
    setNewVillainId('');
    setVillainData({
      id: '',
      name: '',
      description: '',
      backstory: '',
      stats: {
        health: 100,
        attack: 20,
        defense: 15,
        mana: 50
      },
      element: 'Dark',
      spells: [],
      weaknesses: [],
      immunities: [],
      ai: {
        threatThreshold: 50,
        elementalPreference: true,
        resourceThreshold: 30
      },
      dropTable: {
        items: [],
        equipment: []
      },
      classRewards: [],
      spellUnlocks: []
    });
  };

  const handleDelete = (villainId: string) => {
    if (confirm(`Are you sure you want to delete "${villains[villainId].name}"?`)) {
      onDeleteVillain(villainId);
    }
  };

  const handleCancel = () => {
    setEditingVillain(null);
    setIsCreating(false);
    setNewVillainId('');
    setVillainData({
      id: '',
      name: '',
      description: '',
      backstory: '',
      stats: {
        health: 100,
        attack: 20,
        defense: 15,
        mana: 50
      },
      element: 'Dark',
      spells: [],
      weaknesses: [],
      immunities: [],
      ai: {
        threatThreshold: 50,
        elementalPreference: true,
        resourceThreshold: 30
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
    setNewVillainId('');
    setVillainData({
      id: '',
      name: '',
      description: '',
      backstory: '',
      stats: {
        health: 100,
        attack: 20,
        defense: 15,
        mana: 50
      },
      element: 'Dark',
      spells: [],
      weaknesses: [],
      immunities: [],
      ai: {
        threatThreshold: 50,
        elementalPreference: true,
        resourceThreshold: 30
      },
      dropTable: {
        items: [],
        equipment: []
      },
      classRewards: [],
      spellUnlocks: []
    });
  };

  const elementOptions: Array<{ id: Element; name: Element }> = [
    { id: 'Light', name: 'Light' },
    { id: 'Fire', name: 'Fire' },
    { id: 'Water', name: 'Water' },
    { id: 'Earth', name: 'Earth' },
    { id: 'Air', name: 'Air' },
    { id: 'Dark', name: 'Dark' },
    { id: 'Neutral', name: 'Neutral' }
  ];

  const spellOptions = Object.values(spells).map(spell => ({
    id: spell.id,
    name: spell.name
  }));

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
          <Crown className="w-8 h-8 text-purple-400 mr-3" />
          Villain Management
        </h3>
        <button
          onClick={startCreating}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Villain</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingVillain) && (
        <div className="bg-black/50 rounded-xl p-6 border border-gray-700 max-h-[80vh] overflow-y-auto">
          <h4 className="text-lg font-semibold text-white mb-4">
            {isCreating ? 'Create New Villain' : `Edit ${villains[editingVillain!]?.name}`}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Villain ID
              </label>
              <input
                type="text"
                value={newVillainId}
                onChange={(e) => setNewVillainId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="unique_villain_id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Villain Name
              </label>
              <input
                type="text"
                value={villainData.name}
                onChange={(e) => setVillainData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter villain name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Element
              </label>
              <SearchableSelect
                options={elementOptions}
                value={villainData.element}
                onChange={(value) => setVillainData(prev => ({ ...prev, element: value as Element }))}
                placeholder="Select element"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={villainData.description}
              onChange={(e) => setVillainData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter villain description"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Backstory
            </label>
            <textarea
              value={villainData.backstory}
              onChange={(e) => setVillainData(prev => ({ ...prev, backstory: e.target.value }))}
              className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter villain backstory"
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
                  value={villainData.stats.health}
                  onChange={(e) => setVillainData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, health: parseInt(e.target.value) || 100 }
                  }))}
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Attack</label>
                <input
                  type="number"
                  value={villainData.stats.attack}
                  onChange={(e) => setVillainData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, attack: parseInt(e.target.value) || 20 }
                  }))}
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Defense</label>
                <input
                  type="number"
                  value={villainData.stats.defense}
                  onChange={(e) => setVillainData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, defense: parseInt(e.target.value) || 15 }
                  }))}
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Mana</label>
                <input
                  type="number"
                  value={villainData.stats.mana}
                  onChange={(e) => setVillainData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, mana: parseInt(e.target.value) || 50 }
                  }))}
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
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
              values={villainData.spells}
              onMultiChange={(values) => setVillainData(prev => ({ ...prev, spells: values }))}
              placeholder="Select spells"
            />
          </div>

          {/* Weaknesses */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Weaknesses
            </label>
            <SearchableSelect
              options={elementOptions}
              value=""
              onChange={() => {}}
              multiple={true}
              values={villainData.weaknesses}
              onMultiChange={(values) => setVillainData(prev => ({ ...prev, weaknesses: values as Element[] }))}
              placeholder="Select elemental weaknesses"
            />
          </div>

          {/* Immunities */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Immunities
            </label>
            <SearchableSelect
              options={elementOptions}
              value=""
              onChange={() => {}}
              multiple={true}
              values={villainData.immunities}
              onMultiChange={(values) => setVillainData(prev => ({ ...prev, immunities: values as Element[] }))}
              placeholder="Select elemental immunities"
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

      {/* Villains List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(villains).map(([villainId, villain]) => (
          <div key={villainId} className={`rounded-xl p-6 border-2 ${getElementColor(villain.element)}`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-white">{villain.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(villainId)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(villainId)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{villain.description}</p>
            <p className="text-gray-400 text-xs mb-4 italic">{villain.backstory}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Element:</span>
                <span className="text-white font-medium">{villain.element}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Health:</span>
                <span className="text-red-400">{villain.stats.health}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Attack:</span>
                <span className="text-orange-400">{villain.stats.attack}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Defense:</span>
                <span className="text-blue-400">{villain.stats.defense}</span>
              </div>
              {villain.weaknesses.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Weaknesses:</span>
                  <span className="text-red-300">{villain.weaknesses.join(', ')}</span>
                </div>
              )}
              {villain.immunities.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Immunities:</span>
                  <span className="text-green-300">{villain.immunities.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};