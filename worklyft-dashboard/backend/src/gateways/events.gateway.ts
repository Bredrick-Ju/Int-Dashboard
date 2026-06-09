// ─────────────────────────────────────────────────────────────────────────────
// events.gateway.ts — Socket.io WebSocket Gateway
// ─────────────────────────────────────────────────────────────────────────────

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  afterInit() {
    this.logger.log('⚡ WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // ─── Room Management ───────────────────────────────────────────────────────

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const room = `user:${userId}`;
    // Leave all previous user rooms before joining new one
    client.rooms.forEach((r) => {
      if (r.startsWith('user:') && r !== room) {
        client.leave(r);
        this.logger.log(`Client ${client.id} left room: ${r}`);
      }
    });
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    return { event: 'room_joined', room };
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const room = `user:${userId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
    return { event: 'room_left', room };
  }

  // ─── Emit Helpers (called by services) ───────────────────────────────────

  emitLeadUpdated(userId: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit('lead.updated', payload);
    this.logger.log(`📢 lead.updated → user:${userId}`);
  }

  emitOrderCreated(userId: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit('order.created', payload);
    this.logger.log(`📢 order.created → user:${userId}`);
  }

  emitActivityUpdated(userId: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit('activity.updated', payload);
    this.logger.log(`📢 activity.updated → user:${userId}`);
  }

  emitDashboardUpdated(userId: string) {
    this.server
      .to(`user:${userId}`)
      .emit('dashboard.updated', { userId, updatedAt: new Date().toISOString() });
    this.logger.log(`📢 dashboard.updated → user:${userId}`);
  }
}
