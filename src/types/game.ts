export interface PlayerStats {
  strength: number;
  intelligence: number;
  vitality: number;
  magic: number;
  luck: number;
  charm: number;
  reputation: number;
  gold: number;
}

export type Element = 'Light' | 'Fire' | 'Water' | 'Earth' | 'Air' | 'Dark' | 'Neutral';

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'quest';
  subType?: 'main_weapon' | 'side_weapon' | 'head' | 'body' | 'legs' | 'shoes' | 'ring' | 'necklace' | 'potion';
  description: string;
  effects?: Partial<PlayerStats & { hearts: number; maxHearts: number }>;
  requirements?: Partial<PlayerStats>;
  value: number;
  sellValue?: number;
  stackable?: boolean;
  quantity?: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  element?: Element;
  dropChance?: number;
}

export interface Equipment {
  mainWeapon?: Item;
  sideWeapon?: Item;
  head?: Item;
  body?: Item;
  legs?: Item;
  shoes?: Item;
  ring1?: Item;
  ring2?: Item;
  necklace?: Item;
  quickPotion?: Item;
}

export interface ShopItem extends Item {
  stock?: number;
  restockTime?: number;
  category: 'weapons' | 'armor' | 'potions' | 'accessories' | 'consumables';
}

export interface Shop {
  id: string;
  name: string;
  categories: string[];
  items: ShopItem[];
  buyMultiplier: number;
  sellMultiplier: number;
}

export interface Spell {
  id: string;
  name: string;
  type: 'Attack' | 'Defend' | 'Heal';
  description: string;
  manaCost: number;
  power: number;
  element?: Element;
  requirements: {
    level: number;
    stats?: Partial<PlayerStats>;
    classes?: string[];
  };
  unlockConditions?: {
    defeatedMonsters?: string[];
    completedNodes?: string[];
  };
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'active';
  effects: Partial<PlayerStats & { hearts: number; maxHearts: number }>;
  requirements: {
    level: number;
    stats?: Partial<PlayerStats>;
    classes?: string[];
  };
}

export interface Monster {
  id: string;
  name: string;
  description: string;
  stats: {
    health: number;
    attack: number;
    defense: number;
    mana: number;
  };
  element: Element;
  spells: string[];
  ai: {
    threatThreshold: number;
    elementalPreference: boolean;
    resourceThreshold: number;
  };
  dropTable: {
    items: Array<{
      itemId: string;
      chance: number;
      quantity?: number;
    }>;
    equipment: Array<{
      itemId: string;
      chance: number;
    }>;
  };
  classRewards: Array<{
    className: string;
    bonusXP: number;
    bonusReputation?: number;
  }>;
  spellUnlocks: string[];
}

export interface Villain extends Monster {
  backstory: string;
  weaknesses: Element[];
  immunities: Element[];
}

export interface PlayerClass {
  name: string;
  level: number;
  unlockedAt: number;
  tier: number;
}

export interface ClassDefinition {
  id: string;
  name: string;
  tier: number;
  baseStats: Partial<PlayerStats>;
  elementalRequirements: Element[];
  requiredElements?: Element[];
  reputation: number;
  gold: number;
  description: string;
  maxLevel: number;
  canChangeTo?: string[];
}

export interface Race {
  id: string;
  name: string;
  description: string;
  bonuses: {
    strength: number;
    intelligence: number;
    vitality: number;
    magic: number;
    gold: number;
    reputation: number;
  };
  calculatedStats?: {
    health: number; // vitality × 10
    mana: number; // magic × 10
    physicalDamage: number; // based on strength
    magicalDamage: number; // based on intelligence
  };
}

export interface Class {
  id: string;
  name: string;
  description: string;
  hitDie: number;
  primaryAbility: string;
  bonuses: {
    strength: number;
    intelligence: number;
    vitality: number;
    magic: number;
    gold: number;
    reputation: number;
  };
  calculatedStats?: {
    health: number; // vitality × 10
    mana: number; // magic × 10
    physicalDamage: number; // based on strength
    magicalDamage: number; // based on intelligence
  };
  spellcasting?: {
    ability: string;
    cantripsKnown: number[];
    spellsKnown: number[];
    spellSlots: number[][];
  };
}

export interface Player {
  id?: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  race: string;
  classes: PlayerClass[];
  activeClass: string;
  stats: PlayerStats;
  level: number;
  xp: number;
  hearts: number;
  maxHearts: number;
  mana: number;
  maxMana: number;
  inventory: Item[];
  equipment: Equipment;
  spells: string[];
  skills: string[];
  unlockedSpells: string[];
  unlockedSkills: string[];
  companions?: { [name: string]: number };
  fame?: number;
  currentNode: string;
  element: Element;
}

export interface Choice {
  text: string;
  next_node: string;
  effects?: Partial<PlayerStats & { xp: number; hearts: number; mana: number }>;
  itemRewards?: string[];
  itemRequirements?: string[];
  spellRewards?: string[];
  skillRewards?: string[];
  require?: Partial<PlayerStats>;
  battleResult?: 'win' | 'lose' | 'escape';
  classRequire?: string[];
  elementRequire?: Element[];
  dice_requirement?: number;
  luck_requirement?: number;
  hidden_unless_luck?: number;
}

export interface StoryNode {
  id: string;
  title: string;
  text: string;
  type: 'story' | 'combat' | 'shop' | 'choice' | 'ending';
  tags: string[];
  battle?: boolean;
  monster?: string;
  shop?: {
    shopId: string;
    categories: string[];
  };
  choices: Choice[];
  dice_requirement?: number;
  is_ending?: boolean;
  conditions?: {
    requiredLevel?: number;
    requiredStats?: Partial<PlayerStats>;
    requiredClasses?: string[];
    requiredItems?: string[];
    requiredSpells?: string[];
  };
}

export interface Story {
  [key: string]: StoryNode;
}

export interface ClassRequirement {
  requiredStats: Partial<PlayerStats>;
  requiredLevel: number;
  requiredElements: Element[];
  description: string;
  initialEquipment?: string[];
}

export interface GameData {
  classes: { [key: string]: ClassDefinition };
  races: { [key: string]: Partial<PlayerStats> };
  classRequirements: { [key: string]: ClassRequirement };
  items: { [key: string]: Item };
  shops: { [key: string]: Shop };
  spells: { [key: string]: Spell };
  skills: { [key: string]: Skill };
  monsters: { [key: string]: Monster };
  villains: { [key: string]: Villain };
  stories: { [storyName: string]: Story };
}

export type GameScreen = 
  | 'start' 
  | 'admin-entry' 
  | 'admin-auth'
  | 'player-creation' 
  | 'story-selection' 
  | 'admin-classes'
  | 'admin-races'
  | 'admin-items'
  | 'admin-shops'
  | 'admin-spells'
  | 'admin-skills'
  | 'admin-monsters'
  | 'admin-villains'
  | 'admin-stories'
  | 'gameplay' 
  | 'combat'
  | 'level-up'
  | 'spell-skill-choice'
  | 'class-selection'
  | 'inventory'
  | 'equipment'
  | 'shop';

export interface CombatState {
  player: {
    health: number;
    mana: number;
    element: Element;
  };
  monster: {
    health: number;
    mana: number;
    element: Element;
    data: Monster;
  };
  turn: 'player' | 'monster';
  round: number;
  log: string[];
}