# Croqee-app
A very cool app that helps drawing/illustration artists to achieve great skills
bla bla

## Running with Docker

- For development using Docker containers: on a docker installed machine, run "docker-compose up" on root folder.</br>
- To run Docker Production image: Run "docker-compose -f docker-compose.prod.yml up".

## Running Locally

Note: if you wanna switch back from docker development to local development, you have to change the proxy in the following files:

- client/package.json: from "http://server_node:8080" to "http://localhost:8080"
- server/index.js: from "tcp://server_python:9699" to "tcp://127.0.0.1:9699""

Then run the python and node servers by the following:

- Python Server : 
    $ cd server_python<br/>
    $ python server.py<br/>
    
- Nodejs/Express Server : 
    $ cd server<br/>
    $ npm run dev<br/>
    
Finally it should start Python and Node.js servers as well as React client.




 
