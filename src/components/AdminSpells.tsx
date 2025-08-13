import React, { useState } from 'react';
import { Zap, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Spell, Element } from '../types/game';
import { SearchableSelect } from './SearchableSelect';

interface AdminSpellsProps {
  spells: { [key: string]: Spell };
  classes: { [key: string]: any };
  onCreateSpell: (spellData: any) => void;
  onUpdateSpell: (spellId: string, spellData: any) => void;
  onDeleteSpell: (spellId: string) => void;
}

export const AdminSpells: React.FC<AdminSpellsProps> = ({ spells, classes, onCreateSpell, onUpdateSpell, onDeleteSpell }) => {
  const [editingSpell, setEditingSpell] = useState<string | null>(null);
  const [newSpellId, setNewSpellId] = useState('');
  const [spellData, setSpellData] = useState<Spell>({
    id: '',
    name: '',
    type: 'Attack',
    description: '',
    manaCost: 1,
    power: 10,
    requirements: {
      level: 1,
      stats: {},
      classes: []
    }
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (spellId: string) => {
    setEditingSpell(spellId);
    setNewSpellId(spellId);
    setSpellData({ ...spells[spellId] });
  };

  const handleSave = () => {
    if (!newSpellId.trim()) return;
    
    const finalSpellData = { ...spellData, id: newSpellId };

    if (editingSpell) {
      if (editingSpell !== newSpellId) {
        // ID changed - delete old and create new
        onDeleteSpell(editingSpell);
        onCreateSpell(finalSpellData);
      } else {
        // Same ID - update existing
        onUpdateSpell(editingSpell, finalSpellData);
      }
    } else {
      // Creating new spell
      onCreateSpell(finalSpellData);
    }
    
    setEditingSpell(null);
    setIsCreating(false);
    setNewSpellId('');
    setSpellData({
      id: '',
      name: '',
      type: 'Attack',
      description: '',
      manaCost: 1,
      power: 10,
      requirements: {
        level: 1,
        stats: {},
        classes: []
      }
    });
  };

  const handleDelete = (spellId: string) => {
    if (confirm(`Are you sure you want to delete "${spells[spellId].name}"?`)) {
      onDeleteSpell(spellId);
    }
  };

  const handleCancel = () => {
    setEditingSpell(null);
    setIsCreating(false);
    setNewSpellId('');
    setSpellData({
      id: '',
      name: '',
      type: 'Attack',
      description: '',
      manaCost: 1,
      power: 10,
      requirements: {
        level: 1,
        stats: {},
        classes: []
      }
    });
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewSpellId('');
    setSpellData({
      id: '',
      name: '',
      type: 'Attack',
      description: '',
      manaCost: 1,
      power: 10,
      requirements: {
        level: 1,
        stats: {},
        classes: []
      }
    });
  };

  const handleStatRequirementChange = (stat: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setSpellData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        stats: {
          ...prev.requirements.stats,
          [stat]: numValue === 0 ? undefined : numValue
        }
      }
    }));
  };

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

  const getSpellTypeColor = (type: string) => {
    const colors = {
      Attack: 'border-red-500 bg-red-900/20',
      Defend: 'border-blue-500 bg-blue-900/20',
      Heal: 'border-green-500 bg-green-900/20'
    };
    return colors[type as keyof typeof colors] || colors.Attack;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Zap className="w-8 h-8 text-purple-400 mr-3" />
          Spell Management
        </h3>
        <button
          onClick={startCreating}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Spell</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingSpell) && (
        <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">
            {isCreating ? 'Create New Spell' : `Edit ${spells[editingSpell!]?.name}`}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Spell ID
              </label>
              <input
                type="text"
                value={newSpellId}
                onChange={(e) => setNewSpellId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="unique_spell_id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Spell Name
              </label>
              <input
                type="text"
                value={spellData.name}
                onChange={(e) => setSpellData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter spell name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <select
                value={spellData.type}
                onChange={(e) => setSpellData(prev => ({ ...prev, type: e.target.value as Spell['type'] }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Attack">Attack</option>
                <option value="Defend">Defend</option>
                <option value="Heal">Heal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Element
              </label>
              <SearchableSelect
                options={elementOptions}
                value={spellData.element || ''}
                onChange={(value) => setSpellData(prev => ({ ...prev, element: value as Element || undefined }))}
                placeholder="Select element (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mana Cost
              </label>
              <input
                type="number"
                min="1"
                value={spellData.manaCost}
                onChange={(e) => setSpellData(prev => ({ ...prev, manaCost: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Power
              </label>
              <input
                type="number"
                min="1"
                value={spellData.power}
                onChange={(e) => setSpellData(prev => ({ ...prev, power: parseInt(e.target.value) || 10 }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Required Level
              </label>
              <input
                type="number"
                min="1"
                value={spellData.requirements.level}
                onChange={(e) => setSpellData(prev => ({
                  ...prev,
                  requirements: {
                    ...prev.requirements,
                    level: parseInt(e.target.value) || 1
                  }
                }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={spellData.description}
              onChange={(e) => setSpellData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter spell description"
            />
          </div>

          {/* Stat Requirements */}
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-300 mb-3">Stat Requirements</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(['strength', 'intelligence', 'magic', 'vitality', 'luck', 'charm', 'reputation', 'gold'] as const).map((stat) => (
                <div key={stat}>
                  <label className="block text-xs text-gray-400 mb-1 capitalize">
                    {stat}
                  </label>
                  <input
                    type="number"
                    value={spellData.requirements.stats?.[stat] || 0}
                    onChange={(e) => handleStatRequirementChange(stat, e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Class Requirements */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Required Classes
            </label>
            <SearchableSelect
              options={classOptions}
              value=""
              onChange={() => {}}
              multiple={true}
              values={spellData.requirements.classes || []}
              onMultiChange={(values) => setSpellData(prev => ({
                ...prev,
                requirements: {
                  ...prev.requirements,
                  classes: values
                }
              }))}
              placeholder="Select required classes"
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

      {/* Spells List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(spells).map(([spellId, spell]) => (
          <div key={spellId} className={`rounded-xl p-4 border-2 ${getSpellTypeColor(spell.type)}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-white">{spell.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(spellId)}
                  className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(spellId)}
                  className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{spell.description}</p>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className={`font-medium ${
                  spell.type === 'Attack' ? 'text-red-400' :
                  spell.type === 'Heal' ? 'text-green-400' :
                  'text-blue-400'
                }`}>{spell.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mana Cost:</span>
                <span className="text-blue-400">{spell.manaCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Power:</span>
                <span className="text-yellow-400">{spell.power}</span>
              </div>
              {spell.element && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Element:</span>
                  <span className="text-purple-400">{spell.element}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Level Req:</span>
                <span className="text-white">{spell.requirements.level}</span>
              </div>
              {spell.requirements.classes && spell.requirements.classes.length > 0 && (
                <div>
                  <span className="text-gray-400">Classes:</span>
                  <div className="mt-1 text-orange-400">
                    {spell.requirements.classes.join(', ')}
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