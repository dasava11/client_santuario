import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { DetailShoppings } from '../../models/detailShoppings';
import { ProductService } from '../../services/product/product.service';
import { ShoppingService } from '../../services/shopping/shopping.service';

@Component({
    selector: 'app-cash-register',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './cash-register.component.html',
    styleUrl: './cash-register.component.css'
})

export class CashRegisterComponent {
  today: Date = new Date();
  purchaseSummary: Product[] = [];
  barcodeInput = new FormControl('');
  products: Product[] = [];
  isModalOpen = false;
  cashReceived: number = 0;
  change: number = 0;

  shoppingData = {
        date: new Date(),
        user_id: 1,
        customer: 123,
        payment_method: 'Efectivo',
        taxes: 0,
        subtotal: 0,
        total_sale: 0,
        detail_shopping: [] as DetailShoppings[]
    };

    modalVisible: boolean = false;

    constructor(
        private shoppingService: ShoppingService,
        private productService: ProductService
    ) {}

    // 🔹 Agregado: Escanear productos por código de barras
    scanProduct() {
        const code = this.barcodeInput.value;
        if (!code) return;

        this.productService.getProductByCode(code).subscribe(product => {
            if (!product) {
                alert("Producto no encontrado");
                return;
            }

            const existingProduct = this.shoppingData.detail_shopping.find(p => p.id_products === product.id_product);

            if (existingProduct) {
                existingProduct.count += 1;
                existingProduct.total = existingProduct.count * existingProduct.unit_price;
            } else {
                const newItem: DetailShoppings = {
                    id_products: product.id_product ?? 0,
                    code: product.code,
                    count: 1,
                    unit_price: product.unit_price,
                    value_taxes: 0, // Lo maneja el backend
                    total: product.unit_price
                };

                this.shoppingData.detail_shopping.push(newItem);
            }

            this.calculateTotals();
            this.barcodeInput.reset();
        }, error => {
            alert("Error al buscar el producto");
        });
    }

    // 🔹 Agregado: Eliminar productos del carrito
    removeProduct(productId: number) {
        const index = this.shoppingData.detail_shopping.findIndex(p => p.id_products === productId);

        if (index !== -1) {
            if (this.shoppingData.detail_shopping[index].count > 1) {
                this.shoppingData.detail_shopping[index].count -= 1;
                this.shoppingData.detail_shopping[index].total = this.shoppingData.detail_shopping[index].count * this.shoppingData.detail_shopping[index].unit_price;
            } else {
                this.shoppingData.detail_shopping.splice(index, 1);
            }

            this.calculateTotals();
        }
    }

    // 🔹 Manteniendo la nueva forma de calcular totales
    calculateTotals() {
        this.shoppingData.subtotal = this.shoppingData.detail_shopping.reduce(
            (acc, item) => acc + (item.unit_price * item.count), 0
        );
        this.shoppingData.total_sale = this.shoppingData.subtotal; // El backend sumará los impuestos
    }

    // 🔹 Confirmación de compra
    openConfirmationModal() {
        this.modalVisible = true;
    }

    confirmShopping() {
        if (this.shoppingData.detail_shopping.length === 0) {
            alert("Debe agregar al menos un producto al carrito");
            return;
        }

        this.shoppingService.createShopping(this.shoppingData).subscribe({
            next: (response) => {
                alert(response.message);
                this.resetShopping();
            },
            error: (error) => {
                alert(error.message);
            }
        });

        this.modalVisible = false;
    }

    resetShopping() {
        this.shoppingData = {
            date: new Date(),
            user_id: 1,
            customer: 123,
            payment_method: 'Efectivo',
            taxes: 0,
            subtotal: 0,
            total_sale: 0,
            detail_shopping: []
        };
    }

    // 🔹 Agregado: Imprimir resumen de compra
    printSummary() {
        let summaryContent = `
            <h2>Factura de Compra</h2>
            <p>Fecha: ${this.shoppingData.date.toLocaleString()}</p>
            <p>Cliente ID: ${this.shoppingData.customer}</p>
            <p>Método de pago: ${this.shoppingData.payment_method}</p>
            <h3>Detalles de la compra:</h3>
            <table border="1" cellspacing="0" cellpadding="5">
                <tr>
                    <th>Producto ID</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                </tr>
        `;

        this.shoppingData.detail_shopping.forEach(item => {
            summaryContent += `
                <tr>
                    <td>${item.id_products}</td>
                    <td>${item.count}</td>
                    <td>${item.unit_price.toFixed(2)}</td>
                    <td>${item.total.toFixed(2)}</td>
                </tr>
            `;
        });

        summaryContent += `
            </table>
            <h3>Subtotal: ${this.shoppingData.subtotal.toFixed(2)}</h3>
            <h3>Total Venta: ${this.shoppingData.total_sale.toFixed(2)}</h3>
        `;

        const printWindow = window.open('', '', 'width=600,height=600');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Factura</title></head><body>');
            printWindow.document.write(summaryContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }

    // 🔹 Confirmación del atajo de teclado para abrir el modal de pago
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === ' ') {
            this.openConfirmationModal();
        }
    }
  }