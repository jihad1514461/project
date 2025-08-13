import { GameData } from '../types/game';
import { initialGameData } from '../data/gameData';

// This utility manages saving game data changes back to the gameData.ts file
// In a real application, this would interface with a backend or file system

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

  public updateClasses(classes: { [key: string]: any }): void {
    this.gameData.classes = classes;
    this.saveToFile();
  }

  public updateClassRequirements(classRequirements: { [key: string]: any }): void {
    this.gameData.classRequirements = classRequirements;
    this.saveToFile();
  }

  public updateRaces(races: { [key: string]: any }): void {
    this.gameData.races = races;
    this.saveToFile();
  }

  public updateItems(items: { [key: string]: any }): void {
    this.gameData.items = items;
    this.saveToFile();
  }

  public updateShops(shops: { [key: string]: any }): void {
    this.gameData.shops = shops;
    this.saveToFile();
  }

  public updateSpells(spells: { [key: string]: any }): void {
    this.gameData.spells = spells;
    this.saveToFile();
  }

  public updateSkills(skills: { [key: string]: any }): void {
    this.gameData.skills = skills;
    this.saveToFile();
  }

  public updateMonsters(monsters: { [key: string]: any }): void {
    this.gameData.monsters = monsters;
    this.saveToFile();
  }

  public updateVillains(villains: { [key: string]: any }): void {
    this.gameData.villains = villains;
    this.saveToFile();
  }

  public updateStories(stories: { [storyName: string]: any }): void {
    this.gameData.stories = stories;
    this.saveToFile();
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