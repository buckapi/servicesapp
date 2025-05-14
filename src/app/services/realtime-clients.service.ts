
import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeClientsService implements OnDestroy {
  private pb: PocketBase;
  private clientsSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public clients$: Observable<any[]> =
    this.clientsSubject.asObservable();

  constructor(

    
  ) {
    this.pb = new PocketBase('https://db.buckapi.lat:8085');
    this.subscribeToSlients();
  }

  private async subscribeToSlients() {
    // (Opcional) Autenticación
    await this.pb.collection('users').authWithPassword('platform@buckapi.lat', 'sw8K4jRuMW5x6jn');

    // Suscribirse a cambios en cualquier registro de la colección 'clients'
    this.pb.collection('clients').subscribe('*', async (e) => {
        await this.updateSlientsList(); // Actualiza la lista de clientes cuando hay un cambio
        this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de clientes
    await this.updateSlientsList();
}
  getClientesCount(): number {
    return this.clientsSubject.getValue().length; // Obtiene la lista actual de clientes y devuelve su longitud
}
  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de eslientas
    this.updateSlientsList();
  }

  private async updateSlientsList() {
    const records = await this.pb.collection('clients').getFullList(200, {
        sort: '-created', // Ordenar por fecha de creación
    });
    this.clientsSubject.next(records); // Actualiza el BehaviorSubject con la nueva lista
}

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('clients').unsubscribe('*');
  }
}
