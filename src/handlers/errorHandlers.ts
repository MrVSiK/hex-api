import type {
    PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
  } from "@prisma/client/runtime";
  import type { FastifyReply } from "fastify/types/reply";

  export const PrismaClientKnownRequestErrorHandler = (
    err: PrismaClientKnownRequestError,
    res: FastifyReply
  ) => {
    switch (err.code) {
      case "P2002": {
        res.status(400).send({
          message: "Unique Constraint Failure",
          error: err.message,
        });
        break;
      }

      case "P2003": {
        res.status(400).send({
          message: "Foreign Key Constraint Failure",
          error: err.message,
        });
        break;
      }

      case "P1000": {
        res.status(500).send({
          message: "Database Authentication Failure",
          error: err.message,
        });

        break;
      }

      case "P1001": {
        res.status(500).send({
          message: "Database Connection Failure",
          error: err.message,
        });

        break;
      }

      case "P1002": {
        res.status(500).send({
          message: "Database Connection Timed Out",
          error: err.message,
        });

        break;
      }

      default: {
        res.status(500).send({
          message: "Error",
          error: err.message,
        });

      }
    }
  };

  export const PrismaClientUnknownRequestErrorHandler = (
    err: PrismaClientUnknownRequestError,
    res: FastifyReply
  ) => {
    res.status(500).send({
      message: "Error",
      error: err.message,
    });

  };

  export const PrismaClientValidationErrorHandler = (
    err: PrismaClientValidationError,
    res: FastifyReply
  ) => {
    res.status(500).send({
      message: "Error",
      error: err.message,
    });

  };