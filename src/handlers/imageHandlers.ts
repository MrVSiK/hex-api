import { ContainerClient } from "@azure/storage-blob";
import { RouteHandlerMethod } from "fastify";
import Storage from "./storageHandlers";


// export const GetOneImage: RouteHandlerMethod = (req, res) => {
//     const { imageid } = req.params as {
//         imageid: string;
//     }

//     prisma.images.findUnique({
//         where: {
//             id: imageid
//         },
//         select: {
//             name: true
//         }
//     }).then((data) => {
//         if(data === null){
//             res.status(404).send({
//                 message: 'Image not found'
//             });
//             return;
//         }
//         res.send({
//             message: {
//                 name: data.name
//             }
//         });
//     }).catch(err => {
//         if(process.env.NODE_ENV !== 'production') console.error(err);
//         res.status(500).send({
//             message: err
//         })
//     })
// }

// export const GetAllImages: RouteHandlerMethod = (req, res) => {
//     const { userid } = req.params as {
//         userid: string;
//     }

//     prisma.images.findMany({
//         where: {
//             userid: userid
//         },
//         select: {
//             name: true
//         }
//     }).then((data) => {
//         if(data === null){
//             res.status(404).send({
//                 message: 'Image not found'
//             });
//             return;
//         }
//         res.send({
//             message: {
//                 names: data
//             }
//         });
//     }).catch(err => {
//         if(process.env.NODE_ENV !== 'production') console.error(err);
//         res.status(500).send({
//             message: err
//         })
//     })
// }

// export const DeleteOneImage: RouteHandlerMethod = (req, res) => {
//     const { imageid } = req.params as {
//         imageid: string;
//     }

//     prisma.images.delete({
//         where: {
//             id: imageid
//         }
//     }).then(() => {
//         res.send({
//             message: 'Successfully deleted'
//         });
//     }).catch(err => {
//         if(process.env.NODE_ENV !== 'production') console.error(err);
//         res.status(500).send({
//             message: err
//         })
//     })
// }

export const SendOneImage: RouteHandlerMethod = (req, res) => {
  const { userid } = req.params as {
    userid: unknown;
  };

  if (typeof userid !== "string") {
    res.status(404).send();
    return;
  }

  const { token } = req.headers;

  if (!token) {
    res.status(401).send();
    return;
  }

  if (token instanceof Array) {
    res.status(401).send();
    return;
  }

  const { image, name } = req.body as {
    image: unknown;
    name: unknown;
  };

  if (typeof image !== "string" || typeof name !== "string") {
    res.status(404).send();
    return;
  }

  const containerClient = Storage.getContainerClient() as ContainerClient;
  const blobClient = containerClient.getBlockBlobClient(name);
  blobClient
    .uploadData(Buffer.from(image, "base64"))
    .then((response) => {
      if (response._response.status >= 200 && response._response.status < 300) {
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
};
