import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent {
  // Controla si el modal está visible
  @Input() visible: boolean = false;

  // Emite cuando el usuario cancela
  @Output() cancel = new EventEmitter<void>();

  // Emite cuando se envían los datos
  @Output() create = new EventEmitter<any>();

  // Modelo de producto
  product = {
    name: '',
    description: '',
    category: '',
    price: 0,
    state: 'Activo'
  };

  onCancel() {
    this.cancel.emit();
  }

  onCreate() {
    this.create.emit(this.product);
  }
}
