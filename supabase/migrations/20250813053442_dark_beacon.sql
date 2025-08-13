-- Seed data for RPG Game
-- This will populate the database with initial game data

-- Insert initial classes
INSERT INTO classes (id, name, tier, baseStats, elementalRequirements, reputation, gold, description, maxLevel) VALUES
('warrior', 'Warrior', 0, '{"strength": 3, "magic": 0, "vitality": 2, "intelligence": 1, "reputation": 1, "gold": 50}', '["Neutral"]', 1, 50, 'A brave fighter skilled in melee combat and physical prowess', 20),
('mage', 'Mage', 0, '{"strength": 0, "magic": 3, "vitality": 1, "intelligence": 3, "reputation": 1, "gold": 100}', '["Fire", "Water", "Air"]', 1, 100, 'A scholar of arcane magic and elemental forces', 20),
('rogue', 'Rogue', 0, '{"strength": 1, "magic": 1, "vitality": 1, "intelligence": 2, "reputation": 0, "gold": 75}', '["Dark", "Neutral"]', 0, 75, 'A stealthy character who relies on cunning and agility', 20),
('cleric', 'Cleric', 0, '{"strength": 1, "magic": 2, "vitality": 2, "intelligence": 2, "reputation": 2, "gold": 60}', '["Light"]', 2, 60, 'A divine healer who channels the power of light', 20);

-- Insert class requirements
INSERT INTO classRequirements (id, requiredStats, requiredLevel, requiredElements, description) VALUES
('knight', '{"strength": 3, "vitality": 2, "reputation": 1}', 20, '["Light"]', 'A noble warrior dedicated to honor and protection'),
('archmage', '{"magic": 4, "intelligence": 3, "reputation": 2}', 20, '["Fire", "Water", "Air", "Earth"]', 'A master of all elemental magics and ancient knowledge');

-- Insert races
INSERT INTO races (id, name, bonuses, description) VALUES
('Human', 'Human', '{"strength": 1, "intelligence": 1, "magic": 1, "vitality": 1, "luck": 1, "charm": 1, "reputation": 1, "gold": 25}', 'Versatile and adaptable beings'),
('Elf', 'Elf', '{"strength": 0, "intelligence": 2, "magic": 2, "vitality": 0, "luck": 1, "charm": 2, "reputation": 1, "gold": 50}', 'Graceful and magical beings'),
('Dwarf', 'Dwarf', '{"strength": 2, "intelligence": 0, "magic": 0, "vitality": 2, "luck": 0, "charm": 0, "reputation": 1, "gold": 75}', 'Hardy and strong mountain folk'),
('Halfling', 'Halfling', '{"strength": 0, "intelligence": 1, "magic": 1, "vitality": 1, "luck": 2, "charm": 1, "reputation": 2, "gold": 40}', 'Small but lucky and charming');

-- Insert basic items
INSERT INTO items (id, name, type, subType, description, effects, value, sellValue, rarity, element) VALUES
('iron_sword', 'Iron Sword', 'weapon', 'main_weapon', 'A sturdy iron blade that increases your combat prowess', '{"strength": 2}', 100, 50, 'common', 'Neutral'),
('fire_staff', 'Fire Staff', 'weapon', 'main_weapon', 'A mystical staff that channels fire magic', '{"magic": 2, "intelligence": 1}', 120, 60, 'common', 'Fire'),
('health_potion', 'Health Potion', 'consumable', 'potion', 'Restores 3 hearts when consumed', '{"hearts": 3}', 50, 25, 'common', NULL);

-- Insert basic spells
INSERT INTO spells (id, name, type, description, manaCost, power, element, requirements) VALUES
('fireball', 'Fireball', 'Attack', 'Launches a ball of fire at the enemy', 3, 15, 'Fire', '{"level": 1, "stats": {"magic": 2, "intelligence": 1}, "classes": ["mage", "archmage"]}'),
('heal', 'Heal', 'Heal', 'Restores health to the caster', 2, 10, 'Light', '{"level": 1, "stats": {"magic": 1, "intelligence": 1}}');

-- Insert basic skills
INSERT INTO skills (id, name, description, type, effects, requirements) VALUES
('sword_mastery', 'Sword Mastery', 'Increases strength when wielding swords', 'passive', '{"strength": 2}', '{"level": 5, "stats": {"strength": 3}, "classes": ["warrior", "knight"]}');

-- Insert basic monster
INSERT INTO monsters (id, name, description, stats, element, spells, ai, dropTable, classRewards) VALUES
('goblin', 'Goblin', 'A small, green-skinned creature with sharp claws and cunning eyes', '{"health": 25, "attack": 8, "defense": 3, "mana": 5}', 'Earth', '["claw_attack"]', '{"threatThreshold": 30, "elementalPreference": true, "resourceThreshold": 20}', '{"items": [{"itemId": "health_potion", "chance": 0.3, "quantity": 1}], "equipment": [{"itemId": "iron_sword", "chance": 0.1}]}', '[{"className": "warrior", "bonusXP": 10, "bonusReputation": 1}, {"className": "all", "bonusXP": 5}]');