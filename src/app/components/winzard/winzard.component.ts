import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { GlobalService } from '@app/services/global.service';
import { RealtimeCarsService } from '@app/services/realtime-cars.service';
import { RealtimeItemInspectionsService } from '@app/services/realtime-iteminspections.service';
import { DescriptionPopupComponent } from '../description-popup/description-popup.component';
import * as bootstrap from 'bootstrap';
interface Inspection {
  id: string;
  name: string;
  items: Item[];
  // nextInspection: number; // Agregar esta línea si es necesario
}

interface Item{
  id: string;
  nextInspection: number;
  name: string;
}

@Component({
  selector: 'app-winzard',
  imports: [CommonModule,
    FormsModule
    ],
  templateUrl: './winzard.component.html',
  styleUrl: './winzard.component.css'
})
export class WinzardComponent {
  @Output() descriptionSaved = new EventEmitter<string>();
  description: string = '';
  currentInspection: any; // Add this line
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
getInspectionClass(pasado:number, actual:number): string {
  if (pasado <  actual) {
      return 'text-green';
  } else {
      return 'text-red';
  }
}

isMayor(a:number,b:number){
  return a > b;
}
openDescriptionPopup(inspection: any) {
  this.currentInspection = inspection; // Guardar la inspección actual
  const modalElement = document.getElementById('descriptionModal');
  
  if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Mostrar el modal
  } else {
      console.error('Modal element not found'); // Manejar el caso donde no se encuentra el modal
  }
}

saveDescription() {
  // Actualizar el objeto de inspección con la nueva descripción
  if (this.currentInspection) {
      this.currentInspection.description = this.currentInspection.description; // Asegúrate de que la descripción se guarde
  }
  
  const modalElement = document.getElementById('descriptionModal');
  
  if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
          modal.hide(); // Cerrar el modal
      }
  } else {
      console.error('Modal element not found'); // Manejar el caso donde no se encuentra el modal
  }
}
onDescriptionSaved(description: string) {
  if (this.currentInspection) {
      this.currentInspection.description = description; // Update the description
  }
}
getMileage(clientId: string): number {
  let mileage = 0; // Valor temporal para almacenar el kilometraje
  this.realtimeItemInspectionsService.itemInspections$.subscribe(inspections => {
      const hasPreviousInspections = inspections.some(inspection => inspection.carId === this.global.clienteDetail.cars[0].id);
      if (hasPreviousInspections) {
          mileage = inspections[inspections.length - 1].mileage; // Asigna el último kilometraje
      }
  });

  const car = this.cars.find(car => car.idUser === clientId);
  mileage = (car && typeof car.mileage === 'number') ? car.mileage : mileage; // Asegúrate de que car.mileage sea un número
  return mileage; // Devuelve el kilometraje
}
isItemRegistered(itemId: string): number | undefined {
  for (let i=0;i<this.global.lastItems.length;i++) {
 if(this.global.lastItems[i].id === itemId){
  return this.global.lastItems[i].nextInspection;
 }
  }

  return undefined; // Devuelve undefined si no se encuentra
}

// getNextInspectionKm(itemId: string): number {
//   const inspection = this.inspections.find(i => i.id === itemId);
//   for (let i=0;i<this.global.lastItems.length;i++) {
//     if(this.global.lastItems[i].id === itemId){
//       return this.global.lastItems[i].nextInspection;
//     }
//   }
//   return inspection ? inspection.nextInspectionKm : 0; // Devuelve 0 o un valor predeterminado
// }

getNextInspectionKm(itemId: string): number | undefined {
  for (let i=0;i<this.global.lastItems.length;i++) {
 if(this.global.lastItems[i].id === itemId){
  return this.global.lastItems[i].nextInspection;
 }
  }

  return undefined; // Devuelve undefined si no se encuentra
}
getFlag(inspection: any) {
  const nextInspectionKm = this.getNextInspectionKm(inspection.id);
  if (nextInspectionKm !== undefined) {
    if (((this.global.mileage - nextInspectionKm) ) > 0) {
      return true;
    }else{
      return false;
    }
  }
  return false;
}
compareInspectionInterval(inspectionId: string): string {
  const prevInspection = this.global.prevInspectionValue; // Accede directamente a la Inspección

  // Verifica que prevInspection no sea undefined y que tenga items
  if (prevInspection && Array.isArray(prevInspection.items) && prevInspection.items.length > 0) {
    const matchingItem = prevInspection.items.find(item => item.id === inspectionId);
    if (matchingItem) {
      const difference = matchingItem.interval - (this.global.mileage || 0); // Asegúrate de que ambos sean números
      return `Diferencia: ${difference} Km`;
    }
  }
  return 'Sin coincidencia';
}
}
