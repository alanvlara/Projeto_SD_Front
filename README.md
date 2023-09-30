# DesporPato - Documentação Técnica FrontEnd

## Sumário

1. [Introdução](#Introdução)
2. [App](#App)
3. [Componentes](#Componentes)
    - [Home](#Home)
    - [Cadastro](#Cadastro)
    - [Sobre](#Sobre)
    - [Politica](#Politica)
    - [Confirm-email](#Confirm-email)
    - [Perfil](#Perfil)
    - [Eventos](#Eventos)
    - [Eventos-detail](#Eventos-detail)
    - [Cria-evento](#Cria-evento)
    - [Atividades](#Atividades)
    - [Atividade-detail](#Atividade-detail)
    - [Cria-atividade](#Cria-atividade)
    - [Ranking](#Ranking)
    - [Not-found](#Not-found)
    - [Configuracoes](#Configuracoes)
4. [Services](#Services)
    - [Api-Service](#Api-Service)
    - [Auth-Guard](#Auth-Guard)
    - [Home-Guard](#Home-Guard)
    - [Theme-Service](#Theme-Service)
    - [Authentication-Service](#Authentication-Service)
    - [Auth-Interceptor](#Auth-Interceptor)
5. [Tutorial](#Tutorial)


## Introdução

*DesporPato* é um webapp destinado a promover e gerenciar o turismo pelo esporte em Pato Branco. Esse repositório contém o frontend do projeto desenvolvido em Angular. Você pode acessar o repositório do backend no link: [https://https://github.com/alanvlara/Projeto_SD_Back](https://https://github.com/alanvlara/Projeto_SD_Back)

- *Navegação*: A navegação entre as rotas do frontend é configurada no app-routing-module.ts.
-*Proteção de Rotas*: A proteção de rotas que necessitam de autenticação é feita através do service auth-guard.ts em conjunto com o service auth-interceptor.ts e o service home-guard.ts.
- *Imagens*: Todas as imagens que o frontend pega estão hopedadas em um bucket no S3 da AWS.
-*Dados*: Os dados estão em um banco de dados no RDS da AWS.

## App

O app component desse projeto utiliza a tag router-outlet para alternar entre os componentes. No app component tenho a navbar do site, essa navbar estará em todas as rotas com diferentes campos dependendo do user estar autenticado ou não.

## Componentes

### Home

É o componente inicial onde será feito o login ou o signup, a rota dele é "/home". 

### Cadastro

É o componente chamado quando o usuário clica no link "Criar Conta" na rota "/home", nele você pode cadastrar sua conta informando os dados da mesma.

### Sobre

Esta seção fornece informações sobre o projeto DesporPato, seu objetivo e algumas funcionalidades-chave.

### Politica

Aqui, você pode encontrar informações sobre a política de privacidade e termos de uso do DesporPato.

### Confirm-email

Este componente lida com a confirmação de e-mails para garantir a segurança das contas de usuário.

### Perfil

O componente Perfil permite aos usuários verificar suas informações pessoais e visualizar acessa botões para acessar o ranking, registrar nova atividade ou acessar suas atividades.

### Eventos

Neste componente, os usuários podem visualizar os eventos esportivos organizados em Pato Branco.

### Eventos-detail

Fornece informações detalhadas sobre um evento específico, incluindo datas, titulo e detalhes adicionais que podem ser visualizados apenas pelo criador do evento.

### Cria-evento

Este é o componente usado pelos criadores de eventos para criar e gerenciar eventos esportivos.

### Atividades

Os usuários podem visualizar atividades esportivas das quais participaram.

### Atividade-detail

Fornece informações detalhadas sobre uma atividade específica, incluindo a foto e a possibilidade de gerar um certificado de participação.

### Cria-atividade

Componente usado pelos criadores de atividades para criar e gerenciar eventos esportivos.

### Ranking

Exibe o ranking dos usuários com base em suas atividades esportivas e desempenho.

### Not-found

Este componente é exibido quando uma página não é encontrada, fornecendo uma mensagem de erro amigável.

### Configuracoes

Permite aos usuários personalizar configurações relacionadas à sua conta e preferências.

## Services

### Api-Service

Este serviço lida com a comunicação com a API do backend para buscar e enviar dados.

### Auth-Guard

O Auth-Guard é um serviço de guarda que protege rotas autenticadas, garantindo que apenas usuários autenticados acessem determinadas páginas.

### Home-Guard

Este serviço de guarda controla o acesso à página inicial, direcionando os usuários para a página correta com base em seu status de autenticação.

### Theme-Service

O Theme-Service permite aos usuários personalizar o tema visual do aplicativo.

### Authentication-Service

Este serviço lida com a autenticação de usuários, incluindo login, registro e gerenciamento de sessões.

### Auth-Interceptor

O Auth-Interceptor é um interceptor HTTP que adiciona automaticamente tokens de autenticação às solicitações HTTP para proteger as rotas autenticadas.


# Tutorial

Siga os passos abaixo para testar todas as funcionalidades.

## 1. Acesso ao WebApp

- Acesse o aplicativo através do link: [https://alanvlara.github.io/Projeto_SD_Front/](https://alanvlara.github.io/Projeto_SD_Front/), você deve rodar o servidor do backend localmente, o código dela está disponível no repositório [https://github.com/alanvlara/Projeto_SD_Back](https://github.com/alanvlara/Projeto_SD_Back).

## 2. Acesso ao Admin

- Clone o repositório do servidor do backend para a sua máquina.
- Navegue até o diretório do projeto.
- Crie um ambiente virtual (venv) para isolar as dependências.
- Instale os requerimentos do projeto.
- Execute o servidor localmente.
- Acesse a interface de administração do Django em [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin).
- Utilize as credenciais do super usuário fornecidas para fazer o login.

## 3. Criação de Contas
- Clique em criar conta e preencha os campos, se marcar o campo "deseja criar eventos" irá aparecer o campo "Representa" onde você pode informar a empresa, instituição e etc que você representa.
- Crie uma conta.
- Execute a verificação no email.
- Faça login no app pelo frontend.
> Nota: o usuário informar que deseja criar eventos não torna ele um criador, apenas mostra para nossa equipe o interesse do mesmo. Para tornar um usuário criador deve ser seguido dos próximos dois passos desse tutorial.


## 4. Tornando um Usuário Criador

- No painel de administração do django, vá para `Usuarios`
- Escolha o usuário que deseja transformar em criador.
- Na página de edição, marque a caixa de seleção `criador`.
- Salve as alterações.

## 5. Crie um Evento

- Faça login em sua conta no link do frontend e vá para a opção eventos da navbar e clique em criar evento.
- Preencha as informações e crie um evento com a data de hoje ou superior, após isso você será redirecionado para a página detalhada desse evento.
- Você poderá acessar o qrcode do evento na página de eventos posteriormente se precisar 
> Essa opção estará disponível apenas para usuários criadores.

## 6. Adicionando uma atividade

- Acesse Atividades na navbar e depois clique em Criar Atividade.
- Para criar a atividade é necessário ler o qrcode, após lido irá liberar o botão salvar.
- Se desejar tire uma foto da atividade, se não irá ser utilizada uma imagem padrão do nosso sistema.
- Salve, caso tenha sucesso você irá receber uma mensagem de sucesso e será redirecionado para a página detalhada desssa atividade. Caso contrário aparecerá uma mensagem de erro.

## 7. Exportando dados do evento

- Para ter os números de quantas pessoas de cada cidade partiparam do evento é possível exportar os dados para um arquivo excel. Você poderá ir em "Eventos" e selecionar o evento especifico e na página detalhada do mesmo clique em exportar dados para excel.
> Nota: Essa opção só estará disponível para o criador do evento ou para membros do staff da DesporPato.

## 8. Gerando certificado de Participação

- Acesse atividades e clique em alguma das suas atividades, na página detalhada da mesma você terá a opção de Gerar certificado.

## 9. Alterando dados do usuário

- Para alterar seus dados acesse Configurações na navbar.
-Altere o que quiser e clique em salvar.

## 10. Alterando e deletando um evento

- Vá para a aba eventos, clique no evento que deseja modificar e clique em editar evento para liberar os campos para edição. Edite e clique em salvar.
- Se desejar deletar basta clicar em deletar e confirmar na tela que irá abrir.
> Nota: Disponível apenas para o criador do evento ou nosso staff e apenas disponível até o dia do evento, não é possivel deletar eventos de hoje ou do futuro.

## 11. Ranking

- Acesse Perfil na navbar e clique em Ranking Pato Branco.
- Na guia que abrir você pode selecionar os rankings de cada esporte.
> Nota: Seu usuário somente irá aparecer no ranking de seu esporte preferido, se desejar altere isso em configurações e você irá aparecer em outro ranking. Os cálculos de suas atividades para cada ranking são feitos ao mudar seu esporte preferido no seu perfil.

## 12. Trocar Tema

- Clique em trocar tema na navbar para alternar entre o tema claro e escuro.

## 13. Log out

- Se desejar sair, clique em sair na navbar e com isso seu usuario sera deslogado do sistema.

---