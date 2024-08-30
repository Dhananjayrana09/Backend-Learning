// In this we are learning how to create, update, read, write and delete files using node js. 


const fs = require('fs');

let fileName = 'sample.txt';
let content = 'This is a sample text file.';

// Sysnchronous version of file creation
console.log('Creating file synchronously...');
fs.writeFileSync(fileName, content);
console.log('File created successfully.');

// Asynchronous version of file creation
console.log('Creating file asynchronously ...');

fs.writeFile(fileName, content, function(err){
    if(err){
        console.log('Error creating file');
    }else{
        console.log('File created successfully and I am reading the content.');
    }
});
console.log("After");

// Reading file sysnchronously
const newContent = fs.readFileSync(fileName)
console.log("content of file is: ", newContent.toString());

// update to file asynchronously
fs.appendFile(fileName, 'This is the updated content.', function(err){
    if(err){
        console.log('Error updating file');
    }else{
        console.log('File updated successfully and I am reading the updated content.');
    }
});



