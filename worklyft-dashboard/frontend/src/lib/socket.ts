// ─────────────────────────────────────────────────────────────────────────────
// lib/socket.ts — Socket.io Client Singleton
// ─────────────────────────────────────────────────────────────────────────────

import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });
  }
  return socket;
}

export function destroySocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinUserRoom(userId: string) {
  getSocket().emit('join_room', userId);
}

export function leaveUserRoom(userId: string) {
  getSocket().emit('leave_room', userId);
}
