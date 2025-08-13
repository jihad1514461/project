import { GameData } from '../types/game';

export const initialGameData: GameData = {
  "classes": {
    "warrior": {
      "id": "warrior",
      "name": "Warrior",
      "tier": 0,
      "baseStats": {
        "strength": 3,
        "magic": 0,
        "vitality": 2,
        "intelligence": 1,
        "reputation": 1,
        "gold": 50
      },
      "elementalRequirements": [
        "Neutral"
      ],
      "reputation": 1,
      "gold": 50,
      "description": "A brave fighter skilled in melee combat and physical prowess",
      "maxLevel": 20,
      "canChangeTo": [
        "knight",
        "barbarian"
      ]
    },
    "mage": {
      "id": "mage",
      "name": "Mage",
      "tier": 0,
      "baseStats": {
        "strength": 0,
        "magic": 3,
        "vitality": 1,
        "intelligence": 3,
        "reputation": 1,
        "gold": 100
      },
      "elementalRequirements": [
        "Fire",
        "Water",
        "Air"
      ],
      "reputation": 1,
      "gold": 100,
      "description": "A scholar of arcane magic and elemental forces",
      "maxLevel": 20,
      "canChangeTo": [
        "archmage",
        "elementalist"
      ]
    },
    "rogue": {
      "id": "rogue",
      "name": "Rogue",
      "tier": 0,
      "baseStats": {
        "strength": 1,
        "magic": 1,
        "vitality": 1,
        "intelligence": 2,
        "reputation": 0,
        "gold": 75
      },
      "elementalRequirements": [
        "Dark",
        "Neutral"
      ],
      "reputation": 0,
      "gold": 75,
      "description": "A stealthy character who relies on cunning and agility",
      "maxLevel": 20,
      "canChangeTo": [
        "assassin",
        "shadowdancer"
      ]
    },
    "cleric": {
      "id": "cleric",
      "name": "Cleric",
      "tier": 0,
      "baseStats": {
        "strength": 1,
        "magic": 2,
        "vitality": 2,
        "intelligence": 2,
        "reputation": 2,
        "gold": 60
      },
      "elementalRequirements": [
        "Light"
      ],
      "reputation": 2,
      "gold": 60,
      "description": "A divine healer who channels the power of light",
      "maxLevel": 20,
      "canChangeTo": [
        "paladin",
        "priest"
      ]
    },
    "knight": {
      "id": "knight",
      "name": "Knight",
      "tier": 1,
      "baseStats": {
        "strength": 4,
        "magic": 0,
        "vitality": 3,
        "intelligence": 1,
        "reputation": 2,
        "gold": 0
      },
      "elementalRequirements": [
        "Light"
      ],
      "reputation": 2,
      "gold": 0,
      "description": "A noble warrior dedicated to honor and protection",
      "maxLevel": 40
    },
    "archmage": {
      "id": "archmage",
      "name": "Archmage",
      "tier": 1,
      "baseStats": {
        "strength": 0,
        "magic": 5,
        "vitality": 1,
        "intelligence": 4,
        "reputation": 2,
        "gold": 0
      },
      "elementalRequirements": [
        "Fire",
        "Water",
        "Air",
        "Earth"
      ],
      "reputation": 2,
      "gold": 0,
      "description": "A master of all elemental magics and ancient knowledge",
      "maxLevel": 40
    }
  },
  "classRequirements": {
    "knight": {
      "requiredStats": {
        "strength": 3,
        "vitality": 2,
        "reputation": 1
      },
      "requiredLevel": 20,
      "requiredElements": [
        "Light"
      ],
      "description": "A noble warrior dedicated to honor and protection"
    },
    "archmage": {
      "requiredStats": {
        "magic": 4,
        "intelligence": 3,
        "reputation": 2
      },
      "requiredLevel": 20,
      "requiredElements": [
        "Fire",
        "Water",
        "Air",
        "Earth"
      ],
      "description": "A master of all elemental magics and ancient knowledge"
    }
  },
  "items": {
    "iron_sword": {
      "id": "iron_sword",
      "name": "Iron Sword",
      "type": "weapon",
      "subType": "main_weapon",
      "description": "A sturdy iron blade that increases your combat prowess",
      "effects": {
        "strength": 2
      },
      "value": 100,
      "sellValue": 50,
      "rarity": "common",
      "element": "Neutral"
    },
    "fire_staff": {
      "id": "fire_staff",
      "name": "Fire Staff",
      "type": "weapon",
      "subType": "main_weapon",
      "description": "A mystical staff that channels fire magic",
      "effects": {
        "magic": 2,
        "intelligence": 1
      },
      "value": 120,
      "sellValue": 60,
      "rarity": "common",
      "element": "Fire"
    },
    "scholar_robes": {
      "id": "scholar_robes",
      "name": "Scholar's Robes",
      "type": "armor",
      "subType": "body",
      "description": "Robes worn by learned scholars, enhancing mental capabilities",
      "effects": {
        "intelligence": 2,
        "magic": 1
      },
      "value": 80,
      "sellValue": 40,
      "rarity": "common",
      "element": "Neutral"
    },
    "health_potion": {
      "id": "health_potion",
      "name": "Health Potion",
      "type": "consumable",
      "subType": "potion",
      "description": "Restores 3 hearts when consumed",
      "effects": {
        "hearts": 3
      },
      "value": 50,
      "sellValue": 25,
      "stackable": true,
      "quantity": 1,
      "rarity": "common"
    },
    "mana_potion": {
      "id": "mana_potion",
      "name": "Mana Potion",
      "type": "consumable",
      "subType": "potion",
      "description": "Restores mana based on your magic stat",
      "effects": {
        "mana": 5
      },
      "value": 60,
      "sellValue": 30,
      "stackable": true,
      "quantity": 1,
      "rarity": "common"
    },
    "gold_ring": {
      "id": "gold_ring",
      "name": "Golden Ring",
      "type": "accessory",
      "subType": "ring",
      "description": "A valuable ring that increases your wealth and reputation",
      "effects": {
        "gold": 25,
        "reputation": 1
      },
      "value": 200,
      "sellValue": 100,
      "rarity": "uncommon"
    }
  },
  "shops": {
    "town_general": {
      "id": "town_general",
      "name": "General Store",
      "categories": [
        "weapons",
        "armor",
        "potions"
      ],
      "buyMultiplier": 1,
      "sellMultiplier": 0.5,
      "items": [
        {
          "id": "health_potion",
          "name": "Health Potion",
          "type": "consumable",
          "subType": "potion",
          "description": "Restores 3 hearts when consumed",
          "effects": {
            "hearts": 3
          },
          "value": 50,
          "sellValue": 25,
          "stackable": true,
          "quantity": 1,
          "rarity": "common",
          "stock": 10,
          "category": "potions"
        },
        {
          "id": "mana_potion",
          "name": "Mana Potion",
          "type": "consumable",
          "subType": "potion",
          "description": "Restores mana based on your magic stat",
          "effects": {
            "mana": 5
          },
          "value": 60,
          "sellValue": 30,
          "stackable": true,
          "quantity": 1,
          "rarity": "common",
          "stock": 8,
          "category": "potions"
        }
      ]
    },
    "magic_emporium": {
      "id": "magic_emporium",
      "name": "Magic Emporium",
      "categories": [
        "weapons",
        "armor",
        "accessories"
      ],
      "buyMultiplier": 1.2,
      "sellMultiplier": 0.6,
      "items": [
        {
          "id": "fire_staff",
          "name": "Fire Staff",
          "type": "weapon",
          "subType": "main_weapon",
          "description": "A mystical staff that channels fire magic",
          "effects": {
            "magic": 2,
            "intelligence": 1
          },
          "value": 120,
          "sellValue": 60,
          "rarity": "common",
          "element": "Fire",
          "stock": 3,
          "category": "weapons"
        },
        {
          "id": "scholar_robes",
          "name": "Scholar's Robes",
          "type": "armor",
          "subType": "body",
          "description": "Robes worn by learned scholars",
          "effects": {
            "intelligence": 2,
            "magic": 1
          },
          "value": 80,
          "sellValue": 40,
          "rarity": "common",
          "stock": 5,
          "category": "armor"
        }
      ]
    }
  },
  "spells": {
    "fireball": {
      "id": "fireball",
      "name": "Fireball",
      "type": "Attack",
      "description": "Launches a ball of fire at the enemy",
      "manaCost": 3,
      "power": 15,
      "element": "Fire",
      "requirements": {
        "level": 1,
        "stats": {
          "magic": 2,
          "intelligence": 1
        },
        "classes": [
          "mage",
          "archmage"
        ]
      }
    },
    "heal": {
      "id": "heal",
      "name": "Heal",
      "type": "Heal",
      "description": "Restores health to the caster",
      "manaCost": 2,
      "power": 10,
      "element": "Light",
      "requirements": {
        "level": 1,
        "stats": {
          "magic": 1,
          "intelligence": 1
        }
      }
    },
    "magic_missile": {
      "id": "magic_missile",
      "name": "Magic Missile",
      "type": "Attack",
      "description": "A reliable magical projectile that never misses",
      "manaCost": 2,
      "power": 8,
      "element": "Neutral",
      "requirements": {
        "level": 1,
        "stats": {
          "magic": 1,
          "intelligence": 2
        }
      }
    },
    "shield": {
      "id": "shield",
      "name": "Magical Shield",
      "type": "Defend",
      "description": "Creates a protective barrier that reduces incoming damage",
      "manaCost": 3,
      "power": 12,
      "element": "Neutral",
      "requirements": {
        "level": 3,
        "stats": {
          "magic": 2,
          "intelligence": 2
        }
      }
    }
  },
  "skills": {
    "sword_mastery": {
      "id": "sword_mastery",
      "name": "Sword Mastery",
      "description": "Increases strength when wielding swords",
      "type": "passive",
      "effects": {
        "strength": 2
      },
      "requirements": {
        "level": 5,
        "stats": {
          "strength": 3
        },
        "classes": [
          "warrior",
          "knight"
        ]
      }
    },
    "arcane_knowledge": {
      "id": "arcane_knowledge",
      "name": "Arcane Knowledge",
      "description": "Deep understanding of magic increases intelligence and magical power",
      "type": "passive",
      "effects": {
        "intelligence": 2,
        "magic": 1
      },
      "requirements": {
        "level": 5,
        "stats": {
          "intelligence": 3,
          "magic": 2
        },
        "classes": [
          "mage",
          "archmage"
        ]
      }
    },
    "noble_presence": {
      "id": "noble_presence",
      "name": "Noble Presence",
      "description": "Your reputation and wealth grow through noble bearing",
      "type": "passive",
      "effects": {
        "reputation": 2,
        "gold": 50
      },
      "requirements": {
        "level": 10,
        "stats": {
          "reputation": 3
        }
      }
    },
    "vitality_boost": {
      "id": "vitality_boost",
      "name": "Vitality Boost",
      "description": "Increases your vitality and maximum health",
      "type": "passive",
      "effects": {
        "vitality": 1,
        "maxHearts": 2
      },
      "requirements": {
        "level": 8,
        "stats": {
          "vitality": 4
        }
      }
    }
  },
  "monsters": {
    "goblin": {
      "id": "goblin",
      "name": "Goblin",
      "description": "A small, green-skinned creature with sharp claws and cunning eyes",
      "stats": {
        "health": 25,
        "attack": 8,
        "defense": 3,
        "mana": 5
      },
      "element": "Earth",
      "spells": [
        "claw_attack"
      ],
      "ai": {
        "threatThreshold": 30,
        "elementalPreference": true,
        "resourceThreshold": 20
      },
      "dropTable": {
        "items": [
          {
            "itemId": "health_potion",
            "chance": 0.3,
            "quantity": 1
          },
          {
            "itemId": "gold_coins",
            "chance": 0.6,
            "quantity": 15
          }
        ],
        "equipment": [
          {
            "itemId": "iron_sword",
            "chance": 0.1
          }
        ]
      },
      "classRewards": [
        {
          "className": "warrior",
          "bonusXP": 10,
          "bonusReputation": 1
        },
        {
          "className": "all",
          "bonusXP": 5
        }
      ],
      "spellUnlocks": []
    },
    "orc_warrior": {
      "id": "orc_warrior",
      "name": "Orc Warrior",
      "description": "A brutish orc wielding crude weapons but possessing great strength",
      "stats": {
        "health": 45,
        "attack": 15,
        "defense": 8,
        "mana": 10
      },
      "element": "Fire",
      "spells": [
        "rage_strike"
      ],
      "ai": {
        "threatThreshold": 40,
        "elementalPreference": true,
        "resourceThreshold": 25
      },
      "dropTable": {
        "items": [
          {
            "itemId": "health_potion",
            "chance": 0.4,
            "quantity": 2
          },
          {
            "itemId": "gold_coins",
            "chance": 0.7,
            "quantity": 25
          }
        ],
        "equipment": [
          {
            "itemId": "iron_sword",
            "chance": 0.2
          }
        ]
      },
      "classRewards": [
        {
          "className": "warrior",
          "bonusXP": 15,
          "bonusReputation": 1
        },
        {
          "className": "knight",
          "bonusXP": 20,
          "bonusReputation": 2
        },
        {
          "className": "all",
          "bonusXP": 8
        }
      ],
      "spellUnlocks": []
    }
  },
  "villains": {
    "dark_lord": {
      "id": "dark_lord",
      "name": "Dark Lord Malachar",
      "description": "An ancient evil that threatens the realm with dark magic",
      "backstory": "Once a noble king, corrupted by dark magic and an insatiable thirst for power",
      "stats": {
        "health": 200,
        "attack": 25,
        "defense": 15,
        "mana": 50
      },
      "element": "Dark",
      "spells": [
        "dark_bolt",
        "shadow_shield",
        "drain_life"
      ],
      "weaknesses": [
        "Light"
      ],
      "immunities": [
        "Dark"
      ],
      "ai": {
        "threatThreshold": 50,
        "elementalPreference": true,
        "resourceThreshold": 30
      },
      "dropTable": {
        "items": [
          {
            "itemId": "legendary_gem",
            "chance": 1,
            "quantity": 1
          },
          {
            "itemId": "gold_coins",
            "chance": 1,
            "quantity": 500
          }
        ],
        "equipment": [
          {
            "itemId": "dark_sword",
            "chance": 0.8
          }
        ]
      },
      "classRewards": [
        {
          "className": "knight",
          "bonusXP": 100,
          "bonusReputation": 10
        },
        {
          "className": "cleric",
          "bonusXP": 120,
          "bonusReputation": 15
        },
        {
          "className": "all",
          "bonusXP": 75,
          "bonusReputation": 5
        }
      ],
      "spellUnlocks": [
        "holy_light",
        "divine_protection"
      ]
    }
  },
  "races": {
    "Human": {
      "strength": 1,
      "intelligence": 1,
      "magic": 1,
      "vitality": 1,
      "dexterity": 1,
      "agility": 1,
      "luck": 1,
      "charm": 1,
      "reputation": 1,
      "gold": 25
    },
    "Elf": {
      "strength": 0,
      "intelligence": 2,
      "magic": 2,
      "vitality": 0,
      "dexterity": 2,
      "agility": 1,
      "luck": 1,
      "charm": 2,
      "reputation": 1,
      "gold": 50
    },
    "Dwarf": {
      "strength": 2,
      "intelligence": 0,
      "magic": 0,
      "vitality": 2,
      "dexterity": 0,
      "agility": 0,
      "luck": 0,
      "charm": 0,
      "reputation": 1,
      "gold": 75
    },
    "Halfling": {
      "strength": 0,
      "intelligence": 1,
      "magic": 1,
      "vitality": 1,
      "dexterity": 1,
      "agility": 2,
      "luck": 2,
      "charm": 1,
      "reputation": 2,
      "gold": 40
    },
    "Orc": {
      "strength": 3,
      "intelligence": 0,
      "magic": 0,
      "vitality": 2,
      "dexterity": 0,
      "agility": 1,
      "luck": 0,
      "charm": 0,
      "reputation": 0,
      "gold": 30
    },
    "High Elf": {
      "strength": 0,
      "intelligence": 3,
      "magic": 3,
      "vitality": 0,
      "dexterity": 1,
      "agility": 1,
      "luck": 1,
      "charm": 3,
      "reputation": 2,
      "gold": 100
    }
  },
  "stories": {
    "The Cursed Forest": {
      "intro": {
        "id": "intro",
        "title": "Forest Entrance",
        "text": "Welcome, {player_name} the {player_race} {player_class}. You stand at the edge of the legendary Cursed Forest, where ancient magics and forgotten treasures await those brave enough to venture forth. Your stats are: Strength {strength}, Intelligence {intelligence}, Magic {magic}, Vitality {vitality}, Gold {gold}, Reputation {reputation}.",
        "type": "story",
        "tags": [
          "forest",
          "beginning"
        ],
        "battle": false,
        "choices": [
          {
            "text": "battle",
            "next_node": "battle1",
            "effects": {},
            "require": {}
          }
        ]
      },
      "end1": {
        "id": "",
        "title": "end1",
        "text": "end1",
        "type": "ending",
        "tags": [],
        "battle": false,
        "choices": [
          {
            "text": "start",
            "next_node": "intro",
            "effects": {},
            "require": {}
          }
        ],
        "is_ending": true,
        "monster": "",
        "shop": {
          "shopId": "",
          "categories": []
        }
      },
      "end2": {
        "id": "",
        "title": "end2",
        "text": "end2",
        "type": "ending",
        "tags": [],
        "battle": false,
        "choices": [],
        "is_ending": true,
        "monster": "",
        "shop": {
          "shopId": "",
          "categories": []
        }
      },
      "battle1": {
        "id": "",
        "title": "battle1",
        "text": "",
        "type": "combat",
        "tags": [],
        "battle": true,
        "choices": [
          {
            "text": "Victory! Continue your journey.",
            "next_node": "battlereward",
            "effects": {
              "xp": 50,
              "reputation": 1
            },
            "require": {
              "battleResult": "win"
            }
          },
          {
            "text": "Defeat... retreat and regroup.",
            "next_node": "end1",
            "effects": {
              "hearts": -1
            },
            "require": {
              "battleResult": "lose"
            }
          },
          {
            "text": "Escape from the battle.",
            "next_node": "end2",
            "effects": {
              "reputation": -1
            },
            "require": {
              "battleResult": "escape"
            }
          }
        ],
        "is_ending": false,
        "monster": "goblin",
        "shop": {
          "shopId": "",
          "categories": []
        }
      },
      "shop": {
        "id": "",
        "title": "shop",
        "text": "buy",
        "type": "shop",
        "tags": [],
        "battle": false,
        "choices": [
          {
            "text": "start again",
            "next_node": "intro",
            "effects": {},
            "require": {}
          }
        ],
        "is_ending": false,
        "monster": "",
        "shop": {
          "shopId": "magic_emporium",
          "categories": []
        }
      },
      "battlereward": {
        "id": "",
        "title": "battlereward",
        "text": "battlereward",
        "type": "choice",
        "tags": [],
        "battle": false,
        "choices": [
          {
            "text": "you won the battle",
            "next_node": "shop",
            "effects": {
              "xp": 100
            },
            "require": {},
            "itemRewards": [
              "iron_sword",
              "fire_staff"
            ]
          }
        ],
        "is_ending": false,
        "monster": "",
        "shop": {
          "shopId": "",
          "categories": []
        }
      }
    },
    "The Ancient Academy": {
      "intro": {
        "id": "intro",
        "title": "Academy Gates",
        "text": "You approach the towering gates of the Ancient Academy, a place of learning where scholars and mages have studied for centuries. The stone walls are covered with glowing runes, and you can feel the weight of accumulated knowledge pressing against your consciousness.",
        "type": "story",
        "tags": [
          "academy",
          "magic",
          "knowledge"
        ],
        "battle": false,
        "choices": [
          {
            "text": "Present yourself as a warrior seeking training",
            "next_node": "warrior_path",
            "effects": {
              "xp": 10
            },
            "require": {
              "strength": 2
            }
          },
          {
            "text": "Request entry as a scholar",
            "next_node": "scholar_path",
            "effects": {
              "xp": 15,
              "intelligence": 1
            },
            "require": {
              "intelligence": 3
            }
          },
          {
            "text": "Demonstrate your magical abilities",
            "next_node": "mage_path",
            "effects": {
              "xp": 20,
              "magic": 1
            },
            "require": {
              "magic": 2
            }
          }
        ]
      },
      "scholar_path": {
        "id": "scholar_path",
        "title": "The Great Library",
        "text": "The academy librarian, impressed by your intellectual prowess, grants you access to the Great Library. Ancient tomes line the walls from floor to ceiling, containing knowledge accumulated over millennia. As you study, your mind expands with newfound wisdom.",
        "type": "story",
        "tags": [
          "library",
          "knowledge",
          "study"
        ],
        "battle": false,
        "choices": [
          {
            "text": "Study combat techniques and strategy",
            "next_node": "tactical_study",
            "effects": {
              "xp": 25,
              "intelligence": 2,
              "strength": 1
            }
          },
          {
            "text": "Delve into magical theory and spellcraft",
            "next_node": "magical_study",
            "effects": {
              "xp": 30,
              "intelligence": 1,
              "magic": 2
            }
          },
          {
            "text": "Research the history of the realm",
            "next_node": "historical_study",
            "effects": {
              "xp": 20,
              "intelligence": 2,
              "reputation": 2,
              "gold": 100
            }
          }
        ]
      }
    }
  }
};
