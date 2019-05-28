var socket = io();

//function that adjusts the scroller depending on the msgs in the screen 
scrollToBottom=()=>{
  //Selectors
  var  messages=jQuery('#messages')//select all elements with id=messages
  var newMessage=messages.children('li:last-child') //selects the last(newest) msg of the rendered list of messages


  //Get the 3 heights and then adjust the scroller accorrdingly
  var clientHeight=messages.prop('clientHeight');
  var scrollTop=messages.prop('scrollTop');
  var scrollHeight=messages.prop('scrollHeight');
  var newMessageHeight=newMessage.innerHeight(); //finds height of the last msg (newest msg)
  var lastMessageHeight=newMessage.prev().innerHeight(); //finds height of the 2nd last msg!


  if(clientHeight +scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
    messages.scrollTop(scrollHeight); //show the bottommost msg. i.e. newest msg!
  }
}

 socket.on('connect', function () {
  console.log('Connected to server');
  //As soon as we get connected , parse the query parameters and join a chat room according to the given chat room name
  var params=jQuery.deparam(window.location.search) //extracts the quert parameters i.e. name and chat room name

  //emits an event for joining the desired chatroom
  socket.emit('join',params,function(err){
    if(err){
      alert(err);
      winndow.location.href='/'; //if error then redirect to the homepage
    } else {
      console.log('No error')
    }

  })
});

//listeners on the client side will be outside the socket.on(connect) -> 

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//the client listens for the event of updating users list and recieves the updatedUsers array(list) from the server
socket.on('updateUserList',(users)=>{
  var ol=jQuery('<ol></ol>'); // creating an ordered list html element using jquery

  users.forEach((user)=>{
    ol.append(jQuery('<li></li>').text(user)) //appending the text property of a list item as text=user where user is the name of a user in that chatroom users array
  })
  
  jQuery('#users').html(ol) //injecting the above ordered list in the section having id=users in the DOM
})

socket.on('newMessage',function(message){ //client side js function to listen to an event'email' and recieves an argument email in the callback (from the server.js emit function)
      console.log('New message recieved!', message)
      var formattedTime=moment(message.createdAt).format('h:mm a');//will channge timestamp into 6:07 pm etc

      var template=jQuery('#message-template').html(); //syntax of calling mustach template engine file 
      var html=Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formattedTime
      })

      jQuery('#messages').append(html); //append the portion with id=messages with the above html content 
      scrollToBottom(); //function that adjusts the scroller depending on the msgs in the screen 
      /* 
      var li=jQuery('<li></li>'); //creates a new list element usig jQuery
      li.text(`${message.from} ${formattedTime}: ${message.text}`) //sets the text porperty of the created element

      jQuery('#messages').append(li); *///append the ordered list section(all messages section) with the new list element containing the new message
  })

  socket.on('newLocationMessage',function(message){ //client side js function to listen to an event'email' and recieves an argument email in the callback (from the server.js emit function)
      console.log('New message recieved!', message)
      var formattedTime=moment(message.createdAt).format('h:mm a');//will channge timestamp into 6:07 pm etc

      var template=jQuery('#location-message-template').html(); //syntax of calling mustach template engine file 
      var html=Mustache.render(template,{
        from:message.from,
        url:message.url,
        createdAt:formattedTime
      })

      jQuery('#messages').append(html)
      scrollToBottom();
    })

/* socket.on('newLocationMessage',function(message){ //client side js function to listen to an event'email' and recieves an argument email in the callback (from the server.js emit function)
 
  var formattedTime=moment(message.createdAt).format('h:mm a');//will channge timestamp into 6:07 pm etc
  
  var li=jQuery('<li></li>'); //creates a new list element usig jQuery
  li.text(`${message.from} ${formattedTime}:`) //sets the text porperty of the created element


  var a = jQuery('<a target="_blank">My Current Location</a>')
  a.attr('href',message.url); //sets the href attribute of the var a as a=message.url

  li.append(a);
  jQuery('#messages').append(li);//append the ordered list section(all messages section) with the new list element containing the new message
})
 */
/*
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});
*/



jQuery('#message-form').on('submit',function(e){
  e.preventDefault(); //prevents the default refreshing of the page while submitting a form

  socket.emit('createMessage', {
    text: jQuery('[name=message]').val() //prints the messaged entered by user in the form
  }, function (data) { //here the client(browser) recieves an acknowledgment 'data'(from the server.js listener function) in the callback function which tells or indicates that the msg is succesfully sent 
    console.log('Got it!', data);
    jQuery('[name=message]').val('')
  });

})


 
var locationButton=jQuery('#send-location');

locationButton.on('click',()=>{ //.on(event,callback,callbackerror)
  if(!navigator.geolocation){
    return alert('geolocation not supported by your browser');
  }

  locationButton.attr('disabled','disabled').text('Sending location'); //disable the send-location button while the sending location is getting processed after clicking button

  navigator.geolocation.getCurrentPosition( (position)=>{
  //sending the geolocation coordinates from our browser to the server
  locationButton.removeAttr('disabled').text('Send location') //re-enable the send location button after the location is redered on the char=t
    socket.emit('createLocationMessage',{
     latitude:position.coords.latitude,
     longitude:position.coords.longitude
   })

  },()=>{
    locationButton.removeAttr('disabled').text('Send location') //re-enable the send location button in case of error
    alert('Unable to fetch location')
  })
})