import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  nomeQrCode = '';
  qrCodeCriado = false;
  // evento = {
  //   titulo: '',
  //   link: '',
  //   data: '',
  //   esporte: '',
  // };

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    ) {}

  @ViewChild('fotoInput') fotoInput!: ElementRef<HTMLInputElement>;


ngOnInit(): void {
      this.form = this.formBuilder.group({
          titulo: ['', Validators.required],
          link: ['', Validators.required],
          data: ['', Validators.required],
          esporte: ['', [Validators.required]],
          foto: ['', Validators.required]
      });
}

onFileSelected(event: any) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      // Set the form value here if needed

      // Reset the input field value
      // this.fotoInput.nativeElement.value = '';

      // Display file info
      // console.log(file);
      // console.log(file.name);
      this.form.get('foto')?.setValue(file);
    };

    reader.readAsDataURL(file);
  }
}


  criar() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
  }

    const valores = this.form.getRawValue();
    const evento = new FormData;
    const userID = String(this.authService.getUserId())

    this.nomeQrCode = valores.titulo.replaceAll(" ","-");
    
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${this.nomeQrCode}&date=${valores.data}&size=150x150`;

    evento.append("titulo", valores.titulo);
    evento.append("link", valores.link);
    evento.append("data", valores.data);
    evento.append("esporte", valores.esporte);
    evento.append("foto", valores.foto);
    evento.append("usuario", userID)
    evento.append("qr_code", qrCodeUrl)
    

    
    this.api.postEvento(evento).subscribe({
      next:(response) => {
        this.mostraSucesso = true;
        console.log('Evento criado com sucesso!', response);
        setTimeout(this.mostraQrcode.bind(this), 3000);
      },
      error: (error) => {
        this.criarClicado = false;
        this.mostraFracasso = true;
        console.error('Erro ao criar evento:', error);
      }
  });
}

mostraQrcode() {
  this.qrCodeCriado = true;
}
}
