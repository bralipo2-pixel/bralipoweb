# Publicar Bralipo en Netlify

Repositorio: https://github.com/bralipo2-pixel/bralipoweb · rama `main`.

## 1. Importar el repositorio

En Netlify: **Add new project → Import an existing project → GitHub → bralipoweb**.
El repositorio debe tener al menos el primer commit.

- Base directory: vacía (raíz del repositorio).
- Build command: `npm run build && npm run check`.
- Publish directory: `dist`.
- Node: 24, definido en `netlify.toml`.

Netlify lee estos valores del archivo. No usar un deploy manual de `dist`: Decap necesita que los cambios en GitHub disparen nuevos builds.

El primer deploy mantiene `PUBLIC_INDEXABLE=false` y habilita el formulario únicamente en producción. Noindex no hace privado al sitio. El contenido de prueba sigue visible hasta que se despublique desde el CMS.

## 2. Conectar Decap

El panel está en `/admin/`. La configuración generada durante el build usa `bralipo2-pixel/bralipoweb`, rama `main`, y desactiva el proxy local. La configuración fuente conserva el proxy para `npm run cms` en tu computadora.

1. En GitHub → Settings → Developer settings → OAuth Apps → New OAuth App:
   - Nombre: Bralipo CMS.
   - Homepage URL: la URL principal asignada por Netlify.
   - Authorization callback URL: `https://api.netlify.com/auth/done`.
2. En Netlify → Project configuration → Security → OAuth → Authentication providers → Install provider → GitHub, ingresar el Client ID y Client Secret de esa aplicación.
3. Guardar el secreto solamente en Netlify; no copiarlo al repositorio, al chat ni a variables `PUBLIC_*`.
4. Abrir `/admin/` e iniciar sesión con GitHub. La cuenta editora debe tener permiso de escritura en el repositorio.
5. Crear un borrador de prueba y comprobar que aparece en el flujo editorial. Publicar una entrada cuando esté lista y verificar el nuevo deploy en Netlify.

No requiere Netlify Identity ni Git Gateway. Si se usa otra rama, definir `CMS_BRANCH`; si se usa otro repositorio, definir `CMS_GITHUB_REPO=usuario/repositorio`.

## 3. Activar y probar el formulario

1. En Netlify → Forms, activar **form detection** y volver a desplegar.
2. Verificar que aparezca el formulario **contact**.
3. Forms → Submission notifications → Add notification → Email: `bralipo2@gmail.com`.
4. Ese correo debe pertenecer a un miembro activo del equipo de Netlify para poder configurar nuevas notificaciones en los planes habituales. Si la cuenta usa otro correo, resolver ese requisito en Netlify antes de guardar la notificación.
5. Asunto sugerido: `Nueva consulta — Bralipo`.
6. Enviar una consulta real de prueba, identificada como tal, desde español y desde inglés. Comprobar respuesta en pantalla, registro en Netlify y recepción del email. El campo `email` permite responder al remitente.

Incluye honeypot, validación nativa, mensajes de error y páginas de agradecimiento para envío sin JavaScript. Los envíos están desactivados en local, deploy previews y branch deploys. El mensaje de éxito local no se simula. La recepción real solo puede verificarse después de configurar Netlify Forms.

## 4. Dominio y SEO antes del lanzamiento

Sin dominio comprado, `URL` de Netlify sirve como dirección principal. Cuando esté comprado y conectado, definir `SITE_URL=https://dominio-final` y volver a desplegar.

Antes de cambiar `PUBLIC_INDEXABLE` a `true` en el contexto de producción:

- Revisar o despublicar **Prueba de IA** (`prueba1`), cuyos textos siguen siendo pruebas.
- Completar los textos, traducciones y campos SEO de **Imprix** y **Rojo Agencia**.
- Revisar **Ryuko** y **Crunchill**: conservan `demo: true` y varios textos originales de demostración. Cuando sean casos reales completos, desmarcar Contenido de prueba. Los ejemplos quedan excluidos de la versión indexable.
- Revisar portadas y descripciones de Labs.
- Confirmar el dominio principal y probar el formulario y acceso al CMS.

Las páginas de agradecimiento y el admin permanecen sin indexación. Las previews tienen además cabecera `X-Robots-Tag: noindex, nofollow`.

## Verificaciones locales

`npm run build && npm run check` valida rutas, recursos, metadatos, formularios y configuración del CMS.
`node scripts/verify-deploy.mjs` prueba la generación del config de producción y previews, sin modificar archivos fuente ni publicar.

## Referencias oficiales

- https://decapcms.org/docs/github-backend/
- https://docs.netlify.com/manage/security/secure-access-to-sites/oauth-provider-tokens/
- https://docs.netlify.com/manage/forms/setup/
- https://docs.netlify.com/manage/forms/notifications/
