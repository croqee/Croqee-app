import { Server } from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
export abstract class CompetitionController {
  drawingField: string;
  socket: Socket;
  io: SocketIoServer;

  constructor(server: Server, drawingField: string) {
    this.drawingField = drawingField;
    this.io = new SocketIoServer(server, {
      cookie: false,
      path: `/compete/${drawingField}`,
    });
    setInterval(() => this.loop(), 80);
  }

  abstract reset(): void;

  abstract loop(): void;

  findWithAttr<T, K extends keyof T>(array: T[], attr: K, value: T[K]): number {
    return array.findIndex((el) => (el[attr] = value));
  }
}
