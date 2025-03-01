import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
constructor(
  public auth:AuthPocketbaseService
) {
  
}
}
