import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-cria-evento',
  templateUrl: './cria-evento.component.html',
  styleUrls: ['./cria-evento.component.css']
})
export class CriaEventoComponent {
  form!: FormGroup;
  criarClicado = false;
  mostraSucesso = false;
  mostraFracasso = false;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
    ) {}

  @ViewChild('fotoInput') fotoInput!: ElementRef<HTMLInputElement>;


ngOnInit(): void {
      this.form = this.formBuilder.group({
          titulo: ['', Validators.required],
          link: ['', Validators.required],
          data: ['', Validators.required],
          esporte: ['', [Validators.required]],
      });
}

  criar() {
    this.mostraFracasso = false;
    this.mostraSucesso = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
  }

    const valores = this.form.getRawValue();
    const evento = new FormData;
    const userID = String(this.authService.getUserId())
  
    evento.append("titulo", valores.titulo);
    evento.append("link", valores.link);
    evento.append("data", valores.data);
    evento.append("esporte", valores.esporte);
    evento.append("usuario", userID)
    
    this.api.postEvento(evento).subscribe({
      next:(response) => {
        this.mostraSucesso = true;
        const eventoId = (response as any).id;
        setTimeout(() => this.router.navigate([`/eventos/${eventoId}`]), 3000);
      },
      error: (error) => {
        this.criarClicado = false;
        this.mostraFracasso = true;
        console.error(error);
      }
  });
}

}
