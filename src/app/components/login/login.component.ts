import { Component } from '@angular/core';
import { AuthPocketbaseService } from '../../services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    FormsModule // Agrega FormsModule aquí
  ],

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  showPassword: boolean = false;

  password: string = '';

  constructor(public authService: AuthPocketbaseService) {}
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  login() {
    // alert('datos: ' + this.email + ' ' + this.password);
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