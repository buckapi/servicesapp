
import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeInspectionsService implements OnDestroy {
  private pb: PocketBase;
  private inspectionsSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public inspections$: Observable<any[]> =
    this.inspectionsSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.lat:8095');
    this.subscribeToInspections();
  }

  private async subscribeToInspections() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('platform@buckapi.lat', 'sw8K4jRuMW5x6jn');

    // Suscribirse a cambios en cualquier registro de la colección 'inspections'
    this.pb.collection('inspections').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esaras
    this.updateInspectionsList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esaras
    this.updateInspectionsList();
  }

  private async updateInspectionsList() {
    // Obtener la lista actualizada de esaras
    const records = await this.pb
      .collection('inspections')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.inspectionsSubject.next(records);
  }
  public async getInspectionsByCarId(carId: string): Promise<any[]> {
    const records = await this.pb.collection('inspections').getFullList(200, {
      filter: `carId = '${carId}'`,
      sort: 'name',
    });
    return records;
  }
  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('inspections').unsubscribe('*');
  }
}
