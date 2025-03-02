const fs = require('fs');
const path = require('path');

// Caminho para o package.json na pasta dist
const distPackageJsonPath = path.join(__dirname, '../../dist/package.json');

// Lê o arquivo package.json
const packageJson = JSON.parse(fs.readFileSync(distPackageJsonPath, 'utf8'));

// Remove devDependencies
delete packageJson.devDependencies;

// Mantém apenas os scripts necessários em produção
const scriptsToKeep = ['start'];
const newScripts = {};
for (const script of scriptsToKeep) {
    if (packageJson.scripts[script]) {
        (newScripts as Record<string, string>)[script] = packageJson.scripts[script];
    }
}
packageJson.scripts = newScripts;

// Escreve o arquivo package.json modificado
fs.writeFileSync(distPackageJsonPath, JSON.stringify(packageJson, null, 4)); 