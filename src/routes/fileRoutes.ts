import type { FastifyPluginCallback } from "fastify";
import { SendOnefile, GetOnefile } from "../handlers/fileHandlers";

const FileRoutes: FastifyPluginCallback = (server, _, done) => {

    // Send a File
    // URL: /file/user/{id}
    server.post("/", SendOnefile);

    // Get a File
    // URL: /file/:Fileid
    server.post("/search", GetOnefile);


    done();
}

export default FileRoutes;