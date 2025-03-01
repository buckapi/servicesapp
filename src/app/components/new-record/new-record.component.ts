import { Component } from '@angular/core';
import { ClientService } from '@app/services/client.service';
import { CarService } from '@app/services/car.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // Importar SweetAlert
import { GlobalService } from '@app/services/global.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-record',
  imports: [FormsModule,CommonModule],
  templateUrl: './new-record.component.html',
  styleUrls: ['./new-record.component.css']
})
export class NewRecordComponent {
  loading = false;

  // Definición de las propiedades
  nombre: string = '';
  rut: string = '';
  telefono: string = '';
  patente: string = '';
  modelo: string = '';
  marca: string = '';
  kilometraje: string = '';
  email: string = '';
  fuelType: string = '';
  transmissionType: string = '';
  


  selectedFuel: string = '';
  selectedTransmission: string = '';

  constructor(
    public global: GlobalService, private clientService: ClientService, private carService: CarService) {}

    async createRecord() {
      this.loading = true;
  
      try {
          const clientData = {
              name: this.nombre,
              rut: this.rut,
              phone: this.telefono,
              email: this.email // Asegúrate de que email esté correctamente inicializado
          };
  
          console.log('Client Data:', clientData); // Verifica los datos del cliente
  
          const client = await this.clientService.createClient(clientData);
          
          const carData = {
              patente: this.patente,
              brand: this.marca,
              model: this.modelo,
              mileage: this.kilometraje,
              idUser: client.id,
              fuelType: this.selectedFuel,
              transmissionType: this.selectedTransmission
          };
          
          await this.carService.createCar(carData);
          
          Swal.fire({
              title: 'Cliente y vehículo registrados exitosamente!',
              text: '',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              customClass: {
                  confirmButton: 'btn btn-success rounded'
              }
          }).then(() => {
              this.global.setRoute('clients');
              this.resetForm();
          });
      } catch (error) {
          console.error('Error al crear el cliente o el coche:', error);
          Swal.fire({
              title: 'Error!',
              text: 'No se pudo crear el cliente o el coche.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              customClass: {
                  confirmButton: 'btn btn-danger rounded'
              }
          });
      } finally {
          this.loading = false;
      }
  }

  // Método para limpiar el formulario
  resetForm() {
    this.nombre = '';
    this.rut = '';
    this.telefono = '';
    this.patente = '';
    this.modelo = '';
    this.marca = '';
    this.kilometraje = '';
    this.email = '';
    this.fuelType = '';
    this.transmissionType = '';
    this.selectedFuel = '';
    this.selectedTransmission = '';
  }
}