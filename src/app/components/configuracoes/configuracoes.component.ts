import { Component, ElementRef, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css']
})
export class ConfiguracoesComponent {
  form!: FormGroup;
  mostraSucesso = false;
  mostraFracasso = false;
  textoErro = 'Nada'
  usuario :any;
  activeLink = 'active';
  querCriar = false;
  salvarClicado = false;
  userPhotoUrl: string | undefined;
  criador = false;

  constructor(
      private formBuilder: FormBuilder,
      private api: ApiService,
      private router: Router,
      private authService: AuthenticationService
  ) { }

  @ViewChild('fotoInput') fotoInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
      this.form = this.formBuilder.group({
          username: [''],
          foto: [''],
          nome: [''],
          sobrenome: [''],
          esportePreferido: [''],
          cep: [''],
          cidade: [''],
          estado: [''],
          endereco: [''],
          querCriar: false,
          representa: ['Nenhuma']
      });

      this.subscribeForms();

      of(this.api.getUserLogado().subscribe({
        next: data => {
          this.usuario = data
          this.criador = data.criador
          this.querCriar = data.quer_criar

          this.form.patchValue({
            username: this.usuario.username,
            nome: this.usuario.first_name,
            sobrenome: this.usuario.last_name,
            esportePreferido: this.usuario.esportePreferido,
            cep: this.usuario.cep,
            cidade: this.usuario.cidade,
            estado: this.usuario.estado,
            endereco: this.usuario.endereco,
            querCriar: this.usuario.quer_criar,
            representa: this.usuario.representa,
          });
          this.userPhotoUrl = this.usuario.foto;
        },
      error: error => console.log(error)
  }));

}

onCriadorChange(event: Event): void {
  const isChecked = (event.target as HTMLInputElement).checked;
  this.querCriar = isChecked;
}

onFileSelected(event: any) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      this.form.get('foto')?.setValue(file);
    };

    reader.readAsDataURL(file);
  }
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
    this.salvarClicado = true;

    if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
    }

    const usuario = this.form.getRawValue();

    const formData = new FormData();
    formData.append('username', usuario.username);
    formData.append('first_name', usuario.nome);
    formData.append('last_name', usuario.sobrenome);
    formData.append('esportePreferido', usuario.esportePreferido);
    formData.append('cep', usuario.cep);
    formData.append('endereco', usuario.endereco);
    formData.append('cidade', usuario.cidade);
    formData.append('estado', usuario.estado);
    formData.append('is_active', 'true');
    formData.append('quer_criar', usuario.querCriar);
    formData.append('representa', usuario.representa)
    formData.append('criador', `${this.criador}`)

    console.log(this.criador)
    
    if (usuario.foto instanceof File) {
      formData.append('foto', usuario.foto, usuario.foto.name);
    }

    const id = this.authService.getUserId();

    of(this.api.putUser(formData, id).subscribe({
        next: data => {
            // console.log(data);
            this.mostraSucesso = true;
            this.salvarClicado = false;
            setTimeout(()=>this.router.navigate(['/perfil']), 5000);
        },
        error: erro => {
            console.log(erro);
            this.textoErro = erro.error.email || erro.error.username;
            this.mostraFracasso = true;
            this.salvarClicado = false;
        },
        complete: () => console.info('complete')
    }));
}


  navigateToProfile() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.router.navigate(['perfil/']);
    } else {
      this.router.navigate(['not-found']);
    }
  }

}
