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
  salvarClicado = false;
  mostraFracasso = false;
  textoErro = 'Nada'
  mostraMensagemPermissaoCamera = false;
  photoUrl: any = null;
  leituraQrCode :any;
  qrCodeNaoLido = true;
  cameraFechada = true;

  lerQrCode(): void {

    this.mostraFracasso = false;
    this.mostraSucesso = false;
    this.cameraFechada = false;

    let cameraStream: MediaStream | null = null;

    function stopCamera() {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    }

    // Verificar permissões de câmera
    navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    // Armazene a instância da câmera
    cameraStream = stream;
    // Permissões concedidas, continue com a leitura QR code
    this.cameraFechada = false;
  })
  .catch((error) => {
    // Permissões não concedidas, exiba a mensagem informativa
    this.mostraMensagemPermissaoCamera = true;
  });

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
        stopCamera(); // Parar a câmera ao fechar
        this.cameraFechada = true;
      });
    });
    readerContainer!.appendChild(voltarBtn);

    // Configurações para a câmera
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    const qrCodeSuccessCallback = (decodedText: any, decodedResult: any) => {
      if (!qrCodeSuccessCallbackExecuted) {
        qrCodeSuccessCallbackExecuted = true;
        // console.log(`Código lido = ${decodedText}, vou chamar o get atividades`, decodedResult);
        localStorage.setItem('leituraQrCode', decodedText);
        this.qrCodeNaoLido = false;
  
        // Parar a leitura da câmera
        html5QrCode.stop().then(() => {
          // Remover a câmera e exibir o valor do QR code
          readerContainer!.innerHTML = ''; // Limpar o conteúdo anterior
          const valorLidoElement = document.createElement("div");
          stopCamera();
          valorLidoElement.textContent = `Evento lido: ${decodedText}`;
          readerContainer!.appendChild(valorLidoElement);
          this.cameraFechada = true;
        });
      }
    }

    function qrCodeErrorCallback(error: any) {
      //coloquei para fazer nada quando não le
    };
  
    // Iniciar a leitura da câmera
    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback);
  }
  
  

  
  tirarFoto() {
    this.mostraFracasso = false;
    this.mostraSucesso = false;
    this.cameraFechada = false;

    let cameraStream: MediaStream | null = null;

    function stopCamera() {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    }

    // Verificar permissões de câmera
    navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    // Armazene a instância da câmera
    cameraStream = stream;
    // Permissões concedidas, continue com a leitura QR code
    this.cameraFechada = false;
  })
  .catch((error) => {
    // Permissões não concedidas, exiba a mensagem informativa
    this.mostraMensagemPermissaoCamera = true;
  });
        
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
              stopCamera();
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
          stopCamera();
        });
  
        fecharFotoBtn.addEventListener('click', () => {
          // Encerrando o stream de vídeo
          stream.getTracks().forEach(track => track.stop());
  
          // Removendo elementos da câmera
          video.remove();
          tirarFotoBtn.remove();
          buttonsContainer.remove();
          stopCamera();
          this.cameraFechada = true;
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
  
  

  salvar() {
    this.leituraQrCode = localStorage.getItem('leituraQrCode');
    this.salvarClicado = true;
    const textoQrCode = this.leituraQrCode.replaceAll('-', ' ')
    
    of(this.api.getAllEventos().subscribe({
      next: eventos => {
        for(let i=0; i<eventos.length; i++)
        {
          if(eventos[i].titulo === textoQrCode)
          {
            this.postarAtividade(eventos[i])
          }
          else
          {
            console.log("Evento nao existe")
          }
        }
      },
      error: erro => console.log(erro)
    }))  
  }
      
      
  
  postarAtividade(evento: any): void {

    const atividade = new FormData;
    this.qrCodeNaoLido = true;

    const userID = String(this.authService.getUserId())
  
    atividade.append("esporte", evento.esporte);
    atividade.append("usuario", userID);
    atividade.append("titulo", evento.titulo);
    atividade.append("data", evento.data);
    atividade.append("evento", evento.id)

    if (this.photoUrl) {
      // Gera um número aleatório ou um timestamp
      const uniqueNumber = Math.floor(Math.random() * 10000); // Gere um número entre 0 e 9999
  
      // Crie o nome do arquivo com o número único
      const fileName = `imagem_${uniqueNumber}.jpg`; // Exemplo: imagem_1234.jpg
  
      // Adicione a imagem ao FormData com o nome de arquivo único
      atividade.append("foto", this.photoUrl, fileName);
    }

  
    of(this.api.postAtividade(atividade).subscribe({
      next: data => {
          // console.log(data);
          this.mostraSucesso = true;
          this.salvarClicado = false;
      },
      error: erro => {
          console.log(erro);
          this.textoErro = erro.error
          this.salvarClicado = false;
      },
      complete: () => { 
        console.info('complete')
        this.salvarClicado = false;
      }
  }));
  }
}
