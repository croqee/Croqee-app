const redis = require("redis");
const REDIS_PORT = 6379;

export const client = redis.createClient(REDIS_PORT);

export function setRound(value: number) {
  client.set("round", value);
}

export function getRound() {
  client.get("round", (err: any, data: number) => {
    if (err) throw err;
    if (data !== null) {
      return data;
    }
  });
}
export function increamentRound() {
  let round: any = getRound();
  round++;
  setRound(round);
}
