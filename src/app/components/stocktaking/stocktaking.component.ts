import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Product } from '../../models/product';


@Component({
    selector: 'stocktaking',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './stocktaking.component.html',
    styleUrl: './stocktaking.component.css'
})


export class StocktakingComponent {
  
  products: any[] = []; // Lista de productos obtenida del backend
  showModal: boolean = false;
  productCode: string = '';
  productName: string = '';
  quantity: number = 0;
  unit_price: number=0;
  filteredProducts: any[] = []; // Lista filtrada para mostrar en la tabla
  searchTerm: string = ''; // Término de búsqueda
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 12; // Elementos por página
  loading: boolean = false;
  existingProduct: boolean = false;
  description: string = '';
  brand: string = '';
  buy_price: number = 0;
  code_earn: number = 0;
  taxes_code: string = '';


  constructor(private productsService: ProductService) { }

  

  ngOnInit() {
     this.loadProducts();
   }

  loadProducts() {
    this.loading = true;
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener productos', err);
        this.loading = false;
      }
    });
  }

  // Abrir el modal
  openModal() {
    this.showModal = true;
    this.resetModal();
  }

  // Cerrar el modal
  closeModal() {
    this.showModal = false;

  }

  resetModal() {
    this.productCode = '';
    this.productName = '';
    this.brand = '';
    this.taxes_code = '';
    this.description = '';
    this.quantity = 0;
    this.buy_price = 0;
    this.code_earn = 0;
    this.quantity = 1;
    this.existingProduct = false;
  }

  checkProduct() {
    const product = this.products.find(p => p.code === this.productCode);

    if (product) {
      this.existingProduct = true;
      this.productName = product.name;
      this.buy_price = product.buy_price;
      this.code_earn = product.code_earn;
    } else {
      this.existingProduct = false;
      // this.productName = '';
      // this.unit_price = 0;
    }
  }


saveProduct() {
  if (!this.productCode || !this.productName || this.quantity <= 0 || this.buy_price <= 0) {
    alert("Por favor, complete todos los datos correctamente");
    return;
  }

  const product = this.products.find(p => p.code === this.productCode);
  if (product) {
    const newStock = product.stock + this.quantity;
    const newUnitPrice = this.unit_price;

    this.productsService.updateProductStock(product.id_product, newStock, newUnitPrice).subscribe(() => {
      alert("Stock actualizado correctamente.");
      this.loadProducts();
      this.resetModal();
    });
  } else {
    const taxesCodeValue = isNaN(Number(this.taxes_code)) ? 0 : Number(this.taxes_code);
    const totalValue = isNaN(Number(this.taxes_code + this.unit_price)) ? 0 : Number(this.taxes_code + this.unit_price)

    // 🔹 Crear el producto asegurando que tenga TODAS las propiedades requeridas
    const newProduct: Product = {
      code: this.productCode,
      name: this.productName,
      description: this.description,
      stock: this.quantity, 
      brand: this.brand,
      buy_price: this.buy_price,
      code_earn: this.code_earn,
      taxes_code: taxesCodeValue,
      unit_price: this.unit_price,  
      total: totalValue,  // 🔹 Calculado
      active: true  // 🔹 Valor por defecto (ajustar si es necesario)
    };

    this.productsService.createProduct(newProduct).subscribe(() => {
      alert("Producto creado correctamente.");
      this.loadProducts();
      this.resetModal();
    });
  }
}


  

get paginatedProducts() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.filteredProducts.slice(start, end);
}

nextPage() {
  if ((this.currentPage * this.itemsPerPage) < this.filteredProducts.length) {
    this.currentPage++;
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

  // Filtrar productos según el término de búsqueda
  searchProduct() {
    this.currentPage = 1;
    this.filteredProducts = this.products.filter((product) =>
      product.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


// Función para exportar a Excel
exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(this.products); // Convierte los datos a formato Excel
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(data, 'Inventario.xlsx'); // Guarda el archivo
}

}


