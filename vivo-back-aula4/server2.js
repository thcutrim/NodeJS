import express from 'express';
import fs from 'fs/promises';
import chalk from 'chalk';

const app = express();
const port = 3000;

// Middleware para registrar requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Função para ler o arquivo JSON
async function lerArquivoJSON(caminho) {
  try {
    const data = await fs.readFile(caminho, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Se o arquivo não existe, retorne um array vazio
      return [];
    } else {
      throw err;
    }
  }
}

// Função para gravar no arquivo JSON
async function gravarArquivoJSON(caminho, data) {
  const dataParaGravar = JSON.stringify(data, null, 2); // Indentação para facilitar leitura
  await fs.writeFile(caminho, dataParaGravar, 'utf8');
}

// Rota principal - HOME 
app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Estou na Vivo!</title>
        <style>
          body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
          }
          h1 {
            color: rgb(102, 0, 153);
            font-size: 4em;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
            margin-bottom: 20px;
          }
          .button-container {
            display: flex;
            gap: 20px;
          }
          .button {
            padding: 15px 30px;
            font-size: 1.2em;
            color: white;
            background-color: rgb(102, 0, 153);
            border: none;
            border-radius: 5px;
            text-decoration: none;
            text-align: center;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s;
          }
          .button:hover {
            background-color: rgb(85, 0, 122);
          }
        </style>
      </head>
      <body>
        <h1>Estou na Vivo!</h1>
        <div class="button-container">
          <a href="/api/planos" class="button">Planos</a>
          <a href="/api/porque-a-vivo" class="button">Vantagens</a>
        </div>
      </body>
      </html>
    `);
  });
  

// Rota para listar motivos filtrados por razão - Vantagens
app.get('/api/porque-a-vivo/:razao?', async (req, res, next) => {
    try {
      const motivos = await lerArquivoJSON('./por-que-a-vivo.json');
      
      const filtro = req.params.razao;
      const motivosFiltrados = filtro ? motivos.filter(m => m.razao.includes(filtro)) : motivos;
  
      if (motivosFiltrados.length) {
        // Gerar HTML dinâmico com base nos motivos filtrados
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="pt-br">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vantagens da Vivo</title>
            <style>
              html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                color: #333;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
                padding: 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
              }
              h1 {
                color: rgb(102, 0, 153);
                font-size: 3em;
                font-weight: bold;
                margin: 0;
              }
              .motivo {
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                margin: 10px 0;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 600px;
              }
              .motivo h2 {
                color: rgb(102, 0, 153);
              }
              .motivo p {
                margin: 0 0 10px;
              }
              .motivo .description {
                font-size: 1.2em;
              }
              .button-container {
                display: flex;
                gap: 20px;
                margin: 40px 0;
                justify-content: center;
                width: 100%;
                max-width: 600px;
              }
              .button {
                padding: 10px 20px;
                font-size: 1.2em;
                color: white;
                background-color: rgb(102, 0, 153);
                border: none;
                border-radius: 5px;
                text-decoration: none;
                text-align: center;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                transition: background-color 0.3s;
              }
              .button:hover {
                background-color: rgb(85, 0, 122);
              }
              footer {
                background-color: rgb(102, 0, 153);
                color: white;
                text-align: center;
                padding: 20px;
                width: 100%;
                box-sizing: border-box;
                margin-top: auto; /* Adiciona espaço entre o conteúdo e o rodapé */
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Vantagens da Vivo</h1>
            </div>
            ${motivosFiltrados.map(motivo => `
              <div class="motivo">
                <h2>${motivo.title}</h2>
                <p class="description">${motivo.description}</p>
              </div>
            `).join('')}
            <div class="button-container">
              <a href="/" class="button">Vivo</a>
              <a href="/api/planos" class="button">Planos</a>
            </div>
            <footer>
              <p>Todos os direitos reservados - Estou na Vivo!</p>
            </footer>
          </body>
          </html>
        `;
        res.send(htmlContent);
      } else {
        res.status(404).send('Não encontrado');
      }
    } catch (error) {
      next(error);
    }
  });

  

// Rota para listar os Planos
app.get('/api/planos/:numero?', async (req, res, next) => {
    try {
      const planos = await lerArquivoJSON('./planos.json');
  
      const filtro = req.params.numero;
      const planosFiltrados = filtro ? planos.filter(p => p.numero.includes(filtro)) : planos;
  
      if (planosFiltrados.length) {
        // Calcular o ponto de divisão para duas colunas
        const metade = Math.ceil(planosFiltrados.length / 2);
        const col1 = planosFiltrados.slice(0, metade);
        const col2 = planosFiltrados.slice(metade);
  
        // Gerar HTML dinâmico com base nos planos filtrados
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="pt-br">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Planos Disponíveis</title>
            <style>
              html, body {
                height: 100%;
                margin: 0;
                padding: 0;
              }
              body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                color: #333;
                display: flex;
                flex-direction: column;
              }
              .container {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                gap: 20px;
                flex: 1;
                box-sizing: border-box;
              }
              .column {
                flex: 1 1 45%;
                min-width: 300px;
              }
              .header {
                text-align: center;
                margin: 20px;
              }
              .header h1 {
                color: rgb(102, 0, 153);
                margin: 0;
              }
              .header .button {
                display: inline-block;
                padding: 10px 20px;
                margin: 10px;
                font-size: 16px;
                color: white;
                background-color: rgb(102, 0, 153);
                border: none;
                border-radius: 5px;
                text-decoration: none;
                cursor: pointer;
              }
              .plano {
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                margin: 10px 0;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .plano h2 {
                color: rgb(102, 0, 153);
              }
              .plano p {
                margin: 0 0 10px;
              }
              .plano .price {
                font-size: 1.2em;
                font-weight: bold;
              }
              .plano .details {
                background-color: #f9f9f9;
                padding: 10px;
                border-radius: 4px;
                list-style-type: none;
                margin: 0;
              }
              .plano .details li {
                padding: 5px 0;
              }
              footer {
                background-color: rgb(102, 0, 153);
                color: white;
                text-align: center;
                padding: 10px;
                position: relative;
                width: 100%;
                box-sizing: border-box;
              }
              @media (max-width: 768px) {
                .column {
                  flex: 1 1 100%;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Planos Disponíveis</h1>
              <a href="/" class="button">Vivo</a>
            </div>
            <div class="container">
              <div class="column">
                ${col1.map(plano => `
                  <div class="plano">
                    <h2>${plano.title}</h2>
                    <p class="price">${plano.price}</p>
                    <ul class="details">
                      ${plano.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
              <div class="column">
                ${col2.map(plano => `
                  <div class="plano">
                    <h2>${plano.title}</h2>
                    <p class="price">${plano.price}</p>
                    <ul class="details">
                      ${plano.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
            </div>
            <footer>
              <p>Todos os direitos reservados - Estou na Vivo!</p>
            </footer>
          </body>
          </html>
        `;
        res.send(htmlContent);
      } else {
        res.status(404).send('Não encontrado');
      }
    } catch (error) {
      next(error);
    }
  });
  
  

// Rota para adicionar um novo plano
app.post('/api/planos', async (req, res, next) => {
    try {
      const plano = await lerArquivoJSON('./planos.json');
  
      const novoPlano = req.body;
      if (!novoPlano || !novoPlano.title || !novoPlano.price || !novoPlano.details) {
        res.sendStatus(400); // Requisição inválida
      } else {
        plano.push(novoPlano);
        await gravarArquivoJSON('./planos.json', plano);
        res.sendStatus(201); // Criado com sucesso
      }
    } catch (error) {
      next(error);
    }
  });

// Rota para adicionar um novo motivo
app.post('/api/porque-a-vivo', async (req, res, next) => {
    try {
      // Ler o arquivo JSON existente
      const data = await fs.readFile('por-que-a-vivo.json', 'utf8');
      const motivos = JSON.parse(data);
  
      // Novo motivo a ser adicionado
      const novoMotivo = req.body;
  
      // Validação dos dados recebidos
      if (!novoMotivo || !novoMotivo.title || !novoMotivo.description) {
        console.log(novoMotivo);
        return res.sendStatus(400); // Requisição inválida
      }
  
      // Adicionar novo motivo
      motivos.push(novoMotivo);
  
      // Salvar o JSON com indentação de 2 espaços
      const dataParaGravar = JSON.stringify(motivos, null, 2); // 2 espaços de indentação
      await fs.writeFile('por-que-a-vivo.json', dataParaGravar, 'utf8');
  
      // Responder com status 201 (Criado com sucesso)
      res.sendStatus(201);
    } catch (error) {
      // Passar o erro para o middleware de erro
      next(error);
    }
  });
  

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Erro inesperado :/');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Aplicação rodando em http://localhost:${port}`);
});
