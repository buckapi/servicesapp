
import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeCarinspectionsService implements OnDestroy {
  private pb: PocketBase;
  private carinspectionsSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public carinspections$: Observable<any[]> =
    this.carinspectionsSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.lat:8095');
    this.subscribeToSars();
  }

  private async subscribeToSars() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('platform@buckapi.lat', 'sw8K4jRuMW5x6jn');

    // Suscribirse a cambios en cualquier registro de la colección 'carinspections'
    this.pb.collection('carinspections').subscribe('*', (e) => {
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
      .collection('carinspections')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.carinspectionsSubject.next(records);
  }
  public async getCarinspectionsByUserId(userId: string): Promise<any[]> {
    const records = await this.pb.collection('carinspections').getFullList(200, {
        filter: `userId = '${userId}'`,
        sort: '-created',
    });
    return records;
}
  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('carinspections').unsubscribe('*');
  }
}
