import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.lat:8085/');
  }

  // Create a new client
  async createClient(data: any): Promise<any> {
    return await this.pb.collection('clients').create(data);
  }

  // Read all clients
  async getClients(): Promise<any[]> {
    return await this.pb.collection('clients').getFullList();
  }

  // Read a single client by ID
  async getClientById(id: string): Promise<any> {
    return await this.pb.collection('clients').getOne(id);
  }

  // Update a client by ID
  async updateClient(id: string, data: any): Promise<any> {
    return await this.pb.collection('clients').update(id, data);
  }

  // Delete a client by ID
  async deleteClient(id: string): Promise<any> {
    return await this.pb.collection('clients').delete(id);
  }
}