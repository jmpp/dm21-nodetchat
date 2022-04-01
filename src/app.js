import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import chatServer from './chat-serveur.js';

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

// Passe l'objet "io" à la fonction du module "./chat-server.js"
chatServer(io);

const PORT = 1337;

app.set('view engine', 'pug');
app.set('views', './src/views/');
app.locals.pretty = true;

app.use('/static', express.static('./src/public'));

app.get("/", (request, response) => {
    response.render('index.pug');
});

// Gestion du login
app.get('/login', (request, response) => {
    if (request.query.pseudo?.trim() === "") {
        return response.redirect("/");
    }

    response.redirect("/chat/" + request.query.pseudo);
});

// Page de chat
app.get('/chat/:pseudo', (request, response) => {
    response.render('chat.pug', {
        pseudo: request.params.pseudo
    });
});

httpServer.listen(PORT, () =>
    console.log(`L'application écoute sur http://localhost:${PORT}`)
);