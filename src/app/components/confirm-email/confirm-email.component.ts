import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';



@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {

  mostraSucesso = false;
  mostraFracasso = false;
  constructor(
    private api: ApiService,  // Service que acessa as urls /accounts do backend
    private _activatedRoute: ActivatedRoute,  // Service que vai permitir recueprar a key que chega na url de validação de email
    private router: Router
    ) {
  }

  ngOnInit(): void {
    // Recupear a key que chega na url
    const key = this._activatedRoute.snapshot.params['key'];

    // A função confirmEmail() faz um POST para a url do backend /accounts/registration/verify-email/, enviando a key
    of(this.api.confirmEmail(key)
      .subscribe({
        next: (value) => {
          // Em caso de sucesso, o e-mail já está confirmado e esta variável pode ser usada no html para mostrar uma mensagem de sucesso e algum link para redirecioanar para o login
          setTimeout( ()=> this.router.navigate(['/home']), 5000)
          this.mostraSucesso = true;
        },
        error: (error) => {
          // Em caso de erro, esta variável pode ser usada no html para mostrar uma mensagem de erro
          this.mostraFracasso = true;
        }
      }))
  }
}