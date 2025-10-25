import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class Chat {
  private socket: Socket;
  receiver = ''

  constructor() {
    // this.socket = io('https://socketapi-2ffd.onrender.com');

  }

  init() {
    this.socket = io('https://socketapi-2ffd.onrender.com');
  }

  setRecevier(id) {
    this.receiver = id;
  }

  getReceiver() {
    return this.receiver;
  }

  connect(userId: string) {
    this.socket.emit('addUsers', userId);
  }

  joinConversation(conversationId: string) {
    this.socket.emit('joinConversation', conversationId);
  }

  sendMessage(data: { senderId: string; receiverId: string; text: string }) {
    this.socket.emit('sendMessage', data);
  }

  onMessage(callback: (msg: any) => void) {
    this.socket.on('getMessage', callback);
  }

  onUsers(callback: (users: any[]) => void) {
    this.socket.on('getUsers', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }

}
