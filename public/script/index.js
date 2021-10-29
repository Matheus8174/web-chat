const socket = io('http://localhost:3000');
// como está utilizando o mesmo server não precisa especificar o parametro do io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get('username');
const room = urlSearch.get('select_room');

const userNameHtml = document.getElementById('username');
userNameHtml.innerHTML = `Olá <strong>${username}</strong> - você está na sala <strong>${room}</strong>`

document.getElementById('logout').addEventListener('click', () => {
  window.location.href = `http://${window.location.host}`
})

socket.emit('selected_room', {
  username,
  room
}, messages => {
  messages.forEach(message => createMessage(message));
});

document.getElementById('message_input').addEventListener('keypress', (event) => {
  if(event.key === 'Enter') {

    socket.emit('message', {
      room,
      message: event.target.value,
      username
    });

    event.target.value = ""
  };
});

socket.on('message', (data) => {
  createMessage(data);
});

function createMessage({ username, text, createdAt }) {
  const messageDiv = document.getElementById('messages');

  messageDiv.insertAdjacentHTML('beforeend', `<div class="new_message"><label class="form-label">
    <strong> ${username} </strong> <span> ${text} - ${new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short', dateStyle: 'short' }).format(new Date(createdAt)).replace(/.[0-9]{4}/, '')}</span>
    </label></div>
  `);
};
// você pode criar o seu proprio evento de emição

// emit => emitir alguma informação, enviar
// on => escutar alguma informação, receber
