import express from 'express';
import handlebars from  'express-handlebars';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import viewRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { __dirname } from './dirname.js';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import messagesDao from './daos/dbManager/messages.dao.js';

import sessionsRouter from "./routes/sessions.router.js";
import userViewRouter from "./routes/users.views.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";

// SERVER
const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => { `Server listening on port: ${PORT}`});

// MONGOOSE
const MONGO_URL = "mongodb://127.0.0.1:27017/proyectoBackend";
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 5 * 60,
    }),
    secret: "d3saFi0L0giN",
    resave: false,
    saveUninitialized: true,
  })
);

/*=============================================
=            connectMongoDB                   =
=============================================*/
const connectMongoDB = async () => {
  try {
      await mongoose.connect(MONGO_URL)
      console.log("Conectado con exito a la DB usando Mongoose!!");
  } catch (error) {
      console.error("No se pudo conectar a la BD usando Moongose: " + error);
      process.exit();
  }
}
connectMongoDB();


// SOCKET
const io = new Server(httpServer);

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HANDLEBARS
app.engine('hbs', handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
}));
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

// STATIC
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// VIEWROUTER
app.use("/", viewRouter);
app.use("/users", userViewRouter);
app.use("/api/sessions", sessionsRouter);

io.on("connection", (socket) => {
  console.log("client connected" + socket.id);

  socket.on("message", async (data) => {
    // servidor recibe el mensaje
    console.log(data);
    await messagesDao.createMessage(data)
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected" + socket.id);
  })

});