import { CommonModule, DatePipe } from '@angular/common';  
import { Component, inject } from '@angular/core';  
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';  
import { SuppliersService } from '@api/supplier.service';  
import { Supplier } from 'shared/models/supplier.interface';  
import { ToastrService } from "ngx-toastr";  
import Swal from 'sweetalert2';  
  
@Component({  
  selector: 'app-supplier-list',  
  standalone: true,  
  imports: [ReactiveFormsModule, CommonModule],  
  templateUrl: './supplier-list.component.html',  
  styleUrl: './supplier-list.component.scss',  
})  
export default class SupplierListComponent {  
  frmForm!: FormGroup;  
    
  public titlemsg: String = 'Lista de Proveedores';  
  public headeremsg: String = 'En esta pantalla se va a poder ver todos los proveedores disponibles y manipularlos (Modificar, eliminar y agregar)';  
    
  public msgheader: String = 'Agregar Proveedor';  
  public msgbody: String = 'Gestione los proveedores de su tienda. Puede agregar nuevos proveedores, editar los existentes o eliminarlos si ya no son necesarios.';  
    
  private readonly supplierSvc = inject(SuppliersService);  
  private readonly toastrSvc = inject(ToastrService);  
    
  suppliers = this.supplierSvc.suppliers;  
    
  constructor(private readonly fb: FormBuilder) {  
    this.createForm();  
  }  
    
  private createForm(): void {  
    this.frmForm = this.fb.group({  
      Id: [''],  
      CompanyName: ['', [Validators.required]],  
      Address: ['', [Validators.required]],  
      Email: ['', [Validators.email]],  
      Phone: ['', [Validators.required]],
      Web: ['']  
    });  
  }  
    
  showModalCreateSupplier(Id: string = '', option: String) {  
  if (option === 'Editar') {  
    this.msgheader = 'Editar Proveedor';  
    this.msgbody = 'Edite el proveedor seleccionado para actualizar su información. Asegúrese de que los cambios reflejen con precisión los datos del proveedor.';  
  
    this.supplierSvc.getSupplierById(Id).subscribe((resp) => {  
      this.frmForm.patchValue(resp);  
    });  
  }  
  if (option === 'Agregar') {  
    this.msgheader = 'Agregar Proveedor';  
    this.msgbody = 'Cree un nuevo proveedor para gestionar sus productos. Asigne información clara y completa.';
    this.frmForm.reset();  
  }  
  
  let dialog = document.getElementById('popup-modal-supplier');  
  dialog!.classList.remove('hiddenmodal');  
  dialog!.classList.add('showmodal');  
} 
    
  hideModalSupplier() {  
    let dialog = document.getElementById('popup-modal-supplier');  
    dialog!.classList.remove('showmodal');  
    dialog!.classList.add('hiddenmodal');
    this.frmForm.reset();
  }  
    
  onSubmit() {  
    if (this.frmForm.valid) {  
      if (!this.frmForm.value.Id) {  
        this.addSupplier(this.frmForm.value);  
      } else {  
        this.updateSupplier(this.frmForm.value);  
      }  
    } else {  
      this.frmForm.markAllAsTouched();  
    }  
  }  
    
  addSupplier(newSupplier: Supplier) {  
    this.supplierSvc.createSupplier(newSupplier).subscribe({  
      next: (response: any) => {  
        this.toastrSvc.success('El proveedor fue creado con éxito', 'Sistema de Gestión y de ventas');  
        this.hideModalSupplier();  
        this.supplierSvc.getSuppliers();  
        this.frmForm.reset();  
      },  
      error: (err: any) => {  
        this.toastrSvc.error('El proveedor no fue creado', 'Sistema de Gestión y de ventas');  
        this.frmForm.reset();  
      },  
    });  
  }  
    
  updateSupplier(supplier: Supplier) {  
    this.supplierSvc.updateSupplier(supplier.Id, supplier).subscribe({  
      next: (response: any) => {  
        this.toastrSvc.success('El proveedor fue actualizado con éxito', 'Sistema de Gestión y de ventas');  
        this.hideModalSupplier();  
        this.supplierSvc.getSuppliers();  
        this.frmForm.reset();  
      },  
      error: (err: any) => {  
        this.toastrSvc.error('El proveedor no fue actualizado', 'Sistema de Gestión y de ventas');  
        this.frmForm.reset();  
      },  
    });  
  }  
    
  showAlert(id: string): void {  
    const swalWithBootstrapButtons = Swal.mixin({  
      customClass: {  
        confirmButton: 'text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-green-500',  
        cancelButton: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2',  
      },  
      buttonsStyling: true,  
    });  
      
    swalWithBootstrapButtons.fire({  
      title: '¿Estás seguro de eliminar este proveedor?',  
      text: 'No podrás revertir esto!',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Aceptar',  
      cancelButtonText: 'Cancelar',  
      reverseButtons: true,  
    }).then((result) => {  
      if (result.isConfirmed) {  
        this.supplierSvc.deleteSupplier(id).subscribe({  
          next: (result: any) => {  
            if (result) {  
              swalWithBootstrapButtons.fire({  
                title: 'Eliminar proveedor!',  
                text: 'El proveedor fue eliminado con éxito!.',  
                icon: 'success',  
              });  
              this.supplierSvc.getSuppliers();  
            } else {  
              swalWithBootstrapButtons.fire({  
                title: 'Cancelar',  
                text: 'El proveedor no fue eliminado :)',  
                icon: 'error',  
              });  
            }  
          },  
          error: (err) => {  
            swalWithBootstrapButtons.fire({  
              title: 'Error',  
              text: 'Ocurrió un error durante la eliminación. Por favor intenta de nuevo.',  
              icon: 'error',  
            });  
          },  
        });  
      } else if (result.dismiss === 'cancel') {  
        swalWithBootstrapButtons.fire({  
          title: 'Cancelar',  
          text: 'El proveedor no fue eliminado :)',  
          icon: 'error',  
        });  
      }  
    });  
  }  
}