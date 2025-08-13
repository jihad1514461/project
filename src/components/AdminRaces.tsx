import React, { useState } from 'react';
import { Crown, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { PlayerStats, Element } from '../types/game';

interface AdminRacesProps {
  races: { [key: string]: any };
  onCreateRace: (raceId: string, raceData: any) => void;
  onUpdateRace: (raceId: string, raceData: any) => void;
  onDeleteRace: (raceId: string) => void;
}

export const AdminRaces: React.FC<AdminRacesProps> = ({ races, onCreateRace, onUpdateRace, onDeleteRace }) => {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeModalTab, setActiveModalTab] = useState<'basic' | 'stats' | 'elements'>('basic');
  const [modalNewRaceId, setModalNewRaceId] = useState('');
  const [modalRaceData, setModalRaceData] = useState<any>({
    name: '',
    description: '',
    innateAbility: '',
    bonuses: {
      strength: 0,
      intelligence: 0,
      magic: 0,
      vitality: 0,
      dexterity: 0,
      agility: 0,
      luck: 0,
      charm: 0,
      gold: 0,
      reputation: 0
    },
    elementalOffense: {},
    elementalDefense: {}
  });

  const handleEdit = (raceName: string) => {
    setModalMode('edit');
    setModalNewRaceId(raceName);
    setModalRaceData(races[raceName] || {
      name: raceName,
      description: '',
      innateAbility: '',
      bonuses: {
        strength: 0,
        intelligence: 0,
        magic: 0,
        vitality: 0,
        dexterity: 0,
        agility: 0,
        luck: 0,
        charm: 0,
        gold: 0,
        reputation: 0
      },
      elementalOffense: {},
      elementalDefense: {}
    });
    setActiveModalTab('basic');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!modalNewRaceId.trim()) return;
    
    const finalRaceData = {
      ...modalRaceData,
      name: modalNewRaceId
    };

    if (modalMode === 'edit') {
      // Find the original race name to handle ID changes
      const originalRaceName = Object.keys(races).find(name => 
        races[name] === modalRaceData || name === modalNewRaceId
      );
      
      if (originalRaceName && originalRaceName !== modalNewRaceId) {
        // ID changed - delete old and create new
        onDeleteRace(originalRaceName);
        onCreateRace(modalNewRaceId, finalRaceData);
      } else {
        // Same ID - update existing
        onUpdateRace(modalNewRaceId, finalRaceData);
      }
    } else {
      // Creating new race
      onCreateRace(modalNewRaceId, finalRaceData);
    }
    
    handleCloseModal();
  };

  const handleDelete = (raceName: string) => {
    if (confirm(`Are you sure you want to delete the ${raceName} race?`)) {
      onDeleteRace(raceName);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode('create');
    setActiveModalTab('basic');
    setModalNewRaceId('');
    setModalRaceData({
      name: '',
      description: '',
      innateAbility: '',
      bonuses: {
        strength: 0,
        intelligence: 0,
        magic: 0,
        vitality: 0,
        dexterity: 0,
        agility: 0,
        luck: 0,
        charm: 0,
        gold: 0,
        reputation: 0
      },
      elementalOffense: {},
      elementalDefense: {}
    });
  };

  const handleBonusChange = (stat: keyof PlayerStats, value: string) => {
    const numValue = parseInt(value) || 0;
    setModalRaceData(prev => ({ 
      ...prev, 
      bonuses: { ...prev.bonuses, [stat]: numValue }
    }));
  };

  const handleElementalChange = (type: 'offense' | 'defense', element: Element, value: string) => {
    const numValue = parseInt(value) || 0;
    const field = type === 'offense' ? 'elementalOffense' : 'elementalDefense';
    setModalRaceData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [element]: numValue === 0 ? undefined : numValue
      }
    }));
  };

  const startCreating = () => {
    setModalMode('create');
    setModalNewRaceId('');
    setModalRaceData({
      name: '',
      description: '',
      innateAbility: '',
      bonuses: {
        strength: 0,
        intelligence: 0,
        magic: 0,
        vitality: 0,
        dexterity: 0,
        agility: 0,
        luck: 0,
        charm: 0,
        gold: 0,
        reputation: 0
      },
      elementalOffense: {},
      elementalDefense: {}
    });
    setActiveModalTab('basic');
    setIsModalOpen(true);
  };

  const elementOptions: Array<{ id: Element; name: Element; color: string; icon: string }> = [
    { id: 'Light', name: 'Light', color: 'text-yellow-400', icon: '☀️' },
    { id: 'Fire', name: 'Fire', color: 'text-red-400', icon: '🔥' },
    { id: 'Water', name: 'Water', color: 'text-blue-400', icon: '💧' },
    { id: 'Earth', name: 'Earth', color: 'text-green-400', icon: '🌍' },
    { id: 'Air', name: 'Air', color: 'text-cyan-400', icon: '💨' },
    { id: 'Dark', name: 'Dark', color: 'text-purple-400', icon: '🌑' },
    { id: 'Neutral', name: 'Neutral', color: 'text-gray-400', icon: '⚪' },
    { id: 'Ice', name: 'Ice', color: 'text-blue-200', icon: '❄️' },
    { id: 'Lightning', name: 'Lightning', color: 'text-yellow-300', icon: '⚡' },
    { id: 'Nature', name: 'Nature', color: 'text-green-300', icon: '🌿' },
    { id: 'Shadow', name: 'Shadow', color: 'text-gray-600', icon: '👤' },
    { id: 'Arcane', name: 'Arcane', color: 'text-indigo-400', icon: '🔮' }
  ];

  const modalTabs = [
    { id: 'basic', name: 'Basic', icon: '📝' },
    { id: 'stats', name: 'Stats', icon: '📊' },
    { id: 'elements', name: 'Elements', icon: '🔥' }
  ];

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

      {/* Races List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(races).map(([raceName, raceData]) => {
          const stats = raceData.bonuses || raceData; // Handle both old and new format
          return (
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
              
              {raceData.description && (
                <p className="text-gray-300 text-sm mb-3">{raceData.description}</p>
              )}
              
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
                  <span className="text-orange-400 flex items-center">
                    <span className="mr-1">🎯</span>
                    Dexterity:
                  </span>
                  <span className="text-white font-medium">{stats.dexterity || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400 flex items-center">
                    <span className="mr-1">💨</span>
                    Agility:
                  </span>
                  <span className="text-white font-medium">{stats.agility || 0}</span>
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

              {/* Innate Ability */}
              {raceData.innateAbility && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <div className="text-xs text-gray-400">
                    <strong>Innate Ability:</strong> {raceData.innateAbility}
                  </div>
                </div>
              )}

              {/* Elemental Masteries */}
              {((raceData.elementalOffense && Object.keys(raceData.elementalOffense).length > 0) ||
                (raceData.elementalDefense && Object.keys(raceData.elementalDefense).length > 0)) && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <div className="text-xs text-gray-400 space-y-1">
                    {raceData.elementalOffense && Object.keys(raceData.elementalOffense).length > 0 && (
                      <div>
                        <strong>Elemental Offense:</strong> {Object.entries(raceData.elementalOffense).map(([elem, val]) => `${elem}: ${val}`).join(', ')}
                      </div>
                    )}
                    {raceData.elementalDefense && Object.keys(raceData.elementalDefense).length > 0 && (
                      <div>
                        <strong>Elemental Defense:</strong> {Object.entries(raceData.elementalDefense).map(([elem, val]) => `${elem}: ${val}`).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Derived Stats Preview */}
              <div className="mt-3 pt-3 border-t border-slate-600">
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Max Health: {(stats.vitality || 0) * 2}</div>
                  <div>Max Mana: {(stats.magic || 0) * 3}</div>
                  <div>Physical Damage: {Math.floor((stats.strength || 0) / 2) + 1}</div>
                  <div>Crit Chance: {5 + Math.max(0, (stats.dexterity || 0) - 10)}%</div>
                  <div>Escape Chance: {25 + Math.max(0, (stats.agility || 0) - 10)}%</div>
                  <div>Social Influence: {Math.floor((stats.reputation || 0) / 2) + 1}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Crown className="w-6 h-6 text-purple-400 mr-3" />
                {modalMode === 'create' ? 'Create New Race' : `Edit ${modalNewRaceId}`}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Tab Navigation */}
            <div className="flex border-b border-slate-700">
              {modalTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as typeof activeModalTab)}
                  className={`flex-1 px-6 py-4 text-center transition-all duration-300 ${
                    activeModalTab === tab.id
                      ? 'bg-slate-700/50 border-b-2 border-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Basic Tab */}
              {activeModalTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Race ID
                      </label>
                      <input
                        type="text"
                        value={modalNewRaceId}
                        onChange={(e) => setModalNewRaceId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="unique_race_id"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Race Name
                      </label>
                      <input
                        type="text"
                        value={modalRaceData.name}
                        onChange={(e) => setModalRaceData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter race name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={modalRaceData.description || ''}
                      onChange={(e) => setModalRaceData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full h-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Enter race description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Innate Ability
                    </label>
                    <input
                      type="text"
                      value={modalRaceData.innateAbility || ''}
                      onChange={(e) => setModalRaceData(prev => ({ ...prev, innateAbility: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter innate racial ability"
                    />
                  </div>
                </div>
              )}

              {/* Stats Tab */}
              {activeModalTab === 'stats' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-300 mb-4">Stat Bonuses</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(['strength', 'intelligence', 'magic', 'vitality', 'dexterity', 'agility', 'luck', 'charm', 'gold', 'reputation'] as const).map((stat) => (
                      <div key={stat}>
                        <label className="block text-sm font-medium text-gray-300 mb-2 capitalize flex items-center">
                          <span className="mr-2">
                            {stat === 'strength' && '⚔️'}
                            {stat === 'intelligence' && '🧠'}
                            {stat === 'magic' && '✨'}
                            {stat === 'vitality' && '❤️'}
                            {stat === 'dexterity' && '🎯'}
                            {stat === 'agility' && '💨'}
                            {stat === 'luck' && '🍀'}
                            {stat === 'charm' && '💫'}
                            {stat === 'gold' && '💰'}
                            {stat === 'reputation' && '👑'}
                          </span>
                          {stat}
                        </label>
                        <input
                          type="number"
                          value={modalRaceData.bonuses?.[stat] || 0}
                          onChange={(e) => handleBonusChange(stat, e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Derived Stats Preview */}
                  <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <h5 className="text-sm font-semibold text-gray-300 mb-3">Derived Stats Preview</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div className="text-red-300">
                        Max Health: {(modalRaceData.bonuses?.vitality || 0) * 2}
                      </div>
                      <div className="text-blue-300">
                        Max Mana: {(modalRaceData.bonuses?.magic || 0) * 3}
                      </div>
                      <div className="text-orange-300">
                        Physical Damage: {Math.floor((modalRaceData.bonuses?.strength || 0) / 2) + 1}
                      </div>
                      <div className="text-yellow-300">
                        Crit Chance: {5 + Math.max(0, (modalRaceData.bonuses?.dexterity || 0) - 10)}%
                      </div>
                      <div className="text-cyan-300">
                        Escape Chance: {25 + Math.max(0, (modalRaceData.bonuses?.agility || 0) - 10)}%
                      </div>
                      <div className="text-pink-300">
                        Social Influence: {Math.floor(((modalRaceData.bonuses?.charm || 0) + (modalRaceData.bonuses?.reputation || 0)) / 2) + 1}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Elements Tab */}
              {activeModalTab === 'elements' && (
                <div className="space-y-6">
                  {/* Elemental Offense */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-4">Elemental Offense Mastery</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {elementOptions.map((element) => (
                        <div key={element.id}>
                          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <span className="mr-2">{element.icon}</span>
                            <span className={element.color}>{element.name}</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={modalRaceData.elementalOffense?.[element.id] || 0}
                            onChange={(e) => handleElementalChange('offense', element.id, e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Elemental Defense */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-4">Elemental Defense Mastery</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {elementOptions.map((element) => (
                        <div key={element.id}>
                          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <span className="mr-2">{element.icon}</span>
                            <span className={element.color}>{element.name}</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={modalRaceData.elementalDefense?.[element.id] || 0}
                            onChange={(e) => handleElementalChange('defense', element.id, e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Elemental Requirements Section */}
                  <div className="mt-8 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <h5 className="text-sm font-semibold text-gray-300 mb-3">Elemental Requirements</h5>
                    <p className="text-xs text-gray-400 mb-4">
                      Future feature: Define elemental requirements for this race (e.g., minimum elemental mastery needed to play this race)
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {elementOptions.map((element) => (
                        <div key={element.id} className="text-center p-2 bg-slate-800/50 rounded border border-slate-600">
                          <div className="flex items-center justify-center mb-1">
                            <span className="mr-1">{element.icon}</span>
                            <span className={`text-xs ${element.color}`}>{element.name}</span>
                          </div>
                          <div className="text-xs text-gray-500">Coming Soon</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-700">
              <div className="text-sm text-gray-400">
                Tab {modalTabs.findIndex(t => t.id === activeModalTab) + 1} of {modalTabs.length}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={!modalNewRaceId.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Race</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};