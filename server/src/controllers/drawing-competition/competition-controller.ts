export class CompetitionController {
  io: any;
  drawingField: string;
  socket: any;

  constructor(socketIO: any, server: any, drawingField: string) {
    this.drawingField = drawingField;
    this.io = socketIO(server, {
      cookie: false,
      path: `/compete/${drawingField}`,
    });
    setInterval(() => {
      this.loop(this.io);
    }, 80);
  }

  reset() {}

  loop(io: any) {}

  findWithAttr(array: Array<any>, attr: string, value: string) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }
}
