import type { FastifyPluginCallback } from "fastify";
import { SendOneImage, GetOneImage } from "../handlers/imageHandlers";

const ImageRoutes: FastifyPluginCallback = (server, _, done) => {

    // Send an image
    // URL: /image/user/{id}
    server.post("/", SendOneImage);

    // Get an image
    // URL: /image/:imageid
    server.post("/file", GetOneImage);


    done();
}

export default ImageRoutes;