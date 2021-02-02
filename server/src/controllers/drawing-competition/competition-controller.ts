export class CompetitionController {
  io: any;
  drawingField: string;
  socket: any;

  constructor(socketIO: any, server: any, drawingField: string) {
    this.drawingField = drawingField;
    this.io = socketIO(server, {
      path: `/compete/${drawingField}`,
      cookie: false,
    });
    setInterval(() => {
      this.loop(this.io);
    }, 80);
  }

  reset() {}

  loop(io: any) {}

  findWithAttr(array: Array<any>, attr: string, value: string) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }
}
