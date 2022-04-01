import sanitizeHtml from 'sanitize-html';
// import { encodeHTML } from 'entities'

export default function socketChat(io) {

    const userPseudos = new Map();

    io.on('connection', (socket) => {
        console.log('Nouveau client connecté !', socket.id);

        socket.on('chat:new_message', objMessage => {
            // On pourrait aussi utiliser encodeHTML() pour garder le code affiché, mais sécurisé
            const message = sanitizeHtml(objMessage.message);
            const pseudo = userPseudos.get(socket.id);

            if (message.trim().length === 0) return;

            io.emit('chat:new_message', { message, pseudo });
        });

        socket.on('user:set_pseudo', pseudo => {
            userPseudos.set(socket.id, sanitizeHtml(pseudo));

            // Envoyer la liste de tous les pseudos mise à jour à tous les clients
            io.emit('users:list', Array.from(userPseudos.values()));
        });

        socket.on('disconnect', () => {
            userPseudos.delete(socket.id);

            // Envoyer la liste de tous les pseudos mise à jour à tous les clients
            io.emit('users:list', Array.from(userPseudos.values()));
        });
    });

}