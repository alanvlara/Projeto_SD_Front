import { Component} from '@angular/core';
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
  eventosFiltrados: any[] = [];
  texto = '';
  eventosPorPagina = 10; // Número de eventos por página
  paginaAtual = 1; // Página atual
  filtro: string = 'futuros';
  criador = false;
  textoBusca = '';


  constructor(private api:ApiService){}

  ngOnInit(){
    of(this.api.getUserLogado().subscribe({
      next: data => this.criador = data.criador,
      error: error => console.log(error)
    }));

    of(this.api.getAllEventos().subscribe({
      next: data =>{this.eventos = data
        this.atualizarEventosFiltrados();},
      error: erro => console.log(erro),
      complete: () => console.info('complete') 
    }));
    
    
  }


  getCurrentDateInBrasilia(): Date {
    // Crie uma nova data
    const now = new Date();

    // Defina o fuso horário como Brasília
    now.setUTCHours(-3);

    return now;
  }

  compareDates(dateString: string, comparisonDate: Date): number {
    const eventDate = new Date(dateString);
    return eventDate.getTime() - comparisonDate.getTime();
  }

  atualizarEventosFiltrados() {
    // Atualize a lista de eventos filtrados com base no filtro selecionado
    if (this.filtro === 'futuros') {
      this.eventosFiltrados = this.eventos.filter(evento =>
        this.compareDates(evento.data, this.getCurrentDateInBrasilia()) >= 0
      );
    } else if (this.filtro === 'passados') {
      this.eventosFiltrados = this.eventos.filter(evento =>
        this.compareDates(evento.data, this.getCurrentDateInBrasilia()) < 0
      );
    } else if (this.filtro === 'admin') {
      this.eventosFiltrados = this.eventos.filter(evento => evento.qr_code);
    }
  
    // Defina a página atual de volta para a primeira página
    this.paginaAtual = 1;
  }

  filtrarEventosPorNome() {
    this.eventosFiltrados = this.eventos.filter(evento => evento.titulo.toLowerCase().includes(this.textoBusca.toLowerCase()));
  }
  
}