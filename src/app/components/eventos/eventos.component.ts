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
  eventosFuturos: any[] = [];
  eventosPassados: any[] = [];
  eventosAdmin: any[] = [];
  texto = '';
  mostraQrCode = false;
  eventosPorPagina = 10; // Número de atividades por página
  paginaAtual = 1; // Página atual
  filtro: string = 'futuros';


  constructor(private api:ApiService){
    this.getEventos();
    this.filtrarEventos();
  }

  filtrarEventos() {
    const dataAtual = new Date();

    this.eventosFuturos = this.eventos.filter((evento) => {
      const dataEvento = new Date(evento.data);
      return dataEvento >= dataAtual;
    });

    this.eventosPassados = this.eventos.filter((evento) => {
      const dataEvento = new Date(evento.data);
      return dataEvento < dataAtual;
    });

    this.eventosAdmin = this.eventos.filter((evento) => evento.qr_code);
  }

  getEventos(){
    of(this.api.getAllEventos().subscribe({
      next: data =>{this.eventos = data},
      error: erro => console.log(erro),
      complete: () => console.info('complete') 
    }))
  }

  hoje(): Date {
    return new Date(); // Isso retorna a data e hora atual
  }

  compareDates(dateString: string, comparisonDate: Date): number {
    const eventDate = new Date(dateString);
    return eventDate.getTime() - comparisonDate.getTime();
  }

}


