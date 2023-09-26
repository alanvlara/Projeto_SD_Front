import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-eventos-detail',
  templateUrl: './eventos-detail.component.html',
  styleUrls: ['./eventos-detail.component.css']
})
export class EventosDetailComponent {
  form!: FormGroup;
  constructor(
    private api : ApiService,
    private route : ActivatedRoute,
    private formBuilder: FormBuilder,
    
  ){}
    salvarClicado = false;
    deletarClicado = false;
    mostraPutSucesso = false;
    mostraDeleteSucesso = false;
    mostraPutFracasso = false;
    mostraDeleteFracasso = false;
  edicao = true;
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

  ngOnInit(): void {
    this.form = this.formBuilder.group({
        titulo: [''],
        esporte: [''],
        data: [''],
        link: ['']
    });

    this.route.paramMap.subscribe(params => {const eventoId = params.get('id')
    of(this.api.getEventoById(eventoId).subscribe({
      next:usuario => {this.eventoSelecionado = usuario
        this.form.patchValue({
          titulo: this.eventoSelecionado.titulo,
          data: this.eventoSelecionado.data,
          link: this.eventoSelecionado.link,
          esporte: this.eventoSelecionado.esporte
        });},
      error:error => console.log(error),
      complete: () => console.info('complete') 
    }))
  });
}

exportarExcel(){

}

editar(){
  this.edicao = false;
}

salvar(){
  this.salvarClicado = true;
  const evento = this.form.getRawValue();
  this.route.paramMap.subscribe(params => {const eventoId = params.get('id')
  of(this.api.putEvento(evento, eventoId).subscribe({
    next: data => {console.log(data)
      this.salvarClicado = false;
      this.mostraPutSucesso = true;
    setTimeout(() =>window.location.reload, 3000)},
    error: error => {console.log(error)
      this.salvarClicado = false;
      this.mostraPutFracasso = false}
  }))});
}

fechar(){
  window.location.reload();
}

deletar(){
  this.deletarClicado = true;
  this.route.paramMap.subscribe(params => {const eventoId = params.get('id')
  of(this.api.deleteEvento(eventoId).subscribe({
    next: data => {console.log(data)
      this.deletarClicado = false;
      this.mostraDeleteSucesso = true;
    setTimeout(() =>window.location.reload, 3000)},
    error: error => {console.log(error)
      this.deletarClicado = false;
      this.mostraDeleteFracasso=true}
  }))});
}


}
 