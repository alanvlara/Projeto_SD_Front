import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-eventos-detail',
  templateUrl: './eventos-detail.component.html',
  styleUrls: ['./eventos-detail.component.css']
})
export class EventosDetailComponent {

  constructor(
    private api : ApiService,
    private route : ActivatedRoute,
    private http : HttpClient
    
  ){}

  
  eventoSelecionado = {
    'id': 0,
    'titulo':'',
    'usuario': {'first_name':'', 'last_name':''},
    'esporte': '',
    'cidade':'',
    'data':'',
    'link':'',
    'qr_code': ''
  };

  ngOnInit(){
    this.route.paramMap.subscribe(params => {const eventoId = params.get('id')
    of(this.api.getEventoById(eventoId).subscribe({
      next:data => this.eventoSelecionado = data,
      error:error => console.log(error),
      complete: () => console.info('complete') 
    }))
  });
}

verGrafico(){

}
}
