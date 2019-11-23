const production = false;

export let socketEndPoint;
export let pythonServerEndPoint;

if (production) {
	socketEndPoint = 'http://157.230.181.88';
	pythonServerEndPoint = 'tcp://server_python:9699';
} else {
	socketEndPoint = 'localhost:3000';
	pythonServerEndPoint = 'tcp://localhost:9699';
}

