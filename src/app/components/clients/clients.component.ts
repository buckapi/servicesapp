import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewRecordComponent } from '../new-record/new-record.component';
import { GlobalService } from '@app/services/global.service';
import { RealtimeCarsService } from '@app/services/realtime-cars.service';
import { RealtimeClientsService } from '@app/services/realtime-clients.service';
import { map } from 'rxjs/operators'; // Asegúrate de importar map
import { FormsModule } from '@angular/forms';
import { HistorialComponent } from '../historial/historial.component';
import { WinzardComponent } from '../winzard/winzard.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule,
    HistorialComponent,
    WinzardComponent,
    // NewRecordComponent,
    FormsModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit {
  public searchTerm: string = ''; // Nueva propiedad para el término de búsqueda

  public cars: any[] = []; // Agregar esta línea para almacenar los coches
  public showDetail =false;
  constructor(
    public global: GlobalService, 
    public realtimeClientsService: RealtimeClientsService,
    public realtimeCarsService: RealtimeCarsService
  ) {}

  ngOnInit(): void {
    // Suscribirse al observable para obtener los coches
    this.realtimeCarsService.cars$.subscribe(cars => {
      this.cars = cars;
    });
  }
  back(){
    this.showDetail=false
    this.global.setRoute('clients')
  }

  get filteredClients() {
    return this.realtimeClientsService.clients$.pipe(
        map(clients => clients.filter(client => 
            client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            client.phone.includes(this.searchTerm) ||
            client.rut.includes(this.searchTerm) ||
            this.getPatente(client.id).includes(this.searchTerm) // Asumiendo que getPatente devuelve la patente
        ))
    );
}

toggleDetail(){
  this.showDetail=!this.showDetail;
  this.getMileage(this.global.clienteDetail.id);
  
}
onShowDetail(clientId: string) {
  this.realtimeClientsService.clients$.subscribe(clients => {
      console.log('Clients:', clients); // Verifica los clientes disponibles
      const client = clients.find(c => c.id === clientId);
      if (client) {
          this.global.clienteDetail = client;
          this.realtimeCarsService.getCarsByUserId(client.id).then(cars => {
              this.global.clienteDetail.cars = cars;
          });
          this.toggleDetail();
      } else {
          console.error('Client not found for ID:', clientId);
      }
  });
}
getMileage(clientId: string): number {
  const car = this.cars.find(car => car.idUser === clientId);
  this.global.mileage= car ? car.mileage : 0; // Asegúrate de que car.mileage sea un número
  return car ? car.mileage : 0; // Asegúrate de que car.mileage sea un número
}


  getPatente(clientId: string): string {
    const car = this.cars.find(car => car.idUser === clientId);
    return car ? car.patente : 'Sin patente';
  }
}
