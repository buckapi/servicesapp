import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth.service';
import { GlobalService } from '@app/services/global.service';
import { RealtimeCarsService } from '@app/services/realtime-cars.service';
import { RealtimeClientsService } from '@app/services/realtime-clients.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  totalClientes!: number; // Aserción no nula
constructor(
  public auth:AuthPocketbaseService,
  public clientsService: RealtimeClientsService,
  public carsService: RealtimeCarsService,
  public globalService: GlobalService
) {
  
}
ngOnInit() {
  this.clientsService.clients$.subscribe(clients => {
    this.globalService.totalClientes = clients.length; // Actualiza el conteo de clientes en tiempo real
    
  });
  this.carsService.cars$.subscribe(cars => {
    this.globalService.totalCars = cars.length; // Actualiza el conteo de autos en tiempo real
    
  });
}
}
