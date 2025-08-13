import React, { useState } from 'react';
import { Sword, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { PlayerStats, Item, Element, ClassDefinition } from '../types/game';
import { SearchableSelect } from './SearchableSelect';

interface AdminClassesProps {
  classes: { [key: string]: ClassDefinition };
  classRequirements: { [key: string]: any };
  items: { [key: string]: Item };
  onCreateClass: (classData: any, requirementData?: any) => void;
  onUpdateClass: (classId: string, classData: any, requirementData?: any) => void;
  onDeleteClass: (classId: string) => void;
}

export const AdminClasses: React.FC<AdminClassesProps> = ({ 
  classes, 
  classRequirements, 
  items, 
  onCreateClass,
  onUpdateClass,
  onDeleteClass
}) => {
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [newClassName, setNewClassName] = useState('');
  const [classData, setClassData] = useState<ClassDefinition>({
    id: '',
    name: '',
    tier: 0,
    baseStats: {},
    elementalRequirements: [],
    reputation: 0,
    gold: 0,
    description: '',
    maxLevel: 20
  });
  const [classRequirement, setClassRequirement] = useState<any>({
    requiredStats: {},
    requiredLevel: 1,
    requiredElements: [],
    description: '',
    initialEquipment: []
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (className: string) => {
    setEditingClass(className);
    setNewClassName(className);
    setClassData(classes[className]);
    setClassRequirement(classRequirements[className] || {
      requiredStats: {},
      requiredLevel: 1,
      requiredElements: [],
      description: '',
      initialEquipment: []
    });
  };

  const handleSave = () => {
    if (!newClassName.trim()) return;
    
    const finalClassData = { ...classData, id: newClassName, name: newClassName };
    const finalRequirementData = classRequirement && Object.keys(classRequirement).length > 0 ? classRequirement : undefined;

    if (editingClass) {
      if (editingClass !== newClassName) {
        // ID changed - delete old and create new
        onDeleteClass(editingClass);
        onCreateClass(finalClassData, finalRequirementData);
      } else {
        // Same ID - update existing
        onUpdateClass(editingClass, finalClassData, finalRequirementData);
      }
    } else {
      // Creating new class
      onCreateClass(finalClassData, finalRequirementData);
    }
    
    setEditingClass(null);
    setIsCreating(false);
    setNewClassName('');
    setClassData({
      id: '',
      name: '',
      tier: 0,
      baseStats: {},
      elementalRequirements: [],
      reputation: 0,
      gold: 0,
      description: '',
      maxLevel: 20
    });
    setClassRequirement({
      requiredStats: {},
      requiredLevel: 1,
      requiredElements: [],
      description: '',
      initialEquipment: []
    });
  };

  const handleDelete = (className: string) => {
    if (confirm(`Are you sure you want to delete the ${className} class?`)) {
      onDeleteClass(className);
    }
  };

  const handleCancel = () => {
    setEditingClass(null);
    setIsCreating(false);
    setNewClassName('');
    setClassData({
      id: '',
      name: '',
      tier: 0,
      baseStats: {},
      elementalRequirements: [],
      reputation: 0,
      gold: 0,
      description: '',
      maxLevel: 20
    });
    setClassRequirement({
      requiredStats: {},
      requiredLevel: 1,
      requiredElements: [],
      description: '',
      initialEquipment: []
    });
  };

  const handleStatChange = (stat: keyof PlayerStats, value: string) => {
    const numValue = parseInt(value) || 0;
    setClassData(prev => ({ 
      ...prev, 
      baseStats: { ...prev.baseStats, [stat]: numValue }
    }));
  };

  const handleRequirementStatChange = (stat: keyof PlayerStats, value: string) => {
    const numValue = parseInt(value) || 0;
    setClassRequirement(prev => ({
      ...prev,
      requiredStats: {
        ...prev.requiredStats,
        [stat]: numValue
      }
    }));
  };

  const handleEquipmentChange = (equipment: string) => {
    const equipmentArray = equipment.split(',').map(e => e.trim()).filter(e => e);
    setClassRequirement(prev => ({
      ...prev,
      initialEquipment: equipmentArray
    }));
  };
  const startCreating = () => {
    setIsCreating(true);
    setNewClassName('');
    setClassData({
      id: '',
      name: '',
      tier: 0,
      baseStats: {
        strength: 0,
        intelligence: 0,
        magic: 0,
        vitality: 0,
        gold: 0,
        reputation: 0
      },
      elementalRequirements: [],
      reputation: 0,
      gold: 0,
      description: '',
      maxLevel: 20
    });
    setClassRequirement({
      requiredStats: {},
      requiredLevel: 1,
      requiredElements: [],
      description: '',
      initialEquipment: []
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Sword className="w-8 h-8 text-red-400 mr-3" />
          Character Classes
        </h3>
        <button
          onClick={startCreating}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Class</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingClass) && (
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
          <h4 className="text-lg font-semibold text-white mb-4">
            {isCreating ? 'Create New Class' : `Edit ${editingClass}`}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Class Name
              </label>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter class name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={classData.description}
                onChange={(e) => setClassData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter class description"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tier
              </label>
              <input
                type="number"
                min="0"
                value={classData.tier}
                onChange={(e) => setClassData(prev => ({ ...prev, tier: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Level
              </label>
              <input
                type="number"
                min="1"
                value={classData.maxLevel}
                onChange={(e) => setClassData(prev => ({ ...prev, maxLevel: parseInt(e.target.value) || 20 }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Elemental Requirements */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Element Requirements (for class usage)
            </label>
            <SearchableSelect
              options={elementOptions}
              value=""
              onChange={() => {}}
              multiple={true}
              values={classData.elementalRequirements}
              onMultiChange={(values) => setClassData(prev => ({ 
                ...prev, 
                elementalRequirements: values as Element[] 
              }))}
              placeholder="Select element requirements"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Required Level for Unlock
            </label>
            <input
              type="number"
              min="1"
              value={classRequirement.requiredLevel}
              onChange={(e) => setClassRequirement(prev => ({ ...prev, requiredLevel: parseInt(e.target.value) || 1 }))}
              className="w-32 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <h5 className="col-span-full text-sm font-semibold text-gray-300 mb-2">Base Class Stats (added when class is taken)</h5>
            {(['strength', 'intelligence', 'magic', 'vitality', 'gold', 'reputation'] as const).map((stat) => (
              <div key={stat}>
                <label className="block text-sm font-medium text-gray-300 mb-2 capitalize flex items-center">
                  <span className="mr-1">
                    {stat === 'strength' && '⚔️'}
                    {stat === 'intelligence' && '🧠'}
                    {stat === 'magic' && '✨'}
                    {stat === 'vitality' && '❤️'}
                    {stat === 'gold' && '💰'}
                    {stat === 'reputation' && '👑'}
                  </span>
                  {stat}
                </label>
                <input
                  type="number"
                  min="0"
                  value={classData.baseStats[stat] || 0}
                  onChange={(e) => handleStatChange(stat, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <h5 className="col-span-full text-sm font-semibold text-gray-300 mb-2">Stat Requirements (needed to unlock this class)</h5>
            {(['strength', 'intelligence', 'magic', 'vitality', 'gold', 'reputation'] as const).map((stat) => (
              <div key={stat}>
                <label className="block text-sm font-medium text-gray-300 mb-2 capitalize flex items-center">
                  <span className="mr-1">
                    {stat === 'strength' && '⚔️'}
                    {stat === 'intelligence' && '🧠'}
                    {stat === 'magic' && '✨'}
                    {stat === 'vitality' && '❤️'}
                    {stat === 'gold' && '💰'}
                    {stat === 'reputation' && '👑'}
                  </span>
                  {stat}
                </label>
                <input
                  type="number"
                  min="0"
                  value={classRequirement.requiredStats[stat] || 0}
                  onChange={(e) => handleRequirementStatChange(stat, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Required Elements for Unlocking */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Required Elements (for unlocking)
            </label>
            <SearchableSelect
              options={elementOptions}
              value=""
              onChange={() => {}}
              multiple={true}
              values={classRequirement.requiredElements || []}
              onMultiChange={(values) => setClassRequirement(prev => ({ 
                ...prev, 
                requiredElements: values as Element[] 
              }))}
              placeholder="Select required elements for unlocking"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Initial Equipment (Item IDs, comma-separated)
            </label>
            <input
              type="text"
              value={classRequirement.initialEquipment?.join(', ') || ''}
              onChange={(e) => handleEquipmentChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="iron_sword, leather_armor, health_potion"
            />
            <p className="text-xs text-gray-400 mt-1">
              Available items: {Object.keys(items).join(', ')}
            </p>
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

      {/* Classes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(classes).map(([className, classData]) => (
          <div key={className} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-white">{classData.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(className)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(className)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {classData.description && (
              <p className="text-gray-300 text-sm mb-3">{classData.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-red-400">⚔️ Strength:</span>
                <span className="text-white font-medium">{classData.baseStats.strength || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400">🧠 Intelligence:</span>
                <span className="text-white font-medium">{classData.baseStats.intelligence || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">✨ Magic:</span>
                <span className="text-white font-medium">{classData.baseStats.magic || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">❤️ Vitality:</span>
                <span className="text-white font-medium">{classData.baseStats.vitality || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">🍀 Luck:</span>
                <span className="text-white font-medium">{classData.baseStats.luck || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pink-400">💫 Charm:</span>
                <span className="text-white font-medium">{classData.baseStats.charm || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-400">👑 Reputation:</span>
                <span className="text-white font-medium">{classData.baseStats.reputation || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">💰 Gold:</span>
                <span className="text-white font-medium">{classData.baseStats.gold || 0}</span>
              </div>
            </div>
            
            {classData.elementalRequirements.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-600">
                <div className="text-xs text-gray-400">
                  Elements: {classData.elementalRequirements.join(', ')}
                </div>
              </div>
            )}
            
            {classRequirements[className] && (
              <div className="mt-2 pt-2 border-t border-slate-600">
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Tier: {classData.tier} | Max Level: {classData.maxLevel}</div>
                  <div>Unlock Level: {classRequirements[className].requiredLevel}</div>
                  {classRequirements[className].initialEquipment?.length > 0 && (
                    <div>Starting Equipment: {classRequirements[className].initialEquipment.join(', ')}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};