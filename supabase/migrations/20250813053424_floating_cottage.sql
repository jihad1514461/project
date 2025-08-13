-- RPG Game Database Schema
-- Run this script to create all necessary tables

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    race VARCHAR(100) NOT NULL,
    activeClass VARCHAR(100) NOT NULL,
    stats JSON NOT NULL,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    hearts INT NOT NULL,
    maxHearts INT NOT NULL,
    mana INT NOT NULL,
    maxMana INT NOT NULL,
    inventory JSON DEFAULT ('[]'),
    equipment JSON DEFAULT ('{}'),
    spells JSON DEFAULT ('[]'),
    skills JSON DEFAULT ('[]'),
    unlockedSpells JSON DEFAULT ('[]'),
    unlockedSkills JSON DEFAULT ('[]'),
    currentNode VARCHAR(255) DEFAULT 'intro',
    element VARCHAR(50) DEFAULT 'Neutral',
    classes JSON DEFAULT ('[]'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tier INT DEFAULT 0,
    baseStats JSON NOT NULL,
    elementalRequirements JSON DEFAULT ('[]'),
    reputation INT DEFAULT 0,
    gold INT DEFAULT 0,
    description TEXT,
    maxLevel INT DEFAULT 20,
    canChangeTo JSON DEFAULT ('[]'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Class Requirements table
CREATE TABLE IF NOT EXISTS classRequirements (
    id VARCHAR(100) PRIMARY KEY,
    requiredStats JSON NOT NULL,
    requiredLevel INT NOT NULL,
    requiredElements JSON DEFAULT ('[]'),
    description TEXT,
    initialEquipment JSON DEFAULT ('[]'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Races table
CREATE TABLE IF NOT EXISTS races (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bonuses JSON NOT NULL,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('weapon', 'armor', 'accessory', 'consumable', 'quest') NOT NULL,
    subType VARCHAR(50),
    description TEXT,
    effects JSON DEFAULT ('{}'),
    requirements JSON DEFAULT ('{}'),
    value INT DEFAULT 0,
    sellValue INT DEFAULT 0,
    stackable BOOLEAN DEFAULT FALSE,
    quantity INT DEFAULT 1,
    rarity ENUM('common', 'uncommon', 'rare', 'epic', 'legendary') DEFAULT 'common',
    element VARCHAR(50),
    dropChance DECIMAL(3,2) DEFAULT 0.00,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Shops table
CREATE TABLE IF NOT EXISTS shops (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    categories JSON DEFAULT ('[]'),
    items JSON DEFAULT ('[]'),
    buyMultiplier DECIMAL(3,2) DEFAULT 1.00,
    sellMultiplier DECIMAL(3,2) DEFAULT 0.50,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Spells table
CREATE TABLE IF NOT EXISTS spells (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('Attack', 'Defend', 'Heal') NOT NULL,
    description TEXT,
    manaCost INT NOT NULL,
    power INT NOT NULL,
    element VARCHAR(50),
    requirements JSON NOT NULL,
    unlockConditions JSON DEFAULT ('{}'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('passive', 'active') NOT NULL,
    effects JSON NOT NULL,
    requirements JSON NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Monsters table
CREATE TABLE IF NOT EXISTS monsters (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    stats JSON NOT NULL,
    element VARCHAR(50) NOT NULL,
    spells JSON DEFAULT ('[]'),
    ai JSON NOT NULL,
    dropTable JSON NOT NULL,
    classRewards JSON DEFAULT ('[]'),
    spellUnlocks JSON DEFAULT ('[]'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Villains table
CREATE TABLE IF NOT EXISTS villains (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    backstory TEXT,
    stats JSON NOT NULL,
    element VARCHAR(50) NOT NULL,
    spells JSON DEFAULT ('[]'),
    weaknesses JSON DEFAULT ('[]'),
    immunities JSON DEFAULT ('[]'),
    ai JSON NOT NULL,
    dropTable JSON NOT NULL,
    classRewards JSON DEFAULT ('[]'),
    spellUnlocks JSON DEFAULT ('[]'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nodes JSON NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_players_level ON players(level);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_rarity ON items(rarity);
CREATE INDEX idx_spells_type ON spells(type);
CREATE INDEX idx_skills_type ON skills(type);