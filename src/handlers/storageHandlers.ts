import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

class Storage {

    containerClient: ContainerClient | null;

    constructor(){
        this.containerClient = null;
    }

    init = (connectionString: string) => {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerName = "images";
        this.containerClient = blobServiceClient.getContainerClient(containerName);
        return this.containerClient.createIfNotExists();
    };

    getContainerClient = () => {
        return this.containerClient;
    }

}

export default new Storage();