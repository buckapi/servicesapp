import { Component, OnInit } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { RealtimeItemInspectionsService } from '@app/services/realtime-iteminspections.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import PocketBase from 'pocketbase';
import { InspeccionService } from '@app/services/inspection.service';
const pb = new PocketBase('https://db.buckapi.lat:8085');
@Component({
  selector: 'app-clients-add-inspection', 
  imports: [
    CommonModule,
    FormsModule,


  ],
  templateUrl: './clients-add-inspection.component.html',
  styleUrl: './clients-add-inspection.component.css'
})
export class ClientsAddInspectionComponent  implements OnInit {
itemsInspections: any[] = [];
filteredItems: any[] = [];
loading: boolean = false;
selectedRows: Set<any> = new Set();
private updateTimeout: any;
constructor
(public global: GlobalService, 
  public inspeccionService: InspeccionService,
  public realtimeItemInspectionsService: RealtimeItemInspectionsService) {
  this.realtimeItemInspectionsService.itemInspections$.subscribe(items => {
    this.itemsInspections = items;
    // Opcional: filtrar aquí en lugar de en el template
    this.filteredItems = this.filterItems(items);
  });
}
onRowClick(itemInspection: any) {
  this.selectedRows.add(itemInspection);
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
    level: 'two', 
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
onDescriptionChange() {
  clearTimeout(this.updateTimeout); // Limpia el timeout anterior si existe
  this.updateTimeout = setTimeout(() => {
      this.actualizarInspeccion();
  }, 2000);
}
async actualizarInspeccion() {
  const inspectionId = localStorage.getItem('inspeccionId');
  if (!inspectionId) {
      console.error('No se encontró el ID de la inspección en localStorage');
      return;
  }

  this.loading = true; // Inicia el estado de carga

  // Obtén la lista actual de items
  const items = this.itemsInspections.map(itemInspection => ({
      id: itemInspection.id,
      name: itemInspection.name,
      limit:    this.getNextItemInspectionKm(itemInspection.id),
      description: itemInspection.description,
      // nextInspection: this.getNextItemInspectionKm(itemInspection.id),
      nextInspection: this.global.mileage + itemInspection.interval,
      mechanicId: this.global.getOrderId(),
      interval: itemInspection.interval,
  }));

  const data = {
      status: "pendiente",
      items: JSON.stringify(items),
      carId: localStorage.getItem('carId'),
      date: new Date().toISOString(),
      mileage: this.global.mileage,
      level: localStorage.getItem('level'),
  };

  try {
      const record = await pb.collection('inspections').update(inspectionId, data);
      console.log('Registro actualizado:', record);
  } catch (error) {
      console.error('Error al actualizar el registro:', error);
  } finally {
      this.loading = false; // Finaliza el estado de carga
  }
}
ngOnInit(): void {

}
// Añade esto a tu componente
// getItemStatus(itemInspection: any): {nextInspection: number, isOverdue: boolean} | null {
//   if (!this.global.lastItems) return null;
  
//   const lastItem = this.global.lastItems.find(item => item.id === itemInspection.id);
//   if (!lastItem) return null;
  
//   return {
//       nextInspection: lastItem.nextInspection,
//       isOverdue: lastItem.nextInspection < this.global.mileage
//   };
// }
getItemStatus(itemInspection: any): {nextInspection: number, isOverdue: boolean} | null {
  if (!this.global.mileage) return null;
  
  // Calculate next inspection based on current mileage and interval
  const nextInspection = this.global.mileage + itemInspection.interval;
  
  return {
      nextInspection: nextInspection,
      isOverdue: false // For first maintenance, it's never overdue
  };
}
private filterItems(items: any[]): any[] {
  return items.filter(item => 
    item.inspectionType === 'tecnica' &&
    (item.tractionType === this.global.gettractionType() || item.tractionType === 'ambos') &&
    (item.fuelType === this.global.getFuelType() || item.fuelType === 'ambos')
  );
}
// onDescriptionChange() {
//   this.loading = true;
//   setTimeout(() => {
//     this.loading = false;
//   }, 2000);
// }

// private filterItems(items: any[]): any[] {
//   return items.filter(item => 
//     item.inspectionType === 'tecnica' &&
//     (item.tractionType === this.global.gettractionType() || item.tractionType === 'ambos') &&
//     (item.fuelType === this.global.getFuelType() || item.fuelType === 'ambos')
//   );
// }


getItemInspectionStatus(itemInspection: any) {
  const lastItem = this.global.lastItems?.find(item => item.id === itemInspection.id);
  if (!lastItem) return null;
  
  return {
    nextInspection: lastItem.nextInspection,
    isOverdue: lastItem.nextInspection < this.global.mileage
  };
}
  getNextItemInspectionKm(id: string){
    for (let i = 0; i < this.global.lastItems.length; i++) {
      if (this.global.lastItems[i].id === id) {
        return this.global.lastItems[i].nextInspection;
      }
    }
    return undefined; // Devuelve undefined si no se encuentra
  }

  
  getFlag(itemInspection: any){
    for (let i = 0; i < this.global.lastItems.length; i++) {
      if (this.global.lastItems[i].id === itemInspection.id) {
        return this.global.lastItems[i].nextInspection;
      }
    }
    return undefined; // Devuelve undefined si no se encuentra
  }
  isItemRegistered(id: string){
    for (let i = 0; i < this.global.lastItems.length; i++) {
      if (this.global.lastItems[i].id === id) {
        return this.global.lastItems[i].nextInspection;
      }
    }
    return undefined; // Devuelve undefined si no se encuentra
  } 

getItemsInspectionClass(pasado: number, actual: number): string {
  if (pasado < actual) {
    return 'text-green';
  } else {
    return 'text-red';
  }
}
}
