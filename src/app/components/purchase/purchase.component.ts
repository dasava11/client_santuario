import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchasesService } from '../../services/purchases/purchases.service';
import { Purchase } from '../../models/purchases';
import { ProductService } from '../../services/product/product.service';
import { SupplierService } from '../../services/supplier/supplier.service'; // Se agregó la importación del servicio de proveedores
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule , FormsModule, ReactiveFormsModule],
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})


export class PurchaseComponent implements OnInit {
  purchaseForm: FormGroup;
  products: any[] = [];
  filteredProducts: any[] = [];
  suppliers: any[] = []; // Lista de proveedores
  selectedProducts: any[] = [];
  subtotal: number = 0;
  taxes: number = 0;
  total: number = 0;
  searchTerm: string = ''; // Variable para el campo de búsqueda

  constructor(
    private purchasesServices: PurchasesService, 
    private productService: ProductService,
    private supplierService: SupplierService, // Se agregó para obtener los proveedores
    private fb: FormBuilder
  ) {
    this.purchaseForm = this.fb.group({
      supplier: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadSuppliers(); // Cargar proveedores al iniciar
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      data => {
        this.products = data;
        this.filteredProducts = data; // Inicialmente todos los productos están disponibles
      },
      error => { console.error('Error loading products', error); }
    );
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(
      data => { this.suppliers = data; },
      error => { console.error('Error loading suppliers', error); }
    );
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectProduct(product: any): void {
    const exists = this.selectedProducts.find(p => p.id_products === product.id_products);
    if (!exists) {
      this.selectedProducts.push({ ...product, quantity: 1 });
      this.updateTotals();
    }
  }

  removeProduct(index: number): void {
    this.selectedProducts.splice(index, 1);
    this.updateTotals();
  }

  updateTotals(): void {
    this.subtotal = this.selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    this.taxes = this.subtotal * 0.19; // Suponiendo 19% de IVA
    this.total = this.subtotal + this.taxes;
  }

  submitPurchase(): void {
  if (this.purchaseForm.valid && this.selectedProducts.length > 0) {
    const purchaseData: Purchase = {
      supplier: this.purchaseForm.value.supplier,
      date: this.purchaseForm.value.date,
      count: this.selectedProducts.length,
      price: this.subtotal, // Se envía como referencia, pero el backend lo recalcula
      taxes: this.taxes, // Se envía como referencia, pero el backend lo recalcula
      subtotal: this.subtotal, // Se envía como referencia
      total_price: this.total, // Se envía como referencia, pero el backend lo recalcula
      detailPurchasesBody: this.selectedProducts.map(product => ({
        id_detail_purchases: '', // Se generará en el backend
        id_purchases: 0, // Se generará en el backend
        id_products: product.id_products,
        count: product.quantity, // Debe ser count, no quantity
        unit_price: product.unit_price,
        value_taxes: product.value_taxes, // Enviar el porcentaje, el backend lo procesa
        total: (product.unit_price + (product.unit_price * product.value_taxes / 100)) * product.quantity // Corrección del cálculo
      }))
    };

    this.purchasesServices.createPurchase(purchaseData).subscribe(
      response => {
        console.log('Compra realizada con éxito', response);
        this.selectedProducts = [];
        this.purchaseForm.reset();
        this.updateTotals(); // Asegúrate de que este método existe y actualiza los valores correctamente
      },
      error => {
        console.error('Error al enviar la compra', error);
      }
    );
    }
  }
}