import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-formheader',
  standalone: true,
  imports: [],
  template: `
      <div class="bg-gradient-to-r rounded-lg from-indigo-600 to-purple-600 p-6 text-white">
      <div class="flex items-center justify-between">
          <div class="flex items-center">
              <i class="fas fa-tags text-2xl mr-3"></i>
              <h1 class="text-2xl font-bold">{{ titlemsg() }}</h1>
          </div>
          <div class="bg-white/20 p-2 rounded-full" (click)="showModalCreateCategory('','Agregar')"  data-modal-target="popup-modal-category">
              <i class="fas fa-plus text-white"></i>
          </div>
      </div>
      <p class="mt-2 text-center  font-bold text-indigo-100">{{ (headeremsg()) }}</p>
  </div>
  `,
})
export class FormheaderComponent {

  titlemsg  = input.required<String>();
  headeremsg  = input.required<String>();

  @Output() showModal = new EventEmitter<any>();

  showModalCreateCategory(Id:String='', option:String):void {
    this.showModal.emit({Id,option});
  }
}
