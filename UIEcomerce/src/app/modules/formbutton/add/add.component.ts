import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [],
  template: `
    <button class="text-blue-600 hover:text-blue-900 transition-colors" data-title="{{ datatitle() }}"
      data-modal-target="popup-modal-category" (click)="showModalCreateCategory(Id,option)">
      <i class="fa fa-plus" aria-hidden="true"></i>
    </button>
  `,
})
export class AddComponent {
  datatitle  = input.required<String>();

  Id:string ='';
  option:string ='';

   @Output() showModal = new EventEmitter<any>();

   showModalCreateCategory(Id:String='', option:String):void {
     this.showModal.emit({Id,option});
    }
}
