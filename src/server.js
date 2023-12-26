import express from 'express';
import handlebars from  'express-handlebars';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
import viewRouter from './routes/views.routes.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { __dirname } from './dirname.js';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import messagesDao from './daos/dbManager/messages.dao.js';

// SERVER
const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => { `Server listening on port: ${PORT}`});

// MONGOOSE
mongoose.connect("mongodb://127.0.0.1:27017/proyectoBackend")
.then( () => {
    console.log("Connected DB");
})
.catch((error) => {
    console.log(error);
    console.log("Error connecting DB");
})

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
app.use("/", viewRouter);



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