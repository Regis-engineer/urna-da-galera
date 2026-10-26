# Urna da Galera 🗳️

Aplicação de brincadeira, responsiva para celular e computador, com votação compartilhada em tempo real.

## Recursos
- Votos: **Verdadeiro** ou **Falso**.
- Contagem, percentuais e barras atualizadas em tempo real.
- Botão de compartilhar link.
- Uma votação por identificador de navegador na rodada.
- Reinício protegido por PIN.
- Interface responsiva e animação de comemoração.
- Node.js + Express + Socket.IO.

## Executar no computador

1. Instale o Node.js 18 ou mais recente: https://nodejs.org/
2. Extraia este ZIP.
3. Abra um terminal dentro da pasta `urna_da_galera`.
4. Execute:

   ```bash
   npm install
   npm start
   ```

5. No computador, acesse `http://localhost:3000`.

Para testar no celular usando a mesma rede Wi-Fi, descubra o IP local do computador e abra `http://IP-DO-COMPUTADOR:3000` no navegador do celular. Permita conexões na rede local no firewall, se solicitado.

## Publicar para todos acessarem por um link

A opção mais simples é publicar o projeto em um serviço que hospede aplicações Node.js (por exemplo, Render).

1. Crie um repositório GitHub e envie os arquivos desta pasta.
2. No Render, crie um **Web Service** conectado ao repositório.
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Em **Environment Variables**, crie `ADMIN_PIN` com um PIN diferente do padrão `2468`.
5. Publique e abra a URL HTTPS fornecida pelo serviço.
6. Compartilhe essa URL com seus colegas. Todos verão a mesma contagem em tempo real.

## Importante sobre hospedagem e limites

- O estado dos votos fica na memória do servidor: reiniciar ou redeployar a aplicação apaga a rodada.
- Para uma brincadeira simples, mantenha uma única instância do servidor. Várias instâncias exigem um adaptador Socket.IO e armazenamento compartilhado.
- O sistema bloqueia novos votos pelo mesmo identificador do navegador durante a rodada, mas isso **não é segurança forte**: apagar os dados do navegador ou usar outro aparelho pode permitir novo voto.
- O PIN protege o botão de reiniciar, mas este é um protótipo recreativo, não um sistema eleitoral oficial ou adequado para decisões sensíveis.
- A votação não é uma pesquisa anônima certificada; evite coletar dados pessoais ou usar para assuntos sensíveis.

## Estrutura

- `server.js` — servidor e regras de votação
- `public/index.html` — interface e comportamento no navegador
- `package.json` — dependências e comandos
