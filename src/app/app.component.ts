import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PeriodicElementsListComponent} from './components/periodic-elements/periodic-elements-list/periodic-elements-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PeriodicElementsListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chemical-elements';
}
