import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    
  ){}
    salvarClicado = false;
    deletarClicado = false;
    mostraPutSucesso = false;
    mostraDeleteSucesso = false;
    mostraPutFracasso = false;
    mostraDeleteFracasso = false;
    textoErroPut = 'Nada';
    textoErroDel = 'Nada';
    edicaoHabilitada = false;
    eventoId : string | null = '0';

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
      titulo: [{ value: '', disabled: true }],
      esporte: [{ value: '', disabled: true }],
      data: [{ value: '', disabled: true }],
      link: [{ value: '', disabled: true }]
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
  this.route.paramMap.subscribe(params => {this.eventoId = params.get('id')});
  of(this.api.exportarDadosParaExcel(this.eventoId).subscribe({
    next: (data: any) => {
        // Faça o download do arquivo Excel retornado na resposta
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dados_exportados.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    },
    error: (error) => {
        // Lidere com erros, se houver algum
        console.error(error);
    }
  }));
}

editar() {
  this.edicaoHabilitada = !this.edicaoHabilitada;

  if (this.edicaoHabilitada) {
    this.form.enable();
  } else {
    this.form.disable();
  }
}

salvar(){
  this.salvarClicado = true;
  const evento = this.form.getRawValue();
  this.route.paramMap.subscribe(params => {const eventoId = params.get('id')
  of(this.api.putEvento(evento, eventoId).subscribe({
    next: data => {console.log(data)
      this.salvarClicado = false;
      this.mostraPutSucesso = true;
    setTimeout(() =>window.location.reload(), 3000)},
    error: erro => {console.log(erro)
      this.salvarClicado = false;
      this.mostraPutFracasso = false
      this.textoErroPut = erro.error}
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
    setTimeout(() =>this.router.navigate(['/eventos']), 3000)},
    error: erro => {console.log(erro)
      this.deletarClicado = false;
      this.mostraDeleteFracasso=true
      this.textoErroDel = erro.error}
  }))});
}


}