import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CategoriesService } from '@api/category.service';
import { CategoryInterface } from 'app/interfaces/category.interface';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export default class CategoryListComponent {

  msgheader:String = 'Agregar Categoría';
  msgbody:String = 'Gestione las categorías de productos de su tienda. Puede agregar nuevas categorías, editar las existentes o eliminarlas si ya no son necesarias. Mantener sus categorías organizadas ayuda a los clientes a encontrar fácilmente los productos que buscan.';

  private readonly categorySvc = inject(CategoriesService);
  categories = this.categorySvc.categories;

  selectCategory(category: CategoryInterface): void {
  }
  addCategory(category: CategoryInterface) {

  }

  updateCategory(id: number, updates:CategoryInterface) {

  }

  deleteCategory(id: String) {

  }

  showModalCreateCategory() {
    debugger
      this.msgheader = 'Agregar Subcategoría';
          this.msgbody = 'Gestione las subcategorías de productos de su tienda. Puede agregar nuevas subcategorías, editar las existentes o eliminarlas si ya no son necesarias. Mantener sus subcategorías organizadas ayuda a los clientes a encontrar fácilmente los productos que buscan.';

          let dialog = document.getElementById('popup-modal-category');
          // if (dialog) {
          dialog!.classList.remove('hiddenmodal');
              dialog!.classList.add('showmodal');
            // dialog!.classList.remove('hiddenmodal');
            // dialog!.classList.add('flex');
            // setTimeout(() => {
          //   }, 20);
          // }
    }

    hideModalcategory(){
      let dialog = document.getElementById('popup-modal-category');
      // if (dialog) {
        dialog!.classList.remove('showmodal');
        dialog!.classList.add('hiddenmodal');
        // setTimeout(() => {
          // dialog!.classList.add('hidden');
      //   }, 20);
      // }
    }

}
