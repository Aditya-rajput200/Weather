const http = require("http")
const requests = require("requests");
const fs  = require("fs");

const homefiles = fs.readFileSync("index.html", "utf-8");
const style = fs.readFileSync("style.css" ,"utf-8")
const replaceval= (tempVal,orgVal)=>{
      let temperature =  tempVal.replace("{%tempval%}",orgVal.main.temp);
          temperature =  temperature.replace("{%tempmin%}",orgVal.main.temp_min);
          temperature =  temperature.replace("{%tempmax%}",orgVal.main.temp_max);
          temperature =  temperature.replace("{%location%}",orgVal.name);
          temperature =  temperature.replace("{%country%}",orgVal.sys.country);
          temperature =  temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
   return temperature;
};

// fetching forntend to backend server files


const server = http.createServer((req,res)=>{
    if(req.url =="/"){
    requests("https://api.openweathermap.org/data/2.5/weather?q=patna&units=metric&appid=265cc95cad6440901a7e205d9a4f54a2", )
    .on('data', function (chunk) {
        const objdata =JSON.parse(chunk);
        const arrdata = [objdata]; 
    //   console.log(arrdata[0].main.temp)
    const  realtimedata = arrdata.map((val)=>replaceval(homefiles,val)).join("j");
     res.write(realtimedata);
   
 })
    .on('end', function (err) {
      if (err) return console.log('connection closed due to errors', err);
     res.end();
    }); 
}
else if (req.url === "/style.css") { 
    // Serve the CSS file
    fs.readFile("style.css", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not Found");
      } else {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);}
})}
else{
    res.end("File not Found")
}
 });
server.listen(8000,"127.0.0.1");
