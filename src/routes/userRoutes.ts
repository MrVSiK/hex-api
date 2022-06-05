import type { FastifyPluginCallback } from "fastify";
import { Login, Register } from "../handlers/userHandlers";


const UserRoutes: FastifyPluginCallback = (server, _, done) => {

    // Login
    // URL: /user
    server.post("/", Login);

    // Register
    // URL: /user/new
    server.post("/new", Register);

    done();
}

export default UserRoutes;