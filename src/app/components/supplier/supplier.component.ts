import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier/supplier.service';
import { Supplier } from '../../models/supplier';


@Component({
    selector: 'supplier',
    imports: [CommonModule, FormsModule],
    templateUrl: './supplier.component.html',
    styleUrl: './supplier.component.css'
})
export class SupplierComponent {

  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  loading: boolean = false;
  filterText: string = '';
  supplierForm: Supplier = {
    nit: '', name: '', address: '', city: '', phone: '', email: '', active: true,
    id_suppliers: 0
  };
  isEditing: boolean = false;
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Elementos por página
  searchTerm: string = ''; // Término de búsqueda
  

  constructor(private supplierService: SupplierService) { }

  ngOnInit() {
    this.loadSuppliers();
  }


  searchSupplier() {
    this.currentPage = 1;
    this.filteredSuppliers = this.suppliers.filter((supplier) =>
      supplier.nit.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      supplier.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  loadSuppliers() {
    this.loading = true;
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.filteredSuppliers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener proveedores', err);
        this.loading = false;
      }
    });
  }
  filterSuppliers() {
    this.filteredSuppliers = this.suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }
  saveSupplier() {
    if (this.isEditing) {
      this.supplierService.updateSupplier(this.supplierForm.id_suppliers!, this.supplierForm).subscribe(() => {
        this.loadSuppliers();
        this.resetForm();
      });
    } else {
      this.supplierService.createSuppliers(this.supplierForm).subscribe(() => {
        this.loadSuppliers();
        this.resetForm();
      });
    }
  }
  editSupplier(supplier: Supplier) {
    this.supplierForm = { ...supplier };
    this.isEditing = true;
  }
  deleteSuppliers(id_suppliers: number) {

    if (confirm('¿Estás seguro de desactivar este proveedor?')) {
      this.supplierService.deleteSupplier(id_suppliers).subscribe(() => {

        this.loadSuppliers();
      });
    }
  }
  resetForm() {
    this.supplierForm = { nit: '', name: '', address: '', city: '', phone: '', email: '', active: true, id_suppliers: 0 };
    this.isEditing = false;
  }

  toggleSupplierStatus(supplier: Supplier) {
    this.supplierService.deleteSupplier(supplier.id_suppliers!).subscribe(() => {
      supplier.active = !supplier.active; // Cambia visualmente el estado en la interfaz
    });
  }
  

  get paginatedSuppliers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredSuppliers.slice(start, end);
  }
  
  nextPage() {
    if ((this.currentPage * this.itemsPerPage) < this.filteredSuppliers.length) {
      this.currentPage++;
    }
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}
