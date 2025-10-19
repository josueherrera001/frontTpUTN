import { CommonModule } from '@angular/common';  
import { Component, inject } from '@angular/core';  
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';  
import { UsersService } from '@api/user-list.service';  
import { RolesService } from '@api/role.service';  
import { User } from 'shared/models/user-list';  
import { Role } from 'shared/models/role.interface';  
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
  frmForm!: FormGroup;  
  
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
    this.frmForm = this.fb.group({  
      Id: [''],  
      FirstName: ['', [Validators.required]],  
      LastName: ['', [Validators.required]],  
      Email: ['', [Validators.required, Validators.email]],  
      Phone: ['', [Validators.required]],  
      auth: this.fb.group({  
        UserName: ['', [Validators.required]],  
        UserPass: ['', [Validators.minLength(6)]],  
        RoleId: ['', [Validators.required]]  
      }),  
      address: this.fb.group({  
        Country: ['', [Validators.required]],  
        Province: ['', [Validators.required]],  
        Location: ['', [Validators.required]],  
        Street: ['', [Validators.required]],  
        Number: ['', [Validators.required]],  
        Between: ['']  
      })  
    });  
  }  
  onCountryChange(event: Event): void {  
    const countryId = (event.target as HTMLSelectElement).value;  
    if (countryId) {  
      this.provincesSvc.getProvincesByCountry(countryId);  
    }  
  }  
onRoleChange(event: Event, user: User): void {  
  const newRoleId = (event.target as HTMLSelectElement).value;  
    
  if (!user.Id || !newRoleId) {  
    this.toastrSvc.error('Datos inválidos', 'Sistema de Gestión y de ventas');  
    return;  
  }  
  
  // Crear objeto con solo los datos necesarios para actualizar el rol  
  const updateData = {  
    Id: user.Id,  
    FirstName: user.FirstName,  
    LastName: user.LastName,  
    Email: user.Email,  
    Phone: user.Phone,  
    auth: {  
      UserName: user.Accounts?.[0]?.UserName || '',  
      UserPass: '', // No enviar contraseña en actualización de rol  
      RoleId: newRoleId  
    }  
  };  
  
  this.usersSvc.updateUser(user.Id, updateData).subscribe({  
    next: (response: any) => {  
      this.toastrSvc.success('Rol actualizado con éxito', 'Sistema de Gestión y de ventas');  
      this.usersSvc.getUsers(); // Recargar la lista  
    },  
    error: (err: any) => {  
      this.toastrSvc.error('Error al actualizar el rol', 'Sistema de Gestión y de ventas');  
      // Revertir el select al valor anterior  
      this.usersSvc.getUsers();  
    }  
  });  
}
  showModalCreateUser(Id: string = '', option: String) {  
  if (option === 'Editar') {  
    this.msgheader = 'Editar Usuario';  
    this.msgbody = 'Edite el usuario seleccionado para actualizar su información.';  
  
    this.usersSvc.getUserById(Id).subscribe((resp) => {  
      this.frmForm.patchValue({  
        Id: resp.Id,  
        FirstName: resp.FirstName,  
        LastName: resp.LastName,  
        Email: resp.Email,  
        Phone: resp.Phone || resp.PhoneNumber,  
        auth: {  
          UserName: resp.Accounts?.[0]?.UserName || '',  // ← Pre-llenar usuario  
          UserPass: '',  // ← Dejar vacío por seguridad  
          RoleId: resp.Accounts?.[0]?.RoleId || ''  
        },  
        address: {  
          Country: resp.Addresses?.[0]?.Country || '',  
          Province: resp.Addresses?.[0]?.Province || '',  
          Location: resp.Addresses?.[0]?.Location || '',  
          Street: resp.Addresses?.[0]?.Street || '',  
          Number: resp.Addresses?.[0]?.StreetNumber || '',  
          Between: resp.Addresses?.[0]?.StreetNumber || ''  
        }  
      });  
    });  
  }  
  if (option === 'Agregar') {  
    this.msgheader = 'Agregar Usuario';  
    this.msgbody = 'Cree un nuevo usuario para gestionar el acceso al sistema.';  
    this.frmForm.reset();  
  }  
  
  let dialog = document.getElementById('popup-modal-user');  
  dialog!.classList.remove('hiddenmodal');  
  dialog!.classList.add('showmodal');  
}  
  
  hideModalUser() {  
    let dialog = document.getElementById('popup-modal-user');  
    dialog!.classList.remove('showmodal');  
    dialog!.classList.add('hiddenmodal');  
    this.frmForm.reset();  
  }  
  
  onSubmit() {  
    if (this.frmForm.valid) {  
      if (!this.frmForm.value.Id) {  
        this.addUser(this.frmForm.value);  
      } else {  
        this.updateUser(this.frmForm.value);  
      }  
    } else {  
      this.frmForm.markAllAsTouched();  
    }  
  }  
  
  addUser(newUser: User) {  
    this.usersSvc.createUser(newUser).subscribe({  
      next: (response: any) => {  
        this.toastrSvc.success('El usuario fue creado con éxito', 'Sistema de Gestión y de ventas');  
        this.hideModalUser();  
        this.usersSvc.getUsers();  
        this.frmForm.reset();  
      },  
      error: (err: any) => {  
        this.toastrSvc.error('El usuario no fue creado', 'Sistema de Gestión y de ventas');  
        this.frmForm.reset();  
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
      this.frmForm.reset();  
    },  
    error: (err: any) => {  
      this.toastrSvc.error('El usuario no fue actualizado', 'Sistema de Gestión y de ventas');  
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