import { Component, OnInit } from '@angular/core';
import { InicioComponent } from './components/inicio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InicioComponent],
  templateUrl: './app.component.html'
})
export class AppComponent{

  title = 'lawal';
  
}
