import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthPocketbaseService } from '@app/services/auth.service';
import { GlobalService } from '@app/services/global.service';
import { RealtimeCarsService } from '@app/services/realtime-cars.service';
import { RealtimeClientsService } from '@app/services/realtime-clients.service';
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
  public auth:AuthPocketbaseService,
  public clientsService: RealtimeClientsService,
  public carsService: RealtimeCarsService,
  public globalService: GlobalService
) {
  
}
filterResults() {
  this.filteredResults = this.cars.filter(car => 
    car.patente.includes(this.searchTerm2) // Filtra por patente
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
onShowDetail(clientId: string) {
  this.globalService.showHistorial = true;
  this.searchTerm2 = ''; // Reinicia el valor de searchTerm2
  this.clientsService.clients$.subscribe(clients => {
      const client = clients.find(c => c.id === clientId);
      if (client) {
          this.globalService.clienteDetail = client;
          this.carsService.getCarsByUserId(client.id).then(cars => {
              this.globalService.clienteDetail.cars = cars;
          });
          this.toggleDetail();
          this.globalService.showHistorial = true;
      } else {
          console.error('Client not found for ID:', clientId);
      }
  });
}
toggleDetail(){
  this.globalService.showDetail=!this.globalService.showDetail;
  this.getMileage(this.globalService.clienteDetail.id);
  this.globalService.setRoute('car-detail');

  
}
getMileage(clientId: string): number {
  const car = this.cars.find(car => car.idUser === clientId);
  this.globalService.mileage= car ? car.mileage : 0; // Asegúrate de que car.mileage sea un número
  return car ? car.mileage : 0; // Asegúrate de que car.mileage sea un número
}



getClientDetail(idUser:string){
  this.clientsService.clients$.subscribe(clients => {
    this.clients = clients;
  })
  const client = this.clients.find(client => client.id === idUser);
  return client;
}
get filteredClients() {
  return this.clientsService.clients$.pipe(
      map(clients => clients.filter(client => 
          client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          client.phone.includes(this.searchTerm) ||
          client.rut.includes(this.searchTerm) ||
          this.getPatente(client.id).includes(this.searchTerm) // Asumiendo que getPatente devuelve la patente
      ))
  );
}
getPatente(clientId: string): string {
  const car = this.cars.find(car => car.idUser === clientId);
  return car ? car.patente : 'Sin patente';
}
}
