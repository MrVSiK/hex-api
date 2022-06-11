# hex api

**hex-api** is a service which will allow users to save files in Azure Blob Storage. It can be accessed by the companion CLI, [hex-cli](https://github.com/MrVSiK/hex-cli).

Files are uploaded in base64 form via a POST request to the API. JSON web tokens are used to authenticate a user.

## Environment variables used
```
DATABASE_URL /* PostgreSQL connection string */
AZURE_STORAGE /* Azure Blob Storage connection string */
JWT_SECRET /* Random string */
```
