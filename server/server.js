const path=require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http');

const publicPath=path.join(__dirname,'../public');
const port=process.env.POT || 3000;

const {generateMessage,generateLocationMessage}=require('./utils/message'); //for importing the createMessage constructor js file
const {isRealString}=require('./utils/validation');
const {Users}=require('./utils/users'); //importing all the users method

var app=express();
var server=http.createServer(app); //creating a basic http server
var io=socketIO(server);//we have to pass the http server to the sockt.io function to get or create a socket.io server
//io is now a socket.io server created.
var users=new Users();//A new users instance which calls the users call once and hence creates an empty users array(happens only once!!)

app.use(express.static(publicPath));

//note that io.on() will all be special events which are inbuilt or fixed eg: 'connect' etc
//for custom events as here 'newEmail' we use socket.on() for every custom events
//.on() are all listeners.. and .emit()  are senders or emitters

io.on('connection',(socket)=>{ //io.on listens to a connection which returns a socket everytime a new user gets connected to the server
    console.log('New User connected!')

    socket.on('join',(params,callback)=>{
       // console.log(params);
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room name are required');
        }
            //if the validation is succesful then connect the user to the specified chat room
            socket.join(params.room) //inbuilt socket function to join a room of passed string name
            //for leaving we use socket.leave('room name')
            users.removeUser(socket.id)//remove the user from any other previous rooms if they exist

          
            users.addUser(socket.id,params.name,params.room); //adds a newly connected user in the users array list

            io.to(params.room).emit('updateUserList',users.getUserList(params.room)) //the server emits a updateuserlist event passing the updatedUserlist of the chatroom presently connected
            
             //Sends a newMessage to the new user who gets connected
   socket.emit('newMessage',generateMessage('Admin','Welcome to the Chat app'))

   //Send a new msg telling all the other users connected to that chat room that a new user joined
   socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`)) //broadcasts the created msg to all the other users except the one who created it.

        callback(); //if no errorthen call the callback func with no parameter
    })
    

    socket.on('createMessage',(message,callback)=>{
        var user=users.getUser(socket.id) //get the user object with the id of user who createdthe msg

        if(user&&isRealString(message.text)){
            //As soon as a user sends a newMessage and the server recieves it, it broadcasts to every user connected to the server(in a group chat or chatroom)
        io.to(user.room).emit('newMessage',generateMessage(user.name,message.text)) //io.emit vroadcasts the message to every user connected to the server
        }
      
        
         callback('This reply is from server that the msg has been succesfully sent!')   

       

        /* socket.broadcast.emit('newMessage',{ //broadcasts the created msg to all the other users except the one who created it.
            from:message.from,
            text:message.text,
            createdAt:new Date().getTime()
        }) */
    })
    
    //recieves the coords from the browser
    socket.on('createLocationMessage',(coords)=>{
        var user=users.getUser(socket.id) //get the user object with the id of user who createdthe msg

        if(user){
        io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude))
        }//broadcasts the location of user to all the users connected to the server

    })


    socket.on('disconnect',()=>{
        //As soon as a user gets disconnected, remove the user from the users list of that chatroom
        console.log('user');
        var user=users.removeUser(socket.id);
        console.log(user);
        
        if(user){ //if a user is removed then update the actual array and inform to all other users in the chatroom
            console.log('doing..')
            io.to(user.room).emit('updateUserList',users.getUserList(user.room)) //the server emits a updateuserlist event passing the updatedUserlist of the chatroom presently connected
           // io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`))

        }
    }) 
})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}`);
});