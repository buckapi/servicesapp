import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthPocketbaseService } from '@app/services/auth.service';
import { GlobalService } from '@app/services/global.service';
import { InspeccionService } from '@app/services/inspection.service';
import { RealtimeCarsService } from '@app/services/realtime-cars.service';
import { RealtimeClientsService } from '@app/services/realtime-clients.service';
import { RealtimeInspectionsService } from '@app/services/realtime-inspections.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public filteredResults: any[] = []; // Define la propiedad aquí

  totalClientes!: number; // Aserción no nula
  public searchTerm: string = ''; // Nueva propiedad para el término de búsqueda
  public searchTerm2: string = ''; // Nueva propiedad para el término de búsqueda
  public cars: any[] = []; // Agregar esta línea para almacenar los coches
  public clients: any[] = []; // Agregar esta línea para almacenar los clientes
  public showDetail =false;
constructor(
  public realtimeInspectionsService: RealtimeInspectionsService,
  public auth:AuthPocketbaseService,
  public clientsService: RealtimeClientsService,
  public carsService: RealtimeCarsService,
  public globalService: GlobalService,
  public inspeccionService: InspeccionService
) {
  
}
filterResults() {
  this.filteredResults = this.cars.filter(car => 
    car.patent.toLowerCase().includes(this.searchTerm2.toLowerCase()) // Filtra sin distinción de mayúsculas y minúsculas
  );
}
ngOnInit() {
  this.clientsService.clients$.subscribe(clients => {
    this.globalService.totalClientes = clients.length; // Actualiza el conteo de clientes en tiempo real
    this.clients = clients; // Almacena los clientes en la propiedad
    this.filterResults(); // Aplica el filtro inicial
  });
  this.carsService.cars$.subscribe(cars => {
    this.globalService.totalCars = cars.length; // Actualiza el conteo de autos en tiempo real
    this.cars = cars; // Almacena los coches en la propiedad
    this.filterResults(); // Aplica el filtro inicial
  });
}
goToNewRecord() { 
  localStorage.setItem('carId', '');
  localStorage.setItem('mileage', JSON.stringify(0));
  localStorage.setItem('tractionType', '');
  localStorage.setItem('fuelType', '');
  this.globalService.setRoute('new-record');
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
    level: "two", 
    carId: this.globalService.clienteDetail.cars?.[0]?.id,
    date: "2022-01-01 10:00:00.123Z",
    mileage: this.globalService.mileage
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

onShowDetail(clientId: string) {
  this.crearInspeccion();
  this.globalService.showHistorial = true;
  this.searchTerm2 = ''; // Reinicia el valor de searchTerm2
  this.clientsService.clients$.subscribe(clients => {
      const client = clients.find(c => c.id === clientId);
      if (client) {
    localStorage.setItem('clientId', clientId);

          this.globalService.clienteDetail = client;
          this.carsService.getCarsByUserId(client.id).then(cars => {
              this.globalService.clienteDetail.cars = cars;
              this.globalService.carId=cars[0].id;
    localStorage.setItem('carId', cars[0].id);
    localStorage.setItem('mileage', JSON.stringify(cars[0].mileage));
    this.globalService.mileage=cars[0].mileage;
    localStorage.setItem('tractionType', cars[0].tractionType);
    localStorage.setItem('fuelType', cars[0].fuelType);
    localStorage.setItem('firstTime', cars[0].firstTime);
            this.globalService.tractionType=cars[0].tractionType;
            this.globalService.fuelType=cars[0].fuelType;
    this.getMileage(client.id);
              
          });
          this.toggleDetail();
          this.globalService.showHistorial = true;
      } else {
          console.error('Client not found for ID:', clientId);
      }
  });
}
toggleDetail(){
  this.globalService.showDetail==true?this.globalService.showDetail=false:this.globalService.showDetail=true;
  this.globalService.setRoute('car-detail');
 
}
// getMileage(clientId: string): number {
//   const car = this.cars.find(car => car.userId === clientId);
//   this.globalService.mileage= car ? car.mileage : 0; // Asegúrate de que car.mileage sea un número
//   return car ? car.mileage : 0; // Asegúrate de que car.mileage sea un número
// }
getMileage(clientId: string): void {
  this.realtimeInspectionsService.inspections$.subscribe(inspections => {
      console.log('Inspecciones:', inspections);

      if (!this.globalService.clienteDetail || !localStorage.getItem('carId') || this.globalService.clienteDetail.cars.length === 0) {
          return; // Sal de la función si no hay coche
      }

      if (inspections.length === 0) {
          this.globalService.mileage = this.globalService.clienteDetail.cars[0].mileage;
          return;
      }

      const previousInspections = inspections.filter(inspection => inspection.carId === this.globalService.carId && inspection.status === 'completada');
      const hasPreviousInspections = previousInspections.length > 0;

      if (hasPreviousInspections) {
          const lastInspection = previousInspections[previousInspections.length - 1];
          this.globalService.prevInspectionValue = lastInspection;
          this.globalService.prevMileage = lastInspection.mileage;

          localStorage.setItem('itemsPre', JSON.stringify(lastInspection.items));
          localStorage.setItem('level', previousInspections.length <= 1 ? 'two' : lastInspection.level.toString());
          localStorage.setItem('inspeccionId', inspections[inspections.length - 2]?.id || '');
      } else {
          localStorage.setItem('level', JSON.stringify('one'));
      }
  });
}
getClientDetail(userId:string){
  this.clientsService.clients$.subscribe(clients => {
    this.clients = clients;
  })
  const client = this.clients.find(client => client.id === userId);
  return client;
}
get filteredClients() {
  return this.clientsService.clients$.pipe(
      map(clients => clients.filter(client => 
          client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          client.phone.includes(this.searchTerm) ||
          client.rut.includes(this.searchTerm) ||
          this.getPatente(client.id).includes(this.searchTerm) // Asumiendo que getPatente devuelve la patent
      ))
  );
}
getPatente(clientId: string): string {
  const car = this.cars.find(car => car.userId === clientId);
  return car ? car.patent : 'Sin patent';
}
}
