import { Component, input } from '@angular/core';

@Component({
  selector: 'app-formaddheader',
  standalone: true,
  imports: [],
  templateUrl: './formaddheader.component.html',
  styleUrl: './formaddheader.component.scss'
})
export class FormaddheaderComponent {


    msgheader  = input.required<String>();
    msgbody  = input.required<String>();

}
