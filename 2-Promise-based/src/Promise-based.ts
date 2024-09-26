// This is a promise-based TCP echo server
// uses promises to handle asychronous operations

import * as net from "net";
// Changing events to promises

// A promise-based API for TCP sockets.
type TCPConn = {
    // the JS socket object
    socket: net.Socket;
    // from the 'error' event
    err: null|Error;
    // EOF, from the 'end' event
    ended: boolean;
    // the callbacks of the promise of the current read 
    reader: null|{
        resolve: (value: Buffer) => void,
        reject: (reason: Error) => void, };
    };

// Create a wrapper from net.Socket
function soInit(socket: net.Socket): TCPConn {
    const conn: TCPConn = {
        socket: socket, 
        err: null,      // I added this code myself, check why it isn't in the book
        ended: false,   // I added this code myself
        reader: null,
    };
    socket.on('data', (data: Buffer) => {
        console.assert(conn.reader);
        conn.socket.pause(); // Pause the 'data' event
        conn.reader!.resolve(data); // Fulfill the promise
        conn.reader = null;
    });
    socket.on('end', () => {
        conn.ended = true; 
        if (conn.reader) {
            conn.reader.resolve(Buffer.from(''));
            conn.reader = null; 
        }
    });
    socket.on('error', (err: Error) => {
        conn.err = err;
        if (conn.reader) {
            conn.reader.reject(err);
            conn.reader = null; 
        }
    });
    return conn;
}

function soRead(conn: TCPConn): Promise<Buffer> {
    console.assert(!conn.reader); // Ensure no concurrent calls 
    return new Promise((resolve, reject) => {
        if (conn.err) { 
            reject(conn.err); 
            return;
        }
        if (conn.ended) {
            resolve(Buffer.from(''));
            return; 
        }
        conn.reader = { resolve: resolve, reject: reject };
        conn.socket.resume();
    });
}

function soWrite(conn: TCPConn, data: Buffer): Promise<void> {
    console.assert(data.length > 0);
    return new Promise((resolve, reject) => {
        if (conn.err) { 
            reject(conn.err); 
            return;
        }
        conn.socket.write(data, (err?: Error) => { 
            if (err) {
                reject(err); 
            } else {
                resolve(); 
            }
        });
    });
}

// connection handler to the server
const server = net.createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {
    const conn = soInit(socket);
    (async () => {
        try {
            while (true) {
                const data = await soRead(conn);
                if (data.length === 0) break; // end of stream
                console.log('Received: ', data.toString());
                await soWrite(conn, data); // Echo back the data
                }
        } catch (err) {
            console.error('Connection error:', err);
        } finally {
            socket.end();
        }
    }) ();
});

// Start listening on port 1234
server.listen(1234, '127.0.0.1', () => {
    console.log('Server is listening on port 1234');
});