import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '@app/services/global.service';
import { RealtimeCarsService } from '@app/services/realtime-cars.service';
import { RealtimeItemInspectionsService } from '@app/services/realtime-iteminspections.service';
import * as bootstrap from 'bootstrap';
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://db.buckapi.lat:8085');
import { InspeccionService } from '@app/services/inspection.service';
import Swal from 'sweetalert2'; // Add this import at the top of your file


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
  loading: boolean = false; // Para controlar el estado de carga
  
  currentInspection: any; // Add this line
  steep = 1;
  itemsInspectionsFirstHalf: any[] = [];
  itemsInspectionsSecondHalf: any[] = [];
  itemsInspections: any[] = [];
  private updateTimeout: any;
  public cars: any[] = []; // Agregar esta línea para almacenar los coches
  constructor(
    public global: GlobalService,
    public inspectionService: InspeccionService,
    public realtimeCarsService: RealtimeCarsService,
    public realtimeItemInspectionsService: RealtimeItemInspectionsService
  ) {
    const midpoint = Math.ceil(this.itemsInspections.length / 2);
    this.itemsInspectionsFirstHalf = this.itemsInspections.slice(0, midpoint);
    this.itemsInspectionsSecondHalf = this.itemsInspections.slice(midpoint);
    this.realtimeItemInspectionsService.itemInspections$.subscribe(items => {
      this.itemsInspections = items.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.realtimeCarsService.cars$.subscribe(cars => {
      this.cars = cars;
    });
  }
  next(steep: number) {
    this.steep = steep;
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

onDescriptionChange() {
  clearTimeout(this.updateTimeout); // Limpia el timeout anterior si existe
  this.updateTimeout = setTimeout(() => {
      this.actualizarInspeccion();
  }, 2000);
}
  getItemsInspectionClass(pasado: number, actual: number): string {
    if (pasado < actual) {
      return 'text-green';
    } else {
      return 'text-red';
    }
  }
  finish() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas cambiar el estado de la inspección a 'completada'?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, completar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.inspectionService.toEnd(localStorage.getItem('inspeccionId')!, 'completada');
      }
    });
  }
  isMayor(a: number, b: number) {
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
    const car = this.cars.find(car => car.userId === clientId);
    mileage = (car && typeof car.mileage === 'number') ? car.mileage : mileage; // Asegúrate de que car.mileage sea un número
    return mileage; // Devuelve el kilometraje
  }
  isItemRegistered(itemId: string): number | undefined {
    for (let i = 0; i < this.global.lastItems.length; i++) {
      if (this.global.lastItems[i].id === itemId) {
        return this.global.lastItems[i].nextInspection;
      }
    }
    return undefined; // Devuelve undefined si no se encuentra
  }

  getNextItemInspectionKm(itemId: string): number | undefined {
    for (let i = 0; i < this.global.lastItems.length; i++) {
      if (this.global.lastItems[i].id === itemId) {
        return this.global.lastItems[i].nextInspection;
      }
    }
    return undefined; // Devuelve undefined si no se encuentra
  }
  async actualizarMileage() {
    const inspectionId = localStorage.getItem('inspeccionId');
    if (!inspectionId) {
        console.error('No se encontró el ID de la inspección en localStorage');
        return;
    }

    this.loading = true; // Inicia el estado de carga

    const data = {
        status: "pendiente",
        items: JSON.stringify(this.itemsInspections.map(itemInspection => ({
            id: itemInspection.id,
            name: itemInspection.name,
            description: itemInspection.description,
            nextInspection: itemInspection.interval+this.global.mileage,
            mechanicId: this.global.getOrderId(),
            interval: itemInspection.interval,
        }))),
        carId: this.global.clienteDetail.cars?.[0]?.id,
        date: new Date().toISOString(),
        mileage: this.global.mileage, // Usa el nuevo mileage
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
onMileageChange() {
  const mileage=this.global.mileage;
  // this.global.mileage = 0;
const mileageToUpdate = (mileage && typeof mileage === 'number') ? mileage : 0; // Asegúrate de que mileage sea un número
this.global.mileage = mileageToUpdate;
localStorage.setItem('carId', this.global.clienteDetail.cars?.[0]?.id);
localStorage.setItem('mileage', JSON.stringify(this.global.mileage));
  clearTimeout(this.updateTimeout); // Limpia el timeout anterior si existe
  this.updateTimeout = setTimeout(() => {
      this.actualizarMileage();
      
  }, 2000);
}
  getFlag(inspection: any) {
    const nextInspectionKm = this.getNextItemInspectionKm(inspection.id);
    if (nextInspectionKm !== undefined) {
      if (((this.global.mileage - nextInspectionKm)) > 0) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}
