
import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class RealtimeInspectionsService implements OnDestroy {
  private pb: PocketBase;
  private inspectionsSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public inspections$: Observable<any[]> =
    this.inspectionsSubject.asObservable();

  constructor(private globalService: GlobalService) {
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


  itemsPrev(){
    this.inspections$.subscribe(inspections => {
      console.log('Inspecciones:', inspections); // Verifica las inspecciones
  
      // Verifica si clienteDetail y cars están definidos
      if (this.globalService.clienteDetail && localStorage.getItem('carId') && this.globalService.clienteDetail.cars.length > 0) {
          // console.log('Car ID:', this.globalService.carId); // Verifica el carId
      } else {
          // console.error('clienteDetail o cars no están definidos o están vacíos.');
          // alert('No se puede obtener el ID del coche.');
          return; // Sal de la función si no hay coche
      }
  
      // Verifica si hay inspecciones y su estructura
      if (inspections.length === 0) {
          console.log('No hay inspecciones disponibles.');
          this.globalService.mileage =  this.globalService.clienteDetail.cars[0].mileage;
  
          alert('No hay inspecciones disponibles. por lo tanto se usara la de registro: ' +this.globalService.clienteDetail.cars[0].mileage );
          return;
      }
  
      const hasPreviousInspections = inspections.some(inspection => inspection.carId === this.globalService.carId && inspection.status === 'completada');
      console.log('¿Hay inspecciones previas?', hasPreviousInspections); // Verifica el resultado de la búsqueda
  
      if (hasPreviousInspections) {
        this.globalService.prevInspectionValue = inspections[inspections.length - 1];
        if (hasPreviousInspections) {
          this.globalService.prevInspectionValue = inspections[inspections.length - 1];
        this.globalService.prevMileage = inspections[inspections.length - 1].mileage; // Asigna el último kilometraje
  
      }
     localStorage.setItem('itemsPrev',JSON.stringify(inspections[inspections.length - 2].items ));
     localStorage.setItem('level',JSON.stringify('two')); 
     // alert('hasPreviousInspections' + JSON.stringify(this.globalService.lastItems));
        // this.globalService.mileage = inspections[inspections.length - 1].mileage; // Asigna el último kilometraje
        // this.globalService.prevMileage = inspections[inspections.length - 1].mileage; // Asigna el último kilometraje
        } else {
        localStorage.setItem('level',JSON.stringify('one'));
        // alert('no hasPreviousInspections');
      }
  });
  }


  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('inspections').unsubscribe('*');
  }
}
