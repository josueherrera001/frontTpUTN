import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PresentationsService } from '@api/presentation.service';
import { Presentation } from 'shared/models/presentation.interface';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-presentations',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './presentations.component.html',
  styleUrl: './presentations.component.scss',
})
export class PresentationsComponent {
  frmForm!: FormGroup;

  public msgheader: string = 'Agregar nueva presentacion';

  public msgbody: string =
    'Gestione las presentaciones de productos de su tienda. Puede agregar nuevas presentacions, editar las existentes o eliminarlas si ya no son necesarias. Mantener sus presentaciones organizadas ayuda a los clientes a encontrar fácilmente los productos que buscan.';

  private readonly presentationSvc = inject(PresentationsService);
  private readonly toastrSvc = inject(ToastrService);

  presentations = this.presentationSvc.presentations;

  constructor(private readonly fb: FormBuilder) {
    this.createForm();
  }
  private createForm(): void {
    this.frmForm = this.fb.group({
      Id: [''],
      Name: ['', [Validators.required]],
      Description: [''],
    });
  }

  showModalCreate(Id: string = '', option: string, categoryname: string = '') {
    this.msgbody = '';
    this.msgheader = '';
    if (option === 'Editar') {
      this.msgheader = 'Editar presentation';
      this.msgbody = `Edite la presentation seleccionada para actualizar su información. Asegúrese de que los cambios reflejen con precisión la naturaleza de los productos que contiene la categoría. Mantener las categorías actualizadas ayuda a los clientes a navegar y encontrar productos fácilmente.`;

      this.presentationSvc.getPresentationById(Id).subscribe((resp) => {
        this.frmForm.patchValue(resp);
      });
    } else {
      this.msgheader = 'Agregar nueva presentation';
      this.msgbody = `Cree una nueva presentation para organizar sus productos de manera efectiva. Asigne un nombre claro y una descripción relevante que facilite a los clientes la identificación de los productos dentro de esa categoría. Una buena categorización mejora la experiencia de compra y la navegación en su tienda.`;
    }

    let dialog = document.getElementById('popup-modal-presentation');
    dialog!.classList.remove('hiddenmodal');
    dialog!.classList.add('showmodal');
  }

  showAlert(id: string): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton:
          'text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-green-500',
        cancelButton:
          'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2',
      },
      buttonsStyling: true,
    });
    swalWithBootstrapButtons
      .fire({
        title: '¿Estas seguro desee eliminar la descripcion sobre ti?',
        text: 'No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.presentationSvc.deletePresentation(id).subscribe({
            next: (result: any) => {
              if (result) {
                swalWithBootstrapButtons.fire({
                  title: 'Eliminar archivo!',
                  text: 'Tu archivo fue eliminado con exito!.',
                  icon: 'success',
                });
                location.reload();
              } else {
                swalWithBootstrapButtons.fire({
                  title: 'Cancelar',
                  text: 'Tu archivo no fue eliminado :)',
                  icon: 'error',
                });
              }
            },
            error: (err) => {
              swalWithBootstrapButtons.fire({
                title: 'Error de eliminacion',
                text: err.message,
                icon: 'error',
              });
            },
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === 'cancel'
        ) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelar',
            text: 'Tu archivo no fue eliminado :)',
            icon: 'error',
          });
        }
      });
  }

  hideModal(Id: string = 'popup-modal-presentation') {
    let dialog = document.getElementById(Id);

    dialog!.classList.remove('showmodal');
    dialog!.classList.add('hiddenmodal');
  }
  onSubmit() {
    if (this.frmForm.valid) {
      if (!this.frmForm.value.Id) {
        this.add(this.frmForm.value);
      } else {
        this.update(this.frmForm.value);
      }
    } else {
      this.frmForm.markAllAsTouched();
    }
  }

  add(newpresentation: Presentation) {
    this.presentationSvc.createPresentation(newpresentation).subscribe({
      next: (response: any) => {
        let res = response;
        debugger;
        this.toastrSvc.success(
          'La presentacion fue creada con exito',
          'Sistema de Gestion y de ventas'
        );
        this.hideModal();
        this.presentationSvc.getPresentations();
        this.frmForm.reset();
      },
      error: (err: any) => {
        debugger;
        this.toastrSvc.error(
          'La presentacion no fue creada',
          'Sistema de Gestion y de ventas'
        );
        this.frmForm.reset();
      },
    });
  }

  update(data: Presentation) {
    this.presentationSvc.updatePresentation(data.Id, data).subscribe({
      next: (response: any) => {
        this.toastrSvc.success(
          'La presentacion fue actualizada con exito',
          'Sistema de Gestion y de ventas'
        );
        this.hideModal();
        this.presentationSvc.getPresentations();
        this.frmForm.reset();
      },
      error: (err: any) => {
        this.toastrSvc.error(
          'La presentacion no fue actualizada',
          'Sistema de Gestion y de ventas'
        );
        this.frmForm.reset();
      },
    });
  }
}
