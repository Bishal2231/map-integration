import express from "express"
import dotenv from "dotenv"
import path from 'path'
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import http from 'http'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const PORT=process.env.PORT||4000

const app=express();

const server=http.createServer(app)

const io = new Server(server);



app.set("view engine","ejs")
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

io.on("connection",function(socket){
    console.log(`User connected: ${socket.id}`);

    console.log("hello worling")
    socket.on("send-location",function(data){
        socket.broadcast.emit("receive-location",{id:socket.id,...data})
    })

    socket.on('disconnect',function(){
        io.emit("user-disconnect",socket.id)
    })
})



app.get('/',(req,res)=>{
    res.render('map.ejs');
})

// app.get('/map',(req,res)=>{
//     res.render('map.ejs');
// })

server.listen(PORT,'0.0.0.0',()=>{
    console.log(`app is runing on port http://localhost:${PORT}`);
})