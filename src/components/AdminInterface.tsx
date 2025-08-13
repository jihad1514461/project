import React, { useState } from 'react';
import { Settings, ArrowLeft, Sword, Crown, BookOpen, Package, Download, Upload, Save, ShoppingCart, Zap, Star, Skull, Search } from 'lucide-react';
import { GameData } from '../types/game';
import { gameDataManager } from '../utils/gameDataManager';
import { GameDataService } from '../api';
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
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleUpdateClasses = async (classes: { [key: string]: any }) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      // Update local state immediately for responsive UI
      const newData = { ...gameData, classes };
      onUpdateGameData(newData);
      
      // Save to API in background
      await gameDataManager.updateClasses(classes);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update classes');
      console.error('Failed to update classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClassRequirements = async (classRequirements: { [key: string]: any }) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const newData = { ...gameData, classRequirements };
      onUpdateGameData(newData);
      
      await gameDataManager.updateClassRequirements(classRequirements);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update class requirements');
      console.error('Failed to update class requirements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRaces = async (races: { [key: string]: any }) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const newData = { ...gameData, races };
      onUpdateGameData(newData);
      
      await gameDataManager.updateRaces(races);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update races');
      console.error('Failed to update races:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItems = async (items: { [key: string]: any }) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const newData = { ...gameData, items };
      onUpdateGameData(newData);
      
      await gameDataManager.updateItems(items);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update items');
      console.error('Failed to update items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStories = async (stories: { [storyName: string]: any }) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const newData = { ...gameData, stories };
      onUpdateGameData(newData);
      
      await gameDataManager.updateStories(stories);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update stories');
      console.error('Failed to update stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateShops = async (shops: { [key: string]: any }) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const newData = { ...gameData, shops };
      onUpdateGameData(newData);
      
      await gameDataManager.updateShops(shops);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update shops');
      console.error('Failed to update shops:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSpells = async (spells: { [key: string]: any }) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const newData = { ...gameData, spells };
      onUpdateGameData(newData);
      
      await gameDataManager.updateSpells(spells);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update spells');
      console.error('Failed to update spells:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSkills = async (skills: { [key: string]: any }) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const newData = { ...gameData, skills };
      onUpdateGameData(newData);
      
      await gameDataManager.updateSkills(skills);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update skills');
      console.error('Failed to update skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMonsters = async (monsters: { [key: string]: any }) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const newData = { ...gameData, monsters };
      onUpdateGameData(newData);
      
      await gameDataManager.updateMonsters(monsters);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update monsters');
      console.error('Failed to update monsters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVillains = async (villains: { [key: string]: any }) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const newData = { ...gameData, villains };
      onUpdateGameData(newData);
      
      await gameDataManager.updateVillains(villains);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update villains');
      console.error('Failed to update villains:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Granular API functions for Classes
  const handleCreateClass = async (classData: any, requirementData?: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const classResponse = await GameDataService.createClass(classData);
      if (!classResponse.success) {
        throw new Error(classResponse.error || 'Failed to create class');
      }

      if (requirementData && Object.keys(requirementData).length > 0) {
        const reqResponse = await GameDataService.createClassRequirement({
          id: classData.id,
          ...requirementData
        });
        if (!reqResponse.success) {
          console.warn('Class created but requirement failed:', reqResponse.error);
        }
      }

      // Update local state
      const newData = {
        ...gameData,
        classes: { ...gameData.classes, [classData.id]: classData },
        classRequirements: requirementData ? 
          { ...gameData.classRequirements, [classData.id]: requirementData } : 
          gameData.classRequirements
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to create class');
      console.error('Failed to create class:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClass = async (classId: string, classData: any, requirementData?: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const classResponse = await GameDataService.updateClass(classId, classData);
      if (!classResponse.success) {
        throw new Error(classResponse.error || 'Failed to update class');
      }

      if (requirementData) {
        const reqResponse = await GameDataService.updateClassRequirement(classId, requirementData);
        if (!reqResponse.success) {
          console.warn('Class updated but requirement failed:', reqResponse.error);
        }
      }

      // Update local state
      const newData = {
        ...gameData,
        classes: { ...gameData.classes, [classData.id]: classData },
        classRequirements: requirementData ? 
          { ...gameData.classRequirements, [classData.id]: requirementData } : 
          gameData.classRequirements
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update class');
      console.error('Failed to update class:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const classResponse = await GameDataService.deleteClass(classId);
      if (!classResponse.success) {
        throw new Error(classResponse.error || 'Failed to delete class');
      }

      // Also delete class requirement if it exists
      if (gameData.classRequirements[classId]) {
        await GameDataService.deleteClassRequirement(classId);
      }

      // Update local state
      const newClasses = { ...gameData.classes };
      const newRequirements = { ...gameData.classRequirements };
      delete newClasses[classId];
      delete newRequirements[classId];
      
      const newData = {
        ...gameData,
        classes: newClasses,
        classRequirements: newRequirements
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to delete class');
      console.error('Failed to delete class:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Granular API functions for Races
  const handleCreateRace = async (raceId: string, raceData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.createRace({ id: raceId, ...raceData });
      if (!response.success) {
        throw new Error(response.error || 'Failed to create race');
      }

      const newData = {
        ...gameData,
        races: { ...gameData.races, [raceId]: raceData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to create race');
      console.error('Failed to create race:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRace = async (raceId: string, raceData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.updateRace(raceId, raceData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update race');
      }

      const newData = {
        ...gameData,
        races: { ...gameData.races, [raceId]: raceData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update race');
      console.error('Failed to update race:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRace = async (raceId: string) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.deleteRace(raceId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete race');
      }

      const newRaces = { ...gameData.races };
      delete newRaces[raceId];
      
      const newData = { ...gameData, races: newRaces };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to delete race');
      console.error('Failed to delete race:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Granular API functions for Items
  const handleCreateItem = async (itemData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.createItem(itemData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create item');
      }

      const newData = {
        ...gameData,
        items: { ...gameData.items, [itemData.id]: itemData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to create item');
      console.error('Failed to create item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItem = async (itemId: string, itemData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.updateItem(itemId, itemData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update item');
      }

      const newData = {
        ...gameData,
        items: { ...gameData.items, [itemData.id]: itemData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update item');
      console.error('Failed to update item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.deleteItem(itemId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete item');
      }

      const newItems = { ...gameData.items };
      delete newItems[itemId];
      
      const newData = { ...gameData, items: newItems };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to delete item');
      console.error('Failed to delete item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Granular API functions for Shops
  const handleCreateShop = async (shopData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.createShop(shopData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create shop');
      }

      const newData = {
        ...gameData,
        shops: { ...gameData.shops, [shopData.id]: shopData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to create shop');
      console.error('Failed to create shop:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateShop = async (shopId: string, shopData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.updateShop(shopId, shopData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update shop');
      }

      const newData = {
        ...gameData,
        shops: { ...gameData.shops, [shopData.id]: shopData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update shop');
      console.error('Failed to update shop:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteShop = async (shopId: string) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.deleteShop(shopId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete shop');
      }

      const newShops = { ...gameData.shops };
      delete newShops[shopId];
      
      const newData = { ...gameData, shops: newShops };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to delete shop');
      console.error('Failed to delete shop:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Granular API functions for Spells
  const handleCreateSpell = async (spellData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.createSpell(spellData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create spell');
      }

      const newData = {
        ...gameData,
        spells: { ...gameData.spells, [spellData.id]: spellData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to create spell');
      console.error('Failed to create spell:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSpell = async (spellId: string, spellData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.updateSpell(spellId, spellData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update spell');
      }

      const newData = {
        ...gameData,
        spells: { ...gameData.spells, [spellData.id]: spellData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update spell');
      console.error('Failed to update spell:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSpell = async (spellId: string) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.deleteSpell(spellId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete spell');
      }

      const newSpells = { ...gameData.spells };
      delete newSpells[spellId];
      
      const newData = { ...gameData, spells: newSpells };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to delete spell');
      console.error('Failed to delete spell:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Granular API functions for Skills
  const handleCreateSkill = async (skillData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.createSkill(skillData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create skill');
      }

      const newData = {
        ...gameData,
        skills: { ...gameData.skills, [skillData.id]: skillData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to create skill');
      console.error('Failed to create skill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSkill = async (skillId: string, skillData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.updateSkill(skillId, skillData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update skill');
      }

      const newData = {
        ...gameData,
        skills: { ...gameData.skills, [skillData.id]: skillData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update skill');
      console.error('Failed to update skill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.deleteSkill(skillId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete skill');
      }

      const newSkills = { ...gameData.skills };
      delete newSkills[skillId];
      
      const newData = { ...gameData, skills: newSkills };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to delete skill');
      console.error('Failed to delete skill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Granular API functions for Monsters
  const handleCreateMonster = async (monsterData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.createMonster(monsterData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create monster');
      }

      const newData = {
        ...gameData,
        monsters: { ...gameData.monsters, [monsterData.id]: monsterData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to create monster');
      console.error('Failed to create monster:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMonster = async (monsterId: string, monsterData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.updateMonster(monsterId, monsterData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update monster');
      }

      const newData = {
        ...gameData,
        monsters: { ...gameData.monsters, [monsterData.id]: monsterData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update monster');
      console.error('Failed to update monster:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMonster = async (monsterId: string) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.deleteMonster(monsterId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete monster');
      }

      const newMonsters = { ...gameData.monsters };
      delete newMonsters[monsterId];
      
      const newData = { ...gameData, monsters: newMonsters };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to delete monster');
      console.error('Failed to delete monster:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Granular API functions for Villains
  const handleCreateVillain = async (villainData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.createVillain(villainData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create villain');
      }

      const newData = {
        ...gameData,
        villains: { ...gameData.villains, [villainData.id]: villainData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to create villain');
      console.error('Failed to create villain:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVillain = async (villainId: string, villainData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.updateVillain(villainId, villainData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update villain');
      }

      const newData = {
        ...gameData,
        villains: { ...gameData.villains, [villainData.id]: villainData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update villain');
      console.error('Failed to update villain:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVillain = async (villainId: string) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.deleteVillain(villainId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete villain');
      }

      const newVillains = { ...gameData.villains };
      delete newVillains[villainId];
      
      const newData = { ...gameData, villains: newVillains };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to delete villain');
      console.error('Failed to delete villain:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Granular API functions for Stories
  const handleCreateStory = async (storyData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.createStory(storyData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create story');
      }

      const newData = {
        ...gameData,
        stories: { ...gameData.stories, [storyData.id]: storyData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to create story');
      console.error('Failed to create story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStory = async (storyId: string, storyData: any) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.updateStory(storyId, storyData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update story');
      }

      const newData = {
        ...gameData,
        stories: { ...gameData.stories, [storyData.id]: storyData }
      };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update story');
      console.error('Failed to update story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await GameDataService.deleteStory(storyId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete story');
      }

      const newStories = { ...gameData.stories };
      delete newStories[storyId];
      
      const newData = { ...gameData, stories: newStories };
      onUpdateGameData(newData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to delete story');
      console.error('Failed to delete story:', error);
    } finally {
      setIsLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Fixed Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-80 bg-slate-800/90 backdrop-blur-sm border-r border-slate-700 z-40 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Main Menu</span>
          </button>
          
          <div className="text-center">
            <Settings className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-1">Game Master</h2>
            <p className="text-gray-400 text-sm">Control Panel</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-600">
          <div className="relative">
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

        {/* Tab Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-all duration-300 text-left ${
                    activeTab === tab.id
                      ? 'bg-slate-700/70 border border-blue-500/50 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/30 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : 'text-gray-500'}`} />
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex space-x-2">
            <button
              onClick={handleExportGameData}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center space-x-2 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleDownloadGameData}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center space-x-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-80">
        <div className="min-h-screen p-6">
          {/* Content Header */}
          <div className="mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {tabs.find(t => t.id === activeTab)?.label} Management
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Manage all aspects of your RPG world
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {tabs.find(t => t.id === activeTab)?.icon && (
                    React.createElement(tabs.find(t => t.id === activeTab)!.icon, {
                      className: `w-8 h-8 ${tabs.find(t => t.id === activeTab)?.color}`
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-6">
              {/* Loading Indicator */}
              {isLoading && (
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span className="text-blue-400 text-sm">Saving changes...</span>
                  </div>
                </div>
              )}
              
              {/* API Error Display */}
              {apiError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 text-sm">API Error: {apiError}</span>
                    <button
                      onClick={() => setApiError(null)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-red-300 text-xs mt-1">Changes saved locally. Check your backend connection.</p>
                </div>
              )}
              
              {/* Tab Content */}
              {activeTab === 'classes' && (
                <AdminClasses
                  classes={gameData.classes}
                  classRequirements={gameData.classRequirements}
                  items={gameData.items}
                  onCreateClass={handleCreateClass}
                  onUpdateClass={handleUpdateClass}
                  onDeleteClass={handleDeleteClass}
                />
              )}
              {activeTab === 'races' && (
                <AdminRaces
                  races={gameData.races}
                  onCreateRace={handleCreateRace}
                  onUpdateRace={handleUpdateRace}
                  onDeleteRace={handleDeleteRace}
                />
              )}
              {activeTab === 'items' && (
                <AdminItems
                  items={gameData.items}
                  onCreateItem={handleCreateItem}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                />
              )}
              {activeTab === 'shops' && (
                <AdminShops
                  shops={gameData.shops}
                  items={gameData.items}
                  onCreateShop={handleCreateShop}
                  onUpdateShop={handleUpdateShop}
                  onDeleteShop={handleDeleteShop}
                />
              )}
              {activeTab === 'spells' && (
                <AdminSpells
                  spells={gameData.spells}
                  classes={gameData.classes}
                  onCreateSpell={handleCreateSpell}
                  onUpdateSpell={handleUpdateSpell}
                  onDeleteSpell={handleDeleteSpell}
                />
              )}
              {activeTab === 'skills' && (
                <AdminSkills
                  skills={gameData.skills}
                  classes={gameData.classes}
                  onCreateSkill={handleCreateSkill}
                  onUpdateSkill={handleUpdateSkill}
                  onDeleteSkill={handleDeleteSkill}
                />
              )}
              {activeTab === 'monsters' && (
                <AdminMonsters
                  monsters={gameData.monsters}
                  items={gameData.items}
                  spells={gameData.spells}
                  classes={gameData.classes}
                  onCreateMonster={handleCreateMonster}
                  onUpdateMonster={handleUpdateMonster}
                  onDeleteMonster={handleDeleteMonster}
                />
              )}
              {activeTab === 'villains' && (
                <AdminVillains
                  villains={gameData.villains}
                  items={gameData.items}
                  spells={gameData.spells}
                  classes={gameData.classes}
                  onCreateVillain={handleCreateVillain}
                  onUpdateVillain={handleUpdateVillain}
                  onDeleteVillain={handleDeleteVillain}
                />
              )}
              {activeTab === 'stories' && (
                <AdminStories
                  stories={gameData.stories}
                  items={gameData.items}
                  monsters={gameData.monsters}
                  villains={gameData.villains}
                  shops={gameData.shops}
                  onCreateStory={handleCreateStory}
                  onUpdateStory={handleUpdateStory}
                  onDeleteStory={handleDeleteStory}
                />
              )}
            </div>
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