import React, { useState, useMemo } from 'react';
import { BookOpen, Plus, Edit, Trash2, Save, X, Eye, EyeOff, AlertTriangle, Search, Download } from 'lucide-react';
import { Story, StoryNode, Choice, PlayerStats } from '../types/game';
import { gameDataManager } from '../utils/gameDataManager';
import { SearchableSelect } from './SearchableSelect';

interface AdminStoriesProps {
  stories: { [storyName: string]: Story };
  items: { [key: string]: any };
  monsters: { [key: string]: any };
  villains: { [key: string]: any };
  shops: { [key: string]: any };
  onCreateStory: (storyData: any) => void;
  onUpdateStory: (storyId: string, storyData: any) => void;
  onDeleteStory: (storyId: string) => void;
}

export const AdminStories: React.FC<AdminStoriesProps> = ({ stories, items, monsters, villains, shops, onCreateStory, onUpdateStory, onDeleteStory }) => {
  const [selectedStory, setSelectedStory] = useState<string>('');
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [newStoryName, setNewStoryName] = useState('');
  const [showStoryTree, setShowStoryTree] = useState(false);
  const [nextNodeSearch, setNextNodeSearch] = useState('');
  const [nodeData, setNodeData] = useState<StoryNode>({
    id: '',
    title: '',
    text: '',
    type: 'story',
    tags: [],
    battle: false,
    choices: [],
    is_ending: false,
    monster: '',
    shop: {
      shopId: '',
      categories: []
    }
  });
  const [showNodeDetails, setShowNodeDetails] = useState<{ [key: string]: boolean }>({});

  const handleCreateStory = () => {
    if (!newStoryName.trim()) return;
    
    const newStoryData = {
      id: newStoryName,
      name: newStoryName,
      nodes: {
        intro: {
          id: 'intro',
          title: 'Beginning',
          text: `Welcome to ${newStoryName}. Your adventure begins here.`,
          type: 'story',
          tags: [],
          battle: false,
          choices: [],
          is_ending: false,
          monster: '',
          shop: { shopId: '', categories: [] }
        }
      }
    };
    
    onCreateStory(newStoryData);
    setSelectedStory(newStoryName);
    setIsCreatingStory(false);
    setNewStoryName('');
  };

  const handleDeleteStory = (storyName: string) => {
    if (confirm(`Are you sure you want to delete "${storyName}"?`)) {
      onDeleteStory(storyName);
      if (selectedStory === storyName) {
        setSelectedStory('');
      }
    }
  };

  const handleSaveNode = () => {
    if (!selectedStory || !editingNode) return;
    
    // Auto-create win/lose choices for combat nodes
    if ((nodeData.type === 'combat' || nodeData.battle) && nodeData.choices.length === 0) {
      nodeData.choices = [
        {
          text: "Victory! Continue your journey.",
          next_node: "",
          effects: { xp: 50, reputation: 1 },
          require: { battleResult: 'win' }
        },
        {
          text: "Defeat... retreat and regroup.",
          next_node: "",
          effects: { hearts: -1 },
          require: { battleResult: 'lose' }
        },
        {
          text: "Escape from the battle.",
          next_node: "",
          effects: { reputation: -1 },
          require: { battleResult: 'escape' }
        }
      ];
    }
    
    const updatedStoryData = {
      id: selectedStory,
      name: selectedStory,
      nodes: { ...stories[selectedStory] }
    };
    
    const nodeKey = isCreatingNode ? editingNode : editingNode;
    updatedStoryData.nodes[nodeKey] = nodeData;
    
    onUpdateStory(selectedStory, updatedStoryData);
    
    setEditingNode(null);
    setIsCreatingNode(false);
    setNodeData({
      text: '',
      battle: false,
      choices: [],
      is_ending: false
    });
  };

  const handleDeleteNode = (nodeKey: string) => {
    if (!selectedStory) return;
    if (confirm(`Are you sure you want to delete node "${nodeKey}"?`)) {
      const updatedStoryData = {
        id: selectedStory,
        name: selectedStory,
        nodes: { ...stories[selectedStory] }
      };
      delete updatedStoryData.nodes[nodeKey];
      
      onUpdateStory(selectedStory, updatedStoryData);
    }
  };

  const handleEditNode = (nodeKey: string) => {
    if (!selectedStory) return;
    setEditingNode(nodeKey);
    setNodeData({ ...stories[selectedStory][nodeKey] });
  };

  const handleCreateNode = () => {
    setIsCreatingNode(true);
    setEditingNode('new_node');
    setNodeData({
      id: '',
      title: '',
      text: '',
      type: 'story',
      tags: [],
      battle: false,
      choices: [],
      is_ending: false,
      monster: '',
      shop: {
        shopId: '',
        categories: []
      }
    });
  };

  const addChoice = () => {
    setNodeData(prev => ({
      ...prev,
      choices: [
        ...prev.choices,
        {
          text: '',
          next_node: '',
          effects: {},
          require: {}
        }
      ]
    }));
  };

  const updateChoice = (index: number, field: keyof Choice, value: any) => {
    setNodeData(prev => ({
      ...prev,
      choices: prev.choices.map((choice, i) => 
        i === index ? { ...choice, [field]: value } : choice
      )
    }));
  };

  const removeChoice = (index: number) => {
    setNodeData(prev => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index)
    }));
  };

  const updateChoiceEffect = (choiceIndex: number, stat: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setNodeData(prev => ({
      ...prev,
      choices: prev.choices.map((choice, i) => 
        i === choiceIndex ? {
          ...choice,
          effects: {
            ...choice.effects,
            [stat]: numValue === 0 ? undefined : numValue
          }
        } : choice
      )
    }));
  };

  const updateChoiceRequirement = (choiceIndex: number, stat: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setNodeData(prev => ({
      ...prev,
      choices: prev.choices.map((choice, i) => 
        i === choiceIndex ? {
          ...choice,
          require: {
            ...choice.require,
            [stat]: numValue === 0 ? undefined : numValue
          }
        } : choice
      )
    }));
  };

  const updateChoiceRewards = (choiceIndex: number, rewards: string) => {
    const rewardArray = rewards.split(',').map(r => r.trim()).filter(r => r);
    setNodeData(prev => ({
      ...prev,
      choices: prev.choices.map((choice, i) => 
        i === choiceIndex ? {
          ...choice,
          itemRewards: rewardArray.length > 0 ? rewardArray : undefined
        } : choice
      )
    }));
  };

  const updateChoiceRequiredItems = (choiceIndex: number, items: string) => {
    const itemArray = items.split(',').map(i => i.trim()).filter(i => i);
    setNodeData(prev => ({
      ...prev,
      choices: prev.choices.map((choice, i) => 
        i === choiceIndex ? {
          ...choice,
          itemRequirements: itemArray.length > 0 ? itemArray : undefined
        } : choice
      )
    }));
  };

  const monsterOptions = Object.values(monsters).map(monster => ({
    id: monster.id,
    name: monster.name
  }));

  const villainOptions = Object.values(villains).map(villain => ({
    id: villain.id,
    name: villain.name
  }));

  const shopOptions = Object.values(shops).map(shop => ({
    id: shop.id,
    name: shop.name
  }));

  const allEnemyOptions = [
    ...monsterOptions,
    ...villainOptions
  ];

  const getAvailableNodes = () => {
    if (!selectedStory) return [];
    return Object.keys(stories[selectedStory]);
  };

  const getFilteredNodes = () => {
    const nodes = getAvailableNodes();
    if (!nextNodeSearch) return nodes;
    return nodes.filter(node => 
      node.toLowerCase().includes(nextNodeSearch.toLowerCase())
    );
  };

  const getNodeIssues = () => {
    if (!selectedStory) return { orphanNodes: [], choicesWithoutNextNode: [], nodesWithoutChoices: [] };
    
    const story = stories[selectedStory];
    const referencedNodes = new Set<string>();
    const choicesWithoutNextNode: Array<{nodeKey: string, choiceIndex: number}> = [];
    const nodesWithoutChoices: string[] = [];
    
    Object.entries(story).forEach(([nodeKey, node]) => {
      // Check for nodes without choices (and not ending nodes)
      if (!node.is_ending && node.choices.length === 0) {
        nodesWithoutChoices.push(nodeKey);
      }
      
      node.choices.forEach((choice, index) => {
        if (choice.next_node) {
          referencedNodes.add(choice.next_node);
        } else {
          choicesWithoutNextNode.push({ nodeKey, choiceIndex: index });
        }
      });
    });
    
    const orphanNodes = Object.keys(story).filter(nodeKey => 
      nodeKey !== 'intro' && 
      !referencedNodes.has(nodeKey) && 
      !story[nodeKey].is_ending
    );
    
    return { orphanNodes, choicesWithoutNextNode, nodesWithoutChoices };
  };

  const getOrganizedNodes = () => {
    if (!selectedStory) return { intro: [], nodes: [], battles: [], ends: [] };
    
    const story = stories[selectedStory];
    const organized = {
      intro: [] as string[],
      nodes: [] as string[],
      battles: [] as string[],
      ends: [] as string[]
    };
    
    Object.keys(story).forEach(nodeKey => {
      const node = story[nodeKey];
      if (nodeKey === 'intro') {
        organized.intro.push(nodeKey);
      } else if (node.is_ending) {
        organized.ends.push(nodeKey);
      } else if (node.battle) {
        organized.battles.push(nodeKey);
      } else {
        organized.nodes.push(nodeKey);
      }
    });
    
    // Sort alphabetically
    organized.nodes.sort();
    organized.battles.sort();
    organized.ends.sort();
    
    return organized;
  };

  const renderStoryTree = () => {
    if (!selectedStory) return null;
    const story = stories[selectedStory];
    const { orphanNodes, choicesWithoutNextNode, nodesWithoutChoices } = getNodeIssues();
    const organized = getOrganizedNodes();
    
    return (
      <div className="bg-slate-700/50 rounded-xl p-4 md:p-6 border border-slate-600">
        <h4 className="text-lg font-semibold text-white mb-4">Story Flow Analysis</h4>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Issues Summary */}
          {(orphanNodes.length > 0 || choicesWithoutNextNode.length > 0 || nodesWithoutChoices.length > 0) && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <h5 className="text-red-400 font-semibold mb-2">Issues Found:</h5>
              <div className="text-sm space-y-1">
                {orphanNodes.length > 0 && (
                  <div className="text-red-300">• {orphanNodes.length} orphaned nodes</div>
                )}
                {choicesWithoutNextNode.length > 0 && (
                  <div className="text-red-300">• {choicesWithoutNextNode.length} choices without next node</div>
                )}
                {nodesWithoutChoices.length > 0 && (
                  <div className="text-red-300">• {nodesWithoutChoices.length} non-ending nodes without choices</div>
                )}
              </div>
            </div>
          )}

          {/* Organized Nodes */}
          {Object.entries(organized).map(([category, nodeKeys]) => {
            if (nodeKeys.length === 0) return null;
            
            return (
              <div key={category}>
                <h5 className="text-gray-300 font-semibold mb-2 capitalize">{category}</h5>
                <div className="space-y-2">
                  {nodeKeys.map(nodeKey => {
                    const node = story[nodeKey];
                    const isOrphan = orphanNodes.includes(nodeKey);
                    const hasNoChoices = nodesWithoutChoices.includes(nodeKey);
                    const hasChoicesWithoutNext = choicesWithoutNextNode.some(c => c.nodeKey === nodeKey);
                    
                    return (
                      <div key={nodeKey} className={`p-3 rounded-lg border text-sm ${
                        isOrphan || hasNoChoices || hasChoicesWithoutNext
                          ? 'border-red-500 bg-red-500/20' 
                          : 'border-slate-600 bg-slate-800/50'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{nodeKey}</span>
                          <div className="flex space-x-1">
                            {node.battle && <span className="text-red-400 text-xs">⚔</span>}
                            {node.is_ending && <span className="text-yellow-400 text-xs">🏁</span>}
                            {(isOrphan || hasNoChoices || hasChoicesWithoutNext) && 
                              <AlertTriangle className="w-4 h-4 text-red-400" />}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {node.choices.length > 0 ? (
                            <>Leads to: {node.choices.map(c => c.next_node || '[NO NEXT NODE]').join(', ')}</>
                          ) : (
                            <span className="text-red-400">No choices available</span>
                          )}
                        </div>
                        {(isOrphan || hasNoChoices || hasChoicesWithoutNext) && (
                          <div className="text-xs text-red-400 mt-1">
                            {isOrphan && '• Orphaned node'}
                            {hasNoChoices && '• No choices'}
                            {hasChoicesWithoutNext && '• Has choices without next node'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const toggleNodeDetails = (nodeKey: string) => {
    setShowNodeDetails(prev => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  const { orphanNodes, choicesWithoutNextNode, nodesWithoutChoices } = getNodeIssues();
  const organized = getOrganizedNodes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 md:p-4">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div></div>
          <h3 className="text-xl md:text-2xl font-bold text-white flex items-center">
            <BookOpen className="w-6 md:w-8 h-6 md:h-8 text-green-400 mr-3" />
            Story Management
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsCreatingStory(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Story</span>
            </button>
          </div>
        </div>

        {/* Create Story Modal */}
        {isCreatingStory && (
          <div className="bg-slate-700/50 rounded-xl p-4 md:p-6 border border-slate-600">
            <h4 className="text-lg font-semibold text-white mb-4">Create New Story</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newStoryName}
                onChange={(e) => setNewStoryName(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter story name"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateStory}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                  Create
                </button>
                <button
                  onClick={() => setIsCreatingStory(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Story Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(stories).map((storyName) => (
            <div
              key={storyName}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                selectedStory === storyName
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              }`}
              onClick={() => setSelectedStory(storyName)}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold truncate">{storyName}</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStory(storyName);
                  }}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors duration-200 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {Object.keys(stories[storyName]).length} nodes
              </p>
            </div>
          ))}
        </div>

        {/* Node Management */}
        {selectedStory && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h4 className="text-lg md:text-xl font-semibold text-white">
                Nodes in "{selectedStory}"
              </h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowStoryTree(!showStoryTree)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">{showStoryTree ? 'Hide' : 'Show'} Analysis</span>
                  <span className="sm:hidden">Analysis</span>
                </button>
                <button
                  onClick={handleCreateNode}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Node</span>
                </button>
              </div>
            </div>

            {/* Story Tree */}
            {showStoryTree && renderStoryTree()}

            {/* Organized Node List */}
            <div className="space-y-6">
              {Object.entries(organized).map(([category, nodeKeys]) => {
                if (nodeKeys.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h5 className="text-lg font-semibold text-white mb-3 capitalize flex items-center">
                      {category === 'intro' && '🏠'}
                      {category === 'nodes' && '📄'}
                      {category === 'battles' && '⚔️'}
                      {category === 'ends' && '🏁'}
                      <span className="ml-2">{category} ({nodeKeys.length})</span>
                    </h5>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {nodeKeys.map(nodeKey => {
                        const node = stories[selectedStory][nodeKey];
                        const isOrphan = orphanNodes.includes(nodeKey);
                        const hasNoChoices = nodesWithoutChoices.includes(nodeKey);
                        const hasChoicesWithoutNext = choicesWithoutNextNode.some(c => c.nodeKey === nodeKey);
                        const hasIssues = isOrphan || hasNoChoices || hasChoicesWithoutNext;
                        
                        return (
                          <div key={nodeKey} className={`rounded-xl p-4 border ${
                            hasIssues 
                              ? 'bg-red-500/10 border-red-500/50' 
                              : 'bg-slate-800/50 border-slate-700'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3 min-w-0">
                                <h5 className="text-white font-medium truncate">{nodeKey}</h5>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  {node.battle && <span className="text-red-400 text-sm">⚔</span>}
                                  {node.is_ending && <span className="text-yellow-400 text-sm">🏁</span>}
                                  {hasIssues && (
                                    <div className="flex items-center space-x-1 text-red-400 text-sm">
                                      <AlertTriangle className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2 flex-shrink-0">
                                <button
                                  onClick={() => toggleNodeDetails(nodeKey)}
                                  className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                  {showNodeDetails[nodeKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => handleEditNode(nodeKey)}
                                  className="p-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteNode(nodeKey)}
                                  className="p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {hasIssues && (
                              <div className="mb-2 text-xs text-red-400 space-y-1">
                                {isOrphan && <div>• Orphaned node (not referenced by any choice)</div>}
                                {hasNoChoices && <div>• No choices available (non-ending node)</div>}
                                {hasChoicesWithoutNext && <div>• Has choices without next node</div>}
                              </div>
                            )}

                            {showNodeDetails[nodeKey] && (
                              <div className="mt-3 space-y-2 text-sm">
                                <p className="text-gray-300">{node.text.substring(0, 150)}...</p>
                                <p className="text-gray-400">
                                  {node.choices.length} choice{node.choices.length !== 1 ? 's' : ''} available
                                </p>
                                {node.choices.length > 0 && (
                                  <div className="text-xs text-gray-500">
                                    Leads to: {node.choices.map(c => c.next_node || '[NO NEXT NODE]').join(', ')}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Node Editor */}
        {editingNode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-slate-800 rounded-xl p-4 md:p-6 max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              <h4 className="text-lg md:text-xl font-semibold text-white mb-4">
                {isCreatingNode ? 'Create New Node' : `Edit Node: ${editingNode}`}
              </h4>

              <div className="space-y-4">
                {/* Node Key */}
                {isCreatingNode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Node Key
                    </label>
                    <input
                      type="text"
                      value={editingNode === 'new_node' ? '' : editingNode}
                      onChange={(e) => setEditingNode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter unique node key"
                    />
                  </div>
                )}

                {/* Node Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Node Title
                  </label>
                  <input
                    type="text"
                    value={nodeData.title || ''}
                    onChange={(e) => setNodeData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter node title"
                  />
                </div>

                {/* Node Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Node Type
                  </label>
                  <select
                    value={nodeData.type || 'story'}
                    onChange={(e) => setNodeData(prev => ({ ...prev, type: e.target.value as StoryNode['type'] }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="story">Story</option>
                    <option value="combat">Combat</option>
                    <option value="shop">Shop</option>
                    <option value="choice">Choice</option>
                    <option value="ending">Ending</option>
                  </select>
                </div>

                {/* Node Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Story Text
                  </label>
                  <textarea
                    value={nodeData.text}
                    onChange={(e) => setNodeData(prev => ({ ...prev, text: e.target.value }))}
                    className="w-full h-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Enter the story text for this node..."
                  />
                </div>

                {/* Node Options */}
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={nodeData.type === 'combat' || nodeData.battle}
                      onChange={(e) => setNodeData(prev => ({ 
                        ...prev, 
                        battle: e.target.checked,
                        type: e.target.checked ? 'combat' : 'story'
                      }))}
                      className="rounded"
                    />
                    <span className="text-gray-300">Battle Node</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={nodeData.type === 'ending' || nodeData.is_ending}
                      onChange={(e) => setNodeData(prev => ({ 
                        ...prev, 
                        is_ending: e.target.checked,
                        type: e.target.checked ? 'ending' : 'story'
                      }))}
                      className="rounded"
                    />
                    <span className="text-gray-300">Ending Node</span>
                  </label>
                </div>

                {/* Monster/Villain Selection for Combat Nodes */}
                {(nodeData.type === 'combat' || nodeData.battle) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Monster/Villain
                    </label>
                    <SearchableSelect
                      options={allEnemyOptions}
                      value={nodeData.monster || ''}
                      onChange={(value) => setNodeData(prev => ({ ...prev, monster: value }))}
                      placeholder="Select monster or villain"
                    />
                    <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-blue-400 text-sm font-medium mb-2">Combat Node Configuration:</p>
                      <p className="text-gray-300 text-xs">
                        Add two choices below: one for winning the battle and one for losing. 
                        The game will automatically show the appropriate choice based on combat results.
                      </p>
                    </div>
                  </div>
                )}

                {/* Shop Selection for Shop Nodes */}
                {nodeData.type === 'shop' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Shop
                    </label>
                    <SearchableSelect
                      options={shopOptions}
                      value={nodeData.shop?.shopId || ''}
                      onChange={(value) => setNodeData(prev => ({ 
                        ...prev, 
                        shop: { ...prev.shop, shopId: value, categories: [] }
                      }))}
                      placeholder="Select shop"
                    />
                    {nodeData.shop?.shopId && shops[nodeData.shop.shopId] && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Shop Categories
                        </label>
                        <SearchableSelect
                          options={shops[nodeData.shop.shopId].categories.map((cat: string) => ({ id: cat, name: cat }))}
                          value=""
                          onChange={() => {}}
                          multiple={true}
                          values={nodeData.shop?.categories || []}
                          onMultiChange={(values) => setNodeData(prev => ({ 
                            ...prev, 
                            shop: { ...prev.shop, categories: values }
                          }))}
                          placeholder="Select categories to show"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Dice Requirement */}
                {(nodeData.type === 'combat' || nodeData.battle) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Dice Requirement (optional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={nodeData.dice_requirement || ''}
                      onChange={(e) => setNodeData(prev => ({ 
                        ...prev, 
                        dice_requirement: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      className="w-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Choices */}
                <div>
                  {!(nodeData.type === 'combat' || nodeData.battle) && (
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-300">Choices</label>
                      <button
                        onClick={addChoice}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
                      >
                        Add Choice
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {nodeData.choices.map((choice, index) => (
                      <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-medium">
                            {(nodeData.type === 'combat' || nodeData.battle) ? 
                              (index === 0 ? 'Victory Choice' : index === 1 ? 'Defeat Choice' : 'Escape Choice') :
                              `Choice ${index + 1}`
                            }
                          </span>
                          {!(nodeData.type === 'combat' || nodeData.battle) && (
                            <button
                              onClick={() => removeChoice(index)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Choice Text</label>
                            <input
                              type="text"
                              value={choice.text}
                              onChange={(e) => updateChoice(index, 'text', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Enter choice text"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Next Node</label>
                            <div className="relative">
                              <div className="flex">
                                <input
                                  type="text"
                                  value={nextNodeSearch}
                                  onChange={(e) => setNextNodeSearch(e.target.value)}
                                  className="flex-1 px-2 py-1 bg-slate-800 border border-slate-600 rounded-l text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="Search nodes..."
                                />
                                <div className="px-2 py-1 bg-slate-800 border-t border-r border-b border-slate-600 rounded-r flex items-center">
                                  <Search className="w-3 h-3 text-gray-400" />
                                </div>
                              </div>
                              {nextNodeSearch && (
                                <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-b max-h-32 overflow-y-auto z-10">
                                  {getFilteredNodes().map(nodeKey => (
                                    <button
                                      key={nodeKey}
                                      onClick={() => {
                                        updateChoice(index, 'next_node', nodeKey);
                                        setNextNodeSearch('');
                                      }}
                                      className="w-full text-left px-2 py-1 text-white text-sm hover:bg-slate-700 transition-colors duration-200"
                                    >
                                      {nodeKey}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <select
                              value={choice.next_node}
                              onChange={(e) => updateChoice(index, 'next_node', e.target.value)}
                              className="w-full mt-1 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Select next node</option>
                              {getAvailableNodes().map(nodeKey => (
                                <option key={nodeKey} value={nodeKey}>{nodeKey}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Dice Req.</label>
                            <input
                              type="number"
                              min="1"
                              max="6"
                              value={choice.dice_requirement || ''}
                              onChange={(e) => updateChoice(index, 'dice_requirement', e.target.value ? parseInt(e.target.value) : undefined)}
                              className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Luck Req.</label>
                            <input
                              type="number"
                              min="1"
                              value={choice.luck_requirement || ''}
                              onChange={(e) => updateChoice(index, 'luck_requirement', e.target.value ? parseInt(e.target.value) : undefined)}
                              className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Hidden Unless Luck</label>
                            <input
                              type="number"
                              min="1"
                              value={choice.hidden_unless_luck || ''}
                              onChange={(e) => updateChoice(index, 'hidden_unless_luck', e.target.value ? parseInt(e.target.value) : undefined)}
                              className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Effects - Only show for non-combat nodes or allow editing for combat nodes */}
                        {!(nodeData.type === 'combat' || nodeData.battle) && (
                          <div className="mb-3">
                            <label className="block text-xs text-gray-400 mb-2">Effects</label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                              {(['strength', 'intelligence', 'magic', 'vitality', 'luck', 'charm', 'reputation', 'gold', 'xp', 'hearts'] as const).map((stat) => (
                                <div key={stat}>
                                  <label className="block text-xs text-gray-400 mb-1 capitalize">
                                    {stat}
                                  </label>
                                  <input
                                    type="number"
                                    value={choice.effects?.[stat as keyof typeof choice.effects] || 0}
                                    onChange={(e) => updateChoiceEffect(index, stat, e.target.value)}
                                    className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Requirements - Only show for non-combat nodes */}
                        {!(nodeData.type === 'combat' || nodeData.battle) && (
                          <div className="mb-3">
                            <label className="block text-xs text-gray-400 mb-2">Stat Requirements</label>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                              {(['strength', 'intelligence', 'magic', 'vitality', 'luck', 'charm', 'reputation', 'gold'] as const).map((stat) => (
                                <div key={stat}>
                                  <label className="block text-xs text-gray-400 mb-1 capitalize">
                                    {stat}
                                  </label>
                                  <input
                                    type="number"
                                    value={choice.require?.[stat] || 0}
                                    onChange={(e) => updateChoiceRequirement(index, stat, e.target.value)}
                                    className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Item Rewards - Only show for non-combat nodes */}
                        {!(nodeData.type === 'combat' || nodeData.battle) && (
                          <div className="mb-3">
                            <label className="block text-xs text-gray-400 mb-1">Item Rewards (comma-separated)</label>
                            <input
                              type="text"
                              value={choice.itemRewards?.join(', ') || ''}
                              onChange={(e) => updateChoiceRewards(index, e.target.value)}
                              className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="iron_sword, health_potion"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Available: {Object.keys(items).join(', ')}
                            </p>
                          </div>
                        )}

                        {/* Item Requirements - Only show for non-combat nodes */}
                        {!(nodeData.type === 'combat' || nodeData.battle) && (
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Required Items (comma-separated)</label>
                            <input
                              type="text"
                              value={choice.itemRequirements?.join(', ') || ''}
                              onChange={(e) => updateChoiceRequiredItems(index, e.target.value)}
                              className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="silver_coin, magic_key"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleSaveNode}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Node</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingNode(null);
                      setIsCreatingNode(false);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};