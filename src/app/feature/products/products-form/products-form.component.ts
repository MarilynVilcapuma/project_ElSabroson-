// src/app/modules/products/components/products-form/products-form.component.ts
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
import { CommonModule } from '@angular/common';

// Importa tu interfaz Products (asegúrate de que la ruta sea correcta)
import { Products } from '../../../core/interfaces/products';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Usar ReactiveFormsModule
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() productData: Products | null = null; // Recibe el producto a editar o null para crear

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<Products>(); // Emite el producto creado
  @Output() update = new EventEmitter<Products>(); // Emite el producto actualizado

  productForm!: FormGroup; // Declaración del FormGroup

  // Opciones para los select (para mapear a los valores de la DB)
  categoriesOptions = [
    { value: 'P', label: 'Producto' },
    { value: 'B', label: 'Servicio' } // Ajusta el label si 'B' es otra cosa
  ];
  stateOptions = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' }
  ];

  constructor(private fb: FormBuilder) { } // Inyecta FormBuilder

  ngOnInit(): void {
    this.initForm();
  }

  // Este hook se ejecuta cuando cambian las propiedades de entrada (@Input)
  ngOnChanges(changes: SimpleChanges): void {
    if (this.productForm) { // Asegura que el formulario esté inicializado
      // Manejar la visibilidad del modal
      if (changes['visible'] && changes['visible'].currentValue === true) {
        if (this.productData) {
          // Si hay productData, es modo edición: rellenar el formulario
          this.productForm.patchValue({
            productId: this.productData.productId,
            name: this.productData.name,
            description: this.productData.description,
            category: this.productData.category,
            price: this.productData.price,
            stock: this.productData.stock,
            state: this.productData.state
          });
        } else {
          // Si no hay productData, es modo creación: resetear con valores por defecto
          this.productForm.reset({
            productId: null,
            name: '',
            description: '',
            category: 'P', // Valor por defecto
            price: 0,
            stock: 1,    // Valor por defecto
            state: 'A'   // Valor por defecto
          });
        }
      } else if (changes['visible'] && changes['visible'].currentValue === false) {
        // Cuando el modal se cierra, resetear el formulario completamente
        this.productForm.reset();
      }
    }
  }

  // Inicializa el FormGroup con sus FormControl y Validators
  initForm(): void {
    this.productForm = this.fb.group({
      productId: [null], // Se usará para identificar si es edición o creación
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-z áéíóúÁÉÍÓÚñÑ]+$/) // Permite letras, espacios, y vocales acentuadas/ñ
      ]],
      description: ['', [
        Validators.required,
        Validators.maxLength(150)
      ]],
      category: ['P', [ // 'P' como valor por defecto
        Validators.required,
        Validators.pattern(/^[PB]$/) // Solo 'P' o 'B'
      ]],
      price: [0, [ // 0 como valor inicial, validación a > 0
        Validators.required,
        Validators.min(0.01) // Precio debe ser mayor que 0
      ]],
      stock: [1, [ // 1 como valor inicial, validación a > 0
        Validators.required,
        Validators.min(1) // Stock debe ser mayor que 0
      ]],
      state: ['A', [ // 'A' como valor por defecto
        Validators.required,
        Validators.pattern(/^[AI]$/) // Solo 'A' o 'I'
      ]]
    });
  }

  onCancel(): void {
    this.visible = false; // Oculta el modal
    this.cancel.emit(); // Emite el evento de cancelación
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productToEmit: Products = this.productForm.value;

      // Dependiendo de tu backend, podrías no necesitar esta conversión si
      // tu servicio ya lo hace o si el backend acepta "Activo"/"Inactivo".
      // Sin embargo, si tu DB usa 'A'/'I', es mejor asegurarse.
      if (productToEmit.state === 'Activo') {
        productToEmit.state = 'A';
      } else if (productToEmit.state === 'Inactivo') {
        productToEmit.state = 'I';
      }

      if (productToEmit.productId) {
        // Si hay un productId, es una actualización
        this.update.emit(productToEmit);
      } else {
        // Si no hay productId, es una creación
        this.create.emit(productToEmit);
      }
      this.visible = false; // Oculta el modal después de la operación
    } else {
      // Si el formulario no es válido, marca todos los controles como 'touched'
      // para que los mensajes de error se muestren al usuario.
      this.productForm.markAllAsTouched();
      console.error('Formulario inválido. Por favor, revisa los campos.');
    }
  }

  // Función de ayuda para verificar si un control tiene un error específico
  hasError(controlName: string, errorType: string): boolean {
    const control = this.productForm.get(controlName);
    // Retorna true si el control existe, tiene el error y ha sido tocado o modificado
    return control ? control.hasError(errorType) && (control.touched || control.dirty) : false;
  }
}