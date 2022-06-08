import type { FastifyPluginCallback } from "fastify";
import { SendOneImage, GetOneImage } from "../handlers/imageHandlers";

const ImageRoutes: FastifyPluginCallback = (server, _, done) => {

    // Send an image
    // URL: /image/user/{id}
    server.post("/", SendOneImage);

    // Get an image
    // URL: /image/:imageid
    server.post("/file", GetOneImage);

    // Get all images for an user
    // URL: /image/user/:userid
    // server.get("/user/:userid", GetAllImages);

    // Delete an image
    // URL: /image/:imageid
    // server.delete("/:imageid", DeleteOneImage);

    done();
}

export default ImageRoutes;