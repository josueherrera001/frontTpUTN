import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-madalaction',
  standalone: true,
  imports: [
    DatePipe,ReactiveFormsModule, CommonModule
  ],
  template: `


  <div id="popup-modal-add" tabindex="-1"
    class="bg-black bg-opacity-50 w-screen h-screen hidden overflow-y-auto  overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center  md:inset-0  max-h-full">
    <div class="relative p-4 w-full max-h-full items-center justify-center flex">
      <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 lg:w-[43rem] md:w-3/4 sm:w-full">

        <div class="p-4 md:p-5 text-center">
          <hr>
          <form action="" class="flex flex-col justify-between h-full" [formGroup]="frmForm" class="form">

            <div class="bg-indigo-600 p-6 text-white justify-items-center">
              <div class="flex items-center">
                <i class="fas fa-list text-2xl mr-3"></i>
                <h1 class="text-2xl font-bold">{{ msgheader() }}</h1>
              </div>
              <p class="mt-2 text-indigo-100">{{ msgbody() }}</p>
            </div>
            <input type="text" name="Id" hidden readonly id="Id">

            <div class="form-section mb-1">
            </div>
            <div class="md:col-span-5">
              <label class="flex" for="Name">Nombre <p class="text-red-500">*</p></label>
              <input type="text" name="Name" id="Name" formControlName="Name"
                class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" placeholder="Nombre de la categoria" />
              <div *ngIf="frmForm.get('Name')?.touched && frmForm.get('Name')?.invalid"
                class="text-lg text-red-700 p-2 mt-1">
                <div *ngIf="frmForm.get('Name')?.errors?.['required']">Nombre requerido</div>
              </div>
            </div>

            <div class="md:col-span-5">
              <label class="flex" for="Description">Descripcion</label>
              <textarea type="text" name="Description" id="Name" formControlName="Description"
                class="resize-none border mt-1 rounded px-4 w-full h-52 bg-gray-50" value="" placeholder="Ingresa la descripcion" >
              </textarea>
            </div>
            <div
              class="justify-end p-4 border-t border-gray-200 rounded-b-lg flex items-center space-x-2 dark:border-gray-600">
              <button (click)="hideModalcategory()" data-modal-hide="popup-modal-category" type="button"
                class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                cancel
              </button>
              <button data-modal-hide="popup-modal-category" type="submit"
                class="text-white bg-purple-600 hover:bg-purple-900 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                Aceptar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class MadalactionComponent {

  msgheader  = input.required<String>();
  msgbody  = input.required<String>();

  // @Output() showModal = new EventEmitter<any>();
  // @Output() onsubmit = new EventEmitter<any>();
  // @Output()  hidemodalcategory = new EventEmitter<any>();

  frmForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder
  ){this.createForm();}

  private createForm():void{
    this.frmForm = this.fb.group({
      Id: [''],
      Name: ['',[Validators.required]],
      Description: ['']
    });
  }

  showModalCreateCategory():void {
    debugger;
     let dialog = document.getElementById('popup-modal-add');
    dialog!.classList.remove('hiddenmodal');
    dialog!.classList.add('showmodal');
    // this.showModal.emit();
  }

  // onSubmit():void {
  //   this.onsubmit.emit();
  // }

  hideModalcategory() {
    debugger;
    let dialog = document.getElementById('popup-modal-add');

    dialog!.classList.remove('showmodal');
    dialog!.classList.add('hiddenmodal');
    return;
  }
}
