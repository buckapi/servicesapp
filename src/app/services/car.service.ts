import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.lat:8085/');
  }

  // Create a new car
  async createCar(data: any): Promise<any> {
    return await this.pb.collection('cars').create(data);
  }

  // Read all cars
  async getCars(): Promise<any[]> {
    return await this.pb.collection('cars').getFullList();
  }

  // Read a single car by ID
  async getCarById(id: string): Promise<any> {
    return await this.pb.collection('cars').getOne(id);
  }

  // Update a car by ID
  async updateCar(id: string, data: any): Promise<any> {
    return await this.pb.collection('cars').update(id, data);
  }

  // Delete a car by ID
  async deleteCar(id: string): Promise<any> {
    return await this.pb.collection('cars').delete(id);
  }
}