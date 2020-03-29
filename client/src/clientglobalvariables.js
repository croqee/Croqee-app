const production = false;

export let socketEndPoint;
export let pythonServerEndPoint;
export const googleApiKey =
  "701118539942-qhfj5072bdipbp3gj12ki3ol6hg5mhme.apps.googleusercontent.com";
export const facebookAppId = "641364966683591";

if (production) {
  socketEndPoint = "croqee.com";
  pythonServerEndPoint = "tcp://server_python:9699";
} else {
  socketEndPoint = "localhost:3000";
  pythonServerEndPoint = "tcp://localhost:9699";
}
