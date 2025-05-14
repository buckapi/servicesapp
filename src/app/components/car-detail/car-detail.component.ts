import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HistorialComponent } from '@app/components/historial/historial.component';
import { WinzardComponent } from '@app/components/winzard/winzard.component';
import { GlobalService } from '@app/services/global.service';
import { ModalInspectionComponent } from '../modal-inspection/modal-inspection.component';
import { CarrDetailAddInspectionComponent } from '../modales/carr-detail-add-inspection/carr-detail-add-inspection.component';
import { ClientsAddInspectionComponent } from '../modales/clients-add-inspection/clients-add-inspection.component';

@Component({
  selector: 'app-car-detail',
  imports: [
HistorialComponent,
WinzardComponent,
CommonModule,
// ModalInspectionComponent
CarrDetailAddInspectionComponent,
ClientsAddInspectionComponent


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
  this.global.showDetail=false;
}
onShowWizard(){
  this.global.showWinzard=true;
  this.global.showHistorial=false;
  
}
goToCarDetail(){
  this.global.mileage=0;
  this.global.lastItems=[
    
  ]
  this.global.prevInspectionValue={
    id:'',
    level:'one',
    mileage:0, 
    items:[

    ],
    status:'',
    date: new Date()
  };
  this.global.showWinzard=false;
  this.global.showHistorial=true;
}
}
