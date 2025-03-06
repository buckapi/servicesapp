import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterInspections',
  standalone: true // Añadimos esta línea
})
export class FilterInspectionsPipe implements PipeTransform {
  transform(    inspections: any[], carId: string): any[] {
    if (carId) {
    //   return inspections; // Mostrar todos los especialistas si es admin
      return inspections.filter(inspection => inspection.carId === carId );

    } else {
      return inspections.filter(inspection => inspection.status === 'completada'  );
    }
  }
}