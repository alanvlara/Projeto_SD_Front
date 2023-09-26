import { Component } from '@angular/core';
import { of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent {

  pessoas: any[] = [];
  pessoasPorPagina = 10; // Número de atividades por página
  paginaAtual = 1; // Página atual
  userLogado: any;
  filtro: string = '';

  constructor(
    private api : ApiService,
  ){}

  ngOnInit(){
    of(this.api.getUserLogado().subscribe({
      next: user => {
        this.userLogado = user;
        this.filtro = this.userLogado.esportePreferido;

        // Após configurar o filtro, carregue apenas as pessoas com o mesmo esporte preferido
        this.carregarPessoasComEsportePreferido();
      },
      error: error => console.log(error),
      complete: () => console.log('complete')
    }))
  }

  carregarPessoasComEsportePreferido() {
    if (this.filtro) {
      // Carregue apenas as pessoas com o esporte preferido igual ao do usuário logado
      of(this.api.getAllUsers().subscribe({
        next: users => {
          this.pessoas = users.filter((pessoa:any) => pessoa.esportePreferido === this.filtro);
          // Ordenar as pessoas, se necessário
          this.pessoas.sort((b, a) => a.totalEventos - b.totalEventos);
        },
        error: error => console.error(error),
        complete: () => console.log("complete")
      }));
    }
  }

  filtrarRanking() {
    // Filtra os usuários com base no esporte selecionado (this.filtro)
    this.carregarPessoasComEsportePreferido();
  }
}