import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ItemState } from '../../store/items.reducers';
import { Store } from '@ngrx/store';
import { Item } from '../../models/cartItem';
import Swal from 'sweetalert2'
import { Cotizacion } from '../../models/cotizacion';
import { FormsModule, NgForm } from '@angular/forms';
import { Client } from '../../models/client';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.css'
  
})
export class PayComponent {

  cotizacion!: Cotizacion;

  client: Client;
  items!: Item[];
  total = 0;

  show = true;

  
  constructor(private store: Store<{items: ItemState}>, 
    private http: HttpClient
  ){
    this.store.select('items').subscribe(state => {
        this.items = state.items;
        this.total = state.total;
    }),
    this.client = new Client(),
    this.cotizacion = new Cotizacion()
  }

  showSend(show: boolean): void{
    this.show = show;
  }
  sendCotizacion(){
  }
  onSubmit(clientForm: NgForm): void {
    if (clientForm.valid){
      this.cotizacion = {
        cliente: this.client,
        cartItems: this.items,
        total:  this.total
      }
       // Hacer la solicitud POST al backend
    this.http.post("http://localhost:8080/api/cotizacion/guardar", this.cotizacion)
    .subscribe(
        response => {
            Swal.fire({
                title: "¡Cotización Enviada!",
                text: "Un vendedor te informará sobre la disponibilidad de productos.",
                icon: "success"
            });
            console.log('Respuesta del servidor:', response);
        },
        error => {
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al enviar la cotización. Por favor, intenta nuevamente.",
                icon: "error"
            });
            console.error('Error al enviar la cotización:', error);
        }
    );
    console.log(this.cotizacion)
    }
    clientForm.reset();
    clientForm.resetForm()
  }

}
