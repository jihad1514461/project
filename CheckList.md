
# RPG Game Implementation Plan - Checklist

## Phase 1: Core API Integration

### Milestone 1.1: Setup API Service Layer
- [ ] Create API Directory (`project/src/api`)
- [ ] Define API Client (`project/src/api/apiClient.ts`)
  - [ ] Set up fetch-based client
  - [ ] Handle base URL configuration
  - [ ] Implement basic error handling
- [ ] Create Player Service (`project/src/api/playerService.ts`)
  - [ ] `createPlayer(playerData)`: `POST /players`
  - [ ] `getPlayer(playerId)`: `GET /players/:id`
  - [ ] `updatePlayer(playerId, updates)`: `PUT /players/:id`
- [ ] Create Game Data Service (`project/src/api/gameDataService.ts`)
  - [ ] `fetchGameData()`: `GET /api/gameData`
  - [ ] `updateClass(classId, data)`: `PUT /api/classes/:id`
  - [ ] `createItem(data)`: `POST /api/items`
  - [ ] Similar functions for all game entities
- [ ] Export Services (`project/src/api/index.ts`)

### Milestone 1.2: Player Data API Integration
- [ ] Load Player Data (modify `project/src/App.tsx`)
  - [ ] Use `playerService.getPlayer()` on mount
  - [ ] Implement playerId storage mechanism
- [ ] New Game Flow (update `project/src/components/PlayerCreation.tsx`)
  - [ ] Call `playerService.createPlayer()`
  - [ ] Update player state from backend response
- [ ] Update Player Data (refactor `project/src/App.tsx`)
  - [ ] `handleMakeChoice` → `playerService.updatePlayer()`
  - [ ] `handleApplyLevelUp` → `playerService.updatePlayer()`
  - [ ] `handleSelectClass` → `playerService.updatePlayer()`
  - [ ] `handleUseItem` → `playerService.updatePlayer()`
  - [ ] `handleEquipItem` → `playerService.updatePlayer()`
  - [ ] `handleUnequipItem` → `playerService.updatePlayer()`
  - [ ] `handleBuyItem` → `playerService.updatePlayer()`
  - [ ] `handleSellItem` → `playerService.updatePlayer()`
  - [ ] `handleCombatEnd` → `playerService.updatePlayer()`
- [ ] Remove Local Player Persistence
  - [ ] Remove localStorage calls for player data

### Milestone 1.3: Game Data API Integration (Read Operations)
- [ ] Fetch Initial Game Data (modify `project/src/App.tsx`)
  - [ ] Use `gameDataService.fetchGameData()`
  - [ ] Remove import of `initialGameData`
- [ ] Pass Data via Props
  - [ ] Ensure all components receive gameData as props

### Milestone 1.4: Game Data API Integration (CRUD Operations)
- [ ] Update GameDataManager (`project/src/utils/gameDataManager.ts`)
  - [ ] Remove local file saving logic
  - [ ] Update all `updateX` methods to call API
- [ ] Admin Panel Integration
  - [ ] Update `AdminInterface.tsx`
  - [ ] Update all Admin components for API calls
- [ ] Re-evaluate Export/Download functionality

## Phase 2: Admin Panel Enhancements & UI/UX Improvements

### Milestone 2.1: Implement Admin Navigation Slidebar
- [ ] Modify AdminInterface Layout
  - [ ] Restructure for fixed-position sidebar
- [ ] Move Tab Navigation
  - [ ] Relocate tabs to sidebar
- [ ] Add Collapsible Functionality
  - [ ] Implement expand/collapse logic
- [ ] Ensure Responsiveness
  - [ ] Adjust CSS for different screen sizes

### Milestone 2.2: Address Admin Panel Feature Gaps
- [ ] Races (`AdminRaces.tsx`)
  - [ ] Add Elemental Offense/Defense fields
  - [ ] Add Innate Ability field
- [ ] Classes (`AdminClasses.tsx`)
  - [ ] Add Race Restrictions field
  - [ ] Add Starting Action field
- [ ] Items (`AdminItems.tsx`)
  - [ ] Add Elemental Bonuses fields
  - [ ] Add Embedded Abilities/Spells/Skills fields
  - [ ] Implement Potion Effects (temporary/permanent)
- [ ] Monsters & Villains
  - [ ] Modify Gold Drop to accept range
  - [ ] Add Equipped Slots for villains
- [ ] Spells / Skills / Abilities
  - [ ] Add AoE/DoT properties for spells
  - [ ] Add Summon Config for spells
  - [ ] Add Cooldowns for skills
  - [ ] Add Optional Elements for skills
  - [ ] Create AdminAbilities component if needed
- [ ] Stories (`AdminStories.tsx`)
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