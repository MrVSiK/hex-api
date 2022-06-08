import { ContainerClient } from "@azure/storage-blob";
import { RouteHandlerMethod } from "fastify";
import Storage from "./storageHandlers";
import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CheckIfTokenHasId = (token: any): token is { id: string } => {
  return (token as { id: string }).id !== undefined;
};

export const SendOneImage: RouteHandlerMethod = (req, res) => {
  const { token } = req.headers;

  if (!token) {
    res.status(401).send();
    return;
  }

  if (token instanceof Array) {
    res.status(401).send();
    return;
  }

  const decodedToken = verify(token, process.env["JWT_SECRET"] as string);

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
      const { image, name } = req.body as {
        image: unknown;
        name: unknown;
      };

      if (typeof image !== "string" || typeof name !== "string") {
        res.status(401).send();
        return;
      }

      const containerClient = Storage.getContainerClient() as ContainerClient;
      const blobClient = containerClient.getBlockBlobClient(name);
      blobClient
        .uploadData(Buffer.from(image, "base64"))
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
      console.error(err);
      res.status(500).send({
        message: err.name,
      });
    });
};


export const GetOneImage: RouteHandlerMethod = (req, res) => {
  const { token } = req.headers;

  if (!token) {
    res.status(401).send();
    return;
  }

  if (token instanceof Array) {
    res.status(401).send();
    return;
  }

  const decodedToken = verify(token, process.env["JWT_SECRET"] as string);

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
      console.error(err);
      res.status(500).send({
        message: err.name,
      });
    });
}