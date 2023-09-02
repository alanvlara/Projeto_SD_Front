import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/utils/validators';
import { HttpClient, HttpHeaders } from '@angular/common/http'
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
  mostraFracasso = false;

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
          email: ['', [Validators.required, Validators.email]], // { email: true }
          senha: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(4), CustomValidators.forcaSenha]],
          confirmaSenha: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(4)]],
          esportePreferido: ['', [Validators.required]],
          cpf: ['', [Validators.required, CustomValidators.cpf]],
          cep: ['', [Validators.required]],
          endereco: ['', [Validators.required]],
          cidade: ['', [Validators.required]],
          estado: ['', [Validators.required]]
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


  }
  

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    const usuario = {
      ...this.form.getRawValue(),
      esportePreferido: this.form.get('esportePreferido')?.value,
      cpf: this.form.get('cpf')?.value,
      cep: this.form.get('cep')?.value,
      endereco: this.form.get('endereco')?.value,
      cidade: this.form.get('cidade')?.value,
      estado: this.form.get('estado')?.value,
    };
  
    console.log(usuario);
  
    of(this.api.postUser(usuario).subscribe({
      next: data => {
        console.log(data);
        this.mostraSucesso = true;
      },
      error: erro => {
        console.log(erro);
        this.mostraFracasso = true;
      },
      complete: () => console.info('complete') 
    }));
  }
}
