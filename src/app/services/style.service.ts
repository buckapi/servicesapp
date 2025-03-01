import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  private pocketbase: PocketBase;

  constructor() {
    this.pocketbase = new PocketBase('https://db.buckapi.com:8065');
  }

  async addStyle(styleName: string): Promise<void> {
    try {
      await this.pocketbase.collection('styles').create({
        name: styleName,
      });
    } catch (error) {
      console.error('Error adding style:', error);
      throw error; // Rethrow or handle the error as needed
    }
  }
}