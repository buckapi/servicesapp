
import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeCategoriesService implements OnDestroy {
  private pb: PocketBase;
  private categoriesSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public categories$: Observable<any[]> =
    this.categoriesSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8065');
    this.subscribeToSntries();
  }

  private async subscribeToSntries() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('platform@email.com', 'uioW99..platform');

    // Suscribirse a cambios en cualquier registro de la colección 'categories'
    this.pb.collection('categories').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esntrieas
    this.updateSntriesList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esntrieas
    this.updateSntriesList();
  }

  private async updateSntriesList() {
    // Obtener la lista actualizada de esntrieas
    const records = await this.pb
      .collection('categories')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.categoriesSubject.next(records);
  }

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('categories').unsubscribe('*');
  }
}
