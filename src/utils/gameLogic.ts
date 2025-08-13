import { Player, PlayerStats, Choice, StoryNode, Item, PlayerClass, Equipment, Element, ClassDefinition } from '../types/game';

// Fibonacci XP calculation
export const calculateXPThreshold = (level: number): number => {
  const fibonacci = (n: number): number => {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  };
  return fibonacci(level) * 10;
};

export const createPlayer = (
  name: string,
  gender: 'male' | 'female' | 'other',
  race: string,
  playerClass: string,
  raceStats: Partial<PlayerStats>,
  classData: ClassDefinition,
  initialEquipment?: string[]
): Player => {
  const baseStats: PlayerStats = {
    strength: 1,
    intelligence: 1,
    magic: 1,
    vitality: 1,
    dexterity: 1,
    agility: 1,
    luck: 1,
    charm: 1,
    reputation: 1,
    gold: 20,
  };

  // Apply race and class modifiers
  const finalStats = { ...baseStats };
  Object.keys(raceStats).forEach(key => {
    if (key in finalStats) {
      finalStats[key as keyof PlayerStats] += raceStats[key as keyof PlayerStats] || 0;
    }
  });
  Object.keys(classData.baseStats).forEach(key => {
    if (key in finalStats) {
      finalStats[key as keyof PlayerStats] += classData.baseStats[key as keyof PlayerStats] || 0;
    }
  });

  // Only tier 0 classes get starting reputation and gold
  if (classData.tier === 0) {
    finalStats.reputation += classData.reputation;
    finalStats.gold += classData.gold;
  }

  const maxHearts = Math.max(1, finalStats.vitality * 2);
  const maxMana = Math.max(1, finalStats.magic * 3);

  const player: Player = {
    name,
    gender,
    race,
    classes: [{ name: playerClass, level: 1, unlockedAt: 1, tier: classData.tier }],
    activeClass: playerClass,
    stats: finalStats,
    level: 1,
    xp: 0,
    hearts: maxHearts,
    maxHearts,
    mana: maxMana,
    maxMana,
    inventory: [],
    equipment: {},
    spells: [],
    skills: [],
    unlockedSpells: [],
    unlockedSkills: [],
    currentNode: 'intro',
    element: classData.elementalRequirements[0] || 'Neutral'
  };

  return player;
};

export const canUnlockClass = (player: Player, className: string, classRequirements: any, classData: ClassDefinition): boolean => {
  const requirement = classRequirements[className];
  if (!requirement) return false;
  
  // Check if player already has this class
  if (player.classes.some(c => c.name === className)) return false;
  
  // Check if player has reached required level (every 20 levels for class changes)
  if (player.level < requirement.requiredLevel) return false;
  
  // Check stat requirements
  for (const [stat, required] of Object.entries(requirement.requiredStats)) {
    if (player.stats[stat as keyof PlayerStats] < required) return false;
  }
  
  // Check elemental requirements
  if (classData.elementalRequirements && classData.elementalRequirements.length > 0) {
    // For now, we'll allow any class if the player meets other requirements
    // In the future, this could check player's elemental affinity
  }
  
  return true;
};

export const canLevelUp = (player: Player): boolean => {
  return player.xp >= calculateXPThreshold(player.level);
};

export const levelUpPlayer = (player: Player): Player => {
  const newLevel = player.level + 1;
  const newMaxHearts = Math.max(1, player.stats.vitality * 2);
  const newMaxMana = Math.max(1, player.stats.magic * 3);
  
  return {
    ...player,
    level: newLevel,
    maxHearts: newMaxHearts,
    maxMana: newMaxMana,
    hearts: Math.min(player.hearts + 1, newMaxHearts),
    mana: Math.min(player.mana + 1, newMaxMana)
  };
};

export const shouldShowSpellSkillChoice = (player: Player): boolean => {
  return player.level % 5 === 0 && player.level > 0;
};

export const addClassToPlayer = (player: Player, className: string, classData: ClassDefinition): Player => {
  const newClass: PlayerClass = {
    name: className,
    level: 1,
    unlockedAt: player.level,
    tier: classData.tier
  };
  
  const newStats = { ...player.stats };
  Object.keys(classData.baseStats).forEach(key => {
    if (key in newStats) {
      newStats[key as keyof PlayerStats] += classData.baseStats[key as keyof PlayerStats] || 0;
    }
  });
  
  const newMaxHearts = Math.max(1, newStats.vitality * 2);
  const newMaxMana = Math.max(1, newStats.magic * 3);
  
  return {
    ...player,
    classes: [...player.classes, newClass],
    stats: newStats,
    maxHearts: newMaxHearts,
    maxMana: newMaxMana,
    hearts: Math.min(player.hearts, newMaxHearts),
    mana: Math.min(player.mana, newMaxMana)
  };
};

export const addItemToInventory = (player: Player, item: Item): Player => {
  const newInventory = [...player.inventory];
  
  if (item.stackable) {
    const existingItem = newInventory.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
    } else {
      newInventory.push({ ...item });
    }
  } else {
    newInventory.push({ ...item });
  }
  
  return { ...player, inventory: newInventory };
};

export const removeItemFromInventory = (player: Player, itemId: string, quantity: number = 1): Player => {
  const newInventory = [...player.inventory];
  const itemIndex = newInventory.findIndex(i => i.id === itemId);
  
  if (itemIndex === -1) return player;
  
  const item = newInventory[itemIndex];
  if (item.stackable && item.quantity && item.quantity > quantity) {
    item.quantity -= quantity;
  } else {
    newInventory.splice(itemIndex, 1);
  }
  
  return { ...player, inventory: newInventory };
};

export const useItem = (player: Player, item: Item): Player => {
  if (item.type !== 'consumable') return player;
  
  let updatedPlayer = { ...player };
  
  if (item.effects) {
    const newStats = { ...player.stats };
    let heartsChange = 0;
    let maxHeartsChange = 0;
    let manaChange = 0;
    
    Object.keys(item.effects).forEach(key => {
      if (key === 'hearts') {
        heartsChange = item.effects!.hearts || 0;
      } else if (key === 'maxHearts') {
        maxHeartsChange = item.effects!.maxHearts || 0;
      } else if (key === 'mana') {
        manaChange = item.effects!.mana || 0;
      } else if (key in newStats) {
        newStats[key as keyof PlayerStats] += item.effects![key as keyof PlayerStats] || 0;
      }
    });
    
    updatedPlayer.stats = newStats;
    
    if (maxHeartsChange !== 0) {
      updatedPlayer.maxHearts = Math.max(1, updatedPlayer.maxHearts + maxHeartsChange);
    }
    
    if (heartsChange !== 0) {
      updatedPlayer.hearts = Math.max(0, Math.min(updatedPlayer.maxHearts, updatedPlayer.hearts + heartsChange));
    }
    
    if (manaChange !== 0) {
      updatedPlayer.mana = Math.max(0, Math.min(updatedPlayer.maxMana, updatedPlayer.mana + manaChange));
    }
  }
  
  // Remove the used item
  updatedPlayer = removeItemFromInventory(updatedPlayer, item.id, 1);
  
  return updatedPlayer;
};

export const canEquipItem = (player: Player, item: Item): boolean => {
  if (!item.subType) return false;
  
  // Check stat requirements
  if (item.requirements) {
    for (const [stat, requirement] of Object.entries(item.requirements)) {
      if (player.stats[stat as keyof PlayerStats] < requirement) {
        return false;
      }
    }
  }
  
  return true;
};

export const equipItem = (player: Player, item: Item): Player => {
  if (!canEquipItem(player, item) || !item.subType) return player;
  
  const newEquipment = { ...player.equipment };
  const newInventory = [...player.inventory];
  
  // Handle ring slots specially
  if (item.subType === 'ring') {
    if (!newEquipment.ring1) {
      newEquipment.ring1 = item;
    } else if (!newEquipment.ring2) {
      newEquipment.ring2 = item;
    } else {
      // Replace ring1, move old ring1 to inventory
      newInventory.push(newEquipment.ring1);
      newEquipment.ring1 = item;
    }
  } else {
    const slot = item.subType as keyof Equipment;
    
    // If slot is occupied, move old item to inventory
    if (newEquipment[slot]) {
      newInventory.push(newEquipment[slot]!);
    }
    
    newEquipment[slot] = item;
  }
  
  // Remove item from inventory
  const itemIndex = newInventory.findIndex(i => i.id === item.id);
  if (itemIndex !== -1) {
    newInventory.splice(itemIndex, 1);
  }
  
  return {
    ...player,
    equipment: newEquipment,
    inventory: newInventory
  };
};

export const unequipItem = (player: Player, slot: keyof Equipment): Player => {
  const item = player.equipment[slot];
  if (!item) return player;
  
  const newEquipment = { ...player.equipment };
  const newInventory = [...player.inventory, item];
  
  delete newEquipment[slot];
  
  return {
    ...player,
    equipment: newEquipment,
    inventory: newInventory
  };
};

export const getEquippedStats = (equipment: Equipment): Partial<PlayerStats & { hearts: number; maxHearts: number }> => {
  const bonusStats: Partial<PlayerStats & { hearts: number; maxHearts: number }> = {};
  
  Object.values(equipment).forEach(item => {
    if (item?.effects) {
      Object.entries(item.effects).forEach(([stat, value]) => {
        bonusStats[stat as keyof typeof bonusStats] = (bonusStats[stat as keyof typeof bonusStats] || 0) + value;
      });
    }
  });
  
  return bonusStats;
};

export const getTotalPlayerStats = (player: Player): PlayerStats & { hearts: number; maxHearts: number } => {
  const baseStats = { ...player.stats, hearts: player.hearts, maxHearts: player.maxHearts };
  const equipmentStats = getEquippedStats(player.equipment);
  
  const totalStats = { ...baseStats };
  Object.entries(equipmentStats).forEach(([stat, value]) => {
    if (stat in totalStats) {
      totalStats[stat as keyof typeof totalStats] += value || 0;
    }
  });
  
  return totalStats;
};

export const hasItem = (player: Player, itemId: string): boolean => {
  return player.inventory.some(item => item.id === itemId);
};

export const applyStatIncrease = (player: Player, stat: keyof PlayerStats, amount: number): Player => {
  const newStats = { ...player.stats };
  newStats[stat] += amount;
  
  const newMaxHearts = stat === 'vitality' 
    ? Math.max(1, newStats.vitality * 2)
    : player.maxHearts;

  const newMaxMana = stat === 'magic'
    ? Math.max(1, newStats.magic * 3)
    : player.maxMana;

  return {
    ...player,
    stats: newStats,
    maxHearts: newMaxHearts,
    maxMana: newMaxMana,
    hearts: Math.min(player.hearts, newMaxHearts),
    mana: Math.min(player.mana, newMaxMana)
  };
};

// Calculate derived stats based on base attributes
export const calculateDerivedStats = (stats: {
  strength: number;
  intelligence: number;
  vitality: number;
  magic: number;
  dexterity: number;
  agility: number;
  luck: number;
  charm: number;
  reputation: number;
  gold: number;
}) => {
  return {
    health: stats.vitality * 10,
    mana: stats.magic * 10,
    physicalDamage: Math.floor(stats.strength / 2) + 1, // Base physical damage from strength
    magicalDamage: Math.floor(stats.magic / 2) + 1, // Base magical damage from magic
    critChance: 5 + Math.max(0, stats.dexterity - 10), // 5% base + 1% per dexterity above 10
    escapeChance: 25 + Math.max(0, stats.agility - 10), // 25% base + 1% per agility above 10
    luckBonus: Math.floor(stats.luck / 2) + 1, // Luck-based bonuses
    socialInfluence: Math.floor((stats.charm + stats.reputation) / 2) + 1, // Combined social influence
    wealthBonus: Math.floor(stats.gold / 100), // Wealth-based bonuses
  };
};

export const rollDice = (hasAdvantage: boolean = false): number => {
  return hasAdvantage 
    ? Math.floor(Math.random() * 3) + 4  // 4-6
    : Math.floor(Math.random() * 6) + 1; // 1-6
};

export const canMakeChoice = (choice: Choice, player: Player, diceRoll?: number): boolean => {
  // Check stat requirements
  if (choice.require) {
    for (const [stat, requirement] of Object.entries(choice.require)) {
      if (player.stats[stat as keyof PlayerStats] < requirement) {
        return false;
      }
    }
  }

  // Check class requirements
  if (choice.classRequire) {
    const hasRequiredClass = choice.classRequire.some(className => 
      player.classes.some(c => c.name === className)
    );
    if (!hasRequiredClass) return false;
  }

  // Check elemental requirements
  if (choice.elementRequire) {
    if (!choice.elementRequire.includes(player.element)) {
      return false;
    }
  }

  // Check item requirements
  if (choice.itemRequirements) {
    for (const itemId of choice.itemRequirements) {
      if (!hasItem(player, itemId)) {
        return false;
      }
    }
  }

  // Check dice roll requirement
  if (choice.dice_requirement && diceRoll !== undefined) {
    return diceRoll >= choice.dice_requirement;
  }

  return true;
};

export const applyChoiceEffects = (player: Player, choice: Choice, gameItems: { [key: string]: Item }): Player => {
  if (!choice.effects) return player;

  let newPlayer = { ...player };
  let newStats = { ...player.stats };

  // Apply stat effects
  Object.keys(choice.effects).forEach(key => {
    if (key === 'xp') {
      newPlayer.xp += choice.effects!.xp || 0;
    } else if (key === 'hearts') {
      const healthChange = choice.effects!.hearts || 0;
      newPlayer.hearts = Math.max(0, Math.min(newPlayer.maxHearts, newPlayer.hearts + healthChange));
    } else if (key === 'mana') {
      const manaChange = choice.effects!.mana || 0;
      newPlayer.mana = Math.max(0, Math.min(newPlayer.maxMana, newPlayer.mana + manaChange));
    } else if (key in newStats) {
      newStats[key as keyof PlayerStats] += choice.effects![key as keyof PlayerStats] || 0;
    }
  });

  newPlayer.stats = newStats;

  // Recalculate max hearts and mana if vitality or magic changed
  if (choice.effects.vitality) {
    newPlayer.maxHearts = Math.max(1, newStats.vitality * 2);
    newPlayer.hearts = Math.min(newPlayer.hearts, newPlayer.maxHearts);
  }
  if (choice.effects.magic) {
    newPlayer.maxMana = Math.max(1, newStats.magic * 3);
    newPlayer.mana = Math.min(newPlayer.mana, newPlayer.maxMana);
  }

  // Add item rewards
  if (choice.itemRewards) {
    choice.itemRewards.forEach(itemId => {
      const item = gameItems[itemId];
      if (item) {
        newPlayer = addItemToInventory(newPlayer, item);
      }
    });
  }

  // Add spell rewards
  if (choice.spellRewards) {
    choice.spellRewards.forEach(spellId => {
      if (!newPlayer.unlockedSpells.includes(spellId)) {
        newPlayer.unlockedSpells.push(spellId);
      }
    });
  }

  // Add skill rewards
  if (choice.skillRewards) {
    choice.skillRewards.forEach(skillId => {
      if (!newPlayer.unlockedSkills.includes(skillId)) {
        newPlayer.unlockedSkills.push(skillId);
      }
    });
  }

  return newPlayer;
};

export const replaceVariables = (text: string, player: Player): string => {
  const pronouns = {
    male: { he_she: 'he', his_her: 'his', him_her: 'him' },
    female: { he_she: 'she', his_her: 'her', him_her: 'her' },
    other: { he_she: 'they', his_her: 'their', him_her: 'them' }
  };

  const playerPronouns = pronouns[player.gender];

  return text
    .replace(/{player_name}/g, player.name)
    .replace(/{player_race}/g, player.race)
    .replace(/{player_class}/g, player.activeClass)
    .replace(/{he_she}/g, playerPronouns.he_she)
    .replace(/{his_her}/g, playerPronouns.his_her)
    .replace(/{him_her}/g, playerPronouns.him_her)
    .replace(/{strength}/g, player.stats.strength.toString())
    .replace(/{intelligence}/g, player.stats.intelligence.toString())
    .replace(/{magic}/g, player.stats.magic.toString())
    .replace(/{vitality}/g, player.stats.vitality.toString())
    .replace(/{gold}/g, player.stats.gold.toString())
    .replace(/{reputation}/g, player.stats.reputation.toString());
};