import fastify from "fastify";
import ImageRoutes from "./routes/imageRoutes";
import UserRoutes from "./routes/userRoutes";
import { config } from "dotenv";
import Storage from "./handlers/storageHandlers";

config();
const PORT = process.env.PORT || 3000;
const server = fastify({
  logger: process.env.NODE_ENV === "production" ? false : true,
});
const storage = Storage.init(process.env["AZURE_STORAGE"] as string);

server.register(ImageRoutes, { prefix: "/image" });
server.register(UserRoutes, { prefix: "/user" });

storage.then(() => {
  server
    .listen(PORT, "0.0.0.0")
    .then((add) => {
      console.log(`Server has started: ${add}`);
    })
    .catch((err) => {
      console.error(err);
    });
});
