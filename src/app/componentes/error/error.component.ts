import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export default class ErrorComponent {

}
