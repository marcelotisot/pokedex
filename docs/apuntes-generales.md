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


