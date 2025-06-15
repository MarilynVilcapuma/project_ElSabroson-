import { Component } from '@angular/core';
import { UsersFormComponent } from '../users-form/users-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-list',
  imports: [UsersFormComponent, FormsModule, CommonModule],
  standalone: true,
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
 arrova="@";
showUserForm = false;

searchTerm: string = '';

  users = [
    {
      nombre: 'Juan Pérez',
      documento: '12345678',
      email: 'juan@gmail.com',
      celular: '987654321',
      rol: 'Administrador',
      registro: '15/01/2023',
      estado: 'Activo'
    },
    {
      nombre: 'María García',
      documento: '87654321',
      email: 'maria@outlook.com',
      celular: '987123456',
      rol: 'Empleado',
      registro: '20/02/2023',
      estado: 'Activo'
    },
    {
      nombre: 'Carlos López',
      documento: '45678912',
      email: 'carlos@gmail.com',
      celular: '912345678',
      rol: 'Empleado',
      registro: '10/03/2023',
      estado: 'Activo'
    },
    {
      nombre: 'Ana Martínez',
      documento: '78912345',
      email: 'ana@gmail.com',
      celular: '945678123',
      rol: 'Cliente',
      registro: '05/04/2023',
      estado: 'Inactivo'
    },
    {
      nombre: 'Pedro Salazar',
      documento: '65432178',
      email: 'pedro@outlook.com',
      celular: '931234567',
      rol: 'Cliente',
      registro: '12/05/2023',
      estado: 'Activo'
    }
  ];

  filteredUsers = [...this.users];

  openUserForm() {
    this.showUserForm = true;
  }

  closeUserForm() {
    this.showUserForm = false;
  }

  createUser(user: any) {
    console.log('Usuario creado:', user);
    this.showUserForm = false;
    // Aquí podrías añadir el usuario a tu lista o hacer un POST a la API
  }

   filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.nombre.toLowerCase().includes(term) ||
      user.documento.includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }
 
}
