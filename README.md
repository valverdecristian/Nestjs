# 🚀 NestJS

NestJS es un framework backend para `Node.js` que permite crear aplicaciones del lado del servidor con una arquitectura **modular, escalable y profesional**, inspirada en Angular.

Ofrece estructura clara, inyección de dependencias, módulos reutilizables, servicios bien definidos y código limpio.

### 🧩 Características

- **Arquitectura modular**: organiza la app en `@Module`, `@Controller`, `@Service`.
- **Inyección de dependencias**: gestiona instancias de clases automáticamente.
- **TypeScript nativo**: tipado fuerte, decoradores, clases.
- **Compatible con Express y Fastify**: puede usar distintos motores HTTP.
- **Listo para APIs REST, GraphQL, WebSockets, JWT, etc.**
- **Testing integrado**: unitario y e2e con Jest.
- **Integraciones fáciles**: con bases de datos (TypeORM, Mongoose), colas de mensajes, autenticación, etc.
- **Soporte para WebSockets**: ideal para chats o apps en tiempo real.
- **CLI poderosa**: scaffolding de módulos, controladores, servicios.

### 🎯 ¿Para qué lo usaría?

- Crear APIs robustas y seguras.
- Desarrollar microservicios, gateways WebSocket (para tiempo real), y apps híbridas (REST + tiempo real).
- Backend profesional para proyectos Angular, React o móviles.

### ⚙️ Instalación de NestJS

1. Instalar la CLI de NestJS (globalmente)

```bash
npm i -g @nestjs/cli
```

2. Crear un nuevo proyecto NestJS

```bash
nest new nombre-del-proyecto
```

⚡️ Va a preguntar si queremos usar npm o yarn.

3. Entrar al proyecto y levantar el servidor.

```bash
cd nombre-del-proyecto
npm run start:dev
```

- Comentar esta linea en eslint.config.msj

```ts
// eslintPluginPrettierRecommended,
```

<br>

## 📦 Métodos HTTP en NestJS

Los métodos HTTP se usan dentro de los **controladores** para manejar las rutas:

```ts
Import {
    Get, Post, Put, Patch, Delete, Body, Param, Query
} from '@nestjs/common';
```

### 🧩 Ejemplo básico en un controlador

```ts
@Controller("usuarios")
export class UsuariosController {
  @Get()
  obtenerTodos() {
    return this.usuariosService.findAll();
  }

  @Post()
  crear(@Body() datos: CrearUsuarioDto) {
    return this.usuariosService.create(datos);
  }

  @Put(":id")
  actualizar(@Param("id") id: string, @Body() datos: ActualizarUsuarioDto) {
    return this.usuariosService.update(id, datos);
  }

  @Delete(":id")
  eliminar(@Param("id") id: string) {
    return this.usuariosService.remove(id);
  }
}
```

#### 💡 Bonus

- `@Param()`: para capturar parámetros de ruta (``:id`).
- `@Body()`: para recibir datos enviados en el cuerpo del request.
- `@Query()`: para capturar parámetros tipo `?filtro=activo`.

### 📍 Argumentos de Métodos HTTP

👉 Aplica a cualquier metodo http (@Get(), @Post(), @Put(), @Delete())

```ts
// Default
@Get()
```

- Si el controlador es @Controller('gatos'), esta ruta responde a GET /gatos

```ts
// Con segmento dinamico
@Get(':id')
```

- Captura el valor de `id` desde la URL
- Ejemplo: `GET /gatos/42` -> `@Param('id')` devuelve `"42"`

```ts
// Especificando una ruta
@Get('gatos/siames')
@Get(['gatos', 'siames'])
```

<br>

## 📌 Módulos

En NestJS, los módulos (`@Module`) son unidades organizativas, que agrupan componentes relacionados, como controladores, servicios, pipes, guards y otros modulos.
Cada aplicacion tiene al menos un módulo raiz (`AppModule`), pero lo mejor es dividirla en multiples modulos.

### 🧩 Estructura de un módulo

```ts
@Module({
  imports: [OtroModulo], // Reutilizar funcionales de otros modulos o integrar librerias
  controllers: [MiController], // Manejan las rutas HTTP. Recibe los datos del cliente. Decorador @Controller()
  providers: [MiService], // Lógica de negocio. Decorador @Injectable() y se inyectan en los controladores
  exports: [MiService], // Servicios que pueden ser usados por otros módulos
})
export class MiModulo {}
```

### 📍 DTO

Un DTO (`Data Transfer Object`) es una clase que define la forma y estructura de los datos que se reciben o envian entre el cliente y el servidor.

👉 Es como un contrato que dice: “si querés crear un usuario, estos son los campos que tenés que mandar, con estos tipos y validaciones”.

#### 🧩 ¿Para qué sirve?

- ✅ Validar los datos que llegan en el @Body().
- ✅ Evitar errores por datos mal formateados.
- ✅ Documentar claramente qué espera cada endpoint.
- ✅ Separar la lógica de negocio de la estructura de datos.
- ✅ Usar pipes como ValidationPipe para validar automáticamente.

#### 🎯 ¿Cuándo usar DTOs?

- En todos los endpoints que reciben datos (POST, PUT, PATCH).
- Para definir claramente qué espera tu API.
- Para proteger tu backend de datos maliciosos o incompletos.

### 🛡️ Validación de Datos

Para asegurar que los datos de entrada (payload) sean correctos, NestJS utiliza DTOs junto con ValidationPipe.

Para que la validacion funcione con los decoradores de clase, se necesitan dos paquetes:
- class-validator: para usar los decoradores de validación como @IsString(), @IsInt, etc.
- class-transformer: para transformar el objeto JSON de la petición en una instancia de la clase DTO

```bash
npm i --save class-validator class-transformer
```

#### Activacion global

La mejor práctica es configurarlo **globalmente** para que se aplique a **todos** los endpoints de la aplicación, evitando repetirlo en cada controlador.

```ts
// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🚀 Aplica el ValidationPipe globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      // Opciones clave para mayor seguridad y robustez
      whitelist: true,         // 🛡️ Ignora y elimina propiedades que NO estén definidas en el DTO.
      forbidNonWhitelisted: true, // 🛑 Lanza un error si hay propiedades no definidas en el DTO.
      transform: true,         // 🔄 Asegura que los tipos se transformen al DTO.
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

- ✅ whitelist: true elimina silenciosamente cualquier campo que no esté definido en el DTO.
- 🛑 Para que se lance un error ante campos no permitidos, agregá también forbidNonWhitelisted: true.

#### Uso en el controlador

Una vez configurado globalmente, solo necesitas usar el DTO en la firma del controlador. El Pipe hará el resto.

```ts
// usuarios.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/crear-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  @Post()
  // El ValidationPipe global actúa automáticamente sobre @Body()
  create(@Body() datos: CreateUsuarioDto) { 
    // Si llegamos aquí, 'datos' ya está validado y es una instancia de CrearUsuarioDto
    return this.usuariosService.create(datos);
  }
}
```

✅ Tip: Para que decoradores como @IsInt() y @Min() funcionen correctamente, activá transform: true en el ValidationPipe. Esto convierte automáticamente los tipos (por ejemplo, "42" → 42) antes de validar.

<br>

### 🛡️ Pipes y Guards

- **Pipes**: transforman y validan datos antes de que lleguen al controlador. Ej: `ValidationPipe`.
- **Guards**: controlan el acceso a rutas. Ej: `AuthGuard` para verificar si el usuario está autenticado.

Se pueden aplicar a nivel de método, controlador o módulo.

```ts
@UseGuards(AuthGuard)
@Get()
obtenerPrivado() {
  return 'Solo usuarios autenticados';
}

@UsePipes(ValidationPipe)
@Post()
crear(@Body() dto: CrearDto) {
  return servicio.crear(dto);
}
```

<br>

## 📌 Ciclo de vida en Nestjs

El ciclo se divide en dos fases principales: Arranque (Bootstrap) y Apagado (Shutdown).

1. Fase de Arranque (Initialization)

<br>

## 📌 Conexion a la Base de Datos

### 📍 MongoDB

- Para integrar MongoDB con NestJS, se debe intalar el siguiente paquete:

```bash
npm i @nestjs/mongoose mongoose
```

- Tambien instalar el paquete de NestConfig para manejar variables de entorno.

```bash
npm i @nestjs/config
```

- Una vez instalado NestConfig crear el archivo `.env` (en la raiz del proyecto) para poder usar las variables luego.
- Guardar la URI en una variable de entorno.
- Se debe importar NestConfig y Mongoose en `app.module.ts`.
- `isGlobal: true`: permite que el modulo de configuración (`ConfigModule`) este disponible **automáticamente en todos los módulos** del proyecto, **sin necesidad de importarlo nuevamente** cada vez que querés usar `process.env` o `ConfigService`

```ts
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    // actualizacion: se agrego { isGlobal: true }
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### 📍 Definicion de Esquemas

- Nest usa decoradores para definir los **esquemas de MongoDB** de forma declarativa y tipada.
- PRINCIPALES DECORADORES:
1. `@Schema()`: marca la clase como esquema de MongoDB.
2. `@Prop()`: define cada propiedad y sus opciones (type, required, default, enum, etc).
- 👉 Hay mas formas de crear un esquema.

```ts
// usuario.entity.ts

export type UsuarioDocument = HydratedDocument<Usuario>; // se usa en nuestros servicios

@Schema()
export class Usuario {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  edad: number;
}
```

- Luego se genera el esquema con:

```ts
export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
```


### 📍 Registro del Esquema en el Módulo

- **Esta parte es clave**: cada módulo que usa un modelo debe registrarlo con MongooseModule.forFeature(...)
- Siguiendo el ejemplo se debe configurar en usuarios.module.ts:

```typescript
import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './entities/usuario.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
```

- 🔍 Esto permite que el modelo Usuario esté disponible para inyectarlo en el servicio (`usuarios.service.ts`) con @InjectModel(...).

- en el servicio (`usuarios.service.ts`) usar UsuarioDocument como tipo generico para `Model<>`.
- Usuario es solo la clase que define el esquema (las propiedades).
- UsuarioDocument incluye además:
  * Métodos de Mongoose (save(), populate(), etc.).
  * Propiedades como _id, createdAt, updatedAt.
  * Tipado completo del documento que devuelve la base de datos.

<br>

## 💥 Manejo de Errores y Excepciones.

### 📍 Filtros de Excepciones (Exception Filters)

- comando de creación: nest g f filters/httpExeption

```typescript
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExeptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}

```

### 🎯 Aplicación del Filtro (@UseFilters())

- Luego uso este filtro con el decorador `@UseFilters`.
- La aplicación puede ser a tres niveles, siendo la global la más común para manejar errores uniformemente.

1. A nivel metodo o clase
```typescript
// Aplicación a nivel de método
@UseFilters(HttpExceptionFilter)
@Get(':id')
findOne(@Param('id') id: string) { /* ... */ }

// Aplicación a nivel de controlador
@Controller('usuarios')
@UseFilters(HttpExceptionFilter)
export class UsuariosController { /* ... */ }
```

2. A nivel global (recomendado): se registra el filtro en el main.ts

```typescript
// main.ts

import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🚀 REGISTRO GLOBAL
  app.useGlobalFilters(new HttpExceptionFilter()); 
  
  await app.listen(3000);
}
```

<br>

## 🔑 Autenticación con JWT

La autenticación con JWT es el estándar moderno para gestionar sesiones en APIs sin estado (stateless). Se usa para verificar la identidad del usuario en cada solicitud sin necesidad de consultar una base de datos.

### 📍 ¿Qué es JWT?

JWT (JSON Web Tokens) es una llave de acceso segura y compacta que el servidor genera tras verificar las credenciales del usuario. El backend (que es stateless, es decir, que no recuerda sesiones) le delega al token la responsabilidad de portar la información de la sesión.

### 📍 Estructura del Token

<p>Un JWT es un string codificado en Base64url que consta de tres partes separadas por puntos (.). Las dos primeras partes son visibles y descifrables; la tercera es la firma de seguridad. </p>

<h4>Estructura: header.payload.signature</h4>

- **header (cabecera)**: tipo de token (JWT) y el algoritmo de cifrado, define como verificar el token

- **payload (cuerpo)**: contiene la informción del usuario (claims) y el tiempo de expiración, transporta los datos de la sesión que el backend necesita.

- **signature (firma)**: creada cifrando el header y el payload con una clave secreta que SOLO el servidor conoce.

<br>

### 📍 Flujo de Autenticación

<p>El proceso asegura que el <strong>Frontend</strong> recuerde la sesión sin guardar la contraseña, usando el token como credencial temporal.</p>

<ol>
  <li>Login: El cliente envía credenciales a la ruta /auth/login.</li>
  <li>Generación: El servidor valida el usuario, crea el JWT (firmado con la Clave Secreta), y lo devuelve al cliente.</li>
  <li>Persistencia (Frontend): El Frontend guarda el JWT (en localStorage o cookies).</li>
  <li>Acceso a Recursos: Para cada solicitud a rutas protegidas (/productos, /usuarios), el Frontend adjunta el JWT en el Header Authorization: Bearer &lt;token&gt;.</li>
</ol>

<br>

### 🛠️ Implementación

La implementación se enfoca en tres pasos clave: usar una librería para las operaciones fundamentales de JWT, inyectar esa lógica en un servicio (o proveedor) y proteger las rutas con Guards.

<br>

1. **Instalación de la Libreria Core**: usamos la libreria base de Node.js

```bash
npm install jsonwebtoken

# tipado para typescript
npm install -D @types/jsonwebtoken
```

Función: Este paquete (jsonwebtoken) es la herramienta esencial que usaremos en un Servicio para las tareas de firmado (sign()) y verificación (verify()) del token.

<br>

2. **Generación del Token**: La generación del token ocurre en el Servicio de Autenticación (`AuthService`) después de validar al usuario.
  
  -   Utilizamos la función sign() para crear el token, inyectando el Payload, la Clave Secreta (JWT_SECRET) y el Tiempo de Expiración (expiresIn).

```typescript
// Fragmento clave del servicio:
createToken(username: string){
    const token:string = sign(
        {
            usuario: username,
            admin: false,
        },
        JWT_SECRET, // Clave Secreta
        { expiresIn: '15m' }, // Tiempo de expiración
    );
    return {token: token};
}
```

<br>

3. **Protección de Rutas (Verificación con Guards)**: La verificación del token se realiza mediante Passport y un Guard de NestJS para interceptar las peticiones antes de que lleguen a los endpoints.

```typescript
// En el Controlador
@UseGuards(AuthGuard('jwt')) // El Guard usa la Estrategia 'jwt'
@Get('perfil')
getProfile(@Request() req) {
  // Si se llega aquí, el token es válido y la info. del usuario está en req.user
  return req.user;
}
```

<br>

### 📍 Cookies

[Documentacion](https://docs.nestjs.com/techniques/cookies)

- Instalar el paquete requerido

```bash
npm i cookie-parser
npm i -D @types/cookie-parser
```