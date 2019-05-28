var moment=require('moment');

var generateMessage=(from,text)=>{
    return {
        from:from,
        text:text,
        createdAt:moment().valueOf()  //gives same value as new Date().getTime()
    } //but it is a time library which is later useful for displaying the time in whatever way we want
}

var generateLocationMessage=(from,latitude,longitude)=>{
    console.log(latitude,longitude);
    return {
        from:from,
        url:`https://google.com/maps?q=${latitude},${longitude}`,
        createdAt:moment.valueOf()
    }
}

module.exports={generateMessage,generateLocationMessage};