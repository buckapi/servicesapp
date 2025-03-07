// description-popup.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-description-popup',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './description-popup.component.html',
  styleUrl: './description-popup.component.css'
})





@Component({
  selector: 'app-description-popup',
  templateUrl: './description-popup.component.html',
})
export class DescriptionPopupComponent {
  @Output() descriptionSaved = new EventEmitter<string>();
  description: string = '';

  save() {
    this.descriptionSaved.emit(this.description);
    this.close();
  }

  close() {
    // Lógica para cerrar el popup
  }
}