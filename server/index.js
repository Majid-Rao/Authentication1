import express from 'express';
import 'dotenv/config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import ConnectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
const app = express();
//app.set("trust proxy", 1); for production
const port = process.env.PORT || 3000;
ConnectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log('server running at :',port);
        
    })
})
.catch((err)=>{
    console.log("mongo making error :",err);
    
})
app.use(cors(
    {
        origin : process.env.CLIENT_URL,
        credentials : true
    }
))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded());
app.use(express.static("./uploads"));
app.use(cookieParser());
app.get('/',(req,res)=>{
    res.send('hello')
})
// routes
app.use("/api",authRoutes);

// app.listen(port, ()=>{
//     console.log("server running",port);
    
// })