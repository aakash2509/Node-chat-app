const path=require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http');

const publicPath=path.join(__dirname,'../public');
const port=process.env.POT || 3000;

const {generateMessage}=require('./utils/message'); //for importing the createMessage constructor js file

var app=express();
var server=http.createServer(app); //creating a basic http server
var io=socketIO(server);//we have to pass the http server to the sockt.io function to get or create a socket.io server
//io is now a socket.io server created.

app.use(express.static(publicPath));

//note that io.on() will all be special events which are inbuilt or fixed eg: 'connect' etc
//for custom events as here 'newEmail' we use socket.on() for every custom events
//.on() are all listeners.. and .emit()  are senders or emitters

io.on('connection',(socket)=>{ //io.on listens to a connection which returns a socket everytime a new user gets connected to the server
    console.log('New User connected!')

    //Sends a newMessage to the new user who gets connected
   socket.emit('newMessage',generateMessage('Admin','Welcome to the Chat app'))

   //Send a newmsg telling all the other users that a new user joined
   socket.broadcast.emit('newMessage',generateMessage('Admin','New User joined')) //broadcasts the created msg to all the other users except the one who created it.


    

    socket.on('createMessage',(message,callback)=>{
       // console.log('createMessage',message);
        //As soon as a user sends a newMessage and the server recieves it, it broadcasts to every user connected to the server(in a group chat or chatroom)
        io.emit('newMessage',generateMessage(message.from,message.text)) //io.emit vroadcasts the message to every user connected to the server
         callback('This reply is from server that the msg has been succesfully sent!')   

        /* socket.broadcast.emit('newMessage',{ //broadcasts the created msg to all the other users except the one who created it.
            from:message.from,
            text:message.text,
            createdAt:new Date().getTime()
        }) */
    })
    


socket.on('disconnect',function(){
    console.log('User was disconnected')
}) 
})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}`);
});