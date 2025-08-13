import React, { useState, useEffect } from 'react';
import { Player, CombatState, GameData, Spell } from '../types/game';
import { Sword, Shield, Heart, Zap, ArrowLeft, Play } from 'lucide-react';

interface CombatScreenProps {
  player: Player;
  combatState: CombatState;
  gameData: GameData;
  onCombatEnd: (result: 'win' | 'lose' | 'escape', updatedPlayer: Player) => void;
  onBack: () => void;
}

export const CombatScreen: React.FC<CombatScreenProps> = ({
  player,
  combatState,
  gameData,
  onCombatEnd,
  onBack
}) => {
  const [currentCombat, setCurrentCombat] = useState<CombatState>(combatState);
  const [selectedAction, setSelectedAction] = useState<'attack' | 'defend' | 'spell' | null>(null);
  const [selectedSpell, setSelectedSpell] = useState<string>('');
  const [combatEnded, setCombatEnded] = useState(false);

  const playerSpells = player.spells
    .map(spellId => gameData.spells[spellId])
    .filter(spell => spell && player.mana >= spell.manaCost);

  const handleEscape = () => {
    if (combatEnded) return;
    
    setCombatEnded(true);
    const updatedPlayer = { ...player };
    updatedPlayer.hearts = currentCombat.player.health;
    updatedPlayer.mana = currentCombat.player.mana;
    updatedPlayer.stats.reputation = Math.max(0, updatedPlayer.stats.reputation - 1);
    
    onCombatEnd('escape', updatedPlayer);
  };
  const handleAction = (action: 'attack' | 'defend' | 'spell', spellId?: string) => {
    if (currentCombat.turn !== 'player' || combatEnded) return;

    let newCombat = { ...currentCombat };
    let damage = 0;
    let logMessage = '';

    switch (action) {
      case 'attack':
        damage = Math.floor(Math.random() * 10) + player.stats.strength;
        newCombat.monster.health = Math.max(0, newCombat.monster.health - damage);
        logMessage = `You attack for ${damage} damage!`;
        break;

      case 'defend':
        // Defending reduces incoming damage next turn
        logMessage = 'You prepare to defend!';
        break;

      case 'spell':
        if (spellId && gameData.spells[spellId]) {
          const spell = gameData.spells[spellId];
          if (player.mana >= spell.manaCost) {
            newCombat.player.mana -= spell.manaCost;
            
            if (spell.type === 'Attack') {
              damage = spell.power + Math.floor(player.stats.magic / 2);
              newCombat.monster.health = Math.max(0, newCombat.monster.health - damage);
              logMessage = `You cast ${spell.name} for ${damage} damage!`;
            } else if (spell.type === 'Heal') {
              const healing = spell.power;
              newCombat.player.health = Math.min(player.maxHearts, newCombat.player.health + healing);
              logMessage = `You cast ${spell.name} and heal for ${healing} health!`;
            } else if (spell.type === 'Defend') {
              logMessage = `You cast ${spell.name} and strengthen your defenses!`;
            }
          }
        }
        break;
    }

    newCombat.log.push(logMessage);

    // Check if monster is defeated
    if (newCombat.monster.health <= 0) {
      newCombat.log.push(`${newCombat.monster.data.name} is defeated!`);
      setCombatEnded(true);
      const updatedPlayer = { ...player };
      updatedPlayer.hearts = newCombat.player.health;
      updatedPlayer.mana = newCombat.player.mana;
      onCombatEnd('win', updatedPlayer);
      return;
    }

    // Monster turn
    newCombat.turn = 'monster';
    setCurrentCombat(newCombat);

    // AI decision making
    setTimeout(() => {
      performMonsterAction(newCombat);
    }, 1000);
  };

  const performMonsterAction = (combat: CombatState) => {
    const monster = combat.monster.data;
    let action = 'attack'; // Default action
    let logMessage = '';

    // AI decision logic
    const healthPercentage = (combat.monster.health / monster.stats.health) * 100;
    
    if (healthPercentage <= monster.ai.threatThreshold) {
      // Low health - prefer healing or defending
      if (combat.monster.mana >= 5 && Math.random() < 0.7) {
        action = 'heal';
      } else {
        action = 'defend';
      }
    } else if (monster.ai.elementalPreference && combat.monster.mana >= 3) {
      // Use elemental attack if possible
      action = 'spell';
    }

    let newCombat = { ...combat };
    
    switch (action) {
      case 'attack':
        const damage = Math.floor(Math.random() * 8) + monster.stats.attack;
        newCombat.player.health = Math.max(0, newCombat.player.health - damage);
        logMessage = `${monster.name} attacks for ${damage} damage!`;
        break;

      case 'heal':
        const healing = 10;
        newCombat.monster.health = Math.min(monster.stats.health, newCombat.monster.health + healing);
        newCombat.monster.mana -= 5;
        logMessage = `${monster.name} heals for ${healing} health!`;
        break;

      case 'defend':
        logMessage = `${monster.name} prepares to defend!`;
        break;

      case 'spell':
        const spellDamage = 12;
        newCombat.player.health = Math.max(0, newCombat.player.health - spellDamage);
        newCombat.monster.mana -= 3;
        logMessage = `${monster.name} casts a spell for ${spellDamage} damage!`;
        break;
    }

    newCombat.log.push(logMessage);

    // Check if player is defeated
    if (newCombat.player.health <= 0) {
      newCombat.log.push('You have been defeated!');
      setCombatEnded(true);
      const updatedPlayer = { ...player };
      updatedPlayer.hearts = newCombat.player.health;
      updatedPlayer.mana = newCombat.player.mana;
      onCombatEnd('lose', updatedPlayer);
      return;
    }

    newCombat.turn = 'player';
    newCombat.round += 1;
    setCurrentCombat(newCombat);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Flee Combat</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Combat Arena */}
          <div className="lg:col-span-2">
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-red-800">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Combat - Round {currentCombat.round}</h2>
                <p className="text-gray-400">
                  {currentCombat.turn === 'player' ? 'Your Turn' : 'Enemy Turn'}
                </p>
              </div>

              {/* Combatants */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Player */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-blue-400 mb-4">{player.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span className="text-white">
                        {currentCombat.player.health} / {player.maxHearts}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <span className="text-white">
                        {currentCombat.player.mana} / {player.maxMana}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentCombat.player.health / player.maxHearts) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Monster */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-red-400 mb-4">{currentCombat.monster.data.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span className="text-white">
                        {currentCombat.monster.health} / {currentCombat.monster.data.stats.health}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <span className="text-white">
                        {currentCombat.monster.mana} / {currentCombat.monster.data.stats.mana}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentCombat.monster.health / currentCombat.monster.data.stats.health) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {currentCombat.turn === 'player' && !combatEnded && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white text-center">Choose Your Action</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => handleAction('attack')}
                      className="p-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Sword className="w-5 h-5" />
                      <span>Attack</span>
                    </button>
                    <button
                      onClick={() => handleAction('defend')}
                      className="p-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Shield className="w-5 h-5" />
                      <span>Defend</span>
                    </button>
                    <button
                      onClick={() => setSelectedAction('spell')}
                      disabled={playerSpells.length === 0}
                      className="p-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-5 h-5" />
                      <span>Cast Spell</span>
                    </button>
                    <button
                      onClick={handleEscape}
                      className="p-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Play className="w-5 h-5 rotate-180" />
                      <span>Escape</span>
                    </button>
                  </div>

                  {/* Spell Selection */}
                  {selectedAction === 'spell' && playerSpells.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-3">Select Spell:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {playerSpells.map((spell) => (
                          <button
                            key={spell.id}
                            onClick={() => handleAction('spell', spell.id)}
                            className="p-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg transition-colors duration-200 text-left"
                          >
                            <div className="font-medium">{spell.name}</div>
                            <div className="text-sm text-purple-200">
                              {spell.type} • {spell.manaCost} mana • {spell.power} power
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Combat Log */}
          <div className="space-y-6">
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Combat Log</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {currentCombat.log.map((message, index) => (
                  <div key={index} className="text-gray-300 text-sm p-2 bg-gray-800/50 rounded">
                    {message}
                  </div>
                ))}
              </div>
            </div>

            {/* Monster Info */}
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Enemy Info</h3>
              <div className="space-y-2 text-sm">
                <div className="text-gray-300">{currentCombat.monster.data.description}</div>
                <div className="text-yellow-400">Element: {currentCombat.monster.data.element}</div>
                <div className="text-red-400">Attack: {currentCombat.monster.data.stats.attack}</div>
                <div className="text-blue-400">Defense: {currentCombat.monster.data.stats.defense}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};