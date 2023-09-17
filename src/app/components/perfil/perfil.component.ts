import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ApiResponse } from 'src/app/services/api-response-model';
import { Html5QrcodeScanner, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent  {

  form!: FormGroup;
  id : any;
  usuario = {
    'username' : '',
    'cidade' : '',
    'foto' : '',
    'esportePreferido': '',
  }
  atividades = [];
  totalAtividades = 0;
  posicao = 0;
  pessoas: any[] = [];
  userLogado: any;
  

  constructor(
    private formBuilder: FormBuilder,
    private api : ApiService,
    private authService: AuthenticationService,
    private router: Router,
) { }

ngOnInit(): void {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    this.authService.loggedInStatus.next(loggedIn);

    this.authService.getLoggedInStatus().subscribe((loggedIn) => {
    if (loggedIn) {
      of(this.api.getUserLogado().subscribe({
        next: (data: ApiResponse) => {
          this.usuario = data;
          this.userLogado = data;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          // console.info('complete');
        }
      }));
    } else {
      this.router.navigate(['/not-found']); // Redirecionar para a tela de não encontrado
    }
  });

  
  forkJoin([
    this.api.getAtividades(),
    this.api.getAllUsers(),
  ]).subscribe(([atividades, users]) => {
    this.atividades = atividades;
    this.totalAtividades = this.atividades.length;
    
    this.pessoas = users.filter((user:any) => user.esportePreferido === this.userLogado.esportePreferido);
    this.pessoas.sort((a, b) => b.totalEventos - a.totalEventos);

    this.posicao = this.obterIndiceUsuarioLogado(this.pessoas, this.userLogado);
  });
    }  

    obterIndiceUsuarioLogado(pessoas: any[], userLogado: any): number {
      // console.log(pessoas, userLogado);
      return pessoas.findIndex(pessoa => pessoa.id === userLogado.pk);
    }
}
