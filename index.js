import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDb from './src/utils/db/connection.js';
import router from './src/routes/index.js';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { checkAuth } from "./src/middlewares/checkAuth.js";
import sessionRouter from './src/routes/auth.js'
import userRouter from './src/routes/user.js'
// import webhookRouter from './src/routes/webhook.js';

dotenv.config()
connectDb()

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use(morgan('dev'));

app.use('/auth', sessionRouter)
// app.use('/webhooks',webhookRouter)
// app.use('/',checkAuth ,router);
app.use('/user',userRouter)

app.get("/server", (req, res) => {
  res.sendFile(__dirname + '/javascript/script.js');
});

const appPort = process.env.PORT || 3000;
app.listen(appPort, () => {
  console.log(`server is running on http://localhost:${appPort}`);
});