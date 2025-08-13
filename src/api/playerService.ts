import { apiClient, ApiResponse } from './apiClient';
import { Player } from '../types/game';

export interface CreatePlayerRequest {
  name: string;
  gender: 'male' | 'female' | 'other';
  race: string;
  activeClass: string;
  stats: any;
  level: number;
  xp: number;
  hearts: number;
  maxHearts: number;
  mana: number;
  maxMana: number;
  inventory: string; // JSON string
  equipment: string; // JSON string
  spells: string; // JSON string
  skills: string; // JSON string
  unlockedSpells: string; // JSON string
  unlockedSkills: string; // JSON string
  currentNode: string;
  element: string;
  classes: string; // JSON string
}

export interface UpdatePlayerRequest extends Partial<CreatePlayerRequest> {
  id: string;
}

export class PlayerService {
  private static readonly ENDPOINT = '/players';

  static async createPlayer(playerData: Player): Promise<ApiResponse<Player>> {
    const request: CreatePlayerRequest = {
      name: playerData.name,
      gender: playerData.gender,
      race: playerData.race,
      activeClass: playerData.activeClass,
      stats: JSON.stringify(playerData.stats),
      level: playerData.level,
      xp: playerData.xp,
      hearts: playerData.hearts,
      maxHearts: playerData.maxHearts,
      mana: playerData.mana,
      maxMana: playerData.maxMana,
      inventory: JSON.stringify(playerData.inventory),
      equipment: JSON.stringify(playerData.equipment),
      spells: JSON.stringify(playerData.spells),
      skills: JSON.stringify(playerData.skills),
      unlockedSpells: JSON.stringify(playerData.unlockedSpells),
      unlockedSkills: JSON.stringify(playerData.unlockedSkills),
      currentNode: playerData.currentNode,
      element: playerData.element,
      classes: JSON.stringify(playerData.classes),
    };

    const response = await apiClient.post<any>(this.ENDPOINT, request);
    
    if (response.success) {
      return {
        ...response,
        data: this.transformFromApi(response.data),
      };
    }
    
    return response as ApiResponse<Player>;
  }

  static async getPlayer(playerId: string): Promise<ApiResponse<Player>> {
    const response = await apiClient.get<any>(`${this.ENDPOINT}/${playerId}`);
    
    if (response.success) {
      return {
        ...response,
        data: this.transformFromApi(response.data),
      };
    }
    
    return response as ApiResponse<Player>;
  }

  static async updatePlayer(playerId: string, updates: Partial<Player>): Promise<ApiResponse<Player>> {
    const request: Partial<CreatePlayerRequest> = {};
    
    if (updates.name !== undefined) request.name = updates.name;
    if (updates.gender !== undefined) request.gender = updates.gender;
    if (updates.race !== undefined) request.race = updates.race;
    if (updates.activeClass !== undefined) request.activeClass = updates.activeClass;
    if (updates.stats !== undefined) request.stats = JSON.stringify(updates.stats);
    if (updates.level !== undefined) request.level = updates.level;
    if (updates.xp !== undefined) request.xp = updates.xp;
    if (updates.hearts !== undefined) request.hearts = updates.hearts;
    if (updates.maxHearts !== undefined) request.maxHearts = updates.maxHearts;
    if (updates.mana !== undefined) request.mana = updates.mana;
    if (updates.maxMana !== undefined) request.maxMana = updates.maxMana;
    if (updates.inventory !== undefined) request.inventory = JSON.stringify(updates.inventory);
    if (updates.equipment !== undefined) request.equipment = JSON.stringify(updates.equipment);
    if (updates.spells !== undefined) request.spells = JSON.stringify(updates.spells);
    if (updates.skills !== undefined) request.skills = JSON.stringify(updates.skills);
    if (updates.unlockedSpells !== undefined) request.unlockedSpells = JSON.stringify(updates.unlockedSpells);
    if (updates.unlockedSkills !== undefined) request.unlockedSkills = JSON.stringify(updates.unlockedSkills);
    if (updates.currentNode !== undefined) request.currentNode = updates.currentNode;
    if (updates.element !== undefined) request.element = updates.element;
    if (updates.classes !== undefined) request.classes = JSON.stringify(updates.classes);

    const response = await apiClient.put<any>(`${this.ENDPOINT}/${playerId}`, request);
    
    if (response.success) {
      return {
        ...response,
        data: this.transformFromApi(response.data),
      };
    }
    
    return response as ApiResponse<Player>;
  }

  private static transformFromApi(apiData: any): Player {
    return {
      id: apiData.id,
      name: apiData.name,
      gender: apiData.gender,
      race: apiData.race,
      activeClass: apiData.activeClass,
      stats: JSON.parse(apiData.stats || '{}'),
      level: apiData.level,
      xp: apiData.xp,
      hearts: apiData.hearts,
      maxHearts: apiData.maxHearts,
      mana: apiData.mana,
      maxMana: apiData.maxMana,
      inventory: JSON.parse(apiData.inventory || '[]'),
      equipment: JSON.parse(apiData.equipment || '{}'),
      spells: JSON.parse(apiData.spells || '[]'),
      skills: JSON.parse(apiData.skills || '[]'),
      unlockedSpells: JSON.parse(apiData.unlockedSpells || '[]'),
      unlockedSkills: JSON.parse(apiData.unlockedSkills || '[]'),
      currentNode: apiData.currentNode,
      element: apiData.element,
      classes: JSON.parse(apiData.classes || '[]'),
    };
  }
}