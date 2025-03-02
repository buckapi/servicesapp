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

ngAfterViewInit(): void {
  $('#dataTable').DataTable({
      columns: [
          { data: 0 }, // # ORDEN
          { data: 1 }  // Fecha de Mantenimiento
          // No incluyas data: 2
      ]
  });
}
}
