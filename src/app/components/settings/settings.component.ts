import { Component, OnInit, Inject } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { RealtimeCategoriesService } from '@app/services/realtime-categories.service';
import { RealtimeStylesService } from '@app/services/realtime-styles.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from 'src/app/services/category.service'; // Adjust the import path accordingly
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { StyleService } from '@app/services/style.service';


@Component({
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  constructor(
    public realtimeStylesService: RealtimeStylesService,  
    public categoryService: CategoryService,
    public styleService: StyleService,
    public realtimeCategoriesService: RealtimeCategoriesService,
    private globalService: GlobalService) {
      
    }

    // async addCategory() {
    //   const categoryName = prompt('Enter category name:'); // Get category name from user input
    //   if (categoryName) {
    //     try {
    //       await this.categoryService.addCategory(categoryName);
    //       // Optionally refresh the categories list here
    //     } catch (error) {
    //       console.error('Failed to add category:', error);
    //     }
    //   }
    // }

    async addCategory() {
      const { value: categoryName } = await Swal.fire({
        title: 'Agregar Categoría',
        input: 'text',
        inputLabel: 'Nombre de la categoría',
        inputPlaceholder: 'Escribe el nombre de la categoría',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return '¡Necesitas escribir un nombre de categoría!';
          }
          return null; // Asegúrate de devolver null si no hay errores
        }
      });
    
      if (categoryName) {
        try {
          await this.categoryService.addCategory(categoryName);
          // Opcionalmente, refresca la lista de categorías aquí
        } catch (error) {
          console.error('Error al agregar la categoría:', error);
        }
      }
    }

    async addStyle() {
      const { value: styleName } = await Swal.fire({
        title: 'Agregar Estilo',
        input: 'text',
        inputLabel: 'Nombre del estilo',
        inputPlaceholder: 'Escribe el nombre del estilo',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return '¡Necesitas escribir un nombre de estilo!';
          }
          return null; // Asegúrate de devolver null si no hay errores
        }
      });
    
      if (styleName) {
        try {
          await this.styleService.addStyle(styleName);
          // Opcionalmente, refresca la lista de categorías aquí
        } catch (error) {
          console.error('Error al agregar el estilo:', error);
        }
      }
    }


    
  ngOnInit() {
    this.globalService.setRoute('settings');
  }

}
