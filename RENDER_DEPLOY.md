# Guía de Deploy en Render

## Configuración del Static Site en Render Dashboard

1. Ve a tu Static Site en Render Dashboard
2. Configura los siguientes valores:

### Settings importantes:

- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist/client/browser`

### Notas importantes:

⚠️ **CRÍTICO**: El `Publish Directory` debe ser exactamente `dist/client/browser` (no solo `dist/client`)

## Archivo _redirects

El archivo `public/_redirects` es necesario para que Render redirija todas las rutas a `index.html`. 
Este archivo se copia automáticamente al build cuando Angular compila el proyecto.

El formato debe ser exactamente:
```
/*    /index.html   200
```

Sin comentarios ni líneas adicionales.

## Verificación después del deploy

1. Verifica que todas las rutas funcionen:
   - `https://tu-sitio.onrender.com/login`
   - `https://tu-sitio.onrender.com/publicaciones`
   - `https://tu-sitio.onrender.com/mi-perfil`

2. Si ves un 404 o te redirige a `/index.html`, verifica:
   - Que el `Publish Directory` sea `dist/client/browser`
   - Que el archivo `_redirects` esté en la raíz del sitio publicado
   - Que hayas hecho un nuevo build después de agregar el archivo `_redirects`

## Solución de problemas

Si el problema persiste:
1. Verifica en Render que el archivo `_redirects` aparezca en los archivos del sitio
2. Asegúrate de que el build se haya ejecutado correctamente
3. Verifica que el Root Directory en Render sea `client` (no la raíz del repo)
