
import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeMecanicosService implements OnDestroy {
  private pb: PocketBase;
  private mecanicosSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public mecanicos$: Observable<any[]> =
    this.mecanicosSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.lat:8095');
    this.subscribeToMecanicos();
  }

  private async subscribeToMecanicos() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('platform@buckapi.lat', 'sw8K4jRuMW5x6jn');


    // Suscribirse a cambios en cualquier registro de la colección 'members'
    this.pb.collection('mecanicos').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esntrieas
    this.updateMecanicosList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esntrieas
    this.updateMecanicosList();
  }

  private async updateMecanicosList() {
    // Obtener la lista actualizada de esntrieas
    const records = await this.pb
      .collection('mecanicos')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.mecanicosSubject.next(records);
  }

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('mecanicos').unsubscribe('*');
  }
}
