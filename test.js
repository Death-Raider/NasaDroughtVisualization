//use   $node --max-old-space-size=5120 test.js
const fs = require('fs')
const latitude = 51.39261,longitude = -93.79688;
//read data and filter by line break
dataRaw = fs.readFileSync("gddrg.asc").toString("utf8")
dataRaw = dataRaw.split("\r\n");
dataRaw.pop()

//get the information about data and the data in raw form
//console.log("data filtering");
let basicData = dataRaw.filter((str)=>{return (str.length<50)?true:false});
let dataValues = dataRaw.filter((str)=>{return (str.length>50)?true:false});

//cleaning the information about data
//console.log("basic data filtering");
basicData.forEach((val,i,a)=>{
  let newVal = val.split(" ").filter( (elem)=>{return (elem == "")?false:true}).reverse()
  newVal.pop()
  a[i] = parseFloat(newVal[0]);
});

//calculate the latitude and longituded in the grid from the user inputed latituded and longituded
const latnum = Math.ceil((85-latitude)/basicData[4]), longnum = Math.ceil((-basicData[2]+longitude)/basicData[4]);

//console.log("cleaning data got");
dataValues = dataValues.map(e=>e.split(" ").filter(x=>(x=="")?false:true).map(x=>(x == basicData[5])?-1:parseFloat(x)) )

//create matrix
//console.log("matrix creation");
let dataMatrix = new Array(basicData[1]).fill(0);
dataMatrix.forEach((e,i,a)=>{
  a[i] = new Array(basicData[0]).fill(0)
});

//update the matrix with the values
//console.log("updating Matrix(takes about 20 sec max so wait)");
for(let i = 0; i < basicData[1]; i++){
  for(let index = 0; index < basicData[0]; index++){
    dataMatrix[i][index]=[ dataValues[i][index],[basicData[2]+basicData[4]*index , 84.999 - basicData[4]*i] ]
    //if(dataValues[i][index] != -1) console.log(JSON.stringify(dataMatrix[i][index]));
  }
}

console.log(dataMatrix[latnum][longnum],latnum,longnum);

//do this later not required for visulization
/*
const stream1 = fs.createWriteStream("parsedData1.txt");
const stream2 = fs.createWriteStream("parsedData2.txt");

stream1.once('open', function(fd) {
  for(let i = 0; i < dataMatrix.length/2; i++){
    let dataSendingStream = JSON.stringify(dataMatrix[i]);
    stream1.write(`${dataSendingStream}\n`);
    //console.log("stream1",i);
  }
  stream1.end();
});

stream2.once('open', function(fd) {
  for(let i = dataMatrix.length/2 + 1; i < dataMatrix.length; i++){
    let dataSendingStream = JSON.stringify(dataMatrix[i]);
    stream2.write(`${dataSendingStream}\n`);
    //console.log("stream2",i);
  }
  stream2.end();
});
*/
