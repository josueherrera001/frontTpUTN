import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from 'shared/models/user';
import { RegisterService } from 'shared/services/register.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export default class RegisterComponent {
  registerForm!: FormGroup;

  constructor(
    private readonly registerService: RegisterService,
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.createForm();
  }
  private createForm():void{
      this.registerForm = this.fb.group({
        FirstName: ['',[Validators.required]],
        LastName: ['',[Validators.required]],
        Email: ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
        Phone: ['',[Validators.required, Validators.pattern(/^\+54(?:9)?\d{1,5}\d{7,8}$/)]],
        Country: ['',[Validators.required]],
        Province: ['',[Validators.required]],
        Street: ['',[Validators.required]],
        Location: ['',[Validators.required]],
        StreetNumber: ['',[Validators.required]],
        BetweenStreet: ['',[Validators.required]],
        UserName: ['',[Validators.required]],
        UserPass: ['',[Validators.required]],
        ConfUserPass: ['',[Validators.required]]
      });
    }

  onSubmit(): void {
    if (this.registerForm.valid) {
      try {
        const formData = this.registerForm.value;
        const user: User = {
          address:{
            UserId: '', // This should be set to the actual user ID after registration
            Country: formData.Country,
            Province: formData.Province,
            BetweenStreet: formData.BetweenStreet,
            Location: formData.Location,
            Street: formData.Street,
            StreetNumber: formData.StreetNumber,
            Id: ''
          },
            auth:{
              UserName: formData.UserName,
              UserPass: formData.UserPass,
              RoleId: '', // Default role, can be changed later
              EmailValidated: false,
            },
            Email: formData.Email,
            FirstName: formData.FirstName,
            LastName: formData.LastName,
            Phone: formData.Phone,
          };

        // Here you can add the logic to send the data to the server
        this.registerService.post(user).subscribe(
          (response) => {
            this.router.navigate(['/products']);
          },
          (error:HttpErrorResponse) => {
            console.error('Registration error', error );
          }
        );
      } catch (error: any) {
          console.error('Error during registration', error);
      }

    } else {
      this.registerForm.markAllAsTouched();
    }
  }

}
