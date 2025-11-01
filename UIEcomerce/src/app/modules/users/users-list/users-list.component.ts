import { CommonModule } from '@angular/common';  
import { Component, inject } from '@angular/core';  
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';  
import { UsersService } from '@api/user-list.service';  
import { RolesService } from '@api/role.service';  
import { User } from 'shared/models/user-list';  
import { ToastrService } from "ngx-toastr";  
import Swal from 'sweetalert2';  
import { ProvincesService } from '@api/provinces.service'; 
  
@Component({  
  selector: 'app-users-list',  
  standalone: true,  
  imports: [ReactiveFormsModule, CommonModule],  
  templateUrl: './users-list.component.html',  
  styleUrl: './users-list.component.scss',  
})  
export default class UsersListComponent {  
  frmFormBasic!: FormGroup; 
  
  public titlemsg: String = 'Lista de Usuarios';  
  public headeremsg: String = 'En esta pantalla se va a poder ver todos los usuarios disponibles y manipularlos (Modificar, eliminar y agregar)';  
  
  public msgheader: String = 'Agregar Usuario';  
  public msgbody: String = 'Gestione los usuarios del sistema. Puede agregar nuevos usuarios, editar los existentes o eliminarlos si ya no son necesarios.';  
  
  private readonly usersSvc = inject(UsersService);  
  private readonly rolesSvc = inject(RolesService);  
  private readonly toastrSvc = inject(ToastrService);  
  private readonly provincesSvc = inject(ProvincesService);  
  users = this.usersSvc.users;  
  provinces = this.provincesSvc.provinces;  
  roles = this.rolesSvc.roles;  
  
  constructor(private readonly fb: FormBuilder) {  
    this.createForm();  
  }  
  
  private createForm(): void {  
    this.frmFormBasic = this.fb.group({  
    Id: [''],  
    FirstName: ['', [Validators.required]],  
    LastName: ['', [Validators.required]],  
    Phone: ['', [Validators.required]]  
  });  
  }  
showModalCreateUser(Id: string = '', option: String) {    
        if (option === 'Editar') {  
        this.msgheader = 'Editar Usuario';  
        this.msgbody = 'Edite nombre, apellido y teléfono del usuario.';  
          
        this.usersSvc.getUserById(Id).subscribe((resp) => {  
          this.frmFormBasic.patchValue({  
            Id: resp.Id,  
            FirstName: resp.FirstName,  
            LastName: resp.LastName,  
            Phone: resp.Phone || resp.PhoneNumber  
        });    
      });    
    }    
        if (option === 'Agregar') {  
          this.msgheader = 'Agregar Usuario';  
          this.msgbody = 'Cree un nuevo usuario para gestionar el acceso al sistema.';  
          this.frmFormBasic.reset();  
        }    
      
        let dialog = document.getElementById('popup-modal-user');  
        dialog!.classList.remove('hiddenmodal');  
        dialog!.classList.add('showmodal');  
    }  
  
  hideModalUser() {  
    let dialog = document.getElementById('popup-modal-user');  
    dialog!.classList.remove('showmodal');  
    dialog!.classList.add('hiddenmodal');  
    this.frmFormBasic.reset();  
  }  
  
  onSubmitBasic() {  
  if (this.frmFormBasic.valid) {  
    const userId = this.frmFormBasic.value.Id;  
    const basicData = {  
      FirstName: this.frmFormBasic.value.FirstName,  
      LastName: this.frmFormBasic.value.LastName,  
      Phone: this.frmFormBasic.value.Phone  
    };  
      
    this.usersSvc.updateUser(userId, basicData).subscribe({  
      next: (response: any) => {  
        this.toastrSvc.success('Datos básicos actualizados con éxito', 'Sistema de Gestión');  
        this.hideModalUser();  
        this.usersSvc.getUsers();  
      },  
      error: (err: any) => {  
        this.toastrSvc.error('Error al actualizar datos básicos', 'Sistema de Gestión');  
      }  
    });  
  } else {  
    this.frmFormBasic.markAllAsTouched();  
  }  
}   
  
  addUser(newUser: User) {  
    this.usersSvc.createUser(newUser).subscribe({  
      next: (response: any) => {  
        this.toastrSvc.success('El usuario fue creado con éxito', 'Sistema de Gestión y de ventas');  
        this.hideModalUser();  
        this.usersSvc.getUsers();  
        this.frmFormBasic.reset();  
      },  
      error: (err: any) => {  
        this.toastrSvc.error('El usuario no fue creado', 'Sistema de Gestión y de ventas');  
        this.frmFormBasic.reset();  
      },  
    });  
  }  
  
  updateUser(user: User) {  
  if (!user.Id) {  
    this.toastrSvc.error('ID de usuario no válido', 'Sistema de Gestión y de ventas');  
    return;  
  }  
    
  this.usersSvc.updateUser(user.Id, user).subscribe({  
    next: (response: any) => {  
      this.toastrSvc.success('El usuario fue actualizado con éxito', 'Sistema de Gestión y de ventas');  
      this.hideModalUser();  
      this.usersSvc.getUsers();  
      this.frmFormBasic.reset();  
    },  
    error: (err: any) => {  
      this.toastrSvc.error('El usuario no fue actualizado', 'Sistema de Gestión y de ventas');  
      this.frmFormBasic.reset();  
    },  
  });  
}
   showUserActions(userId: string): void {  
    console.log('Mostrar acciones para usuario:', userId);  
    this.toastrSvc.info('Funcionalidad de acciones en desarrollo', 'Sistema de Gestión');  
  }  
  showAddressModal(userId: string): void {  
    console.log('Mostrar acciones para usuario:', userId);  
    this.toastrSvc.info('Funcionalidad de acciones en desarrollo', 'Sistema de Gestión');  
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
      title: '¿Estás seguro de eliminar este usuario?',  
      text: 'No podrás revertir esto!',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Aceptar',  
      cancelButtonText: 'Cancelar',  
      reverseButtons: true,  
    }).then((result) => {  
      if (result.isConfirmed) {  
        this.usersSvc.deleteUser(id).subscribe({  
          next: (result: any) => {  
            if (result) {  
              swalWithBootstrapButtons.fire({  
                title: 'Eliminar usuario!',  
                text: 'El usuario fue eliminado con éxito!.',  
                icon: 'success',  
              });  
              this.usersSvc.getUsers();  
            } else {  
              swalWithBootstrapButtons.fire({  
                title: 'Cancelar',  
                text: 'El usuario no fue eliminado :)',  
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
          text: 'El usuario no fue eliminado :)',  
          icon: 'error',  
        });  
      }  
    });  
  }  
}