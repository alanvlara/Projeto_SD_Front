import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/utils/validators';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  form!: FormGroup;
  mostraSucesso = false;
  mostraFracasso = false
  textoErro = 'Nada'
  validarSenhas = true;
  querCriar = false;
  salvarClicado = false;
  politica = false;

  constructor(
      private formBuilder: FormBuilder,
      private api: ApiService,
      private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
        username: ['', Validators.required],
        nome: ['', Validators.required],
        sobrenome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(4), CustomValidators.forcaSenha]],
        confirmaSenha: ['', [Validators.required]],
        esportePreferido: ['', [Validators.required]],
        cpf: ['', [Validators.required, CustomValidators.cpf]],
        cep: ['', [Validators.required]],
        endereco: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]], 
        politica: ['', [Validators.required, CustomValidators.politicaValidator]],
        querCriar: false,
        representa: ['Nenhuma']
    });

    this.subscribeForms();
}


  subscribeForms(): void {

      this.form.get('cep')?.valueChanges
          .subscribe(valor => {
              if (valor.length >= 8) {
                  fetch(`https://viacep.com.br/ws/${valor}/json/`).then(response => {
                      return response.json();
                  }).then(resposta => {
                      this.form.get('endereco')?.setValue(resposta.logradouro, {
                          emitEvent: false // pra não cair no maximum call stack excedeed
                      })
                      this.form.get('estado')?.setValue(resposta.uf, {
                          emitEvent: false // pra não cair no maximum call stack excedeed
                      })
                      this.form.get('cidade')?.setValue(resposta.localidade, {
                          emitEvent: false // pra não cair no maximum call stack excedeed
                      })

                  }).catch((e) => {
                      console.log("Error", e);
                  })
              }

          });

          this.form.get('senha')?.valueChanges.subscribe(() => {
            if (this.validarSenhas) {
              this.validarSenhasIguais();
            }
          });
      
          this.form.get('confirmaSenha')?.valueChanges.subscribe(() => {
            if (this.validarSenhas) {
              this.validarSenhasIguais();
            }
          });
          
          

  }

  validarSenhasIguais(): void {
    const senha = this.form.get('senha')?.value;
    const confirmaSenha = this.form.get('confirmaSenha')?.value;

    if (senha !== confirmaSenha || confirmaSenha ==='') {
      // Define um erro personalizado no controle 'confirmaSenha'
      this.form.get('confirmaSenha')?.setErrors({ senhasDiferentes: true });
    } else {
      // Limpa os erros se as senhas forem iguais
      this.form.get('confirmaSenha')?.setErrors(null);
    }
  }

  onQuerCriarChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.querCriar = isChecked;
}

onPoliticaChange(event: Event): void {
  const isChecked2 = (event.target as HTMLInputElement).checked;
  this.politica = isChecked2;
}
  

salvar(): void {
  this.mostraFracasso = false;
  this.mostraSucesso = false;
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.salvarClicado = true;
  const usuario = {
    ...this.form.getRawValue(),
  };

  console.log(usuario);

  of(this.api.postUser(usuario).subscribe({
    next: data => {
      console.log(data);
      this.mostraSucesso = true;
      this.salvarClicado = false;  
      setTimeout(()=>this.router.navigate(['/home']), 4000);
    },
    error: erro => {
      console.log(erro);
      this.textoErro = "Erro: "+ (erro.error.email || erro.error.username  || erro.error.non_field_errors
      || erro.error.password1);
      this.mostraFracasso = true;
      this.salvarClicado = false;
    },
    complete: () => console.info('complete') 
  }));
}
}
