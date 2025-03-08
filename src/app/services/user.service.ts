import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private pb = new PocketBase('https://db.buckapi.lat:8095');

  constructor() {}
  async createMechanic(userId: string, name: string, password: string, type: string) {
    try {
      const mechanicData = {
        userId: userId,
        name: name,
        password: password,
        type: type
      };
      const record = await this.pb.collection('mecanicos').create(mechanicData);
      return record;
    } catch (error) {
      console.error('Error creating mechanic:', error);
      throw error;
    }
  }
  async createUser(data: any) {
    try {
      const record = await this.pb.collection('users').create(data);
      await this.pb.collection('users').requestVerification(data.email);
      return record;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}