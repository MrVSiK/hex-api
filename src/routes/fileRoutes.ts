import type { FastifyPluginCallback } from "fastify";
import { SendOnefile, GetOnefile } from "../handlers/fileHandlers";

const FileRoutes: FastifyPluginCallback = (server, _, done) => {

    // Send an File
    // URL: /File/user/{id}
    server.post("/", SendOnefile);

    // Get an File
    // URL: /File/:Fileid
    server.post("/file", GetOnefile);


    done();
}

export default FileRoutes;