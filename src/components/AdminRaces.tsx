import React, { useState } from 'react';
import { Crown, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { PlayerStats } from '../types/game';

interface AdminRacesProps {
  races: { [key: string]: Partial<PlayerStats> };
  onCreateRace: (raceId: string, raceData: any) => void;
  onUpdateRace: (raceId: string, raceData: any) => void;
  onDeleteRace: (raceId: string) => void;
}

export const AdminRaces: React.FC<AdminRacesProps> = ({ races, onCreateRace, onUpdateRace, onDeleteRace }) => {
  const [editingRace, setEditingRace] = useState<string | null>(null);
  const [newRaceName, setNewRaceName] = useState('');
  const [raceStats, setRaceStats] = useState<Partial<PlayerStats>>({});
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (raceName: string) => {
    setEditingRace(raceName);
    setNewRaceName(raceName);
    setRaceStats(races[raceName]);
  };

  const handleSave = () => {
    if (!newRaceName.trim()) return;
    
    if (editingRace) {
      if (editingRace !== newRaceName) {
        // ID changed - delete old and create new
        onDeleteRace(editingRace);
        onCreateRace(newRaceName, raceStats);
      } else {
        // Same ID - update existing
        onUpdateRace(editingRace, raceStats);
      }
    } else {
      // Creating new race
      onCreateRace(newRaceName, raceStats);
    }
    
    setEditingRace(null);
    setIsCreating(false);
    setNewRaceName('');
    setRaceStats({});
  };

  const handleDelete = (raceName: string) => {
    if (confirm(`Are you sure you want to delete the ${raceName} race?`)) {
      onDeleteRace(raceName);
    }
  };

  const handleCancel = () => {
    setEditingRace(null);
    setIsCreating(false);
    setNewRaceName('');
    setRaceStats({});
  };

  const handleStatChange = (stat: keyof PlayerStats, value: string) => {
    const numValue = parseInt(value) || 0;
    setRaceStats(prev => ({ ...prev, [stat]: numValue }));
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewRaceName('');
    setRaceStats({
      strength: 0,
      intelligence: 0,
      magic: 0,
      vitality: 0,
      gold: 0,
      reputation: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Crown className="w-8 h-8 text-purple-400 mr-3" />
          Character Races
        </h3>
        <button
          onClick={startCreating}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Race</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingRace) && (
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
          <h4 className="text-lg font-semibold text-white mb-4">
            {isCreating ? 'Create New Race' : `Edit ${editingRace}`}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Race Name
              </label>
              <input
                type="text"
                value={newRaceName}
                onChange={(e) => setNewRaceName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter race name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
                  value={raceStats[stat] || 0}
                  onChange={(e) => handleStatChange(stat, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
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

      {/* Races List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(races).map(([raceName, stats]) => (
          <div key={raceName} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-white">{raceName}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(raceName)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(raceName)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-red-400 flex items-center">
                  <span className="mr-1">⚔️</span>
                  Strength:
                </span>
                <span className="text-white font-medium">{stats.strength || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400 flex items-center">
                  <span className="mr-1">🧠</span>
                  Intelligence:
                </span>
                <span className="text-white font-medium">{stats.intelligence || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400 flex items-center">
                  <span className="mr-1">✨</span>
                  Magic:
                </span>
                <span className="text-white font-medium">{stats.magic || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400 flex items-center">
                  <span className="mr-1">❤️</span>
                  Vitality:
                </span>
                <span className="text-white font-medium">{stats.vitality || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400 flex items-center">
                  <span className="mr-1">🍀</span>
                  Luck:
                </span>
                <span className="text-white font-medium">{stats.luck || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pink-400 flex items-center">
                  <span className="mr-1">💫</span>
                  Charm:
                </span>
                <span className="text-white font-medium">{stats.charm || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-400 flex items-center">
                  <span className="mr-1">👑</span>
                  Reputation:
                </span>
                <span className="text-white font-medium">{stats.reputation || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400 flex items-center">
                  <span className="mr-1">💰</span>
                  Gold:
                </span>
                <span className="text-white font-medium">{stats.gold || 0}</span>
              </div>
            </div>

            {/* Derived Stats Preview */}
            <div className="mt-3 pt-3 border-t border-slate-600">
              <div className="text-xs text-gray-400 space-y-1">
                <div>Max Health: {(stats.vitality || 0) * 2}</div>
                <div>Max Mana: {(stats.magic || 0) * 3}</div>
                <div>Physical Damage: {Math.floor((stats.strength || 0) / 2) + 1}</div>
                <div>Social Influence: {Math.floor((stats.reputation || 0) / 2) + 1}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};