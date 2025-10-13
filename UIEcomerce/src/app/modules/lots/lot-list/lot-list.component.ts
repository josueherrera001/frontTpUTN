import { CommonModule, DatePipe } from '@angular/common';  
import { Component, inject } from '@angular/core';  
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';  
import { LotsService } from '@api/lot.service';  
import { Lot } from 'shared/models/lot.interface';  
import { ToastrService } from "ngx-toastr";  
import Swal from 'sweetalert2';  
import { ProductsService } from '@api/products.service';  

@Component({  
  selector: 'app-lot-list',  
  standalone: true,  
  imports: [  
    DatePipe, ReactiveFormsModule, CommonModule  
  ],  
  templateUrl: './lot-list.component.html',  
  styleUrl: './lot-list.component.scss',  
}) 

export default class LotListComponent {  
  frmForm!: FormGroup;  
  
  public titlemsg: String = 'Lista de Lotes';  
  public headeremsg: String = 'En esta pantalla se va a poder ver todos los lotes disponibles y manipularlos (Modificar, eliminar y agregar)';  
  
  public msgheader: String = 'Agregar Lote';  
  public msgbody: String = 'Gestione los lotes de productos de su tienda. Puede agregar nuevos lotes, editar los existentes o eliminarlos si ya no son necesarios.';  
  
  private readonly lotsSvc = inject(LotsService);  
  private readonly productSvc = inject(ProductsService);
  private readonly toastrSvc = inject(ToastrService);  
  
  lots = this.lotsSvc.lots;
  products = this.productSvc.products;  
  
  constructor(private readonly fb: FormBuilder) {  
    this.createForm();  
  }  
  
  private createForm(): void {  
    this.frmForm = this.fb.group({  
      Id: [''],
      LotCode: ['', [Validators.required]],  
      ProductCode: ['', [Validators.required]],  
      ProductId: ['', [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0)]],  
      PurchasePrice: [0, [Validators.required, Validators.min(0)]],  
      SalePrice: [0, [Validators.required, Validators.min(0)]],  
      HasExpiredDate: [false],  
      ExpiredDate: [null]  
    });
      this.frmForm.get('HasExpiredDate')?.valueChanges.subscribe(hasExpired => {  
      if (hasExpired) {  
        this.frmForm.get('ExpiredDate')?.setValidators([Validators.required]);  
      } else {  
        this.frmForm.get('ExpiredDate')?.clearValidators();  
        this.frmForm.get('ExpiredDate')?.setValue(null);  
      }  
      this.frmForm.get('ExpiredDate')?.updateValueAndValidity();  
    });  
  }  
  
  showModalCreateLot(Id: string = '', option: String) {  
    if (option === 'Editar') {  
      this.msgheader = 'Editar lote';  
      this.msgbody = 'Edite el lote seleccionado para actualizar su información. Asegúrese de que los cambios reflejen con precisión los datos del lote.';  
  
      const lotSignal = this.lotsSvc.getLotById(Id);  
const lot = lotSignal();  
if (lot) {  
  this.frmForm.patchValue(lot);  
}  
    }  
    if (option === 'Agregar') {  
      this.msgbody = 'Cree un nuevo lote para organizar sus productos de manera efectiva. Asigne códigos claros y precios relevantes.';  
    }  
  
    let dialog = document.getElementById('popup-modal-lot');  
    dialog!.classList.remove('hiddenmodal');  
    dialog!.classList.add('showmodal');  
  }  
  
  hideModalLot() {  
    let dialog = document.getElementById('popup-modal-lot');  
    dialog!.classList.remove('showmodal');  
    dialog!.classList.add('hiddenmodal');  
  }  
  
  onSubmit() {  
    if (this.frmForm.valid) {  
      const formData = this.frmForm.value;  
        
      if (!this.frmForm.value.Id) {  
        this.addLot(this.frmForm.value);  
      } else {  
        this.updateLot(this.frmForm.value);  
      }  
    } else {  
      this.frmForm.markAllAsTouched();  
    }  
  }  
  
  addLot(newLot: Lot) {  
    this.lotsSvc.createLot(newLot).subscribe({  
      next: (response: any) => {  
        this.toastrSvc.success('El lote fue creado con éxito', 'Sistema de Gestión y de ventas');  
        this.hideModalLot();  
        this.lotsSvc.getLots();  
        this.frmForm.reset();  
      },  
      error: (err: any) => {  
        this.toastrSvc.error('El lote no fue creado', 'Sistema de Gestión y de ventas');  
        this.frmForm.reset();  
      },  
    });  
  }  
  
  updateLot(lot: Lot) {  
    this.lotsSvc.updateLot(lot.Id, lot).subscribe({  
      next: (response: any) => {  
        this.toastrSvc.success('El lote fue actualizado con éxito', 'Sistema de Gestión y de ventas');  
        this.hideModalLot();  
        this.lotsSvc.getLots();  
        this.frmForm.reset();  
      },  
      error: (err: any) => {  
        this.toastrSvc.error('El lote no fue actualizado', 'Sistema de Gestión y de ventas');  
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
      title: '¿Estás seguro de eliminar este lote?',  
      text: 'No podrás revertir esto!',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Aceptar',  
      cancelButtonText: 'Cancelar',  
      reverseButtons: true,  
    }).then((result) => {  
      if (result.isConfirmed) {  
        this.lotsSvc.deleteLot(id).subscribe({  
          next: (result: any) => {  
            if (result) {  
              swalWithBootstrapButtons.fire({  
                title: 'Eliminar lote!',  
                text: 'El lote fue eliminado con éxito!.',  
                icon: 'success',  
              });  
             this.lotsSvc.getLots();
            } else {  
              swalWithBootstrapButtons.fire({  
                title: 'Cancelar',  
                text: 'El lote no fue eliminado :)',  
                icon: 'error',  
              });  
            }  
          },  
          error: (err) => {  
            alert('Ocurrió un error durante la eliminación. Por favor intenta de nuevo.');  
          },  
        });  
      } else if (result.dismiss === 'cancel') {  
        swalWithBootstrapButtons.fire({  
          title: 'Cancelar',  
          text: 'El lote no fue eliminado :)',  
          icon: 'error',  
        });  
      }  
    });  
  }  
}
