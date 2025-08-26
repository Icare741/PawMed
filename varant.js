#!/usr/bin/env node

const { default: inquirer } = require('inquirer');
const { exec } = require('child_process');
const path = require('path');

async function generateFiles() {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Entrez le nom de base pour la migration, le modèle et le contrôleur :',
      validate: input => input.trim() !== '' || 'Le nom ne peut pas être vide.'
    }
  ]);

  const serverPath = path.join(process.cwd(), 'server');


  executeCommand(`cd ${serverPath} && node ace make:migration ${name}`, 'Migration');
  executeCommand(`cd ${serverPath} && node ace make:model ${name}`, 'Modèle');
  executeCommand(`cd ${serverPath} && node ace make:controller ${name}`, 'Contrôleur');
}

function executeCommand(command, type) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur lors de la création du ${type}: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Erreur lors de la création du ${type}: ${stderr}`);
      return;
    }
  });
}

generateFiles().catch(console.error);
