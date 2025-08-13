
# RPG Game Implementation Plan - Checklist

## Phase 1: Core API Integration

### Milestone 1.1: Setup API Service Layer
- [x] Create API Directory (`project/src/api`)
- [x] Define API Client (`project/src/api/apiClient.ts`)
  - [x] Set up fetch-based client
  - [x] Handle base URL configuration
  - [x] Implement basic error handling
- [x] Create Player Service (`project/src/api/playerService.ts`)
  - [x] `createPlayer(playerData)`: `POST /players`
  - [x] `getPlayer(playerId)`: `GET /players/:id`
  - [x] `updatePlayer(playerId, updates)`: `PUT /players/:id`
- [x] Create Game Data Service (`project/src/api/gameDataService.ts`)
  - [x] `fetchGameData()`: `GET /api/gameData`
  - [x] `updateClass(classId, data)`: `PUT /api/classes/:id`
  - [x] `createItem(data)`: `POST /api/items`
  - [x] Similar functions for all game entities
- [x] Export Services (`project/src/api/index.ts`)

### Milestone 1.2: Player Data API Integration
- [x] Load Player Data (modify `project/src/App.tsx`)
  - [x] Use `playerService.getPlayer()` on mount
  - [x] Implement playerId storage mechanism
- [x] New Game Flow (update `project/src/components/PlayerCreation.tsx`)
  - [x] Call `playerService.createPlayer()`
  - [x] Update player state from backend response
- [x] Update Player Data (refactor `project/src/App.tsx`)
  - [x] `handleMakeChoice` → `playerService.updatePlayer()`
  - [x] `handleApplyLevelUp` → `playerService.updatePlayer()`
  - [x] `handleSelectClass` → `playerService.updatePlayer()`
  - [x] `handleUseItem` → `playerService.updatePlayer()`
  - [x] `handleEquipItem` → `playerService.updatePlayer()`
  - [x] `handleUnequipItem` → `playerService.updatePlayer()`
  - [x] `handleBuyItem` → `playerService.updatePlayer()`
  - [x] `handleSellItem` → `playerService.updatePlayer()`
  - [x] `handleCombatEnd` → `playerService.updatePlayer()`
- [x] Remove Local Player Persistence (kept as fallback)
  - [x] localStorage used as fallback when API unavailable

### Milestone 1.3: Game Data API Integration (Read Operations)
- [x] Fetch Initial Game Data (modify `project/src/App.tsx`)
  - [x] Use `gameDataService.fetchGameData()`
  - [x] Keep import of `initialGameData` as fallback
- [x] Pass Data via Props
  - [x] Ensure all components receive gameData as props

### Milestone 1.4: Game Data API Integration (CRUD Operations)
- [x] Update GameDataManager (`project/src/utils/gameDataManager.ts`)
  - [x] Keep local file saving as fallback
  - [x] Update all `updateX` methods to call API
- [ ] Admin Panel Integration
  - [x] Update `AdminInterface.tsx`
  - [x] Update all Admin components for API calls
- [x] Re-evaluate Export/Download functionality (kept for development)

## Phase 2: Admin Panel Enhancements & UI/UX Improvements

### Milestone 2.1: Implement Admin Navigation Slidebar
- [x] Modify AdminInterface Layout
  - [x] Restructure for fixed-position sidebar
- [x] Move Tab Navigation
  - [x] Relocate tabs to sidebar
- [x] Add Collapsible Functionality
  - [x] Implement expand/collapse logic
- [x] Ensure Responsiveness
  - [x] Adjust CSS for different screen sizes

### Milestone 2.2: Address Admin Panel Feature Gaps
use modal and modal nevigarion to reduce size and devide in multiple modal pages
- [ ] Races (`AdminRaces.tsx`)(stats are str,int,vitality,magic,dex,agi,luck,charisma for all)
  - [ ] Add Elemental Offense/Defense fields (12 elements with mastery numaric)
  - [ ] Add Innate Ability field
- [ ] Classes (`AdminClasses.tsx`)(stats are str,int,vitality,magic,dex,agi,luck,charisma for all)
  - [ ] Add Race Restrictions field
  - [ ] Add Starting Action field
- [ ] Items (`AdminItems.tsx`)(stats are str,int,vitality,magic,dex,agi,luck,charisma for all)
  - [ ] Add Elemental Bonuses fields
  - [ ] Add Embedded Abilities/Spells/Skills fields
  - [ ] Implement Potion Effects (temporary/permanent)
- [ ] Monsters & Villains(stats are str,int,vitality,magic,dex,agi,luck,charisma for all)(12 elements with mastery numaric)
  - [ ] Modify Gold Drop to accept range
  - [ ] Add Equipped Slots for villains
- [ ] Spells / Skills / Abilities
  - [ ] Add AoE/DoT properties for spells(12 elements with mastery numaric restriction)stat restriction
  - [ ] Add Summon Config for spells
  - [ ] Add Cooldowns for skills
  - [ ] Add Optional Elements for skills
  - [ ] Create AdminAbilities component if needed
- [ ] Stories (`AdminStories.tsx`)(stats are str,int,vitality,magic,dex,agi,luck,charisma for all)
  - [ ] Enhance validation highlighting

## Phase 3: Game Mechanics & Feature Parity

### Milestone 3.1: Refine Player Stats & Formulas
- [ ] HP/MP Formulas
  - [ ] Update maxHearts to `vitality * 10`
  - [ ] Update maxMana to `magic * 10`
- [ ] Basic Damage Formulas
  - [ ] Align with `STR * 1.0` and `INT * 1.0`
- [ ] Regen per Turn
  - [ ] Implement health/mana regeneration
- [ ] Crit Chance
  - [ ] Implement `5% + 1% * (DEX_player - DEX_target)`
- [ ] Escape Chance
  - [ ] Implement `25% + 1% * (AGI_player - AGI_fastestEnemy)`
- [ ] Elements Pipeline
  - [ ] Develop elemental offense/defense pipeline

### Milestone 3.2: Enhance Inventory & Equipment System
- [ ] Potion Slots
  - [ ] Add `potion2` slot to Equipment interface
- [ ] Update Equipment Screen
  - [ ] Display and manage `potion2` slot
- [ ] Embedded Abilities/Spells/Skills
  - [ ] Implement logic for equipped item abilities

### Milestone 3.3: Implement Advanced Combat Mechanics
- [ ] Combat Integration
  - [ ] Integrate new formulas into combat
- [ ] Environment Definition
  - [ ] Add environment property for battle nodes

## Phase 4: Polish & Testing

### Milestone 4.1: Comprehensive Testing
- [ ] API Integration Testing
- [ ] Game Mechanics Testing
- [ ] Admin Panel Testing
- [ ] UI/UX Testing

### Milestone 4.2: Performance Optimization
- [ ] API Call Optimization
- [ ] Frontend Performance

---

## Notes
- Each checkbox represents a specific task to be completed
- Tasks should be completed in order within each milestone
- Some tasks may depend on completion of previous milestones
- Regular testing should be performed after each milestone completion

milestone 2.2
The Plan
This plan outlines the steps to address the admin panel feature gaps by modifying the frontend application, broken down into subtasks.

Subtask 1: Update PlayerStats and related game logic
This subtask focuses on integrating dexterity and agility as new core player statistics across the application's frontend.

Modify src/types/game.ts:

Add dexterity: number; and agility: number; to the PlayerStats interface.
Why: To define the structure for these new core player statistics.
Modify src/utils/gameLogic.ts:

Update the createPlayer function to initialize dexterity and agility in the finalStats object, typically to a default value like 1.
Why: To ensure new players have these stats initialized correctly.
Update the applyStatIncrease function to handle dexterity and agility increases.
Why: To allow players to allocate points to these new stats during level-up.
Update the calculateDerivedStats function to include calculations based on dexterity and agility (e.g., critChance, escapeChance).
Why: To reflect the impact of these new stats on derived player attributes.
Update the canUnlockClass function to potentially include dexterity and agility in its stat checks if class requirements will use them.
Why: To ensure class unlocking logic considers these new stats.
Update the getTotalPlayerStats function to correctly aggregate dexterity and agility from base stats and equipment.
Why: To provide an accurate total for these stats.
Modify src/components/LevelUpScreen.tsx:

Add dexterity and agility to the list of stats displayed and modifiable during level-up.
Why: To allow players to allocate points to these new stats.
Modify src/components/PlayerCreation.tsx:

Update the getStatColor and getStatIcon functions to include entries for dexterity and agility.
Why: To correctly display these new stats in the character creation screen.
Modify src/components/GameplayScreen.tsx:

Update the "Stats" section to display dexterity and agility from totalStats.
Why: To show the player their current dexterity and agility values during gameplay.
Subtask 2: Implement Race Enhancements
This subtask focuses on adding new attributes to character races in the admin panel.

Modify src/types/game.ts:

In the Race interface, add elementalOffense?: Partial<Record<Element, number>>;, elementalDefense?: Partial<Record<Element, number>>;, and innateAbility?: string;.
Why: To define the structure for new race-specific attributes.
Modify src/components/AdminRaces.tsx:

Add input fields for elementalOffense and elementalDefense. This will involve a section for each element (Light, Fire, Water, Earth, Air, Dark, Neutral) with a numeric input for mastery.
Why: To allow administrators to define elemental affinities for races.
Add a text input field for innateAbility.
Why: To allow administrators to define a unique ability for each race.
Update the handleSave function to correctly capture and store these new properties in the raceStats state and pass them to onCreateRace or onUpdateRace.
Why: To persist the new race data.
Update the display section to show the new elementalOffense, elementalDefense, and innateAbility values for each race.
Why: To visualize the configured race properties.
Subtask 3: Implement Class Enhancements
This subtask focuses on adding new attributes to character classes in the admin panel.

Modify src/types/game.ts:

In the ClassDefinition interface, add raceRestrictions?: string[]; and startingAction?: string;.
Why: To define the structure for new class-specific attributes.
Modify src/components/AdminClasses.tsx:

Add a multi-select input (using SearchableSelect) for raceRestrictions. The options should be derived from gameData.races.
Why: To allow administrators to restrict classes to specific races.
Add a text input field for startingAction.
Why: To define an initial action for characters of this class.
Update the handleSave function to correctly capture and store these new properties in the classData state and pass them to onCreateClass or onUpdateClass.
Why: To persist the new class data.
Update the display section to show the new raceRestrictions and startingAction values for each class.
Why: To visualize the configured class properties.
Subtask 4: Implement Item Enhancements
This subtask focuses on adding new attributes to items in the admin panel.

Modify src/types/game.ts:

In the Item interface, add elementalBonuses?: Partial<Record<Element, number>>; and embeddedAbilities?: string[];.
Why: To define the structure for new item-specific attributes.
Modify src/components/AdminItems.tsx:

Add input fields for elementalBonuses. This will involve a section for each element with a numeric input for the bonus.
Why: To allow administrators to define elemental bonuses for items.
Add a multi-select input (using SearchableSelect) for embeddedAbilities. The options should be derived from gameData.spells and gameData.skills.
Why: To allow administrators to link spells or skills to items.
Ensure the existing effects field can accommodate temporary/permanent potion effects by providing clear labels or tooltips in the UI.
Why: To clarify the usage of item effects for potions.
Update the handleSave function to correctly capture and store these new properties in the itemData state and pass them to onCreateItem or onUpdateItem.
Why: To persist the new item data.
Update the display section to show the new elementalBonuses and embeddedAbilities values for each item.
Why: To visualize the configured item properties.
Subtask 5: Implement Monster Enhancements
This subtask focuses on enhancing monster gold drops in the admin panel.

Modify src/types/game.ts:

In the Monster interface's dropTable property, change gold: number; to minGold: number; and maxGold: number;.
Why: To allow defining a range for gold drops.
Modify src/components/AdminMonsters.tsx:

Modify the gold drop section to include two number input fields: one for minGold and one for maxGold.
Why: To allow administrators to specify a range for gold drops.
Update the handleSave function to correctly capture and store these new properties in the monsterData state and pass them to onCreateMonster or onUpdateMonster.
Why: To persist the new monster data.
Update the display section to show the minGold and maxGold range for each monster.
Why: To visualize the configured monster properties.
Subtask 6: Implement Villain Enhancements
This subtask focuses on adding equipped item slots for villains in the admin panel.

Modify src/types/game.ts:

In the Villain interface, add equippedSlots?: Equipment;.
Why: To define the structure for equipped items on villains.
Modify src/components/AdminVillains.tsx:

Add UI elements to manage equippedSlots. This could be a series of dropdowns or searchable selects, one for each equipment slot (e.g., mainWeapon, head, body, etc.), allowing selection of item IDs.
Why: To allow administrators to equip villains with specific items.
Update the handleSave function to correctly capture and store these new properties in the villainData state and pass them to onCreateVillain or onUpdateVillain.
Why: To persist the new villain data.
Update the display section to show the equippedSlots for each villain.
Why: To visualize the configured villain properties.
Subtask 7: Implement Spell Enhancements
This subtask focuses on adding new properties to spells in the admin panel.

Modify src/types/game.ts:

In the Spell interface, add aoe?: boolean;, dot?: boolean;, elementalRestriction?: Partial<Record<Element, number>>;, and summonConfig?: { summonId: string; duration: number; };.
Why: To define the structure for new spell properties.
Modify src/components/AdminSpells.tsx:

Add checkbox inputs for aoe and dot.
Why: To specify if a spell has Area of Effect or Damage over Time properties.
Add input fields for elementalRestriction. This will involve a section for each element with a numeric input for the restriction level.
Why: To define elemental restrictions for spells.
Add input fields for summonConfig (e.g., a searchable select for summonId (referencing monster/villain IDs) and a number input for duration).
Why: To configure summon spells.
Update the handleSave function to correctly capture and store these new properties in the spellData state and pass them to onCreateSpell or onUpdateSpell.
Why: To persist the new spell data.
Update the display section to show the new aoe, dot, elementalRestriction, and summonConfig values for each spell.
Why: To visualize the configured spell properties.
Subtask 8: Implement Skill Enhancements
This subtask focuses on adding new properties to skills in the admin panel.

Modify src/types/game.ts:

In the Skill interface, add cooldown?: number; and optionalElements?: Element[];.
Why: To define the structure for new skill properties.
Modify src/components/AdminSkills.tsx:

Add a number input field for cooldown.
Why: To define a cooldown period for active skills.
Add a multi-select input (using SearchableSelect) for optionalElements.
Why: To allow skills to have optional elemental affinities.
Update the handleSave function to correctly capture and store these new properties in the skillData state and pass them to onCreateSkill or onUpdateSkill.
Why: To persist the new skill data.
Update the display section to show the new cooldown and optionalElements values for each skill.
Why: To visualize the configured skill properties.
Subtask 9: Enhance Story Validation Highlighting
This subtask focuses on improving the visual feedback for story node validation in the admin panel.

Modify src/components/AdminStories.tsx:
Enhance the getNodeIssues function to check for new validation rules related to the newly added fields (e.g., if a combat node has a monster selected, if a shop node has a shop selected).
Why: To provide more comprehensive validation for story nodes.
Update the renderStoryTree function and the node list rendering to visually highlight nodes that fail these new validation checks (e.g., using different border colors, icons, or text).
Why: To make it easier for administrators to identify and fix issues in their stories.