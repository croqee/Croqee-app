# Croqee-app
A gamification web app that helps artists to improve their drawing skills (mostly anatomy)


## Running with Docker for production
- client/package.json: Make sure the "proxy" is set to "http://server_node:8080"
- To run Docker Production image: Run "docker-compose -f docker-compose.prod.yml up".
 
## Running Locally for Development

Note: If the Python server was required in your development (in order to test the drawing results on the Home and Competition page) you'll need to run `docker-compose up --build`. *This has to be done before any of the following to make the Python server work as expected*.

- In the **./client/package.json** file make sure the "proxy" is set to "http://localhost:8080"
- In the **./client** directory run `npm install`
- In the **./server** directory run `npm install`
- In the **./server** directory run `npm watch-ts`. This will be a watcher to your changes on **./server/src** files which acts as TS/ES6 transpiler to ES5 into the **./server/dist**.
- At the end in the **./server**, in a new terminal run `npm run dev` and you'll be ready to get started on "http://localhost:3000" 
