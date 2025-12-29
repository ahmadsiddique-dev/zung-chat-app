import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js"
import customError from "./src/utils/customError.js";
import dbConnection from "./src/utils/db.js"
import { initializeSocket } from "./src/utils/socket.handler.js";

const port = process.env.PORT || 8000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

// Initialize socket handlers
initializeSocket(io);

dbConnection()
.then(() => {
    app.get("/", (req, res) => {
        res.send(
           <h1>
                Welcome Ahmad Siddique, How are you dear?
           </h1>
        )
    })
    httpServer.listen(port, () => {
        console.log(`App is running at http://localhost:${port}`)
        console.log(`Socket.IO server is ready`)
    })
})
.catch((err) => {
    throw new customError(err.message, 501);
})