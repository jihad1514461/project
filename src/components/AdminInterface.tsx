import React, { useState } from 'react';
import { Settings, ArrowLeft, Sword, Crown, BookOpen, Package, Download, Upload, Save, ShoppingCart, Zap, Star, Skull, Search } from 'lucide-react';
import { GameData } from '../types/game';
import { gameDataManager } from '../utils/gameDataManager';
import { AdminClasses } from './AdminClasses';
import { AdminRaces } from './AdminRaces';
import { AdminItems } from './AdminItems';
import { AdminShops } from './AdminShops';
import { AdminSpells } from './AdminSpells';
import { AdminSkills } from './AdminSkills';
import { AdminMonsters } from './AdminMonsters';
import { AdminVillains } from './AdminVillains';
import { AdminStories } from './AdminStories';

interface AdminInterfaceProps {
  gameData: GameData;
  onUpdateGameData: (newData: GameData) => void;
  onBack: () => void;
}

type AdminTab = 'classes' | 'races' | 'items' | 'shops' | 'spells' | 'skills' | 'monsters' | 'villains' | 'stories';

export const AdminInterface: React.FC<AdminInterfaceProps> = ({ gameData, onUpdateGameData, onBack }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('classes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedContent, setExportedContent] = useState('');

  const handleUpdateClasses = (classes: { [key: string]: any }) => {
    const newData = { ...gameData, classes };
    onUpdateGameData(newData);
  };

  const handleUpdateClassRequirements = (classRequirements: { [key: string]: any }) => {
    const newData = { ...gameData, classRequirements };
    onUpdateGameData(newData);
  };

  const handleUpdateRaces = (races: { [key: string]: any }) => {
    const newData = { ...gameData, races };
    onUpdateGameData(newData);
  };

  const handleUpdateItems = (items: { [key: string]: any }) => {
    const newData = { ...gameData, items };
    onUpdateGameData(newData);
  };

  const handleUpdateStories = (stories: { [storyName: string]: any }) => {
    const newData = { ...gameData, stories };
    onUpdateGameData(newData);
  };

  const handleUpdateShops = (shops: { [key: string]: any }) => {
    const newData = { ...gameData, shops };
    onUpdateGameData(newData);
  };

  const handleUpdateSpells = (spells: { [key: string]: any }) => {
    const newData = { ...gameData, spells };
    onUpdateGameData(newData);
  };

  const handleUpdateSkills = (skills: { [key: string]: any }) => {
    const newData = { ...gameData, skills };
    onUpdateGameData(newData);
  };

  const handleUpdateMonsters = (monsters: { [key: string]: any }) => {
    const newData = { ...gameData, monsters };
    onUpdateGameData(newData);
  };

  const handleUpdateVillains = (villains: { [key: string]: any }) => {
    const newData = { ...gameData, villains };
    onUpdateGameData(newData);
  };

  const handleExportGameData = () => {
    const content = gameDataManager.exportGameData();
    setExportedContent(content);
    setShowExportModal(true);
  };

  const handleDownloadGameData = () => {
    const content = gameDataManager.exportGameData();
    const blob = new Blob([content], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gameData.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportedContent);
    alert('Game data copied to clipboard! You can now paste it into your gameData.ts file.');
  };

  const tabs = [
    { id: 'classes' as AdminTab, label: 'Classes', icon: Sword, color: 'text-red-400' },
    { id: 'races' as AdminTab, label: 'Races', icon: Crown, color: 'text-purple-400' },
    { id: 'items' as AdminTab, label: 'Items', icon: Package, color: 'text-blue-400' },
    { id: 'shops' as AdminTab, label: 'Shops', icon: ShoppingCart, color: 'text-green-400' },
    { id: 'spells' as AdminTab, label: 'Spells', icon: Zap, color: 'text-purple-400' },
    { id: 'skills' as AdminTab, label: 'Skills', icon: Star, color: 'text-orange-400' },
    { id: 'monsters' as AdminTab, label: 'Monsters', icon: Skull, color: 'text-red-400' },
    { id: 'villains' as AdminTab, label: 'Villains', icon: Crown, color: 'text-purple-400' },
    { id: 'stories' as AdminTab, label: 'Stories', icon: BookOpen, color: 'text-green-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Main Menu</span>
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          <div className="text-center p-8 border-b border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div></div>
              <div className="flex space-x-2">
                <button
                  onClick={handleExportGameData}
                  className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Export Data</span>
                </button>
                <button
                  onClick={handleDownloadGameData}
                  className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <Settings className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Game Master Control Panel</h2>
            <p className="text-gray-400">Manage all aspects of your RPG world</p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-slate-700">
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-600">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`Search ${activeTab}...`}
                />
              </div>
            </div>
            
            {/* Tab Buttons */}
            <div className="flex flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 px-3 py-4 text-center transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-slate-700/50 border-b-2 border-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ''}`} />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </div>
                </button>
              );
            })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'classes' && (
              <AdminClasses
                classes={gameData.classes}
                classRequirements={gameData.classRequirements}
                items={gameData.items}
                onUpdateClasses={handleUpdateClasses}
                onUpdateClassRequirements={handleUpdateClassRequirements}
              />
            )}
            {activeTab === 'races' && (
              <AdminRaces
                races={gameData.races}
                onUpdateRaces={handleUpdateRaces}
              />
            )}
            {activeTab === 'items' && (
              <AdminItems
                items={gameData.items}
                onUpdateItems={handleUpdateItems}
              />
            )}
            {activeTab === 'shops' && (
              <AdminShops
                shops={gameData.shops}
                items={gameData.items}
                onUpdateShops={handleUpdateShops}
              />
            )}
            {activeTab === 'spells' && (
              <AdminSpells
                spells={gameData.spells}
                classes={gameData.classes}
                onUpdateSpells={handleUpdateSpells}
              />
            )}
            {activeTab === 'skills' && (
              <AdminSkills
                skills={gameData.skills}
                classes={gameData.classes}
                onUpdateSkills={handleUpdateSkills}
              />
            )}
            {activeTab === 'monsters' && (
              <AdminMonsters
                monsters={gameData.monsters}
                items={gameData.items}
                spells={gameData.spells}
                classes={gameData.classes}
                onUpdateMonsters={handleUpdateMonsters}
              />
            )}
            {activeTab === 'villains' && (
              <AdminVillains
                villains={gameData.villains}
                items={gameData.items}
                spells={gameData.spells}
                classes={gameData.classes}
                onUpdateVillains={handleUpdateVillains}
              />
            )}
            {activeTab === 'stories' && (
              <AdminStories
                stories={gameData.stories}
                items={gameData.items}
                monsters={gameData.monsters}
                villains={gameData.villains}
                shops={gameData.shops}
                onUpdateStories={handleUpdateStories}
              />
            )}
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Export Game Data</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-2">
                  Copy this content and paste it into your <code className="bg-slate-700 px-1 rounded">src/data/gameData.ts</code> file:
                </p>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
                <pre className="text-green-400 text-xs whitespace-pre-wrap font-mono">
                  {exportedContent}
                </pre>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={handleDownloadGameData}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Download File
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};