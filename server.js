//require
const express = require('express');
const spawn = require('child_process').spawn;

//uses the files present in folder public
const app = express();
app.use(express.static('public'));

//sets max JSON get request size
app.use(
  express.json({
    limit:'1kb',
    type:'application/json'
  })
);

app.post('/apiPost', async (request,responce) => {
});

//to get the prediction from the NN that was called
app.get('/api',async (request, responce) => {
  const datagot = request.body;//gets the content submitted
  const droughtData10 = new Promise( (resolve,reject) => {
    callFile('test.js',resolve,reject)
  });
  let coordinates = await droughtData10;
  coordinates = coordinates.split("\n")
  coordinates.pop()
  console.log(coordinates.map(JSON.parse));
  console.log(coordinates.length);
  responce.send(JSON.stringify(coordinates));
});

app.listen(process.env.PORT || 3000, () => console.log('listening at 3000'));

function callFile(filePath,resolve,reject){
  const test = spawn('node',[filePath]);
  let x="";

  test.stdout.on('data',(data) =>{
    x += data.toString('utf8')+" ";
  });
  test.stdout.on('end',()=>{
    resolve(x)
  });
  test.stderr.on('error',(err)=>{
    console.log(err);
    reject(err)
  });

}
