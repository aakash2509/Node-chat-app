var socket = io();

 socket.on('connect', function () {
  console.log('Connected to server');

  /* socket.emit('createMessage',{
    to:'xyz',
    text:'It works!'
  }) */
});

//listeners on the client side will be outside the socket.on(connect) -> 

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage',function(message){ //client side js function to listen to an event'email' and recieves an argument email in the callback (from the server.js emit function)
  console.log('New message recieved!', message)

  var li=jQuery('<li></li>'); //creates a new list element usig jQuery
  li.text(`${message.from}: ${message.text}`) //sets the text porperty of the created element

  jQuery('#messages').append(li);//append the ordered list section(all messages section) with the new list element containing the new message
})

/*
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});
*/



jQuery('#message-form').on('submit',function(e){
  e.preventDefault(); //prevents the default refreshing of the page while submitting a form

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val() //prints the messaged entered by user in the form
  }, function (data) { //here the client(browser) recieves an acknowledgment 'data'(from the server.js listener function) in the callback function which tells or indicates that the msg is succesfully sent 
    console.log('Got it!', data);
  });

})


 
