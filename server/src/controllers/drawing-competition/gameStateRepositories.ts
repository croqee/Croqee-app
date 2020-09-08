const redis = require("redis");
const REDIS_PORT = 6379;
import { iJoinedUser } from "./interfaces";
export const client = redis.createClient(REDIS_PORT);

//round
export function setRound(value: number, drawingField: string) {
  client.set(fieldNameGenerator(drawingField, "round"), value);
}
export function getRound(drawingField: string) {
  return new Promise((resolve, reject) =>
    client.get(
      fieldNameGenerator(drawingField, "round"),
      (err: any, data: any) => {
        if (err) throw err;
        if (data !== null) {
          resolve(parseInt(data));
        }
      }
    )
  );
}
export async function increamentRound(drawingField: string) {
  return new Promise(async (resolve, reject) => {
    let round: any = await getRound(drawingField);
    console.log("round heloo ");
    setRound(round + 1, drawingField);
    resolve(round + 1);
  });
}
function fieldNameGenerator(fieldName: string, propName: string) {
  return fieldName + "_" + propName;
}

//Players
export function setPlayer(value: iJoinedUser[], drawingField: string) {
  let stringifiedValue = JSON.stringify(value);
  client.set(fieldNameGenerator(drawingField, "player"), stringifiedValue);
}
export function getPlayer(drawingField: string) {
  return new Promise((resolve, reject) =>
    client.get(
      fieldNameGenerator(drawingField, "player"),
      (err: any, data: any) => {
        if (err) throw err;
        if (data !== null) {
          let parsedData = JSON.parse(data);
          resolve(parsedData);
        } else {
          resolve([]);
        }
      }
    )
  );
}

//lastdrwanModel
export function setLastDrawnModel(value: string, drawingField: string) {
  client.set(fieldNameGenerator(drawingField, "lastDrawnModel"), value);
}

export function getLastDrawnModel(drawingField: string) {
  return new Promise((resolve, reject) =>
    client.get(
      fieldNameGenerator(drawingField, "lastDrawnModel"),
      (err: any, data: any) => {
        if (err) throw err;
        if (data !== null) {
          resolve(data);
        }
      }
    )
  );
}
