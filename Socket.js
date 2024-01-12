import { Server } from "socket.io";
import { UAParser } from 'ua-parser-js'

const devices = [];

export const ConnectSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:8080",
        "https://phaata.info",
        "https://user.phaata.info",
        "https://phaata.com",
        "https://user.phaata.com",
        "http://localhost:5173",
        "https://65a0e2634bef138e4d3c1038--golden-semifreddo-ce2707.netlify.app/",
      ],
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userAgent = socket.handshake.headers['user-agent'];
    let parser = new UAParser(userAgent); // you need to pass the user-agent for nodejs
    let parserResults = parser.getResult();

    socket.on('watch-video', (agent) => {
      if (!devices.includes(agent)) {
        devices.push(agent);
        io.emit('total-device', devices.length);
      }
    });

    io.emit('total-device', devices.length);

    socket.on('disconnect', function(){
      const index = devices.indexOf(parserResults.ua);
      if (index > -1) {
        devices.splice(index, 1);
        io.emit('total-device', devices.length);
      }
    });
  });
};
