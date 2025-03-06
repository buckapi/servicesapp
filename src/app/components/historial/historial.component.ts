import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { RealtimeInspectionsService } from '@app/services/realtime-inspections.service';
import { RealtimeCarsService } from '@app/services/realtime-cars.service';
declare var $: any; // Asegúrate de declarar jQuery
import { FilterInspectionsPipe } from '@app/pipes/filter-inspections';
import { Observable, } from 'rxjs';





interface Item{
  id:string,
  name:string,
  interval:number,
  inspectionType:string,
  fuelType:string,
  transmissionType:string,
}
interface Car{
  id:string
}
interface Inspection{

  id: string;
  date:Date,
  mileage:number,
  status:string
  itms:Item[];
  }
@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule,
    FilterInspectionsPipe
  ],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'] // Corrected 'styleUrl' to 'styleUrls'
})
export class HistorialComponent implements AfterViewInit {
  // Existing class content...

  // carId: string;
inspections$: Observable<Inspection[]>;
cars$: Observable<Car[]>;

  constructor(
    public realtimeInspections: RealtimeInspectionsService,
    public realtimeCars: RealtimeCarsService,
    public global: GlobalService
  ) {
    this.inspections$ = this.realtimeInspections.inspections$;
    this.cars$  = this.realtimeCars.cars$;
  }
  onShowWizard() {
    this.global.showWinzard = true;
    const inspections = this.realtimeInspections.inspections$;
    const filteredInspections = this.realtimeInspections.getInspectionsByCarId(this.global.clienteDetail.cars?.[0]?.id);
    if (filteredInspections) {
        this.global.prevInspectionValue = filteredInspections;
        this.global.prevInspection = true;
    }
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
