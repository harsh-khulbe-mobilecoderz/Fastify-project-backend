import Fastify from 'fastify';
import dotenv from 'dotenv';
const dbConnect = require('./db/db');
import userRoutes from "./routes/user.route"
import cors from '@fastify/cors'
const fastify = Fastify()

dotenv.config();

fastify.register(cors)


dbConnect();

fastify.register(userRoutes);


const PORT:number = parseInt(process.env.PORT || '3000');

fastify.listen({port: PORT},function (err,address) {
    if(err) {
      console.log(err);
    }
    console.log(`Server started at port ${PORT}`)
})

