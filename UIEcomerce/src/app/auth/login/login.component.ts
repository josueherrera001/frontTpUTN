import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tokens } from 'shared/models/token';
import { AuthService } from 'shared/services/auth.service';
import { DecoderTokenService } from 'shared/services/decoder.token.service';
import { TaskService } from 'shared/services/task.service';
import { UserMenuService } from 'shared/services/user.menu.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {

  authForm!: FormGroup;

  constructor(
    private readonly taskService: TaskService,
    private readonly router: Router,
    private readonly fb:FormBuilder
  ){
      this.Initial();
  }

  Initial():void{
    this.authForm = this.fb.group({
      UserName: ['',[Validators.required]],
      UserPass: ['',[Validators.required]]
    });
  }
  Submit(){
    if( this.authForm.valid){
      debugger;
      this.taskService.Authentication(this.authForm.value).subscribe(
        (data:any) =>{
          if(data){
              this.router.navigate(['/products']);
          }
          else{
            alert('Usuario y/o contraseña incorrecto')
          }
        }
      )
    }
    else{
      alert('Debe ingresar los datos');
    }
  }
}
