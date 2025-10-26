import { Category } from './../../../../shared/models/category.interface';
import { Component, ElementRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'; // <- IMPORTANTE
import { ProductsService } from '@api/products.service';
import { SuppliersService } from '@api/supplier.service';
import { Product } from 'shared/models/product';
import { Supplier } from 'shared/models/supplier.interface';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { PresentationsService } from '@api/presentation.service';
import { SubCategoriesService } from '@api/subcategory.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CloudinaryUploadComponent } from 'app/modules/cloudinary-upload/cloudinary-upload.component';
import { UploadedImg } from 'shared/models/uploadimg';
import { Presentation } from 'shared/models/presentation.interface';
import { CalendardateComponent } from 'app/modules/calendardate/calendardate.component';
import { Lot } from 'shared/models/lot.interface';
import { LotsService } from '@api/lot.service';
@Component({
  selector: 'app-product-form',
  standalone: true, // <- importante
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CloudinaryUploadComponent,
    CalendardateComponent,
  ], // <- forms module para [(ngModel)]
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  frmForm!: FormGroup;

  searchControl = new FormControl('');
  suggestions: any[] = [];

  searchPresentationControl = new FormControl('');
  suggestionPresentations: any[] = [];

  searchSubcategoryControl = new FormControl('');
  suggestionSubCategories: any[] = [];

  istLotEdit: boolean = true;
  istProductEdit: boolean = true;

  public titlemsg: String = 'Lista de Proveedores';
  public headeremsg: String =
    'En esta pantalla se va a poder ver todos los productos disponibles y manipularlos (Modificar, eliminar y agregar)';

  public msgheader: String = 'Agregar nueco producto';
  public msgbody: String =
    'Gestione los productos de su tienda. Puede agregar nuevos productos, editar los existentes o eliminarlos si ya no son necesarios.';

  private readonly supplierSvc = inject(SuppliersService);
  private readonly productSvc = inject(ProductsService);
  private readonly presentationSvc = inject(PresentationsService);
  private readonly subCategorySvc = inject(SubCategoriesService);
  private readonly lotSvc = inject(LotsService);

  private readonly toastrSvc = inject(ToastrService);
  public imgurl: UploadedImg[] = [];
  file1!: File;

  suppliers = this.supplierSvc.suppliers;
  productss = this.productSvc.products;
  // listproducts = this.productss();
  presentations = this.presentationSvc.presentations;
  subCategories = this.subCategorySvc.subCategories;

  constructor(private readonly fb: FormBuilder) {
    this.createForm();
    // this.loadSampleData();
    // this.filteredProducts = [...this.products];

    this.getSearchcontrol();
    this.getSearchSubCategorycontrol();
    this.getSearchPresentationcontrol();
    // this.loadData();
  }

  private createForm(): void {
    this.frmForm = this.fb.group({
      Id: [''],
      SubCategoryId: ['', [Validators.required]],
      PresentationId: ['', [Validators.required]],
      SupplierId: ['', [Validators.required]],
      Name: ['', [Validators.required]],
      ImageUrl: [''],
      PublicIdUrl: [''],
      Description: [''],
      CompanyName: [''],
      SubCategoryName: [''],
      PresentationName: [''],
      /*Lot*/
      lot: this.fb.group({
        Id: [''],
        ProductId: [''],
        LotCode: new FormControl('', [Validators.required]),
        ProductCode: new FormControl('', [Validators.required]),
        ExpiredDate: new FormControl(''),
        HasExpiredDate: new FormControl(''),
        stock: new FormControl('', [Validators.required]),
        PurchasePrice: new FormControl('', [Validators.required]),
        SalePrice: new FormControl('', [Validators.required]),
      }),
    });
  }

  showModalCreate(Id: string = '', option: String) {
    debugger;
    if (option === 'Editar') {
      this.istProductEdit = false;
      this.istLotEdit = true;
      this.msgheader = 'Editar productos';
      this.msgbody =
        'Edite el producto seleccionado para actualizar su información.';

      this.productSvc.getProductById(Id).subscribe((resp) => {
        debugger;
        let catename: any = this.productss().filter((u) => u.Id == resp.Id);

        this.imgurl.push({
          file: this.file1,
          name: 'file.name',
          size: 1024,
          type: 'png',
          url: resp.ImageUrl.toString(),
          uploadDate: new Date(),
          progress: 0,
          status: 'completed',
          public_id: resp.PublicIdUrl,
        });
        this.frmForm.patchValue(resp);
        this.frmForm.patchValue({
          SubCategoryName: catename[0].SubCategory.Name,
          CompanyName: catename[0].Supplier.CompanyName,
          PresentationName: catename[0].Presentation.Name,
        });
      });
    }
    if (option === 'EditarLot') {
      this.istLotEdit = false;
      this.istProductEdit = true;
      const inputsContainerlot = document.getElementById(
        'inputs-containerlot'
      )!;
      inputsContainerlot.classList.toggle('hidden');
      this.msgheader = 'Editar Lote';
      this.msgbody =
        'Edite el lote seleccionado para actualizar su información.';

      this.lotSvc.getLotById(Id).subscribe((resp) => {
        debugger;
        this.frmForm.patchValue({
          lot: resp,
        });
        debugger;
      });
    }
    if (option === 'AgregarLot') {
      this.istLotEdit = false;
      this.istProductEdit = true;
      this.frmForm.patchValue({
        lot: {
          ProductId: Id,
        },
      });
      const inputsContainerlot = document.getElementById(
        'inputs-containerlot'
      )!;
      inputsContainerlot.classList.toggle('hidden');
      this.msgheader = 'Agregar Lote';
      this.msgbody =
        'Agregar un nuevo lote del producto para actualizar su información.';

      this.supplierSvc.getSupplierById(Id).subscribe((resp) => {
        this.frmForm.patchValue(resp);
      });
    }

    if (option === 'Agregar') {
      this.istLotEdit = true;
      this.istProductEdit = true;

      this.msgheader = 'Agregar nuevo producto';
      this.msgbody = 'Cree un nuevo producto para gestionar sus productos.';
      this.frmForm.reset();
    }
    debugger;
    let dialog = document.getElementById('popup-modal-product');
    dialog!.classList.remove('hiddenmodal');
    dialog!.classList.add('showmodal');
  }

  hideModal() {
    this.istLotEdit = true;
    this.istProductEdit = true;
    let dialog = document.getElementById('popup-modal-product');
    dialog!.classList.remove('showmodal');
    dialog!.classList.add('hiddenmodal');
    this.frmForm.reset();
  }

  onSubmit() {
    debugger;
    if (this.frmForm.valid && this.istProductEdit && this.istLotEdit) {
      this.addProduct(this.frmForm.value);
    } else {
      if (this.istLotEdit) {
        if (this.getProductUpdateValidation(this.frmForm.value))
          this.updateProduct(this.frmForm.value);
        else this.frmForm.markAllAsTouched();
      } else {
        if (this.getLotUpdateValidation(this.frmForm.value.lot)) {
          if (!this.frmForm.value.lot.Id) this.addLot(this.frmForm.value.lot);
          else this.updateLot(this.frmForm.value.lot);
        } else this.frmForm.markAllAsTouched();
      }
    }
  }

  getProductUpdateValidation(prod: Product) {
    if (prod.Id && prod.SubCategoryId && prod.SupplierId && prod.PresentationId)
      return true;
    return false;
  }

  getLotUpdateValidation(lot: Lot) {
    if (
      lot.LotCode &&
      lot.ProductCode &&
      lot.PurchasePrice &&
      lot.SalePrice &&
      lot.stock
    )
      return true;
    return false;
  }

  addProduct(prod: Product) {
    this.productSvc.createProduct(prod).subscribe({
      next: (response: any) => {
        debugger;
        this.toastrSvc.success(
          'El producto fue creado con éxito',
          'Sistema de Gestión y de ventas'
        );

        this.productSvc.getProduct();
        this.frmForm.reset();

        this.hideModal();
        this.supplierSvc.getSuppliers();
        this.frmForm.reset();
      },
      error: (err: any) => {
        this.toastrSvc.error(
          err.error.message,
          'Sistema de Gestión y de ventas'
        );
      },
    });
  }

  updateProduct(prod: Product) {
    this.productSvc.updateProduct(prod.Id, prod).subscribe({
      next: (response: any) => {
        this.toastrSvc.success(
          'El producto fue actualizado con éxito',
          'Sistema de Gestión y de ventas'
        );

        this.productSvc.getProduct();
        this.frmForm.reset();

        this.hideModal();
        this.supplierSvc.getSuppliers();
        this.frmForm.reset();
      },
      error: (err: any) => {
        this.toastrSvc.error(
          err.error.message,
          'Sistema de Gestión y de ventas'
        );
      },
    });
  }

  addLot(lot: Lot) {
    this.lotSvc.createLot(lot).subscribe({
      next: (response: any) => {
        debugger;
        this.toastrSvc.success(
          'El lote fue creado con éxito',
          'Sistema de Gestión y de ventas'
        );

        this.productSvc.getProduct();
        this.frmForm.reset();

        this.hideModal();
        this.frmForm.reset();
      },
      error: (err: any) => {
        this.toastrSvc.error(
          err.error.message,
          'Sistema de Gestión y de ventas'
        );
      },
    });
  }

  updateLot(lot: Lot) {
    this.lotSvc.updateLot(lot.Id, lot).subscribe({
      next: (response: any) => {
        this.toastrSvc.success(
          'El lote fue actualizado con éxito',
          'Sistema de Gestión y de ventas'
        );

        this.productSvc.getProduct();
        this.frmForm.reset();

        this.hideModal();
        this.supplierSvc.getSuppliers();
        this.frmForm.reset();
      },
      error: (err: any) => {
        this.toastrSvc.error(
          err.error.message,
          'Sistema de Gestión y de ventas'
        );
      },
    });
  }

  showAlert(id: string, deleteoption:string ='product'): void {
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
        title: '¿Estás seguro de eliminar este proveedor?',
        text: 'No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          if( deleteoption === 'product')
            this.deleteProduct(id,swalWithBootstrapButtons)
          else
            this.deleteLot(id,swalWithBootstrapButtons);
        } else if (result.dismiss === 'cancel') {
          swalWithBootstrapButtons.fire({
            title: 'Cancelar',
            text: 'El proveedor no fue eliminado :)',
            icon: 'error',
          });
        }
      });
  }

  deleteProduct(id: string, swalWithBootstrapButtons: any) {
    this.productSvc.deleteProduct(id).subscribe({
      next: (result: any) => {
        debugger;
        if (result) {
          swalWithBootstrapButtons.fire({
            title: 'Eliminar proveedor!',
            text: 'El producto fue eliminado con éxito!.',
            icon: 'success',
          });
          this.productSvc.getProduct();
        } else {
          swalWithBootstrapButtons.fire({
            title: 'Cancelar',
            text: 'El producto no fue eliminado :)',
            icon: 'error',
          });
        }
      },
      error: (err) => {
        debugger;
        swalWithBootstrapButtons.fire({
          title: 'Error',
          text: err.error.message,
          icon: 'error',
        });
      },
    });
  }

  deleteLot(id: string, swalWithBootstrapButtons: any) {
    debugger;
    this.lotSvc.deleteLot(id).subscribe({
      next: (result: any) => {
        debugger;
        if (result) {
          swalWithBootstrapButtons.fire({
            title: 'Eliminar proveedor!',
            text: 'El producto fue eliminado con éxito!.',
            icon: 'success',
          });
          this.productSvc.getProduct();
        } else {
          swalWithBootstrapButtons.fire({
            title: 'Cancelar',
            text: 'El producto no fue eliminado :)',
            icon: 'error',
          });
        }
      },
      error: (err) => {
        debugger;
        swalWithBootstrapButtons.fire({
          title: 'Error',
          text: err.error.message,
          icon: 'error',
        });
      },
    });
  }

  /*Tabla colapse*/

  toggleProductLots(product: Product) {
    product.expanded = !product.expanded;
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';

    switch (status) {
      case 'available':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'expired':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'low-stock':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  getStockLevelClass(stock: number): string {
    if (stock > 50) return 'text-green-600 font-semibold';
    if (stock > 10) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  }
  // Agregar estos métodos a la clase ProductTableComponent

  getDaysRemaining(expirationDate: Date): string {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Expirado';
    } else if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return '1 día';
    } else {
      return `${diffDays} días`;
    }
  }

  getDaysRemainingClass(expirationDate: Date): string {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'text-red-600';
    } else if (diffDays <= 30) {
      return 'text-yellow-600';
    } else {
      return 'text-green-600';
    }
  }

  getTotalLots(): number {
    return this.productss().reduce(
      (total, product) => total + product?.lots.length,
      0
    );
  }

  getTotalstock(stock: Lot[]): number {
    const totalStock = stock.reduce(
      (acc, prod) => acc + parseInt(prod.stock.toString()),
      0
    );
    return totalStock;
  }

  getSearchPresentationcontrol() {
    this.searchPresentationControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        debugger;
        if (value) {
          this.searchPresentation(value);
        } else {
          this.suggestionPresentations = [];
        }
      });
  }

  getSearchcontrol() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        debugger;
        if (value) {
          this.searchSuppliers(value);
        } else {
          this.suggestions = [];
        }
      });
  }

  getSearchSubCategorycontrol() {
    this.searchSubcategoryControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        debugger;
        if (value) {
          this.searchSubcategory(value);
        } else {
          this.suggestionSubCategories = [];
        }
      });
  }

  searchSuppliers(query: string) {
    this.suggestions = this.suppliers().filter((supplier) =>
      supplier.CompanyName.toLowerCase().includes(query.toLowerCase())
    );
  }

  searchPresentation(query: string) {
    this.suggestionPresentations = this.presentations().filter((presentation) =>
      presentation.Name.toLowerCase().includes(query.toLowerCase())
    );
  }

  searchSubcategory(query: string) {
    let cat = this.subCategories();
    this.suggestionSubCategories = this.subCategories().filter((subcate) =>
      subcate.Name.toLowerCase().includes(query.toLowerCase())
    );
  }

  selectSupplier(supplier: Supplier) {
    debugger;
    this.frmForm.patchValue({
      SupplierId: supplier.Id,
      CompanyName: supplier.CompanyName,
    });
    this.suggestions = [];
    // this.searchControl.setValue("");
  }

  selectPresentation(presentation: Presentation) {
    debugger;
    this.frmForm.patchValue({
      PresentationId: presentation.Id,
      PresentationName: presentation.Name,
    });
    this.suggestionPresentations = [];
    // this.searchControl.setValue("");
  }

  selectSubCategory(cate: Category) {
    debugger;
    this.frmForm.patchValue({
      SubCategoryId: cate.Id,
      SubCategoryName: cate.Name,
    });
    this.suggestionSubCategories = [];
    // this.searchControl.setValue("");
  }

  onSearch() {
    const value = this.searchControl.value;
    if (value) {
      this.searchSuppliers(value);
    }
  }

  onSearchPresentation() {
    const value = this.searchPresentationControl.value;
    if (value) {
      this.searchPresentation(value);
    }
  }

  onSearchSubCategory() {
    const value = this.searchSubcategoryControl.value;
    if (value) {
      this.searchSubcategory(value);
    }
  }

  toggleButton() {
    const toggleButton = document.getElementById('toggle-button')!;
    const inputsContainer = document.getElementById('inputs-container')!;
    const toggleIcon = toggleButton.querySelector('i')!;

    if (this.istLotEdit && this.istProductEdit) {
      const inputsContainerlot = document.getElementById(
        'inputs-containerlot'
      )!;

      if (!inputsContainerlot.classList.contains('hidden')) {
        inputsContainerlot.classList.toggle('hidden');
      }
    }
    // Cambia la visibilidad del contenedor de inputs
    inputsContainer.classList.toggle('hidden');
    // Cambia el icono de la flecha
    toggleIcon.classList.toggle('fa-chevron-down');
    toggleIcon.classList.toggle('fa-chevron-up');
  }
  toggleButtonLot() {
    const toggleButtonlot = document.getElementById('toggle-buttonlot')!;
    const inputsContainerlot = document.getElementById('inputs-containerlot')!;
    const toggleIconlot = toggleButtonlot.querySelector('i')!;

    if (this.istLotEdit && this.istProductEdit) {
      const inputsContainer = document.getElementById('inputs-container')!;
      if (!inputsContainer.classList.contains('hidden')) {
        inputsContainer.classList.toggle('hidden');
      }
    }

    // Cambia la visibilidad del contenedor de inputs
    inputsContainerlot.classList.toggle('hidden');
    // Cambia el icono de la flecha
    toggleIconlot.classList.toggle('fa-chevron-down');
    toggleIconlot.classList.toggle('fa-chevron-up');
  }

  onUploaded(image: UploadedImg) {
    debugger;
    this.frmForm.patchValue({
      ImageUrl: image.secure_url,
      PublicIdUrl: image.public_id,
    });
  }

  onDateChange(date: Date | null) {
    debugger;
    this.frmForm.patchValue({
      lot: {
        ExpiredDate: date,
      },
    });
  }
}
