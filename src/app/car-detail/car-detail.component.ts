import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HistorialComponent } from '@app/components/historial/historial.component';
import { WinzardComponent } from '@app/components/winzard/winzard.component';
import { GlobalService } from '@app/services/global.service';

@Component({
  selector: 'app-car-detail',
  imports: [
HistorialComponent,
WinzardComponent,
CommonModule


  ],
  templateUrl: './car-detail.component.html',
  styleUrl: './car-detail.component.css'
})
export class CarDetailComponent {
  constructor(
    public global: GlobalService
  ) { }
goTohome(){
  this.global.activeRoute='home';
  this.global.showDetail=!this.global.showDetail;
}
goToCarDetail(){
  this.global.showWinzard=false;
  this.global.showHistorial=true;
}
}
