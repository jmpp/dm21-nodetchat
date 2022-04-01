// Initialise la connexion websocket
const socket = io('http://localhost:1337');

// Envoi du pseudo au serveur (qui le stockera avec ce socket.id)
const pseudo = document.location.pathname.slice('/chat'.length + 1);
socket.emit('user:set_pseudo', pseudo);

const form = document.querySelector('.chatbox-form');
const inputMessage = form.querySelector('[name=message]');
const chatboxMessages = document.querySelector('.chatbox-messages');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = inputMessage.value;

    // Envoi au serveur un objet contenant le nouveau message + le pseudo
    socket.emit('chat:new_message', { message });
});

// Ecouter les messages provenants du serveur websocket
socket.on('chat:new_message', objMessage => {

    const pseudo = objMessage.pseudo;
    const message = objMessage.message;
    
    let messageHtml = `<div class="message">
        <span class="msg-date">${new Date().toLocaleString()}</span>
        <span class="msg-user">${pseudo} &gt;</span>
        <span class="msg-message">${message}</span>
    </div>`;

    chatboxMessages.innerHTML += messageHtml;

});

// Ecouter la liste des pseudos depuis le serveur
socket.on('users:list', pseudos => {
    const chatUsers = document.querySelector('.chat-users');
    const ul = chatUsers.querySelector('ul');

    ul.innerHTML = pseudos
        .map(
            (pseudo) =>
                `<li>${pseudo}</li>`
        )
        .join('');
});