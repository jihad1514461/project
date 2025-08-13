import { apiClient, ApiResponse } from './apiClient';
import { GameData } from '../types/game';
import { initialGameData } from '../data/gameData';

export class GameDataService {
  static async fetchGameData(): Promise<ApiResponse<GameData>> {
    try {
      // Try to fetch from API, fallback to local data
      try {
        // Fetch all game data entities in parallel
        const [
          classesResponse,
          racesResponse,
          itemsResponse,
          shopsResponse,
          spellsResponse,
          skillsResponse,
          monstersResponse,
          villainsResponse,
          storiesResponse,
          classRequirementsResponse,
        ] = await Promise.all([
          apiClient.get<any[]>('/classes'),
          apiClient.get<any[]>('/races'),
          apiClient.get<any[]>('/items'),
          apiClient.get<any[]>('/shops'),
          apiClient.get<any[]>('/spells'),
          apiClient.get<any[]>('/skills'),
          apiClient.get<any[]>('/monsters'),
          apiClient.get<any[]>('/villains'),
          apiClient.get<any[]>('/stories'),
          apiClient.get<any[]>('/classRequirements'),
        ]);

        // Transform arrays to objects keyed by ID
        const gameData: GameData = {
          classes: this.arrayToObject(classesResponse.data || []),
          races: this.arrayToObject(racesResponse.data || []),
          items: this.arrayToObject(itemsResponse.data || []),
          shops: this.arrayToObject(shopsResponse.data || []),
          spells: this.arrayToObject(spellsResponse.data || []),
          skills: this.arrayToObject(skillsResponse.data || []),
          monsters: this.arrayToObject(monstersResponse.data || []),
          villains: this.arrayToObject(villainsResponse.data || []),
          stories: this.arrayToObject(storiesResponse.data || []),
          classRequirements: this.arrayToObject(classRequirementsResponse.data || []),
        };
        return {
          data: gameData,
          success: true,
        };
      } catch (apiError) {
        console.warn('API not available, using local game data:', apiError);
        return {
          data: initialGameData,
          success: true,
        };
      }
    } catch (error) {
      return {
        data: initialGameData,
        error: error instanceof Error ? error.message : 'Failed to fetch game data',
        success: true, // Return success with fallback data
      };
    }
  }

  static async updateClass(classId: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/classes/${classId}`, data);
  }

  static async createItem(data: any): Promise<ApiResponse<any>> {
    return apiClient.post('/items', data);
  }

  static async updateItem(itemId: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/items/${itemId}`, data);
  }

  static async deleteItem(itemId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/items/${itemId}`);
  }

  static async createRace(data: any): Promise<ApiResponse<any>> {
    return apiClient.post('/races', data);
  }

  static async updateRace(raceId: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/races/${raceId}`, data);
  }

  static async deleteRace(raceId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/races/${raceId}`);
  }

  static async createShop(data: any): Promise<ApiResponse<any>> {
    return apiClient.post('/shops', data);
  }

  static async updateShop(shopId: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/shops/${shopId}`, data);
  }

  static async deleteShop(shopId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/shops/${shopId}`);
  }

  static async createSpell(data: any): Promise<ApiResponse<any>> {
    return apiClient.post('/spells', data);
  }

  static async updateSpell(spellId: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/spells/${spellId}`, data);
  }

  static async deleteSpell(spellId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/spells/${spellId}`);
  }

  static async createSkill(data: any): Promise<ApiResponse<any>> {
    return apiClient.post('/skills', data);
  }

  static async updateSkill(skillId: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/skills/${skillId}`, data);
  }

  static async deleteSkill(skillId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/skills/${skillId}`);
  }

  static async createMonster(data: any): Promise<ApiResponse<any>> {
    return apiClient.post('/monsters', data);
  }

  static async updateMonster(monsterId: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/monsters/${monsterId}`, data);
  }

  static async deleteMonster(monsterId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/monsters/${monsterId}`);
  }

  static async createVillain(data: any): Promise<ApiResponse<any>> {
    return apiClient.post('/villains', data);
  }

  static async updateVillain(villainId: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/villains/${villainId}`, data);
  }

  static async deleteVillain(villainId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/villains/${villainId}`);
  }

  static async createStory(data: any): Promise<ApiResponse<any>> {
    return apiClient.post('/stories', data);
  }

  static async updateStory(storyId: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/stories/${storyId}`, data);
  }

  static async deleteStory(storyId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/stories/${storyId}`);
  }

  static async createClass(data: any): Promise<ApiResponse<any>> {
    return apiClient.post('/classes', data);
  }

  static async updateClass(classId: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/classes/${classId}`, data);
  }

  static async deleteClass(classId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/classes/${classId}`);
  }

  static async createClassRequirement(data: any): Promise<ApiResponse<any>> {
    return apiClient.post('/classRequirements', data);
  }

  static async updateClassRequirement(requirementId: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/classRequirements/${requirementId}`, data);
  }

  static async deleteClassRequirement(requirementId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/classRequirements/${requirementId}`);
  }

  private static arrayToObject(array: any[]): { [key: string]: any } {
    return array.reduce((obj, item) => {
      if (item.id) {
        obj[item.id] = item;
      }
      return obj;
    }, {});
  }
}