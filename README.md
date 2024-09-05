
# Backend in Nest

To Run our DB at Docker
````
docker compose up -d
````

Copy the ```.env.template``` and rename it to ``` .env ```

This dependencies will make restricted the DTOs
```
npm i class-validator class-transformer
```

To encrypt the password we use this library
```
npm i bcriptjs
```
```
npm i --save-dev @types/bcryptjs
```
JWT
```
npm install --save @nestjs/jwt
```
