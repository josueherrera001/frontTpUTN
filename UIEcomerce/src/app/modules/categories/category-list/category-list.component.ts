import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoriesService } from '@api/category.service';
import { Category } from 'shared/models/category.interface';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SubCategoriesService } from '@api/subcategory.service';
import { SubCategory } from 'shared/models/subcategory.interface';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export default class CategoryListComponent {
  frmForm!: FormGroup;
  frmsubForm!: FormGroup;

  subcategory!: SubCategory;

  public titlemsg: string = 'Lista de Categorías';
  public headeremsg: string =
    'En esta pantalla se va a poder ver todas las categorias disponible y manipularlas.(Modificar, eliminar y agregar sub categoria)';
  public categoryname: string = '';
  public data_title: string = 'Agregar subcategoría';

  public msgheader: string = 'Agregar Categoría';

  public msgbody: string =
    'Gestione las categorías de productos de su tienda. Puede agregar nuevas categorías, editar las existentes o eliminarlas si ya no son necesarias. Mantener sus categorías organizadas ayuda a los clientes a encontrar fácilmente los productos que buscan.';

  private readonly categorySvc = inject(CategoriesService);
  private readonly subcategorySvc = inject(SubCategoriesService);
  private readonly toastrSvc = inject(ToastrService);

  categories = this.categorySvc.categories;
  subcategories: SubCategory[] = [];

  constructor(private readonly fb: FormBuilder) {
    this.createForm();
    this.createsubForm();
  }
  private createForm(): void {
    this.frmForm = this.fb.group({
      Id: [''],
      CategoryId:[''],
      Name: ['', [Validators.required]],
      Description: [''],
    });
  }

  private createsubForm(): void {
    this.frmsubForm = this.fb.group({
      Id: [''],
      Name: ['', [Validators.required]],
      Description: [''],
    });
  }

  showModalCreateCategory(
    Id: string = '',
    option: string,
    categoryname: string = ''
  ) {
    this.msgbody = '';
    this.msgheader = '';
    if (option === 'Editar') {
      this.msgheader = 'Editar categoría';
      this.msgbody = `Edite la categoría seleccionada para actualizar su información. Asegúrese de que los cambios reflejen con precisión la naturaleza de los productos que contiene la categoría. Mantener las categorías actualizadas ayuda a los clientes a navegar y encontrar productos fácilmente.`;

      this.categorySvc.getCategoryById(Id).subscribe((resp) => {
        this.frmForm.patchValue(resp);
      });
    }
    if (option === 'Agregar') {
      this.msgheader = 'Agregar nueva categoría';
      this.msgbody = `Cree una nueva categoría para organizar sus productos de manera efectiva. Asigne un nombre claro y una descripción relevante que facilite a los clientes la identificación de los productos dentro de esa categoría. Una buena categorización mejora la experiencia de compra y la navegación en su tienda.`;
    }

    if (option === 'Subcategoría') {
      this.categoryname = categoryname;
      const categoryIdElement = document.getElementById('categoryId');
      debugger;
      if (categoryIdElement) {
        (categoryIdElement as HTMLInputElement).value = Id;
      }
      this.msgheader = 'Agregar nueva sub categoría';
      this.msgbody = `Cree Subcategoría para organizar mejor sus productos dentro de la categoría seleccionada. Las subcategorías permiten una clasificación más detallada, facilitando a los clientes la búsqueda de productos específicos. Asegúrese de que las subcategorías sean relevantes y claras para mejorar la experiencia de compra.`;
      const categoryElement = document.getElementById('category');
      if (categoryElement) {
        categoryElement.innerHTML = 'Categoria : ' + categoryname;
      }

      if (Id === '') {
        this.subcategorySvc
          .getSubCategories(Id)
          .subscribe((Response: SubCategory[]) => {
            debugger;
            this.subcategories = Response;
          });
      } else {
        this.subcategorySvc
          .getSubCategoryById(Id)
          .subscribe((Response: any) => {
            debugger;
            this.subcategory = Response;
          });
      }
      let dialog = document.getElementById('popup-modal-category');
      dialog!.classList.remove('hiddenmodal');
      dialog!.classList.add('showmodal');
      return;
    }

    let dialog = document.getElementById('popup-modal-category');
    dialog!.classList.remove('hiddenmodal');
    dialog!.classList.add('showmodal');
  }

  showModalCreateSubCategory(Id: string = '') {
    this.msgheader =
      Id == '' ? 'Agregar sub categoría' : 'Editar sub categoría';
    this.msgbody =`Cree Subcategoría para organizar mejor sus productos dentro de la categoría seleccionada. Las subcategorías permiten una clasificación más detallada, facilitando a los clientes la búsqueda de productos específicos. Asegúrese de que las subcategorías sean relevantes y claras para mejorar la experiencia de compra.`;
    this.subcategorySvc.getSubCategoryById(Id).subscribe((Response: any) => {
      debugger;
      this.subcategory = Response;
    });

    this.subcategorySvc
      .getSubCategoryById(Id)
      .subscribe((Response: SubCategory) => {
        this.frmsubForm.patchValue(Response);
      });

    let dialog = document.getElementById('popup-modal-add');
    dialog!.classList.remove('hiddenmodal');
    dialog!.classList.add('showmodal');
  }
  hideModalcategory(Id: string = 'popup-modal-category') {
    let dialog = document.getElementById(Id);

    dialog!.classList.remove('showmodal');
    dialog!.classList.add('hiddenmodal');
  }

  showModalAddSubCategory(Id: string, category: string) {
    this.categoryname = category;
    const categoryIdElement = document.getElementById('categoryId');
    debugger;
    if (categoryIdElement) {
      (categoryIdElement as HTMLInputElement).value = Id;
    }

    this.msgheader = 'Sub categoría';
    this.msgbody = `Cree Subcategoría para organizar mejor sus productos dentro de la categoría seleccionada. Las subcategorías permiten una clasificación más detallada, facilitando a los clientes la búsqueda de productos específicos. Asegúrese de que las subcategorías sean relevantes y claras para mejorar la experiencia de compra.`;
    const categoryElement = document.getElementById('category');
    if (categoryElement) {
      categoryElement.innerHTML = 'Categoria : ' + category;
    }
    this.subcategorySvc
      .getSubCategories(Id)
      .subscribe((Response: SubCategory[]) => {
        this.subcategories = Response;
      });
    let dialog = document.getElementById('popup-modal-subcategory');

    dialog!.classList.remove('hiddenmodal');
    dialog!.classList.add('showmodal');
  }
  onSubmit() {
    if (this.frmForm.valid) {
      const formData = this.frmForm.value;
      const newCategory: Category = {
        Id: '', // This will be generated by the backend
        Name: formData.Name,
        Description: formData.Description,
      };
      if (!this.frmForm.value.Id) {
        this.addCategory(this.frmForm.value);
      } else {
        this.updateCategory(this.frmForm.value);
      }
    } else {
      this.frmForm.markAllAsTouched();
    }
  }

  onAddSubCategory() {
      const categoryIdElement = document.getElementById('categoryId');
    if (categoryIdElement) {
      this.frmsubForm.value.CategoryId = (categoryIdElement as HTMLInputElement).value;
    }
    if (!this.frmsubForm.value.Id) {
      this.addSuCategory(this.frmsubForm.value);
    } else {
      this.updateSubCategory(this.frmsubForm.value);
    }
  }

  addCategory(newCategory: Category) {
    this.categorySvc.createCategory(newCategory).subscribe({
      next: (response: any) => {
        let res = response;
        debugger;
        this.toastrSvc.success(
          'La categoria fue creada con exito',
          'Sistema de Gestion y de ventas'
        );
        this.hideModalcategory();
        this.categorySvc.getCategories();
        this.frmForm.reset();
      },
      error: (err: any) => {
        debugger;
        this.toastrSvc.error(
          'La categoria no fue creada',
          'Sistema de Gestion y de ventas'
        );
        this.frmForm.reset();
      },
    });
  }

  updateCategory(newCategory: Category) {
    this.categorySvc.updateCategory(newCategory.Id, newCategory).subscribe({
      next: (response: any) => {
        debugger;
        this.toastrSvc.success(
          'La categoria fue actualizada con exito',
          'Sistema de Gestion y de ventas'
        );
        this.hideModalcategory();
        this.categorySvc.getCategories();
        this.frmForm.reset();
        this.frmForm.reset();
      },
      error: (err: any) => {
        debugger;
        this.toastrSvc.error(
          // 'La categoria no fue actualizada',
          err.message,
          'Sistema de Gestion y de ventas'
        );
        this.frmForm.reset();
      },
    });
  }

  addSuCategory(subCategory: SubCategory) {
    this.subcategorySvc.createSubCategory(subCategory).subscribe({
      next: (response: any) => {
        debugger;
        this.toastrSvc.success(
          'La sub categoria fue creada con exito',
          'Sistema de Gestion y de ventas'
        );

        this.subcategorySvc
      .getSubCategories(subCategory.CategoryId)
      .subscribe((Response: SubCategory[]) => {
        this.subcategories = Response;
      });
        this.frmsubForm.reset();
        this.hideModalcategory('popup-modal-add');
      },
      error: (err: any) => {
        debugger;
        this.toastrSvc.error(
          // 'La sub categoria no fue creada',
          err.message,
          'Sistema de Gestion y de ventas'
        );
        this.frmsubForm.reset();
      },
    });
  }

  updateSubCategory(subCategory: SubCategory) {
    this.subcategorySvc
      .updateSubCategory(subCategory.Id, subCategory)
      .subscribe({
        next: (response: any) => {
          this.toastrSvc.success(
            'La subcategoria fue actualizada con exito',
            'Sistema de Gestion y de ventas'
          );
          this.subcategorySvc
          .getSubCategories(subCategory.CategoryId)
          .subscribe((Response: SubCategory[]) => {
            this.subcategories = Response;
          });
          this.frmsubForm.reset();
          this.hideModalcategory('popup-modal-add');
        },
        error: (err: any) => {
          this.toastrSvc.error(
            // 'La subcategoria no fue actualizada',
            err.message,
            'Sistema de Gestion y de ventas'
          );
          this.frmsubForm.reset();
        },
      });
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
          this.categorySvc.deleteCategory(id).subscribe({
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


  showAlertSub(id: string): void {
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
          this.subcategorySvc.deleteSubCategory(id).subscribe({
            next: (result: any) => {
              debugger;
              if (result) {
                swalWithBootstrapButtons.fire({
                  title: 'Eliminar archivo!',
                  text: 'Tu archivo fue eliminado con exito!.',
                  icon: 'success',
                });
                 this.subcategorySvc
                .getSubCategories(result.CategoryId)
                .subscribe((Response: SubCategory[]) => {
                  this.subcategories = Response;
                });
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
}
