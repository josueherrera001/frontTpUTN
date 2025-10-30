import { Component } from '@angular/core';
import { Account } from 'shared/models/Account';
import { UserMenuService } from 'shared/services/user.menu.service';

@Component({
  selector: 'app-assignuser',
  standalone: true,
  imports: [],
  templateUrl: './assignuser.component.html',
  styleUrl: './assignuser.component.scss'
})
export class AssignuserComponent {

  account:Account[] =[];

  constructor(private readonly usermemnusvc:UserMenuService){
    this.getAllAccount();
  }


  getAllAccount(){  debugger;
    this.usermemnusvc.getAllAccount().subscribe( ( resp:any ) =>{
      this.account = resp;
    })
  }
}
