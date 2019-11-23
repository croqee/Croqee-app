const production = true;

export let socketEndPoint;
export let pythonServerEndPoint;

if (production) {
	socketEndPoint = 'croqee.com';
	pythonServerEndPoint = 'tcp://server_python:9699';
} else {
	socketEndPoint = 'localhost:3000';
	pythonServerEndPoint = 'tcp://localhost:9699';
}

