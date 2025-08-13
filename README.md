# RPG Text Adventure Game

A comprehensive text-based RPG game with advanced admin panel, turn-based combat, and persistent data management.

## Features

### Game Features
- **Character Creation**: Create heroes with different races and classes
- **Multi-Class System**: Unlock additional classes every 20 levels based on elemental requirements
- **Elemental System**: Classes require specific elements (Light, Fire, Water, Earth, Air, Dark, Neutral)
- **Fibonacci XP Progression**: XP requirements follow Fibonacci(n) × 10 formula
- **Turn-Based Combat**: Strategic combat with Attack, Defend, and Spell casting
- **Spell & Skill System**: Learn new abilities every 5 levels
- **Story Adventures**: Multiple branching storylines with choices and consequences
- **Equipment System**: Equip weapons, armor, and accessories with elemental properties
- **Inventory Management**: Collect and use items throughout your journey
- **Shop System**: Buy and sell items with dynamic pricing and categories

### Admin Features (Password: 123456)
- **Complete CRUD Management**: Full Create, Read, Update, Delete for all game entities
- **Class Management**: Define classes with elemental requirements, tier system, and stat bonuses
- **Race Management**: Create character races with unique stat bonuses
- **Item Management**: Design weapons, armor, consumables with elemental properties and effects
- **Shop Management**: Configure shops with categories, stock, and pricing
- **Spell & Skill Management**: Create spells and skills with requirements and effects
- **Monster & Villain Management**: Design enemies with AI behavior, drop tables, and rewards
- **Story Editor**: Create complex branching narratives with multiple node types
- **Search & Autocomplete**: Searchable dropdowns for all entity references
- **Data Export**: Export all game data to update the gameData.ts file

### Combat System
- **Turn-Based Strategy**: Player and monster take turns choosing actions
- **Monster AI**: Intelligent enemy behavior based on threat assessment and elemental advantages
- **Spell Casting**: Use mana to cast Attack, Defend, or Heal spells
- **Elemental Interactions**: Elements provide advantages and disadvantages in combat
- **Loot System**: Monsters drop items and equipment based on configurable drop tables
- **Class Rewards**: Bonus XP and reputation for specific classes defeating certain monsters

### Data Persistence
The game uses a hybrid approach for data persistence:

1. **Player Data**: Saved in browser localStorage (character progress, inventory, etc.)
2. **Game Data**: All CRUD operations are designed to be saved back to `src/data/gameData.ts`

### Updating Game Data
When you make changes in the admin interface:
1. Use the **Export Data** button in the admin panel
2. Copy the generated TypeScript code
3. Paste it into `src/data/gameData.ts` to make changes permanent
4. Alternatively, use the **Download** button to get a `gameData.ts` file

## Navigation
- **Global Home Button**: Available on all screens (except start and auth) in the top-right corner
- **Contextual Back Buttons**: Navigate between related screens
- **Persistent UI**: The home button is always accessible for quick navigation

## Game Mechanics

### Level Progression
- **XP Formula**: Fibonacci(level) × 10 XP required for each level
- **Level Up Rewards**: Gain stat points and unlock new abilities
- **Spell/Skill Choice**: Every 5 levels, choose a new spell or skill
- **Class Changes**: Every 20 levels, unlock new class options based on stats and elements

### Elemental System
Classes have elemental requirements that must be met:
- **Light**: Holy and divine magic
- **Fire**: Destructive and passionate magic
- **Water**: Healing and adaptive magic
- **Earth**: Defensive and sturdy magic
- **Air**: Swift and ethereal magic
- **Dark**: Shadow and forbidden magic
- **Neutral**: Balanced, no elemental affinity

### Combat Mechanics
- **Health & Mana**: Track both physical and magical resources
- **Action Types**: Attack (physical), Defend (reduce damage), Spell (magical)
- **AI Behavior**: Monsters use threat assessment and elemental preferences
- **Victory Rewards**: XP, items, equipment, and class-specific bonuses

## Admin Panel Structure

### Authentication
- Simple password protection (123456)
- Access to all administrative functions

### Entity Management
1. **Classes**: Base stats, elemental requirements, tier system
2. **Races**: Stat bonuses for character creation
3. **Items**: Weapons, armor, consumables with effects and requirements
4. **Shops**: Categorized item stores with pricing
5. **Spells**: Magical abilities with mana costs and effects
6. **Skills**: Passive and active abilities
7. **Monsters**: Combat enemies with AI and loot tables
8. **Villains**: Elite enemies with backstories and special properties
9. **Stories**: Branching narrative nodes with multiple types

### Story Node Types
- **Story**: Narrative text with choices
- **Combat**: Battle encounters with specific monsters
- **Shop**: Shopping interfaces with category filters
- **Choice**: Decision points with consequences
- **Ending**: Story conclusion nodes

### Search & Autocomplete
All entity reference fields include searchable dropdowns with:
- Name-based filtering
- ID-based searching
- Real-time suggestions
- Multi-select for arrays

## Technical Architecture

### File Structure
- **Game Logic** (`src/utils/gameLogic.ts`)
- **Data Management** (`src/utils/gameDataManager.ts`)
- **UI Components** (`src/components/`)
- **Type Definitions** (`src/types/game.ts`)
- **Initial Data** (`src/data/gameData.ts`)

### Component Organization
- **Admin Components**: Full CRUD interfaces for each entity type
- **Game Components**: Player-facing interfaces for gameplay
- **Shared Components**: Reusable UI elements like SearchableSelect
- **Combat System**: Turn-based battle interface with AI

### Data Flow
1. Admin makes changes through CRUD interfaces
2. Changes update in-memory game state
3. Export functionality generates new gameData.ts content
4. Player actions use current game state
5. Player progress saved to localStorage

## Getting Started

### For Players
1. **Start Adventure**: Create a character and begin your journey
2. **Choose Wisely**: Select race and class based on desired playstyle
3. **Explore Stories**: Navigate branching narratives with meaningful choices
4. **Combat Strategy**: Use spells, skills, and tactics to defeat enemies
5. **Character Growth**: Level up, learn abilities, and unlock new classes

### For Game Masters
1. **Admin Access**: Use password "123456" to access admin panel
2. **Create Content**: Design classes, races, items, spells, and stories
3. **Balance Gameplay**: Set appropriate requirements and rewards
4. **Export Changes**: Use export tools to save your customizations
5. **Test & Iterate**: Play through your content to ensure quality

## Development Notes

### Extensibility
The system is designed for easy extension:
- Add new elemental types by updating the Element type
- Create new item types by extending the Item interface
- Implement new combat mechanics through the CombatState system
- Add new story node types for different gameplay mechanics

### Performance Considerations
- In-memory data management for fast access
- Efficient search algorithms for autocomplete
- Optimized rendering for large data sets
- Lazy loading for complex admin interfaces

### Future Enhancements
- Hashed password authentication
- SQLite or other database integration
- Multiplayer capabilities
- Advanced AI behaviors
- Visual combat representations
- Sound and music integration

This architecture provides a solid foundation for a comprehensive RPG system that can grow and evolve with your creative vision.