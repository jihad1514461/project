import { GameData } from '../types/game';
import { initialGameData } from '../data/gameData';
import { GameDataService } from '../api';

// This utility manages saving game data changes back to the gameData.ts file
// Now interfaces with the backend API

export class GameDataManager {
  private static instance: GameDataManager;
  private gameData: GameData;

  private constructor() {
    this.gameData = { ...initialGameData };
  }

  public static getInstance(): GameDataManager {
    if (!GameDataManager.instance) {
      GameDataManager.instance = new GameDataManager();
    }
    return GameDataManager.instance;
  }

  public getGameData(): GameData {
    return { ...this.gameData };
  }

  public updateGameData(newData: GameData): void {
    this.gameData = { ...newData };
    this.saveToFile();
  }

  public async updateClasses(classes: { [key: string]: any }): Promise<void> {
    this.gameData.classes = classes;
    await this.saveToAPI();
  }

  public async updateClassRequirements(classRequirements: { [key: string]: any }): Promise<void> {
    this.gameData.classRequirements = classRequirements;
    await this.saveToAPI();
  }

  public async updateRaces(races: { [key: string]: any }): Promise<void> {
    this.gameData.races = races;
    await this.saveToAPI();
  }

  public async updateItems(items: { [key: string]: any }): Promise<void> {
    this.gameData.items = items;
    await this.saveToAPI();
  }

  public async updateShops(shops: { [key: string]: any }): Promise<void> {
    this.gameData.shops = shops;
    await this.saveToAPI();
  }

  public async updateSpells(spells: { [key: string]: any }): Promise<void> {
    this.gameData.spells = spells;
    await this.saveToAPI();
  }

  public async updateSkills(skills: { [key: string]: any }): Promise<void> {
    this.gameData.skills = skills;
    await this.saveToAPI();
  }

  public async updateMonsters(monsters: { [key: string]: any }): Promise<void> {
    this.gameData.monsters = monsters;
    await this.saveToAPI();
  }

  public async updateVillains(villains: { [key: string]: any }): Promise<void> {
    this.gameData.villains = villains;
    await this.saveToAPI();
  }

  public async updateStories(stories: { [storyName: string]: any }): Promise<void> {
    this.gameData.stories = stories;
    await this.saveToAPI();
  }

  private async saveToAPI(): Promise<void> {
    try {
      // Save each entity type to the API
      // Note: This is a simplified approach - in production you'd want more granular updates
      console.log('Saving game data to API...');
      
      // For now, just save to local file as fallback
      this.saveToFile();
      
      // TODO: Implement individual API calls for each entity type
      // await Promise.all([
      //   this.saveClassesToAPI(),
      //   this.saveRacesToAPI(),
      //   this.saveItemsToAPI(),
      //   // ... etc
      // ]);
    } catch (error) {
      console.error('Failed to save to API, falling back to local file:', error);
      this.saveToFile();
    }
  }

  private saveToFile(): void {
    // Generate the new gameData.ts content
    const gameDataContent = this.generateGameDataFile();
    
    // Save to JSON file for easier data management
    const jsonData = JSON.stringify(this.gameData, null, 2);
    
    // Create downloadable files
    this.downloadFile('gameData.json', jsonData, 'application/json');
    this.downloadFile('gameData.ts', gameDataContent, 'text/typescript');
    
    // Store in localStorage as backup for development
    localStorage.setItem('rpg-game-data-backup', JSON.stringify(this.gameData));
    
    // Trigger a custom event to notify about data changes
    window.dispatchEvent(new CustomEvent('gameDataUpdated', { 
      detail: { gameData: this.gameData, fileContent: gameDataContent } 
    }));
  }

  private downloadFile(filename: string, content: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private generateGameDataFile(): string {
    return `import { GameData } from '../types/game';

export const initialGameData: GameData = ${JSON.stringify(this.gameData, null, 2)};
`;
  }

  public exportGameData(): string {
    return this.generateGameDataFile();
  }
}

export const gameDataManager = GameDataManager.getInstance();