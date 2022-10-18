// current timestamp in milliseconds
const timestamp = Date.now();
 
const dateObject = new Date(timestamp);
const date = dateObject.getDate();
const month = dateObject.getMonth() + 1;
const year = dateObject.getFullYear();
// current hours
const hours = dateObject.getHours();
 
// current minutes
const minutes = dateObject.getMinutes();
 
// current seconds
const seconds = dateObject.getSeconds();
 
// prints date & time in YYYY-MM-DD format
console.log(`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`);