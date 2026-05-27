import { createServer} from "http";
import { Server} from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer,{
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET","POST"]
    }
})

io.on("connection",(socket) => {
    console.log(`USer connected: ${socket.id}`);

    socket.on("join-board",(boardId: string) => {
        socket.join(boardId);
        console.log(`user ${socket.id} joined board room: ${boardId}`);
    })

    socket.on("board-update",({boardId,action,data}) => {
        console.log(`Board ${boardId} update event: ${action}`)

        socket.to(boardId).emit("board-updated",{action,data});
    })
    
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    })

    
} )
const PORT = process.env.PORT || 3001;
const CorsOrigin = process.env.CORS_ORIGIN
    httpServer.listen(Number(PORT),"0.0.0.0",() => {
        console.log(`Socket.io server listening on http://localhost:${PORT}`)
        console.log(`Allowed CORS origin ${CorsOrigin}`)
    })