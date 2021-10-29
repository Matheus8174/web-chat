import { io } from './http';

interface RoomUser {
  socket_id: string;
  username: string;
  room: string;
};

interface MessageUser {
  room: string;
  text: string;
  username: string;
  createdAt: Date
};

const users: RoomUser[] = [];

const messages: MessageUser[] = [];

// o socket é a representação do cliente no servidor
io.on('connection', socket => {
  socket.on('selected_room', (data, callback) => {
    const { room, id, username  } = data;

    socket.join(room);

    const isUserInRoom = users.find(user => user.username === username && user.room === room);

    isUserInRoom ? isUserInRoom.socket_id = socket.id : users.push({
      room,
      socket_id: id,
      username
    });

    const messagesRoom = getMessagesRoom(data.room);

    callback(messagesRoom);
  });

  socket.on('message', ({ room, username, message }) => {
    const newMessage: MessageUser = {
      room,
      username,
      text: message,
      createdAt: new Date()
    };

    messages.push(newMessage);

    io.to(room).emit('message', newMessage);
  });
});

// O io refere-se ao server enquanto o socket refere-se ao cliente

function getMessagesRoom(room: string) {
  return messages.filter(message => message.room === room);
};
