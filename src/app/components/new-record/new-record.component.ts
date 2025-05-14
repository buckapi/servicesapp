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
  patent: string = '';
  modelo: string = '';
  marca: string = '';
  kilometraje: string = '';
  email: string = '';
  fuelType: string = '';
  tractionType: string = '';
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
              patent: this.patent,
              brand: this.marca,
              model: this.modelo,
              mileage: this.kilometraje,
              userId: client.id,
              fuelType: this.selectedFuel,
              tractionType: this.selectedTransmission,
              firstTime: true
          };
          
          await this.carService.createCar(carData).
          then((response) => {
            localStorage.setItem('carId', response.id);
            this.global.mileage = Number(carData.mileage);
            localStorage.setItem('mileage', carData.mileage);
            localStorage.setItem('tractionType', carData.tractionType);
            localStorage.setItem('fuelType', carData.fuelType);
            localStorage.setItem('firstTime', carData.firstTime.toString());
            this.global.showDetail=true;
            this.global.showHistorial=true;
            this.global.clienteDetail=client;
            this.global.setRoute('car-detail');
          });
          
          Swal.fire({
              title: 'Cliente y vehículo registrados exitosamente!',
              text: '',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              customClass: {
                  confirmButton: 'btn btn-success rounded'
              }
          }).then((response) => {
            this.global.showDetail=true;
            this.global.showHistorial=true;
            this.global.clienteDetail=client;
            this.global.setRoute('car-detail');
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
    this.patent = '';
    this.modelo = '';
    this.marca = '';
    this.kilometraje = '';
    this.email = '';
    this.fuelType = '';
    this.tractionType = '';
    this.selectedFuel = '';
    this.selectedTransmission = '';
  }
}