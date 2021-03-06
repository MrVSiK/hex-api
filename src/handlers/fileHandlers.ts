import { ContainerClient } from "@azure/storage-blob";
import { RouteHandlerMethod } from "fastify";
import Storage from "./storageHandlers";
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestErrorHandler, PrismaClientUnknownRequestErrorHandler, PrismaClientValidationErrorHandler } from "./errorHandlers";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";

const prisma = new PrismaClient();

export const CheckIfTokenHasId = (token: any): token is { id: string } => {
  return (token as { id: string }).id !== undefined;
};

export const SendOnefile: RouteHandlerMethod = (req, res) => {
  const { token } = req.headers;

  if (!token) {
    res.status(401).send({
      message: 'token not found'
    });
    return;
  }

  if (token instanceof Array) {
    res.status(401).send({
      message: 'token cannot be an instance of Array'
    });
    return;
  }

  let decodedToken;

  try{
    decodedToken = verify(token, process.env["JWT_SECRET"] as string);
  } catch (err){
    if(process.env.NODE_ENV !== "production") console.error(err);
    if(err instanceof TokenExpiredError){
      res.status(401).send({
        message: 'Please login again'
      })
    } else if (err instanceof JsonWebTokenError){
      res.status(401).send({
        message: 'Invalid token. Please login again'
      })
    } else {
      res.status(401).send({
        message: 'Please login again'
      })
    }
  }

  if (!CheckIfTokenHasId(decodedToken)) {
    res.status(401).send({
      message: "Invalid Token"
    });
    return;
  }

  prisma.user
    .findUnique({
      where: {
        id: decodedToken.id,
      },
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'No user found'
        });
        return;
      }
      const { file, name } = req.body as {
        file: unknown;
        name: unknown;
      };

      if (typeof file !== "string" || typeof name !== "string") {
        res.status(401).send({
          message: 'Invalid file or name'
        });
        return;
      }

      const containerClient = Storage.getContainerClient() as ContainerClient;
      const blobClient = containerClient.getBlockBlobClient(name);
      blobClient
        .uploadData(Buffer.from(file, "base64"))
        .then((response) => {
          if (
            response._response.status >= 200 &&
            response._response.status < 300
          ) {
            res.send({
              message: `File has been uploaded: ${response.requestId}`,
            });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send({
            message: err.name,
          });
        });
    })
    .catch((err) => {
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
    });
};


export const GetOnefile: RouteHandlerMethod = (req, res) => {
  const { token } = req.headers;

  if (!token) {
    res.status(401).send({
      message: 'token not found'
    });
    return;
  }

  if (token instanceof Array) {
    res.status(401).send({
      message: 'token cannot be an instance of Array'
    });
    return;
  }

  let decodedToken;

  try{
    decodedToken = verify(token, process.env["JWT_SECRET"] as string);
  } catch (err){
    if(process.env.NODE_ENV !== "production") console.error(err);
    if(err instanceof TokenExpiredError){
      res.status(401).send({
        message: 'Please login again'
      })
    } else if (err instanceof JsonWebTokenError){
      res.status(401).send({
        message: 'Invalid token. Please login again'
      })
    } else {
      res.status(401).send({
        message: 'Please login again'
      })
    }
  }

  if (!CheckIfTokenHasId(decodedToken)) {
    res.status(401).send();
    return;
  }

  prisma.user
    .findUnique({
      where: {
        id: decodedToken.id,
      },
    })
    .then((user) => {
      if (!user) {
        res.status(401).send();
        return;
      }
      const { name } = req.body as {
        name: unknown;
      };

      if (typeof name !== "string") {
        res.status(401).send();
        return;
      }

      const containerClient = Storage.getContainerClient() as ContainerClient;
      const blobClient = containerClient.getBlockBlobClient(name);

      blobClient.downloadToBuffer(0).then((data) => {
        res.send({
          file: data.toString('base64')
        });
      }).catch(err => {
        console.error(err);
        res.status(500).send({
          message: err.name,
        });
      })

    })
    .catch((err) => {
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
    });
}