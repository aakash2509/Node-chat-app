class Users {
    constructor(){
        this.users=[]; //create an empty array the 1st time we call this class (is called only once!)
    }

    addUser(id,name,room){
        var user={id,name,room}; //destructuring
        this.users.push(user); //add the newly created user in the users array
        return user; //returns the user which is requested to be found
    }

    removeUser(id){ //removes a user based upont a given userid
        var user=this.getUser(id);
    
        if(user){
            console.log('User removed')
            this.users=this.users.filter((user)=>{ //stores the rest of users in the orignal users array
                return user.id!==id; //returns all the users except one whose id matches with the id to be deleted
            })
        }
        return user; //returns the deleted user
    }


    getUser(id){ //gets the user depending upon a given userid
        var user=this.users.filter((user)=>{
            return user.id===id; //return the user whose id matches to the passed id
        })[0] 

        return user;
    }

    getUserList(room){ //gives all the users of a particular room
        var users = this.users.filter((user)=>{
            return user.room===room ; //for each user in the users array it is kept if it's room matches the room passed as the argument
        })
        //all such users are now added to a new array users

        //Now convert the above array of objects of matched users into an array of strings containing only the names of those matched user 
        //objects. We give this new array name as namesArray

        var namesArray=users.map(user=>{
            return user.name; //returning only the names of all those objects storing them into the namesArray
        })
        console.log(namesArray)
        return namesArray;  //return the name array of all the users matching the room name which is requested to the function 
    }

}


module.exports={Users};