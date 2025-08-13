import React, { useState } from 'react';
import { Star, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Skill, PlayerStats } from '../types/game';
import { SearchableSelect } from './SearchableSelect';

interface AdminSkillsProps {
  skills: { [key: string]: Skill };
  classes: { [key: string]: any };
  onCreateSkill: (skillData: any) => void;
  onUpdateSkill: (skillId: string, skillData: any) => void;
  onDeleteSkill: (skillId: string) => void;
}

export const AdminSkills: React.FC<AdminSkillsProps> = ({ skills, classes, onCreateSkill, onUpdateSkill, onDeleteSkill }) => {
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [newSkillId, setNewSkillId] = useState('');
  const [skillData, setSkillData] = useState<Skill>({
    id: '',
    name: '',
    description: '',
    type: 'passive',
    effects: {},
    requirements: {
      level: 1,
      stats: {},
      classes: []
    }
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (skillId: string) => {
    setEditingSkill(skillId);
    setNewSkillId(skillId);
    setSkillData({ ...skills[skillId] });
  };

  const handleSave = () => {
    if (!newSkillId.trim()) return;
    
    const finalSkillData = { ...skillData, id: newSkillId };

    if (editingSkill) {
      if (editingSkill !== newSkillId) {
        // ID changed - delete old and create new
        onDeleteSkill(editingSkill);
        onCreateSkill(finalSkillData);
      } else {
        // Same ID - update existing
        onUpdateSkill(editingSkill, finalSkillData);
      }
    } else {
      // Creating new skill
      onCreateSkill(finalSkillData);
    }
    
    setEditingSkill(null);
    setIsCreating(false);
    setNewSkillId('');
    setSkillData({
      id: '',
      name: '',
      description: '',
      type: 'passive',
      effects: {},
      requirements: {
        level: 1,
        stats: {},
        classes: []
      }
    });
  };

  const handleDelete = (skillId: string) => {
    if (confirm(`Are you sure you want to delete "${skills[skillId].name}"?`)) {
      onDeleteSkill(skillId);
    }
  };

  const handleCancel = () => {
    setEditingSkill(null);
    setIsCreating(false);
    setNewSkillId('');
    setSkillData({
      id: '',
      name: '',
      description: '',
      type: 'passive',
      effects: {},
      requirements: {
        level: 1,
        stats: {},
        classes: []
      }
    });
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewSkillId('');
    setSkillData({
      id: '',
      name: '',
      description: '',
      type: 'passive',
      effects: {},
      requirements: {
        level: 1,
        stats: {},
        classes: []
      }
    });
  };

  const handleEffectChange = (stat: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setSkillData(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [stat]: numValue === 0 ? undefined : numValue
      }
    }));
  };

  const handleStatRequirementChange = (stat: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setSkillData(prev => ({
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

  const getSkillTypeColor = (type: string) => {
    const colors = {
      passive: 'border-blue-500 bg-blue-900/20',
      active: 'border-green-500 bg-green-900/20'
    };
    return colors[type as keyof typeof colors] || colors.passive;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Star className="w-8 h-8 text-orange-400 mr-3" />
          Skill Management
        </h3>
        <button
          onClick={startCreating}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingSkill) && (
        <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">
            {isCreating ? 'Create New Skill' : `Edit ${skills[editingSkill!]?.name}`}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skill ID
              </label>
              <input
                type="text"
                value={newSkillId}
                onChange={(e) => setNewSkillId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="unique_skill_id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skill Name
              </label>
              <input
                type="text"
                value={skillData.name}
                onChange={(e) => setSkillData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter skill name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <select
                value={skillData.type}
                onChange={(e) => setSkillData(prev => ({ ...prev, type: e.target.value as Skill['type'] }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="passive">Passive</option>
                <option value="active">Active</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Required Level
              </label>
              <input
                type="number"
                min="1"
                value={skillData.requirements.level}
                onChange={(e) => setSkillData(prev => ({
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
              value={skillData.description}
              onChange={(e) => setSkillData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter skill description"
            />
          </div>

          {/* Effects */}
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-300 mb-3">Effects</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(['strength', 'intelligence', 'magic', 'vitality', 'luck', 'charm', 'reputation', 'gold', 'hearts', 'maxHearts'] as const).map((stat) => (
                <div key={stat}>
                  <label className="block text-xs text-gray-400 mb-1 capitalize">
                    {stat === 'maxHearts' ? 'Max Hearts' : stat}
                  </label>
                  <input
                    type="number"
                    value={skillData.effects[stat] || 0}
                    onChange={(e) => handleEffectChange(stat, e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
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
                    value={skillData.requirements.stats?.[stat] || 0}
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
              values={skillData.requirements.classes || []}
              onMultiChange={(values) => setSkillData(prev => ({
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

      {/* Skills List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(skills).map(([skillId, skill]) => (
          <div key={skillId} className={`rounded-xl p-4 border-2 ${getSkillTypeColor(skill.type)}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-white">{skill.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(skillId)}
                  className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(skillId)}
                  className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{skill.description}</p>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className={`font-medium ${
                  skill.type === 'passive' ? 'text-blue-400' : 'text-green-400'
                }`}>{skill.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Level Req:</span>
                <span className="text-white">{skill.requirements.level}</span>
              </div>
              {skill.effects && Object.keys(skill.effects).length > 0 && (
                <div>
                  <span className="text-gray-400">Effects:</span>
                  <div className="mt-1 space-y-1">
                    {Object.entries(skill.effects).map(([stat, value]) => (
                      <div key={stat} className="text-green-400">
                        +{value} {stat === 'maxHearts' ? 'Max Hearts' : stat}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {skill.requirements.classes && skill.requirements.classes.length > 0 && (
                <div>
                  <span className="text-gray-400">Classes:</span>
                  <div className="mt-1 text-orange-400">
                    {skill.requirements.classes.join(', ')}
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