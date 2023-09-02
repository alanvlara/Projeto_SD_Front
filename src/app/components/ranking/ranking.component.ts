import { Component } from '@angular/core';
import { of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

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

  constructor(
    private api : ApiService,
  ){}

  ngOnInit(){

    of(this.api.getUserLogado().subscribe({
      next: user => {this.userLogado = user
      console.log(this.userLogado)},
      error: error => console.log(error),
      complete: () => console.log('complete')
    }))

    of(this.api.getAllUsers().subscribe({
      next: users =>{
        console.log(users)
        for(let i=0; i<users.length; i++){
          if(users[i].esportePreferido == this.userLogado.esportePreferido){
            this.pessoas.push(users[i]);
          }
        }
        this.pessoas.sort((a, b) => b.totalEventos - a.totalEventos);
        console.log(this.pessoas)
      },
    error: error => console.error(error),
    complete: () => console.log("complete")
    }));
  }
}
