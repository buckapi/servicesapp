import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RealtimeMecanicosService } from '@app/services/realtime-mecanicos.service';
import { UserService } from '@app/services/user.service';
import Swal from 'sweetalert2'; // Importa SweetAlert

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  newUser = {
    name: '',
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  };

  constructor(private userService: UserService,

    public realtimeMecanicosService: RealtimeMecanicosService
  ) {

  }

  private generateRandomPassword(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  async createUser(user: any) {
    // Genera una contraseña aleatoria de 8 caracteres
    this.newUser.password = this.generateRandomPassword(8);
    this.newUser.passwordConfirm = this.newUser.password; // Asegúrate de que coincidan
  
    const data = {
      username: user.username,
      email: user.username + "@servicesapp.com",
      password: this.newUser.password,
      passwordConfirm: this.newUser.passwordConfirm,
      name: user.name,
      type: 'mecanico', // Puedes omitir esto si lo pasas al crear el mecánico
    };
  
    try {
      const userRecord = await this.userService.createUser(data);
      console.log('User created:', userRecord);
      
      // Crear el registro en mecanicos
      await this.userService.createMechanic(userRecord.id, user.name, this.newUser.password,'mecanico');
  
      // Mostrar la alerta de SweetAlert con la contraseña
      Swal.fire({
        title: 'Usuario creado',
        text: `La contraseña generada es: ${this.newUser.password}`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error creating user:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo crear el usuario. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }
}