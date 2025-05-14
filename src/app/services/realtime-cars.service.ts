
import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeCarsService implements OnDestroy {
  private pb: PocketBase;
  private carsSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public cars$: Observable<any[]> =
    this.carsSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.lat:8085');
    this.subscribeToSars();
  }

  private async subscribeToSars() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('platform@buckapi.lat', 'sw8K4jRuMW5x6jn');

    // Suscribirse a cambios en cualquier registro de la colección 'cars'
    this.pb.collection('cars').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esaras
    this.updateSarsList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esaras
    this.updateSarsList();
  }

  private async updateSarsList() {
    // Obtener la lista actualizada de esaras
    const records = await this.pb
      .collection('cars')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.carsSubject.next(records);
  }
  public async getCarsByUserId(userId: string): Promise<any[]> {
    const records = await this.pb.collection('cars').getFullList(200, {
        filter: `userId = '${userId}'`,
        sort: '-created',
    });
    return records;
}
  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('cars').unsubscribe('*');
  }
}
