import { Component } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-cria-atividade',
  templateUrl: './cria-atividade.component.html',
  styleUrls: ['./cria-atividade.component.css']
})
export class CriaAtividadeComponent {
  constructor(
    private api : ApiService,
    private authService: AuthenticationService,
  ){}

  mostraSucesso = false;
  mostraFracasso = false;
  mostraFracasso2 = false;
  mostraEventoNaoEncontrado = false;
  photoUrl: any = null;
  // html5QrCode: Html5Qrcode | null = null; // Instância da biblioteca
  leituraQrCode :any;
  qrCodeNaoLido = true;
  cameraFechada = true;

  lerQrCode(): void {

    this.mostraEventoNaoEncontrado = false;
    this.mostraFracasso = false;
    this.mostraFracasso2 = false;
    this.mostraSucesso = false;

    this.cameraFechada = false;
    let qrCodeSuccessCallbackExecuted = false; // Flag para evitar chamada repetida do callback
    const readerContainer = document.getElementById("reader-container");

    let readerElement = document.getElementById("reader");
    if (!readerElement) {
    readerElement = document.createElement("div");
    readerElement.id = "reader";
    readerElement.style.width = "100%";
    const readerContainer = document.getElementById("reader-container");
    readerContainer?.appendChild(readerElement);
  }
  const html5QrCode = new Html5Qrcode("reader");

    // Adicionar o botão "Voltar"
    const voltarBtn = document.createElement("button");
    voltarBtn.textContent = "Voltar";
    voltarBtn.classList.add("btn", "btn-danger", "mt-2");
    voltarBtn.addEventListener("click", () => {
      html5QrCode.stop().then(() => {
      // readerContainer!.innerHTML = ''; // Limpar o conteúdo atual
      this.qrCodeNaoLido = true;
      readerContainer!.removeChild(readerElement!);
      readerContainer!.removeChild(voltarBtn);
      this.cameraFechada = true;
      })
    });
    readerContainer!.appendChild(voltarBtn);

    // Configurações para a câmera
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    const qrCodeSuccessCallback = (decodedText: any, decodedResult: any) => {
      if (!qrCodeSuccessCallbackExecuted) {
        qrCodeSuccessCallbackExecuted = true;
        console.log(`Código lido = ${decodedText}, vou chamar o get atividades`, decodedResult);
        localStorage.setItem('leituraQrCode', decodedText);
        this.qrCodeNaoLido = false;
  
        // Parar a leitura da câmera
        html5QrCode.stop().then(() => {
          // Remover a câmera e exibir o valor do QR code
          readerContainer!.innerHTML = ''; // Limpar o conteúdo anterior
          const valorLidoElement = document.createElement("div");
          valorLidoElement.textContent = `Código lido: ${decodedText}`;
          readerContainer!.appendChild(valorLidoElement);
          this.cameraFechada = true;
        });
      }
    }

    function qrCodeErrorCallback(error: any) {
      // console.error("Erro ao ler o código QR:", error);
      // Faça algo em resposta ao erro, se necessário
    };
  
    // Iniciar a leitura da câmera
    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback);
  }
  
  

  
  tirarFoto() {
    this.mostraEventoNaoEncontrado = false;
    this.mostraFracasso = false;
    this.mostraFracasso2 = false;
    this.mostraSucesso = false;

    this.cameraFechada = false;
    const constraints = {
      video: true,
    };
  
    let stream: MediaStream;
  
    navigator.mediaDevices.getUserMedia(constraints)
      .then((videoStream) => {
        stream = videoStream;
  
        const video = document.createElement('video');
        video.classList.add('rounded', 'shadow');
        video.srcObject = videoStream;
        video.autoplay = true;
        video.style.width = '100%';
  
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
  
        const context = canvas.getContext('2d');
  
        const tirarFotoBtn = document.createElement('button');
        tirarFotoBtn.innerText = 'Tirar Foto';
        tirarFotoBtn.classList.add('btn', 'btn-primary');
  
        const fecharFotoBtn = document.createElement('button');
        fecharFotoBtn.innerText = 'Voltar';
        fecharFotoBtn.classList.add('btn', 'btn-danger');
  
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mt-1');
        buttonsContainer.appendChild(tirarFotoBtn);
        buttonsContainer.appendChild(fecharFotoBtn);
  
        tirarFotoBtn.addEventListener('click', () => {
          context!.drawImage(video, 0, 0, canvas.width, canvas.height);
  
          // Convertendo a imagem para base64
          const dataURL = canvas.toDataURL('image/jpeg');

          // Criar um elemento de imagem para exibir a foto capturada
          const fotoCapturada = document.createElement('img');
          fotoCapturada.src = dataURL; // Use a dataURL da foto capturada
          fotoCapturada.classList.add('rounded', 'shadow');
          fotoCapturada.style.width = '100%';

          // Adicionar a foto capturada ao container de foto
          const fotoContainer = document.getElementById('fotoContainer');
          fotoContainer!.innerHTML = ''; // Limpar o conteúdo anterior
          fotoContainer!.appendChild(fotoCapturada);

                // Criar botões de confirmação e tirar outra foto
          const fotoOkBtn = document.createElement('button');
          fotoOkBtn.innerText = 'Foto Ok';
          fotoOkBtn.classList.add('btn', 'btn-primary', 'me-1');

          const tirarOutraFotoBtn = document.createElement('button');
          tirarOutraFotoBtn.innerText = 'Tirar outra Foto';
          tirarOutraFotoBtn.classList.add('btn', 'btn-danger');

          const buttonsContainer2 = document.createElement('div');
          buttonsContainer2.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mt-1');
          buttonsContainer2.appendChild(fotoOkBtn);
          buttonsContainer2.appendChild(tirarOutraFotoBtn);

          fotoContainer!.appendChild(buttonsContainer2);

          // Adicionar eventos aos botões
          fotoOkBtn.addEventListener('click', () => {
                // Criar um Blob (objeto de arquivo) a partir da string base64
              const byteCharacters = atob(dataURL.split(',')[1]);
              const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
              const ab = new ArrayBuffer(byteCharacters.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteCharacters.length; i++) {
                ia[i] = byteCharacters.charCodeAt(i);
              }
              const blob = new Blob([ab], { type: mimeString });
      
              // Armazenando a imagem em photoUrl para exibição
              this.photoUrl = blob;
              fotoContainer!.innerHTML = '';
              buttonsContainer2.remove();
              this.cameraFechada = true;
          });

          tirarOutraFotoBtn.addEventListener('click', () => {
            fotoContainer!.innerHTML = '';
            buttonsContainer2.remove();
            this.tirarFoto();
          });

  
          // Encerrando o stream de vídeo
          stream.getTracks().forEach(track => track.stop());
  
          // Removendo elementos da câmera
          video.remove();
          tirarFotoBtn.remove();
          buttonsContainer.remove();
        });
  
        fecharFotoBtn.addEventListener('click', () => {
          // Encerrando o stream de vídeo
          stream.getTracks().forEach(track => track.stop());
  
          // Removendo elementos da câmera
          video.remove();
          tirarFotoBtn.remove();
          buttonsContainer.remove();
          this.cameraFechada = false;
        });
  
        const cameraContainer = document.createElement('div')!;
        cameraContainer.classList.add('d-flex', 'justify-content-center', 'align-items-center');
        cameraContainer.appendChild(video);
  
        // Limpando o conteúdo existente
        const fotoContainer = document.getElementById('fotoContainer');
        fotoContainer!.innerHTML = '';
        fotoContainer!.appendChild(cameraContainer);
        fotoContainer!.appendChild(buttonsContainer);
        cameraContainer.classList.add('mt-4', 'bg-light', 'rounded');
      })
      .catch((error) => {
        console.error('Erro ao acessar a câmera:', error);
      });
  }
  
  

  testeClickSalvar() {
    this.leituraQrCode = localStorage.getItem('leituraQrCode');
    console.log("entrei")
    
    const atividades$ = this.api.getAtividades().pipe(
      catchError(error => {
        console.log(error);
        return of([]); // Trata o erro retornando um array vazio
      })
    );
  
    const eventos$ = this.api.getAllEventos().pipe(
      catchError(error => {
        console.log(error);
        return of([]); // Trata o erro retornando um array vazio
      })
    );
  
    forkJoin([atividades$, eventos$]).subscribe(([atividades, eventos]) => {
      for (let i = 0; i < atividades.length; i++) {
        // console.log("verificando atividades")
        if (atividades[i].evento.titulo == this.leituraQrCode.replaceAll('-', ' ') && atividades[i].usuario.id == this.authService.getUserId()) {
          console.log("Evento já cadastrado para esse usuário!");
          this.mostraFracasso = true;
          return;
        }
      }
      let contador = 0;
      for (let i = 0; i < eventos.length; i++) {
        // console.log("veficiando os eventos")
        if (this.leituraQrCode.replaceAll('-', ' ') == eventos[i].titulo) {
          console.log("achei evento");
          this.postarAtividade(eventos[i]);   
          return;
        }
        else if (this.leituraQrCode.replaceAll('-', ' ') != eventos[i].titulo){
          contador++;
          console.log("Evento não encontrado");
        }
      }
      if(contador == eventos.length){
        this.mostraEventoNaoEncontrado = true;
      }
    });
  }
      
      
  
  postarAtividade(evento: any): void {

    const atividade = new FormData;
  
    console.log("postando atividade", this.photoUrl)
    const userID = String(this.authService.getUserId())
  
    atividade.append("esporte", evento.esporte);
    atividade.append("usuario", userID);
    atividade.append("titulo", evento.titulo);
    atividade.append("data", evento.data);
    atividade.append("evento", evento.id)

    if (this.photoUrl) {
      console.log('oi alan')
      // Gere um número aleatório ou um timestamp
      const uniqueNumber = Math.floor(Math.random() * 10000); // Gere um número entre 0 e 9999
  
      // Crie o nome do arquivo com o número único
      const fileName = `imagem_${uniqueNumber}.jpg`; // Exemplo: imagem_1234.jpg
  
      // Adicione a imagem ao FormData com o nome de arquivo único
      atividade.append("foto", this.photoUrl, fileName);
      console.log(atividade.get('foto'))
    }

  
    of(this.api.postAtividade(atividade).subscribe({
      next: data => {
          console.log(data);
          this.mostraSucesso = true;
      },
      error: erro => {
          console.log(erro);
          this.mostraFracasso2 = true;
      },
      complete: () => console.info('complete')
  }));
  
  }
}
