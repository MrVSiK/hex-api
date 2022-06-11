import { RouteHandlerMethod } from "fastify";
import { PrismaClient } from '@prisma/client';
import { ulid } from "ulid";
import { randomBytes, createHash } from "crypto";
import { sign } from "jsonwebtoken";
import { PrismaClientKnownRequestErrorHandler, PrismaClientUnknownRequestErrorHandler, PrismaClientValidationErrorHandler } from "./errorHandlers";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";

const prisma = new PrismaClient()

export type HashObject = {
    salt: string;
    hash: string;
    storageHash: string;
}


export const EncryptPassword = (password: string): HashObject => {
    const salt = randomBytes(256).toString('hex');

    const hash = createHash('sha256').update(`${password}${salt}`).digest('hex');

    return {
        salt: salt,
        hash: hash,
        storageHash: `${salt}.${hash}`
    }
}

export const VerifyPassword = (password: string, hash: string): boolean => {

    const salt = hash.split('.')[0];

    const trueHash = hash.split('.')[1];

    const testHash = createHash('sha256').update(`${password}${salt}`).digest('hex');

    if(testHash !== trueHash){
        return false;
    }

    return true;
}

export const Register: RouteHandlerMethod = (req, res) => {
    const { email, password } = req.body as {
        email: unknown;
        password: unknown;
    };

    if(typeof email !== "string" || typeof password !== "string"){
        res.status(404).send({
            message: 'Email or password not found'
        });
        return;
    }

    prisma.user.create({
        data: {
            id: ulid(),
            email: email,
            password: EncryptPassword(password).storageHash
        }
    }).then(() => {
        res.send({
            message: 'Registered Successfully'
        })
    }).catch(err => {
        if(process.env.NODE_ENV !== "production") console.error(err);
        if (err instanceof PrismaClientKnownRequestError) {
            PrismaClientKnownRequestErrorHandler(err, res);
          } else if (err instanceof PrismaClientUnknownRequestError) {
            PrismaClientUnknownRequestErrorHandler(err, res);
          } else if (err instanceof PrismaClientValidationError) {
            PrismaClientValidationErrorHandler(err, res);
          } else {
            res.status(500).send({
              message: "Error",
              error: err.message,
            });
        }
    })
}

export const Login: RouteHandlerMethod = (req, res) => {
    const { email, password } = req.body as {
        email: unknown;
        password: unknown;
    }

    if(typeof email !== "string"){
        res.status(404).send({
            message: 'Email missing',
            received: email
        })
        return;
    }

    if(typeof password !== "string"){
        res.status(404).send({
            message: 'Password missing'
        })
        return;
    }

    const plainTextPassword = password;

    prisma.user.findUnique({
        where: {
            email: email
        },
        select: {
            id: true,
            password: true
        }
    }).then((data) => {
        if(data === null){
            res.status(404).send({
                message: 'Invalid email or password'
            });
            return;
        }
        const { id, password } = data;

        if(VerifyPassword(plainTextPassword, password)){
            res.send({
                token: sign({ id: id }, process.env["JWT_SECRET"] as string)
            })
            return;
        }

        res.status(401).send({
            message: 'Invalid email or password'
        })
    }).catch(err => {
        if(process.env.NODE_ENV !== "production") console.error(err);
        if (err instanceof PrismaClientKnownRequestError) {
            PrismaClientKnownRequestErrorHandler(err, res);
          } else if (err instanceof PrismaClientUnknownRequestError) {
            PrismaClientUnknownRequestErrorHandler(err, res);
          } else if (err instanceof PrismaClientValidationError) {
            PrismaClientValidationErrorHandler(err, res);
          } else {
            res.status(500).send({
              message: "Error",
              error: err,
            });
        }
    })
}