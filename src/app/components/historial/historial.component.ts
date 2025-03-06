import { Component,AfterViewInit } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
declare var $: any; // Asegúrate de declarar jQuery

@Component({
  selector: 'app-historial',
  imports: [],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements AfterViewInit {
constructor(
  public global:GlobalService
){}
onShowWizard(){
  this.global.showWinzard=true
}
ngAfterViewInit(): void {
  // $('#dataTable').DataTable({
  //     columns: [
  //         { data: 0 }, // # ORDEN
  //         { data: 1 }  // Fecha de Mantenimiento
  //         // No incluyas data: 2
  //     ]
  // });
}

formatDate(dateString: string): string {
  const date = new Date(dateString);
  const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
  const diaSemana = diasSemana[date.getDay()];
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  const anio = date.getFullYear();

  return `${diaSemana} ${dia} de ${mes} de ${anio}`;
}
}
