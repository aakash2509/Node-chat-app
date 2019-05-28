
var isRealString=(str)=>{
   // console.log(str);
    return typeof str=== 'string' && str.trim().length > 0;
}; //returns true if the string is a non empty and contains any letter or number other then whitespaces

module.exports={isRealString};
