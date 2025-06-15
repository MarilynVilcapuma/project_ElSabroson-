import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ProductService } from '../../../core/services/products.service';
import { Products } from '../../../core/interfaces/products'; 
import Swal from 'sweetalert2';
import { ProductsFormComponent } from '../products-form/products-form.component'; 

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    MatButtonModule,
    MatIconModule,
    ProductsFormComponent 
  ],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  products: Products[] = [];
  filteredProducts: Products[] = [];
  categories: string[] = [];

  showInactives = false;

  searchTerm: string = '';
  filterCategory: string = '';
  filterState: string = '';

  showProductForm: boolean = false; 
  currentProduct: Products | null = null; 

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.filterState = this.showInactives ? 'I' : 'A';
    this.loadProducts();
  }

  toggleList() {
    this.showInactives = !this.showInactives;
    this.filterState = this.showInactives ? 'I' : 'A';
    this.loadProducts();
  }

  loadProducts() {
    if (this.filterState === 'A' || this.filterState === 'I') {
      this.productService.getByState(this.filterState).subscribe((data) => {
        this.products = data;
        this.extractCategories();
        this.applyFilters();
      });
    } else {
      this.productService.getAll().subscribe((data) => {
        this.products = data;
        this.extractCategories();
        this.applyFilters();
      });
    }
  }

  extractCategories() {
    const cats = new Set<string>();
    this.products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    this.categories = Array.from(cats).sort();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch =
        this.searchTerm === '' ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory =
        this.filterCategory === '' || product.category === this.filterCategory;

      return matchesSearch && matchesCategory;
    });
  }

  filterProducts() {
    if (this.filterState === 'A' || this.filterState === 'I' || this.filterState === '') {
      this.loadProducts();
    }
    else {
      this.applyFilters();
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }


  editProduct(product: Products) {
    this.currentProduct = { ...product }; 
    this.showProductForm = true; 
  }

  deleteProduct(id?: number) {
    if (!id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el producto de forma lógica.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete(id).subscribe(() => {
          Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
          this.loadProducts();
        }, error => {
          Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
        });
      }
    });
  }

  restoreProduct(id?: number) {
    if (!id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción restaurará el producto.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.restore(id).subscribe(() => {
          Swal.fire('Restaurado', 'El producto ha sido restaurado.', 'success');
          this.loadProducts();
        }, error => {
          Swal.fire('Error', 'No se pudo restaurar el producto.', 'error');
        });
      }
    });
  }


  openProductForm() {
    this.currentProduct = null; 
    this.showProductForm = true; 
  }

 
  onProductFormCancel() {
    this.showProductForm = false; 
    this.currentProduct = null; 
  }


  onProductFormCreate(newProduct: Products) {

    this.productService.create(newProduct).subscribe({
      next: (savedProduct) => {
        Swal.fire('¡Éxito!', 'Producto creado correctamente.', 'success');
        this.loadProducts(); 
        this.showProductForm = false; 
        this.currentProduct = null; 
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo crear el producto.', 'error');
        console.error('Error creando producto:', error);
      }
    });
  }


  onProductFormUpdate(updatedProduct: Products) {
    if (!updatedProduct.productId) {
      console.error('Error: No se encontró el ID del producto para la actualización.');
      Swal.fire('Error', 'No se pudo actualizar el producto: ID faltante.', 'error');
      return;
    }


    this.productService.update(updatedProduct.productId, updatedProduct).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Producto actualizado correctamente.', 'success');
        this.loadProducts(); 
        this.showProductForm = false; 
        this.currentProduct = null; 
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
        console.error('Error actualizando producto:', error);
      }
    });
  }

  private mapProductState(product: Products): Products {
    const mappedProduct = { ...product };
    if (mappedProduct.state === 'Activo') {
      mappedProduct.state = 'A';
    } else if (mappedProduct.state === 'Inactivo') {
      mappedProduct.state = 'I';
    }
    return mappedProduct;
  }

}