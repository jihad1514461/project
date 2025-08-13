
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