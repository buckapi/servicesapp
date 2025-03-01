import { Component, OnInit } from '@angular/core';
import { RealtimeStylesService } from '@app/services/realtime-styles.service';
import { RealtimeCategoriesService } from '@app/services/realtime-categories.service';
import { StyleService } from '@app/services/style.service'; // Importa el servicio de estilos
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-entry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.css']
})
export class AddEntryComponent implements OnInit {
  selectedCategory: string | null = null;

  constructor(
    public realtimeCategoriesService: RealtimeCategoriesService,
    public realtimeStylesService: RealtimeStylesService,
    private styleService: StyleService // Inyecta el servicio de estilos
  ) {}

  ngOnInit() {
    // Aquí puedes cargar los datos necesarios si es necesario
  }

  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory = selectElement.value;
    console.log(this.selectedCategory); // Para verificar que se está asignando correctamente
  }

  addNewStyle() {
    Swal.fire({
      title: 'Agregar Nuevo Estilo',
      input: 'text',
      inputLabel: 'Nombre del Estilo',
      inputPlaceholder: 'Escribe el nombre del nuevo estilo',
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return '¡Necesitas escribir un nombre para el estilo!';
        }
        return null; // Asegúrate de devolver null si la entrada es válida
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newStyleName = result.value;
        try {
          await this.styleService.addStyle(newStyleName); // Llama al método para agregar el estilo
          console.log('Nuevo estilo agregado:', newStyleName);
          // Opcionalmente, puedes refrescar la lista de estilos aquí
        } catch (error) {
          console.error('Error al agregar el nuevo estilo:', error);
        }
      }
    });
  }
}