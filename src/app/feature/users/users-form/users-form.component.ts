import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './users-form.component.html',
  styleUrl: './users-form.component.scss'
})
export class UsersFormComponent {
 // Controla si el modal está visible
  @Input() visible: boolean = false;

  // Emite cuando el usuario cancela
  @Output() cancel = new EventEmitter<void>();

  // Emite cuando se envían los datos
  @Output() create = new EventEmitter<any>();

  // Aquí puedes simular un modelo de usuario si luego quieres conectar con un formulario reactivo
  user = {
    nombre: '',
    apellido: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    telefono: '',
    email: '',
    rol: 'Mesero',
    estado: 'Activo'
  };

  onCancel() {
    this.cancel.emit();
  }

  onCreate() {
    this.create.emit(this.user);
  }
}
