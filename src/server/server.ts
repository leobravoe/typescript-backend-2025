import express, { Application as IApplication } from "express";
import methodOverride from "method-override";
import session from "express-session";
import csurf from "csurf";
import * as dotenv from "dotenv";
import webRoutes from "../routes/web";
// import apiRoutes from "../routes/api";
import path from "path";
import { HbsConfigureCustomHelpers } from "../hbs_config/HbsConfigureCustomHelpers";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app: IApplication = express();

// Configurações do servidor
const isDevMode: boolean = process.env.npm_lifecycle_event === 'dev';
if (isDevMode) console.log("Executando em modo de desenvolvimento."); else console.log("Executando a build.");

const rootDir: string = isDevMode ? path.join(__dirname, '../../src') : path.join(__dirname, '..');

app.set("port", process.env.PORT || 5000);
app.set("view engine", "hbs");
app.set("views", path.join(rootDir, 'views'));

// Configura os CustomHelpers do pacote hbs
HbsConfigureCustomHelpers.run();

// Middlewares
app.use(express.static(path.join(rootDir, 'public')));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware - API routes
// app.use(apiRoutes);

// Middleware - Session
app.use(
    session({
        secret: process.env.APP_SECRET || 'default_secret_key',
        resave: false,
        saveUninitialized: true,
    })
);

// Middleware - CSRF Protection
app.use(csurf());

// Middleware - Web routes
app.use(webRoutes);

// Exporta o objeto app configurado
export default app;