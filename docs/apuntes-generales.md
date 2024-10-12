### Servir contenido estatico

1 - Instalar depedencias
```bash
npm i @nestjs/serve-static
```

2 - Configurar el AppModule: apuntando a la carpeta (public)
```ts
@Module({
  imports: [
    ServeStaticModule.forRoot({ 
      rootPath: join(__dirname,'..','public'), 
    }) 
  ],
})
export class AppModule {}
```


### Docker - DockerCompose - MongoDB
IMAGEN MONGO: https://hub.docker.com/_/mongo

- Descargar imagen mongo
```bash
docker pull mongo
```

- Crear archivo docker-compose.yaml en el root de la app
```yaml
version: '3'

services:
  db: 
    image: mongo:5
    restart: always
    ports:
      - 27017:27017
    environment:
      MONGODB_DATABASE: nest-pokemon
    volumes:
      - ./mongo:/data/db    

```

- Levantar el contenedor y la base de datos
```bash
docker-compose up -d
```

### Generar custom pipe para validar MongoIDS

- Crear modulo common
```bash
nest g mo common
```

- Generar pipe como parte de common
```bash
nest g pipe common/pipes/ParseMongoId --no-spec
```

NOTA: Todos los pipes deben de implementar la interfaz transform
