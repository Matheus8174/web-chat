import express from 'express';
import http from 'http';
import { resolve } from 'path';
import { Server } from 'socket.io';

const app = express();

const serverHttp = http.createServer(app);

const io = new Server(serverHttp);

app.use(express.static(resolve(__dirname, '..', 'public')));

app.use(express.json());

export { serverHttp, io };
