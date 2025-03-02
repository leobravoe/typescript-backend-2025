import * as Crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Carrega as variáveis do .env
dotenv.config();

// Gera uma chave secreta aleatória de 64 caracteres
const secretKey = Crypto.randomBytes(32).toString("hex");

// Caminho do arquivo .env
const envPath = path.join(__dirname, "../../.env");

// Lê o conteúdo do .env, se existir
let envContent = "";
if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
}

// Atualiza ou adiciona a chave secreta
const newEnvContent = envContent
    .split("\n")
    .filter(line => !line.startsWith("APP_SECRET=")) // Remove linha antiga se existir
    .concat(`APP_SECRET=${secretKey}`) // Adiciona a nova chave
    .join("\n");

// Escreve de volta no .env
fs.writeFileSync(envPath, newEnvContent, "utf8");

console.log(`✅ Chave JWT gerada e salva no arquivo .env`);
