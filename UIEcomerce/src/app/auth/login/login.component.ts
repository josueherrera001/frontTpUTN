import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from 'shared/services/task.service';

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
      this.taskService.Authentication(this.authForm.value).subscribe(
        (data:any) =>{
          if(data){
              this.router.navigate(['/principal']);
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
