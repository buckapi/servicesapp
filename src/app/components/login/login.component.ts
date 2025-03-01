import { Component } from '@angular/core';
import { AuthPocketbaseService } from '../../services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule // Agrega FormsModule aquí
  ],

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthPocketbaseService) {}

  login() {
    this.authService.loginUser(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Inicio de sesión exitoso:', response);
        localStorage.setItem('isLoggedin', 'true'); // Guardar el estado de login
          const currentUser = this.authService.getCurrentUser();
   this.authService.permision();
        // Aquí puedes redirigir al usuario o realizar otras acciones
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
      }
    });
  }
}