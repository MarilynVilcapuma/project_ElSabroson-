import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-form',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() productData: any | null = null; 

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<any>(); 
  @Output() update = new EventEmitter<any>(); 

  productForm!: FormGroup; 
  categoriesOptions = [
    { value: 'P', label: 'Producto' },
    { value: 'B', label: 'Servicio' }
  ];
  stateOptions = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' }
  ];

  constructor(private fb: FormBuilder) { } 

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productData'] && this.productForm) {
      if (this.productData) {
        this.productForm.patchValue({
          productId: this.productData.productId, 
          name: this.productData.name,
          description: this.productData.description,
          category: this.productData.category,
          price: this.productData.price,
          stock: this.productData.stock, 
          state: this.productData.state
        });

        this.updateHeader('Editar Producto', 'Modifica los datos del producto');
      } else {
    
        this.productForm.reset({
          name: '',
          description: '',
          category: 'P', 
          price: 0,
          stock: 1, 
          state: 'A' 
        });

        this.updateHeader('Nuevo Producto', 'Completa el formulario para crear un nuevo producto');
      }
    }

    if (changes['visible'] && changes['visible'].currentValue === true && !this.productData) {
      this.productForm.reset({
          name: '',
          description: '',
          category: 'P', 
          price: 0,
          stock: 1, 
          state: 'A' 
      });
    }
  }


  private updateHeader(title: string, subtitle: string) {

  }


  initForm(): void {
    this.productForm = this.fb.group({

      productId: [null], 

      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-z áéíóúÁÉÍÓÚñÑ]+$/) 
      ]],
      description: ['', [
        Validators.required,
        Validators.maxLength(150)
      ]],
      category: ['P', [
        Validators.required,
        Validators.pattern(/^[PB]$/) 
      ]],
      price: [0, [
        Validators.required,
        Validators.min(0.01)
      ]],
      stock: [1, [ 
        Validators.required,
        Validators.min(1) 
      ]],
      state: ['A', [
        Validators.required,
        Validators.pattern(/^[AI]$/) 
      ]]
    });
  }

  onCancel(): void {
    this.visible = false; 
    this.cancel.emit();
    this.productForm.reset(); 
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      if (product.productId) {
    
        this.update.emit(product);
      } else {
      
        this.create.emit(product);
      }
      this.visible = false; 
      this.productForm.reset(); 
    } else {
      
      this.productForm.markAllAsTouched();
     
      console.error('Formulario inválido. Por favor, revisa los campos.');
    }
  }

  
  hasError(controlName: string, errorType: string): boolean {
    const control = this.productForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}