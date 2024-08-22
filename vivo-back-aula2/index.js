import fs from 'fs/promises'; // core

import chalk from 'chalk'; // de terceiro

import criacaoNode from './criacao-node.js'; // local

console.log(chalk.rgb(102, 0, 153).bold('\nEstou na Vivo!'));

console.log(`\nNode foi criado ${criacaoNode}.`);

const data = await fs.readFile('por-que-a-vivo.json', 'utf8')
const motivos = JSON.parse(data);
motivos.forEach(item => {
  console.log('\n' + chalk.rgb(102, 0, 153).bold(item.title));
  console.log(chalk.gray.bold(item.description));
});

console.log('\nPLANOS:\n=======\n');

const arquivo = await fs.readFile('planos.json', 'utf8')
const planos = JSON.parse(arquivo);
planos.forEach(plano => {
  console.log(chalk.rgb(102, 0, 153).bold(plano.title));
  console.log(chalk.gray.bold(plano.price));
});