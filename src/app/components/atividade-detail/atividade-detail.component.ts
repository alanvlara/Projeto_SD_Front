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
  mostrapdf = false;
  atividadeSelecionada = {
    'id': 0,
    'titulo':'',
    'usuario': {'first_name':'', 'last_name':''},
    'evento': {'titulo':'', 'esporte':''},
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

  //Apenas com jspdf sem html2cnavas/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // gerarPDF() {
  //   const doc = new jsPDF();

  //   const dataFormatada = formatDate(this.atividadeSelecionada.data, 'dd/MM/yyyy', 'pt')
    
  //   // Defina o conteúdo do PDF com os dados da atividade
  //   const content = `
  //     Evento: ${this.atividadeSelecionada.evento.titulo}
  //     Esporte: ${this.atividadeSelecionada.evento.esporte}
  //     Data:   ${dataFormatada}
  //   `;
    
  //   // Adicione o conteúdo ao PDF
  //   doc.text(content, 10, 10);
    
  //   // Salve o PDF
  //   doc.save('certificado.pdf');
  // }

  //Com html2canvas/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // gerarPDF() {
  //   this.mostrapdf = true;
  //   const content = document.getElementById('conteudo');

  //   // Configurar a instância do jsPDF com orientação paisagem (landscape)
  //   const pdf = new jsPDF('landscape');
    
  //   if(content){
  //     html2canvas(content).then((canvas) => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const imgProps = pdf.getImageProperties(imgData);
  //       const pdfWidth = pdf.internal.pageSize.getWidth();
  //       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //       const x = (pdfWidth - pdfWidth/2)
  //       const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;
    
  //       pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
  //       pdf.save('cerificado.pdf');
  //   });
  //   }
  // }

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
