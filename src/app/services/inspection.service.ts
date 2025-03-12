import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class InspeccionService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.lat:8095');
  }

  async crearInspeccion(data: { status: string; items: string; carId: string; date: string; mileage: number; }) {
    try {
      const record = await this.pb.collection('inspections').create(data);
      return record;
    } catch (error) {
      console.error('Error al crear el registro:', error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  }

  async eliminarInspeccion(id: string) {
    try {
      await this.pb.collection('inspections').delete(id);
      console.log(`Inspección con ID ${id} eliminada exitosamente.`);
    } catch (error) {
      console.error('Error al eliminar la inspección:', error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  }
}