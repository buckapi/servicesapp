import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-add-category-modal',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Add Category</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Category Name</mat-label>
        <input matInput [(ngModel)]="categoryName" />
      </mat-form-field> 
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button (click)="onAdd()">Add</button>
    </mat-dialog-actions>
  `
})
export class AddCategoryModalComponent {
  categoryName: string = '';

  constructor(private dialogRef: MatDialogRef<AddCategoryModalComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    this.dialogRef.close(this.categoryName);
  }
}