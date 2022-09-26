const app= require('express')();
const server=require('http').createServer(app);
const cors=require('cors');

const io=require('socket.io')(server,{
    cors:{
        origin: "*",
        methods:["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE"]
    }
})
app.use(cors());

const PORT =process.env.PORT || 5009;

app.get('/', (req, res) => {    
    res.send("server is running");
})

io.on('connection',(socket)=>{
    socket.emit('me',socket.id);
    socket.on('disconnect',()=>{
        socket.broadcast.emit('callended');
    })
    socket.on("calluser",({userToCall,SignalData, from, name})=>{
        io.to(userToCall).emit("calluser",{signal:SignalData,from,name});
    })
    socket.on("answercall",(data)=>{
        io.to(data.to).emit("callaccepted", data.signal);
    })
})

server.listen(PORT,()=>{
    console.log(`server is listening on ${PORT}`)
});

