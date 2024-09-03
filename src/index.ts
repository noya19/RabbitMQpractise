import express, {Express, Request, Response} from 'express';
import * as dotenv from 'dotenv';
// import './Consumer';
import { producer as pdc} from './Producer/index.js';

dotenv.config();


const app: Express = express();
app.get("/send", async (req: Request, res: Response) => {
    const value = req.query.value;

    await pdc.sendMessge(JSON.stringify({
        msg: value
    }));
    res.send("Mesaage Published")
})

app.listen(8000, ()=> {
  console.log("server started A");  
})