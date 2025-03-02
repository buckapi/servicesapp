import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '@app/services/global.service';
import { RealtimeItemInspectionsService } from '@app/services/realtime-iteminspections.service';
import PocketBase from 'pocketbase';
import Swal from 'sweetalert2';

const pb = new PocketBase('https://db.buckapi.lat:8095');

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  data = {
    name: '',
    interval: null,
    inspectionsType: '',
    status: '',
    fuelType: '',
    transmissionType: 'ambos',
    inspectionTypeId: 'ambos'
  };
inspections: any[] = [];
  selectedFuel: string | null = null; // Propiedad para almacenar el combustible seleccionado
  selectedTransmission: string | null = null; // Propiedad para almacenar la transmisión seleccionada
  isGasolineChecked: boolean = true; // Checkbox para gasolina
  isDieselChecked: boolean = true; // Checkbox para diesel
  is2wdChecked: boolean = true; // Checkbox para 2WD
  is4wdChecked: boolean = true; // Checkbox para 4WD
  inspectionType: string = 'general'; // Propiedad para almacenar el tipo de inspección seleccionado
  isFuelChecked: boolean = false;
  isTransmissionChecked: boolean = false;
  constructor(public global: GlobalService,
    public realtimeItemInspectionsService: RealtimeItemInspectionsService
  ) {
    this.realtimeItemInspectionsService.itemInspections$.subscribe(items => {
      this.inspections = items;
    });
  }

  async loadInspectionsByType() {
    this.realtimeItemInspectionsService.itemInspections$.subscribe(items => {
      this.inspections = items;
    });
  }

async createInspection(data: any) {
    try {
        await pb.collection('itemInspections').create(data);
        Swal.fire('Inspección agregada!', '', 'success');

        // Reiniciar los valores de selectedFuel y selectedTransmission
        this.selectedFuel = 'ambos';
        this.selectedTransmission = 'ambos';
        this.isGasolineChecked = false;
        this.isDieselChecked = false;
        this.is2wdChecked = false;
        this.is4wdChecked = false;

      this.isFuelChecked = true ;
      this.isTransmissionChecked = true ;

    } catch (error) {
        console.error('Error al crear la inspección:', error);
        Swal.fire('Error', 'No se pudo agregar la inspección.', 'error');
    }
}
  
  selectFuelType(type: string): void {
    this.selectedFuel = type; // Asigna el tipo de combustible seleccionado
    this.isDieselChecked = false; // Desmarcar diesel
this.isFuelChecked = true;
    const fuelTypeInput = document.getElementById('fuelType') as HTMLInputElement;
    if (fuelTypeInput) {
        fuelTypeInput.value = type; // Actualiza el valor oculto
    } else {
        console.error('El elemento con ID "fuelType" no se encontró en el DOM.');
    }

    // Desmarcar el checkbox correspondiente
    if (type === 'gasolina') {
        this.isDieselChecked = false; // Desmarcar diesel
        this.isGasolineChecked = true; // Marcar gasolina
    } else {
        this.isGasolineChecked = false; // Desmarcar gasolina
        this.isDieselChecked = true; // Marcar diesel
    }

    // Desmarcar el checkbox de "Aplica para motores a gasolina y diesel"
    this.isGasolineChecked = false;
    this.isDieselChecked = false;
}
  selectTransmissionType(type: string): void {
    this.selectedTransmission = type; // Asigna el tipo de transmisión seleccionado
    (document.getElementById('transmissionType') as HTMLInputElement).value = type; // Actualiza el valor oculto
    this.is4wdChecked = false; // Desmarcar 4WD
this.isTransmissionChecked = true;
    // Desmarcar el checkbox correspondiente
    if (type === '2wd') {
      this.is4wdChecked = false; // Desmarcar 4WD
    } else {
      this.is2wdChecked = false; // Desmarcar 2WD
    }
  }
  // Método para manejar el cambio de estado del checkbox de gasolina
toggleGasolineCheckbox(): void {
  this.isGasolineChecked = !this.isGasolineChecked; // Cambiar el estado del checkbox
  this.selectedFuel = this.isGasolineChecked ? 'gasolina' : null; // Asignar gasolina si está marcado

  // Si el checkbox está marcado, reiniciar la selección de diesel
  if (this.isGasolineChecked) {
      this.isDieselChecked = false; // Desmarcar diesel
  } else {
      this.selectedFuel = 'ambos'; // Si no está marcado, asignar "ambos"
  }
}

// Método para manejar el cambio de estado del checkbox de diesel
toggleDieselCheckbox(): void {
  this.isDieselChecked = !this.isDieselChecked; // Cambiar el estado del checkbox
  this.selectedFuel = this.isDieselChecked ? 'diesel' : null; // Asignar diesel si está marcado

  // Si el checkbox está marcado, reiniciar la selección de gasolina
  if (this.isDieselChecked) {
      this.isGasolineChecked = false; // Desmarcar gasolina
  } else {
      this.selectedFuel = 'ambos'; // Si no está marcado, asignar "ambos"
  }
}

// Método para manejar el cambio de estado del checkbox de 2WD
toggle2wdCheckbox(): void {
  this.is2wdChecked = !this.is2wdChecked; // Cambiar el estado del checkbox
  this.selectedTransmission = this.is2wdChecked ? '2wd' : null; // Asignar 2WD si está marcado

  // Si el checkbox está marcado, reiniciar la selección de 4WD
  if (this.is2wdChecked) {
      this.is4wdChecked = false; // Desmarcar 4WD
  } else {
      this.selectedTransmission = 'ambos'; // Si no está marcado, asignar "ambos"
  }
}

// Método para manejar el cambio de estado del checkbox de 4WD
toggle4wdCheckbox(): void {
  this.is4wdChecked = !this.is4wdChecked; // Cambiar el estado del checkbox
  this.selectedTransmission = this.is4wdChecked ? '4wd' : null; // Asignar 4WD si está marcado

  // Si el checkbox está marcado, reiniciar la selección de 2WD
  if (this.is4wdChecked) {
      this.is2wdChecked = false; // Desmarcar 2WD
  } else {
      this.selectedTransmission = 'ambos'; // Si no está marcado, asignar "ambos"
  }
}

  // Maneja la lógica de recogida de datos cuando el modal se cierra
  onModalHidden() {
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const interval = Number((document.getElementById('interval') as HTMLInputElement).value);

    // Asignar "ambos" si no se selecciona nada
    const fuelType = this.selectedFuel || 'ambos';
    const transmissionType = this.selectedTransmission || 'ambos';
    
    // Obtener el tipo de inspección seleccionado
    const inspectionType = (document.querySelector('input[name="inspectionType"]:checked') as HTMLInputElement)?.value;

    const data = {
        name,
        interval,
        fuelType,
        transmissionType,
        inspectionType
    };

    this.createInspection(data);
}
}