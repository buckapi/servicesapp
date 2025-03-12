import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { RealtimeInspectionsService } from '@app/services/realtime-inspections.service';
import { RealtimeCarsService } from '@app/services/realtime-cars.service';
import { FilterInspectionsPipe } from '@app/pipes/filter-inspections';
import { Observable, } from 'rxjs';
import { DetailService } from '@app/services/detail-service.service';
import { InspeccionService } from '@app/services/inspection.service';
import { AuthPocketbaseService } from '@app/services/auth.service';
import { CarService } from '@app/services/car.service';
import Swal from 'sweetalert2';
import { PrintComponent } from '../print/print.component';

declare var $: any;

interface Item {
  id: string,
  name: string,
  interval: number,
  nextInspection: number,
  inspectionType: string,
  fuelType: string,
  transmissionType: string,
}
interface Car {
  id: string
}
interface Inspection {
  id: string;
  date: Date,
  carId: string,
  mileage: number,
  status: string
  items: Item[];
}
@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule,
    FilterInspectionsPipe,
    PrintComponent
  ],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements AfterViewInit {

  inspections$: Observable<Inspection[]>;
  cars$: Observable<Car[]>;

  constructor(
    public auth: AuthPocketbaseService,
    private inspeccionService: InspeccionService,
    public realtimeInspections: RealtimeInspectionsService,
    public realtimeCars: RealtimeCarsService,
    public global: GlobalService,
    public detailService: DetailService, 
    public carService: CarService

  ) {
    this.inspections$ = this.realtimeInspections.inspections$;
    this.cars$ = this.realtimeCars.cars$;
  }
  async crearInspeccion() {
    const data = {
      status: "pendiente",
      items: JSON.stringify([
        {
          id: "",
          name: "",
          nextInspection: 0,
          mechanicId: "",
          interval: 0
        }
      ]),
      level: "one", 
      carId: this.global.clienteDetail.cars?.[0]?.id,
      date: "2022-01-01 10:00:00.123Z",
      mileage: this.global.mileage
    };
  
    try {
      const record = await this.inspeccionService.crearInspeccion(data);
      // console.log('Registro creado:', record);
      localStorage.setItem('level', 'one');
      // Guardar el id en localStorage
      localStorage.setItem('inspeccionId', record.id);
      
    } catch (error) {
      console.error('Error al crear el registro:', error);
    }
  }

  toDelete(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres eliminar esta inspección?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete(id);
      }
    });
  }
  delete(id : string){
    this.inspeccionService.eliminarInspeccion(id).then(() => {
      console.log(`Inspección con ID ${id} eliminada exitosamente.`);
    }).catch((error) => {
      console.error('Error al eliminar la inspección:', error);
    });
  }
  // En HistorialComponent
  isAgregarMantencionVisible(inspections: Inspection[] | null): boolean {
    if (!inspections) {
      return true; // Si no hay inspecciones, mostrar el botón
    }
    return !inspections.some(inspection => inspection.status === 'pendiente' && inspection.carId === this.global.clienteDetail.cars?.[0]?.id);
  }
  onShowWizard() {
    this.crearInspeccion();
    this.global.showWinzard = true;
    const inspections = this.realtimeInspections.inspections$;
    const filteredInspections = this.realtimeInspections.getInspectionsByCarId(this.global.clienteDetail.cars?.[0]?.id);
    localStorage.setItem('items',JSON.stringify(filteredInspections));
    // this.detailService.onShowDetail(this.global.clienteDetail.id);
    this.realtimeInspections.itemsPrev();
  }
  ngAfterViewInit(): void {
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const diaSemana = diasSemana[date.getDay()];
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const anio = date.getFullYear();

    return `${diaSemana} ${dia} de ${mes} de ${anio}`;
  }
}
