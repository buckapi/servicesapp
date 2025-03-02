
import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeItemInspectionsService implements OnDestroy {
  private pb: PocketBase;
  private itemInspectionsSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public itemInspections$: Observable<any[]> =
    this.itemInspectionsSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.lat:8095');
    this.subscribeToItemInspections();
  }

  private async subscribeToItemInspections() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('platform@buckapi.lat', 'sw8K4jRuMW5x6jn');

    // Suscribirse a cambios en cualquier registro de la colección 'citemInspections'
    this.pb.collection('itemInspections').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esaras
    this.updateSitemInspectionsList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esaras
    this.updateSitemInspectionsList();
  }
  public async getItemInspectionsByType(type: string): Promise<any[]> {
    const records = await this.pb.collection('itemInspections').getFullList(200, {
        filter: `type = '${type}'`, // Asegúrate de que el campo 'type' exista en tu colección
        sort: '-created',
    });
    return records;
}

  private async updateSitemInspectionsList() {
    // Obtener la lista actualizada de esaras
    const records = await this.pb
      .collection('itemInspections')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.itemInspectionsSubject.next(records);
  }
  public async getItemInspectionsByUserId(idUser: string): Promise<any[]> {
    const records = await this.pb.collection('itemInspections').getFullList(200, {
        filter: `idUser = '${idUser}'`,
        sort: '-created',
    });
    return records;
}
  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('itemInspections').unsubscribe('*');
  }
}
