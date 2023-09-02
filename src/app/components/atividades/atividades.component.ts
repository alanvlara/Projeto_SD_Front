import { Component } from '@angular/core';
import { of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.css']
})
export class AtividadesComponent {
  atividades: any[] = [];
  atividadesPorPagina = 10; // Número de atividades por página
  paginaAtual = 1; // Página atual
  texto = ''
  
  constructor(
    private api:ApiService,
    private auth: AuthenticationService,
    ){
    this.getAtividades();
  }

  getAtividades(){
    of(this.api.getAtividades().subscribe({
      next: data => {
        // console.log(data)
        for(let i = 0; i < data.length; i++){
          if(data[i].usuario['id'] == this.auth.getUserId()){
            this.atividades.push(data[i]);
          }
        }},
      error: erro => console.log(erro),
      complete: () => console.info('complete') 
    }))
  }
}
