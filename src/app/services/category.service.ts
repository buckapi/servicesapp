import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private pocketbase: PocketBase;

  constructor() {
    this.pocketbase = new PocketBase('https://db.buckapi.com:8065');
  }

  async addCategory(categoryName: string): Promise<void> {
    try {
      await this.pocketbase.collection('categories').create({
        name: categoryName,
      });
    } catch (error) {
      console.error('Error adding category:', error);
      throw error; // Rethrow or handle the error as needed
    }
  }
}