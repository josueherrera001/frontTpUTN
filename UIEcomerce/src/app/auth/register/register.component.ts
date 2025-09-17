import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from 'shared/models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export default class RegisterComponent {
  registerForm!: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.createForm();
  }
  private createForm():void{
      this.registerForm = this.fb.group({
        FirstName: ['',[Validators.required]],
        LastName: ['',[Validators.required]],
        Email: ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
        Phone: ['',[Validators.required]],
        Country: ['',[Validators.required]],
        Province: ['',[Validators.required]],
        Street: ['',[Validators.required]],
        Location: ['',[Validators.required]],
        StreetNumber: ['',[Validators.required]],
        BetweenStreet: ['',[Validators.required]],
        UserName: ['',[Validators.required]],
        UserPass: ['',[Validators.required]]
      });
    }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      const user: User = {
        Address:{
            UserId: '', // This should be set to the actual user ID after registration
            Country: formData.Country,
            Province: formData.Province,
            Between: formData.BetweenStreet,
            Location: formData.Location,
            Street: formData.Street,
            Number: formData.StreetNumber,
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
          PhoneNumber: formData.Phone,
        };
      
      // Aquí puedes agregar la lógica para enviar los datos al servidor
    } else {
      console.log('Form is invalid');
    }
  }

}
