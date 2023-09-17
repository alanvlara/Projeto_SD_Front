import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';



registerLocaleData(localePt); // Registre o locale 'pt'

@Component({
  selector: 'app-atividade-detail',
  templateUrl: './atividade-detail.component.html',
  styleUrls: ['./atividade-detail.component.css']
})
export class AtividadeDetailComponent {
  constructor(
    private api : ApiService,
    private route : ActivatedRoute,
    private http : HttpClient
    
  ){}
  atividadeSelecionada = {
    'id': 0,
    'titulo':'',
    'usuario': {'first_name':'', 'last_name':''},
    'evento': {'titulo':'', 'esporte':'', 'data': ''},
    'cidade':'',
    'data':'',
    'foto':''
  };

  ngOnInit(){
    this.route.paramMap.subscribe(params => {const atividadeId = params.get('id')
    of(this.api.getAtividadeById(atividadeId).subscribe({
      next:data => this.atividadeSelecionada = data,
      error:error => console.log(error),
      complete: () => console.info('complete') 
    }))
  });
  }

  //Buscando no backend ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  gerarPDF(atividadeId: number) {
    this.http.get(`http://localhost:8000/atividade/gerar_certificado/${atividadeId}/`, { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'certificado.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
