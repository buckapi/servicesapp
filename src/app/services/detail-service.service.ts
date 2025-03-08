import { Injectable } from '@angular/core';
import { RealtimeClientsService } from '@app/services/realtime-clients.service';
import { RealtimeCarsService } from '@app/services/realtime-cars.service';
import { GlobalService } from '@app/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  constructor(
    private clientsService: RealtimeClientsService,
    private carsService: RealtimeCarsService,
    private globalService: GlobalService
  ) {}

  onShowDetail(clientId: string) {
    this.globalService.showHistorial = true;
  
    // Inicializa clienteDetail como un objeto vacío que cumpla con la estructura de ClienteDetail
    this.globalService.clienteDetail = {
      id: '',
      name: '',
      email: '',
      rut: '',
      telefono: '',
      cars: [], // Asegúrate de que 'cars' sea un arreglo
      patente: '', // Agrega las propiedades que faltan
      modelo: '',
      phone: '',
      marca: '',
      transmissionType: '',
      mileage: 0,
      fuelType: '',
      // Agrega otras propiedades según la definición de ClienteDetail
    };
  
    this.clientsService.clients$.subscribe(clients => {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        this.globalService.clienteDetail = client;
        this.carsService.getCarsByUserId(client.id).then(cars => {
          this.globalService.clienteDetail.cars = cars;
          this.globalService.carId = cars[0]?.id; // Usa el primer coche si existe
          this.getMileage(client.id);
        });
        this.toggleDetail();
      } else {
        console.error('Client not found for ID:', clientId);
      }
    });
  }
  toggleDetail() {
    this.globalService.showDetail = !this.globalService.showDetail;
    this.globalService.setRoute('car-detail');
  }

  getMileage(clientId: string): void {
    this.carsService.getCarsByUserId(clientId).then(cars => {
      if (cars.length > 0) {
        this.globalService.mileage = cars[0].mileage; // Asigna el kilometraje del primer coche
      } else {
        console.error('No cars found for client:', clientId);
      }
    });
  }
}