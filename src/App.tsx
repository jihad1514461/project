import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { StartScreen } from './components/StartScreen';
import { AdminAuth } from './components/AdminAuth';
import { AdminEntry } from './components/AdminEntry';
import PlayerCreation from './components/PlayerCreation';
import { StorySelection } from './components/StorySelection';
import { AdminInterface } from './components/AdminInterface';
import { GameplayScreen } from './components/GameplayScreen';
import { LevelUpScreen } from './components/LevelUpScreen';
import { ClassSelection } from './components/ClassSelection';
import { InventoryScreen } from './components/InventoryScreen';
import { EquipmentScreen } from './components/EquipmentScreen';
import { ShopScreen } from './components/ShopScreen';
import { CombatScreen } from './components/CombatScreen';
import { SpellSkillChoice } from './components/SpellSkillChoice';
import {
  GameScreen,
  Player,
  GameData,
  Choice,
  PlayerStats,
  Equipment,
  ShopItem,
  ClassDefinition,
  CombatState,
} from './types/game';
import { initialGameData } from './data/gameData';
import {
  createPlayer,
  canLevelUp,
  levelUpPlayer,
  applyStatIncrease,
  applyChoiceEffects,
  calculateXPThreshold,
  canUnlockClass,
  addClassToPlayer,
  useItem,
  equipItem,
  unequipItem,
  addItemToInventory,
  removeItemFromInventory,
  shouldShowSpellSkillChoice,
} from './utils/gameLogic';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('start');
  const [gameData, setGameData] = useState<GameData>(initialGameData);
  const [player, setPlayer] = useState<Player | null>(null);
  const [selectedStory, setSelectedStory] = useState<string>('');
  const [currentShop, setCurrentShop] = useState<string>('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [combatState, setCombatState] = useState<CombatState | null>(null);

  // Load saved player data on component mount
  useEffect(() => {
    const savedPlayer = localStorage.getItem('rpg-player');
    if (savedPlayer) {
      try {
        setPlayer(JSON.parse(savedPlayer));
      } catch (error) {
        console.error('Failed to load saved player:', error);
      }
    }
  }, []);

  // Save player data whenever it changes
  useEffect(() => {
    if (player) {
      localStorage.setItem('rpg-player', JSON.stringify(player));
    }
  }, [player]);

  const handleGoHome = () => {
    setCurrentScreen('start');
    setSelectedStory('');
    setCurrentShop('');
  };

  const handleStartScreenOption = (option: 'game' | 'admin') => {
    if (option === 'game') {
      setCurrentScreen('admin-entry');
    } else {
      setCurrentScreen('admin-auth');
    }
  };

  const handleAdminAuth = () => {
    setIsAdminAuthenticated(true);
    setCurrentScreen('admin-classes');
  };

  const handleAdminEntryOption = (option: 'continue' | 'new') => {
    if (option === 'continue' && player) {
      setCurrentScreen('gameplay');
    } else {
      // Clear existing player data for new game
      setPlayer(null);
      localStorage.removeItem('rpg-player');
      setCurrentScreen('player-creation');
    }
  };

  const handleCreatePlayer = (
    name: string,
    gender: 'male' | 'female' | 'other',
    race: string,
    playerClass: string
  ) => {
    const raceStats = gameData.races[race] || {};
    const classData = gameData.classes[playerClass] as ClassDefinition;
    if (!classData) return;

    let newPlayer = createPlayer(
      name,
      gender,
      race,
      playerClass,
      raceStats,
      classData
    );

    setPlayer(newPlayer);
    setCurrentScreen('story-selection');
  };

  const handleSelectStory = (storyName: string) => {
    setSelectedStory(storyName);
    if (player) {
      const updatedPlayer = { ...player, currentNode: 'intro' };
      setPlayer(updatedPlayer);
    }
    setCurrentScreen('gameplay');
  };

  const handleUpdateGameData = (newData: GameData) => {
    setGameData(newData);
    // Note: In a real application, this would save to gameData.ts
    // For now, we'll update the in-memory state
  };

  const handleMakeChoice = (choice: Choice) => {
    if (!player || !selectedStory) return;

    // Apply choice effects
    let updatedPlayer = applyChoiceEffects(player, choice, gameData.items);

    // Check for death
    if (updatedPlayer.hearts <= 0) {
      alert('Your hero has fallen! The adventure ends here.');
      setPlayer(null);
      localStorage.removeItem('rpg-player');
      setCurrentScreen('start');
      return;
    }

    // Update current node
    updatedPlayer.currentNode = choice.next_node;

    // Check for level up
    if (canLevelUp(updatedPlayer)) {
      updatedPlayer = levelUpPlayer(updatedPlayer);
      
      // Check for spell/skill choice every 5 levels
      if (shouldShowSpellSkillChoice(updatedPlayer)) {
        setPlayer(updatedPlayer);
        setCurrentScreen('spell-skill-choice');
        return;
      } else {
        setPlayer(updatedPlayer);
        setCurrentScreen('level-up');
        return;
      }
    }

    setPlayer(updatedPlayer);
  };

  const handleApplyLevelUp = (statIncreases: {
    [key in keyof PlayerStats]?: number;
  }) => {
    if (!player) return;

    let updatedPlayer = { ...player };

    // Apply stat increases
    Object.keys(statIncreases).forEach((stat) => {
      const increase = statIncreases[stat as keyof PlayerStats];
      if (increase) {
        updatedPlayer = applyStatIncrease(
          updatedPlayer,
          stat as keyof PlayerStats,
          increase
        );
      }
    });

    // Check if player can unlock new classes at level 5 or 10
    const canUnlockNewClass = 
      updatedPlayer.level % 20 === 0 &&
      Object.keys(gameData.classRequirements).some((className) =>
        canUnlockClass(updatedPlayer, className, gameData.classRequirements, gameData.classes[className] as ClassDefinition)
      );

    if (canUnlockNewClass) {
      setPlayer(updatedPlayer);
      setCurrentScreen('class-selection');
      return;
    }

    setPlayer(updatedPlayer);
    setCurrentScreen('gameplay');
  };

  const handleSelectClass = (className: string) => {
    if (!player) return;

    const classData = gameData.classes[className] as ClassDefinition;
    const updatedPlayer = addClassToPlayer(player, className, classData);
    setPlayer(updatedPlayer);
    setCurrentScreen('gameplay');
  };

  const handleSpellSkillChoice = (type: 'spell' | 'skill', id: string) => {
    if (!player) return;

    const updatedPlayer = { ...player };
    if (type === 'spell') {
      updatedPlayer.spells.push(id);
    } else {
      updatedPlayer.skills.push(id);
    }

    setPlayer(updatedPlayer);
    setCurrentScreen('gameplay');
  };

  const handleUseItem = (item: any) => {
    if (!player) return;

    const updatedPlayer = useItem(player, item);
    setPlayer(updatedPlayer);
  };

  const handleEquipItem = (item: any) => {
    if (!player) return;
    const updatedPlayer = equipItem(player, item);
    setPlayer(updatedPlayer);
  };

  const handleUnequipItem = (slot: keyof Equipment) => {
    if (!player) return;
    const updatedPlayer = unequipItem(player, slot);
    setPlayer(updatedPlayer);
  };

  const handleBuyItem = (item: ShopItem) => {
    if (!player) return;

    const shop = gameData.shops[currentShop];
    if (!shop) return;

    const price = Math.floor(item.value * shop.buyMultiplier);
    if (player.stats.gold < price) return;

    // Update player
    let updatedPlayer = { ...player };
    updatedPlayer.stats.gold -= price;
    updatedPlayer = addItemToInventory(updatedPlayer, item);

    // Update shop stock
    const updatedShop = { ...shop };
    const shopItemIndex = updatedShop.items.findIndex((i) => i.id === item.id);
    if (shopItemIndex !== -1 && updatedShop.items[shopItemIndex].stock) {
      updatedShop.items[shopItemIndex].stock! -= 1;
    }

    const updatedGameData = {
      ...gameData,
      shops: {
        ...gameData.shops,
        [currentShop]: updatedShop,
      },
    };

    setPlayer(updatedPlayer);
    setGameData(updatedGameData);
    localStorage.setItem('rpg-game-data', JSON.stringify(updatedGameData));
  };

  const handleSellItem = (item: any) => {
    if (!player) return;

    const shop = gameData.shops[currentShop];
    if (!shop) return;

    const sellPrice = Math.floor(
      (item.sellValue || item.value * 0.5) * shop.sellMultiplier
    );

    let updatedPlayer = { ...player };
    updatedPlayer.stats.gold += sellPrice;
    updatedPlayer = removeItemFromInventory(updatedPlayer, item.id, 1);

    setPlayer(updatedPlayer);
  };

  const handleOpenShop = (shopId: string) => {
    setCurrentShop(shopId);
    setCurrentScreen('shop');
  };

  const handleStartCombat = (monsterId: string) => {
    if (!player) return;

    const monster = gameData.monsters[monsterId];
    if (!monster) return;

    const combat: CombatState = {
      player: {
        health: player.hearts,
        mana: player.mana,
        element: player.element
      },
      monster: {
        health: monster.stats.health,
        mana: monster.stats.mana,
        element: monster.element,
        data: monster
      },
      turn: 'player',
      round: 1,
      log: [`Combat begins against ${monster.name}!`]
    };

    setCombatState(combat);
    setCurrentScreen('combat');
  };

  const handleCombatEnd = (result: 'win' | 'lose' | 'escape', updatedPlayer: Player) => {
    // Apply combat results
    let finalPlayer = { ...updatedPlayer };
    if (result === 'win') {
      // Apply rewards for victory
      const monster = combatState?.monster.data;
      if (monster) {
        // XP reward
        const baseXP = 50;
        finalPlayer.xp += baseXP;
        // Class-specific rewards
        const classReward = monster.classRewards.find(
          reward => reward.className === 'all' || finalPlayer.classes.some(c => c.name === reward.className)
        );
        if (classReward) {
          finalPlayer.xp += classReward.bonusXP;
          if (classReward.bonusReputation) {
            finalPlayer.stats.reputation += classReward.bonusReputation;
          }
        }
        // Apply drop table rewards
        monster.dropTable.items.forEach(drop => {
          if (Math.random() < drop.chance) {
            const item = gameData.items[drop.itemId];
            if (item) {
              for (let i = 0; i < (drop.quantity || 1); i++) {
                finalPlayer = addItemToInventory(finalPlayer, item);
              }
            }
          }
        });
        monster.dropTable.equipment.forEach(drop => {
          if (Math.random() < drop.chance) {
            const item = gameData.items[drop.itemId];
            if (item) {
              finalPlayer = addItemToInventory(finalPlayer, item);
            }
          }
        });
      }
    }
    // Handle escape - already applied reputation penalty in CombatScreen
    if (result === 'escape') {
      // No additional effects needed
    }
    // Update health and mana from combat
    if (combatState) {
      finalPlayer.hearts = combatState.player.health;
      finalPlayer.mana = combatState.player.mana;
    }

    // Find the current story node and transition to the next node based on battle result
    if (selectedStory && finalPlayer.currentNode) {
      const story = gameData.stories[selectedStory];
      const node = story[finalPlayer.currentNode];
      if (node && node.choices) {
        // Find the choice with matching battleResult
        const resultChoice = node.choices.find(
          c => c.require && c.require.battleResult === result
        );
        if (resultChoice && resultChoice.next_node) {
          finalPlayer.currentNode = resultChoice.next_node;
        }
      }
    }

    setPlayer(finalPlayer);
    setCombatState(null);
    setCurrentScreen('gameplay');
  };

  const getCurrentStoryNode = () => {
    if (!player || !selectedStory || !gameData.stories[selectedStory]) {
      return null;
    }

    return gameData.stories[selectedStory][player.currentNode] || null;
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen onSelectOption={handleStartScreenOption} />;

      case 'admin-auth':
        return (
          <AdminAuth
            onAuthenticated={handleAdminAuth}
            onBack={() => setCurrentScreen('start')}
          />
        );

      case 'admin-entry':
        return (
          <AdminEntry
            onSelectOption={handleAdminEntryOption}
            onBack={() => setCurrentScreen('start')}
            hasExistingPlayer={!!player}
          />
        );

      case 'player-creation':
        return (
          <PlayerCreation
            gameData={gameData}
            onPlayerCreated={handleCreatePlayer}
            onBack={() => setCurrentScreen('admin-entry')}
          />
        );

      case 'story-selection':
        return (
          <StorySelection
            gameData={gameData}
            onSelectStory={handleSelectStory}
            onBack={() => setCurrentScreen('player-creation')}
          />
        );

      case 'admin-classes':
      case 'admin-races':
      case 'admin-items':
      case 'admin-shops':
      case 'admin-spells':
      case 'admin-skills':
      case 'admin-monsters':
      case 'admin-villains':
      case 'admin-stories':
        if (!isAdminAuthenticated) {
          return (
            <AdminAuth
              onAuthenticated={handleAdminAuth}
              onBack={() => setCurrentScreen('start')}
            />
          );
        }
        return (
          <AdminInterface
            gameData={gameData}
            onUpdateGameData={handleUpdateGameData}
            onBack={() => setCurrentScreen('start')}
          />
        );

      case 'combat':
        if (!player || !combatState) return null;
        return (
          <CombatScreen
            player={player}
            combatState={combatState}
            gameData={gameData}
            onCombatEnd={handleCombatEnd}
            onBack={() => setCurrentScreen('gameplay')}
          />
        );

      case 'spell-skill-choice':
        if (!player) return null;
        return (
          <SpellSkillChoice
            player={player}
            gameData={gameData}
            onChoice={handleSpellSkillChoice}
            onBack={() => setCurrentScreen('gameplay')}
          />
        );

      case 'class-selection':
        if (!player) return null;
        return (
          <ClassSelection
            player={player}
            gameData={gameData}
            onSelectClass={handleSelectClass}
            onBack={() => setCurrentScreen('gameplay')}
          />
        );

      case 'inventory':
        if (!player) return null;
        return (
          <InventoryScreen
            player={player}
            onUseItem={handleUseItem}
            onBack={() => setCurrentScreen('gameplay')}
          />
        );

      case 'equipment':
        if (!player) return null;
        return (
          <EquipmentScreen
            player={player}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
            onBack={() => setCurrentScreen('gameplay')}
          />
        );

      case 'shop':
        if (!player || !currentShop || !gameData.shops[currentShop])
          return null;
        return (
          <ShopScreen
            player={player}
            shop={gameData.shops[currentShop]}
            onBuyItem={handleBuyItem}
            onSellItem={handleSellItem}
            onBack={() => setCurrentScreen('gameplay')}
          />
        );

      case 'gameplay':
        const currentNode = getCurrentStoryNode();
        if (!player || !currentNode) {
          return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
              <p className="text-white text-xl">Loading adventure...</p>
            </div>
          );
        }
        return (
          <GameplayScreen
            player={player}
            currentNode={currentNode}
            onMakeChoice={handleMakeChoice}
            onBack={() => setCurrentScreen('story-selection')}
            onOpenInventory={() => setCurrentScreen('inventory')}
            onOpenEquipment={() => setCurrentScreen('equipment')}
            onOpenShop={handleOpenShop}
            onStartCombat={handleStartCombat}
          />
        );

      case 'level-up':
        if (!player) return null;
        return (
          <LevelUpScreen player={player} onApplyLevelUp={handleApplyLevelUp} />
        );

      default:
        return <StartScreen onSelectOption={handleStartScreenOption} />;
    }
  };

  return (
    <div className="app">
      {/* Global Home Button */}
      {currentScreen !== 'start' && currentScreen !== 'admin-auth' && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleGoHome}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2 text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
        </div>
      )}
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
