import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthPocketbaseService } from '@app/services/auth.service';
import { GlobalService } from '@app/services/global.service';
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
  public globalService: GlobalService
) {
  
}
filterResults() {
  this.filteredResults = this.cars.filter(car => 
    car.patent.includes(this.searchTerm2) // Filtra por patent
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
  localStorage.setItem('transmissionType', '');
  localStorage.setItem('fuelType', '');
  this.globalService.setRoute('new-record');
}
onShowDetail(clientId: string) {
  this.globalService.showHistorial = true;
  this.searchTerm2 = ''; // Reinicia el valor de searchTerm2
  this.clientsService.clients$.subscribe(clients => {
      const client = clients.find(c => c.id === clientId);
      if (client) {
          this.globalService.clienteDetail = client;
          this.carsService.getCarsByUserId(client.id).then(cars => {
              this.globalService.clienteDetail.cars = cars;
              this.globalService.carId=cars[0].id;
    localStorage.setItem('carId', cars[0].id);
    localStorage.setItem('mileage', JSON.stringify(cars[0].mileage));
    this.globalService.mileage=cars[0].mileage;
    localStorage.setItem('transmissionType', cars[0].transmissionType);
    localStorage.setItem('fuelType', cars[0].fuelType);
            this.globalService.transmissionType=cars[0].transmissionType;
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
      console.log('Inspecciones:', inspections); // Verifica las inspecciones

      // Verifica si clienteDetail y cars están definidos
      if (this.globalService.clienteDetail && localStorage.getItem('carId') && this.globalService.clienteDetail.cars.length > 0) {
          // console.log('Car ID:', this.globalService.carId); // Verifica el carId
      } else {
          // console.error('clienteDetail o cars no están definidos o están vacíos.');
          // alert('No se puede obtener el ID del coche.');
          return; // Sal de la función si no hay coche
      }

      // Verifica si hay inspecciones y su estructura
      if (inspections.length === 0) {
          console.log('No hay inspecciones disponibles.');
          this.globalService.mileage =  this.globalService.clienteDetail.cars[0].mileage;

          alert('No hay inspecciones disponibles. por lo tanto se usara la de registro: ' +this.globalService.clienteDetail.cars[0].mileage );
          return;
      }

      const hasPreviousInspections = inspections.some(inspection => inspection.carId === this.globalService.carId && inspection.status === 'completada');
      console.log('¿Hay inspecciones previas?', hasPreviousInspections); // Verifica el resultado de la búsqueda

      if (hasPreviousInspections) {
        this.globalService.prevInspectionValue = inspections[inspections.length - 1];
        if (hasPreviousInspections) {
          this.globalService.prevInspectionValue = inspections[inspections.length - 1];
        this.globalService.prevMileage = inspections[inspections.length - 1].mileage; // Asigna el último kilometraje

      }
     localStorage.setItem('itemsPre',JSON.stringify(inspections[inspections.length - 1].items ));
     localStorage.setItem('level',JSON.stringify('two')); 
     // alert('hasPreviousInspections' + JSON.stringify(this.globalService.lastItems));
        // this.globalService.mileage = inspections[inspections.length - 1].mileage; // Asigna el último kilometraje
        // this.globalService.prevMileage = inspections[inspections.length - 1].mileage; // Asigna el último kilometraje
        } else {
        localStorage.setItem('level',JSON.stringify('one'));
        // alert('no hasPreviousInspections');
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
