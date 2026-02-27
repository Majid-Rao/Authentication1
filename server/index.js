import express from 'express'
import 'dotenv/config.js'
const app = express();

app.use(express());
app.get('/',(req,res)=>{
    res.send('hello')
})
const port = 3000;

app.listen(port, ()=>{
    console.log("server running",port);
    
})