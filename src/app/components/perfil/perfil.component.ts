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
          // console.log(data)
          this.usuario = data;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.info('complete');
        }
      }));
    } else {
      this.router.navigate(['/not-found']); // Redirecionar para a tela de não encontrado
    }
  });

    }  

// pegarLocalizacao = (lat: number, lon: number) => {
//   fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
//       .then(resposta => resposta.json())
//       .then(dados => {
//         console.log(dados)
//         this.form.get('estado')?.setValue(dados.address.state, {
//           emitEvent: false // pra não cair no maximum call stack excedeed
//       })
//         if(dados.address.city){
//         this.form.get('cidade')?.setValue(dados.address.city, {
//           emitEvent: false // pra não cair no maximum call stack excedeed
//       })
//       }
//       else{
//         this.form.get('cidade')?.setValue(dados.address.town, {
//           emitEvent: false // pra não cair no maximum call stack excedeed
//       })
//       }
//       })
//       .catch(erro => console.log('Erro: ', erro));

      
// };

// iniciarLocalizacao = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;
//       this.pegarLocalizacao(latitude, longitude);
//     });
//   }
// }




}
