import { Component } from '@angular/core';
import { of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.css']
})
export class AtividadesComponent {
  atividades: any[] = [];
  atividadesPorPagina = 10; // Número de atividades por página
  paginaAtual = 1; // Página atual
  textoBusca = ''
  atividadesFiltradas: any[] = [];
  
  constructor(
    private api:ApiService,
    ){
    this.getAtividades();
  }

  getAtividades(){
    of(this.api.getAtividades().subscribe({
      next: data => {
        this.atividades = data;
        this.atividadesFiltradas = data;
        },
      error: erro => console.log(erro),
      complete: () => console.info('complete') 
    }))
  }

  filtrarAtividades(): void {
    // filter para criar uma nova lista de atividades que contenham o esporte buscado.
    this.atividadesFiltradas = this.atividades.filter(atividade => atividade.evento.esporte.toLowerCase().includes(this.textoBusca.toLowerCase()));
  }
}
