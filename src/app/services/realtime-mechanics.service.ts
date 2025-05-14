
import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeMechanicsService implements OnDestroy {
  private pb: PocketBase;
  private mechanicsSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public mechanics$: Observable<any[]> =
    this.mechanicsSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.lat:8085');
    this.subscribeToMechanics();
  }

  private async subscribeToMechanics() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('platform@buckapi.lat', 'sw8K4jRuMW5x6jn');


    // Suscribirse a cambios en cualquier registro de la colección 'members'
    this.pb.collection('mechanics').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esntrieas
    this.updateMechanicsList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esntrieas
    this.updateMechanicsList();
  }

  private async updateMechanicsList() {
    // Obtener la lista actualizada de esntrieas
    const records = await this.pb
      .collection('mechanics')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.mechanicsSubject.next(records);
  }

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('mechanics').unsubscribe('*');
  }
}
