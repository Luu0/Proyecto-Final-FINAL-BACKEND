import express, { json } from "express";
import mongoose from "mongoose";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express'
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import {__dirname} from "./dirname.js"
import viewsRouter from "./routes/views.js"
import messageDao from "./Services/Daos/chat/message.dao.js"

import passport from "passport";
import sessionrouter from "./routes/session.router.js";
import userviews from "./routes/users.views.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import initializePassport from "./Config/passport.config.js";
import githubloginrouter from "./routes/github-login.views.router.js"
import config from "./Config/config.js";
import TestRouter from "./routes/TestRoute.js";
import handlebarshelper from "./utils/handlebarshelper.js"

const app = express();
const SERVER_PORT = config.port;

console.log(config);

mongoose.connect('mongodb+srv://Lu0:Lu0@ecomerce.zb53nge.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log('Connection success');
})
.catch(error => {
    console.error('Connection fail', error);
});

//Metadata info about our API
const swaggerOptions = {
  definition: {
      openapi: "3.0.1",
      info: {
          title: "Documentacion API Ecomerce",
          description: "Documentacion para uso de swagger"
      }
  },
  apis: [`./src/docs/**/*.yaml`]
}

//Docs en JSON format
const specs = swaggerJSDoc(swaggerOptions)
//Function to setup our docs
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

const httpServer = app.listen(SERVER_PORT, () => console.log(`Server listening on port ${SERVER_PORT}`));
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//handlbars config
app.engine("hbs",handlebars.engine({
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
  extname: 'hbs',
  defaultLayout: 'main',
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
    multiply: handlebarshelper.helpers.multiply,
    calculateTotal: handlebarshelper.helpers.calculateTotal
  }
}));

// app.use(addLogger);

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`); 
app.use(express.static(`${__dirname}/public`));

app.use(session({

  store: MongoStore.create({
    mongoUrl:"mongodb+srv://Lu0:Lu0@ecomerce.zb53nge.mongodb.net/?retryWrites=true&w=majority", 
    ttl:10 * 60
  }),

  secret: "Th1s1sA5ecret",
  resave:false,
  saveUninitialized:true

}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", viewsRouter); 
app.use("/api/products",productRouter);
app.use("/api/carts",cartRouter);
app.use("/users",userviews);
app.use("/api/sessions",sessionrouter);
app.use("/github", githubloginrouter);
app.use("/test",TestRouter);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('chat message', async (msg) => {
    try {
      await messageDao.createMessage({ user: msg.user, message: msg.content });
    } catch (error) {
      console.log(error);
    }

    io.emit('chat message', msg);
  });
});
