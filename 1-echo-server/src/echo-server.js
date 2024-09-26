"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
function newConn(socket) {
    console.log('new connection', socket.remoteAddress, socket.remotePort);
    socket.on('end', () => {
        // FIN received. The connection will be closed automatically. 
        console.log('EOF.');
    });
    socket.on('data', (data) => {
        console.log('data:', data);
        socket.write(data); // echo back the data.
        // actively closed the connection if the data contains 'q'
        if (data.includes('q')) {
            console.log('closing.');
            socket.end(); // this will send FIN and close the connection.
        }
    });
}
let server = net.createServer();
server.on('connection', newConn);
server.on('error', (err) => { throw err; });
server.listen(1234, '127.0.0.1', () => {
    console.log('Server is listening on port 1234');
});
// also try to copy and paste the .js file in anohter folder 
// to see if the .js file alone cann work
