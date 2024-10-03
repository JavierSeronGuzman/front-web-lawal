import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [RouterOutlet,CommonModule,LoaderComponent],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent implements OnInit{
  isLoading = true;
  ngOnInit(): void {
    this.isLoading = false;
  }

}
