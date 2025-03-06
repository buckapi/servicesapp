import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '@app/services/global.service';
import { RealtimeCarsService } from '@app/services/realtime-cars.service';
import { RealtimeItemInspectionsService } from '@app/services/realtime-iteminspections.service';

@Component({
  selector: 'app-winzard',
  imports: [CommonModule,
    FormsModule
    ],
  templateUrl: './winzard.component.html',
  styleUrl: './winzard.component.css'
})
export class WinzardComponent {
steep = 1;
inspectionsFirstHalf: any[] = [];
    inspectionsSecondHalf: any[] = [];

   
  inspections: any[] = [];
  public cars: any[] = []; // Agregar esta línea para almacenar los coches
 
constructor(public global: GlobalService,
  public realtimeCarsService: RealtimeCarsService,
  
  public realtimeItemInspectionsService: RealtimeItemInspectionsService
) {
  const midpoint = Math.ceil(this.inspections.length / 2);
  this.inspectionsFirstHalf = this.inspections.slice(0, midpoint);
  this.inspectionsSecondHalf = this.inspections.slice(midpoint);

  this.realtimeItemInspectionsService.itemInspections$.subscribe(items => {
    this.inspections = items;
  });
  this.realtimeCarsService.cars$.subscribe(cars => {
    this.cars = cars;
  });
}
next(steep:number){
this.steep =steep;
}
getMileage(clientId: string): number {
  const car = this.cars.find(car => car.idUser === clientId);
  this.global.mileage= car ? car.mileage : 0; // Asegúrate de que car.mileage sea un número
  return car ? car.mileage : 0; // Asegúrate de que car.mileage sea un número
}
}
