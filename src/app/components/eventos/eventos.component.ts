import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {
  eventos: any[] = [];
  texto = '';
  eventosPorPagina = 10; // Número de atividades por página
  paginaAtual = 1; // Página atual


  constructor(private api:ApiService){
    this.getEventos();
  }

  getEventos(){
    of(this.api.getAllEventos().subscribe({
      next: data =>{this.eventos = data},
      error: erro => console.log(erro),
      complete: () => console.info('complete') 
    }))
  }

}


