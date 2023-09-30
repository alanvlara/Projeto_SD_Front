import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  form!: FormGroup;
  mostraFracasso = false;
  id = '';
  acess = '';
  refresh = '';
  entrarClicado : boolean = false;
  textoFracasso = 'Nada';
  linkVerificaEmail = false;
  mostraReenvio = false;
  textoSucesso = 'Nada';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService,
    private authService: AuthenticationService

    ) {}
  ngOnInit(): void {
    this.form = this.formBuilder.group({
        email: [''],
        senha: ['']
  });
  this.entrarClicado = false;
}  


entrar(): void {
  this.linkVerificaEmail = false;
  this.mostraFracasso = false;
  this.mostraReenvio = false;
    if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
    }

    const usuario = this.form.getRawValue();
    
    interface ApiResponse {
      access: string,
      refresh: string,
      user: {
        pk: number,
        username: string,
        email: string,
        first_name: string,
        last_name: string
      }
    }

    this.entrarClicado = true;
    of(this.api.postLoginUser(usuario).subscribe({
      next: data => {
        
          const resposta: ApiResponse = data as ApiResponse;
          this.id = String(resposta.user.pk);
          this.authService.setAuthToken(resposta.access, resposta.refresh, this.id)
          this.router.navigate(['perfil/']);
          localStorage.setItem('mostraHome', 'false')},
      error: erro => {console.log(erro)
      this.entrarClicado = false;
      this.textoFracasso = erro.error.non_field_errors || erro.error.email;
      if(erro.error.non_field_errors == "E-mail não foi verificado.")
      {
        this.linkVerificaEmail = true;
      }
      this.mostraFracasso = true},
      complete: () => console.info('complete') 
    }));
}

reenviaEmail(){
  this.mostraFracasso = false;
  this.entrarClicado = true;
  this.mostraReenvio = false;
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
}

  const usuario = this.form.getRawValue();
  of(this.api.postResendEmail(usuario.email).subscribe({
    next: data => {
      console.log(data)
      this.mostraReenvio = true;
      this.textoSucesso = "Email reenviado, Verifique sua caixa de mensagens. A página será recarregada";
      this.entrarClicado = false;
  },
    error: erro => {
      console.error(erro);
      this.mostraFracasso = true;
      this.textoFracasso = erro.error;
      this.entrarClicado = false;}
  }));

  setTimeout(() =>window.location.reload(), 5000);
}
}




