# BRALIPO — primera versión

Sitio estático bilingüe con Astro, React, Three.js y Decap CMS. Preparado para Netlify. Ver [guía de despliegue](DEPLOY-NETLIFY.md) para conectar CMS, formularios y dominio.

## Desarrollo

```sh
npm ci
npm run dev
```

Abrir http://localhost:4321/es/ o /en/. Para el CMS, ejecutar también `npm run cms` desde esta carpeta y abrir `/admin/`. El proxy local solo debe ejecutarse en tu computadora; no se despliega. Las ediciones locales actualizan los JSON de `src/content/projects` y `src/content/labs`.

## Contenido

- Dos colecciones independientes con campos en español e inglés.
- `published: false` excluye la entrada de todas las páginas.
- `demo: true` identifica los ejemplos y los excluye cuando `PUBLIC_INDEXABLE=true`.
- Los slugs son estables y compartidos entre idiomas. Cambiar un slug publicado requiere una redirección en Netlify.
- Las portadas de Labs son ilustraciones tipográficas, no capturas ni retratos reales. Reemplazarlas desde el CMS.
- Los proyectos Forma y Objeto son demostraciones, no trabajos atribuidos a Bralipo.
- Las descripciones de Labs proceden de la información suministrada por Brian; demos y redes no han sido auditadas.

## Netlify y publicación

1. Crear repositorio GitHub y conectar Netlify. Build `npm run build`, salida `dist`.
2. Repositorio configurado: `bralipo2-pixel/bralipoweb`, rama `main`. El postbuild ajusta el dominio OAuth y desactiva el proxy local en Netlify.
3. Configurar OAuth de GitHub en Netlify para el backend GitHub de Decap. No usar Git Gateway. Cada editor necesita acceso de escritura al repositorio.
4. Configurar el dominio y `SITE_URL=https://dominio-confirmado` (sin slash final).
5. Activar detección de formularios en Netlify, redeploy y configurar notificaciones a bralipo2@gmail.com. `netlify.toml` habilita `PUBLIC_FORM_ENABLED=true` solo en producción. Verificar un envío real antes de lanzar.
6. Reemplazar ejemplos, revisar traducciones, autoría de casos, biografía y portadas.
7. Solo después de revisar el contenido: `PUBLIC_INDEXABLE=true`. Esto activa canonical/hreflang y sitemap y excluye demos. Las deploy previews continúan con noindex.
8. Verificar dominio canónico, redirecciones de URLs anteriores, rendimiento móvil, Rich Results y Search Console.

No se promete posicionamiento. `noindex` no restringe el acceso: la primera versión está pensada para revisión local. Decap no tiene autenticación de producción configurada hasta completar los pasos anteriores.

## Diseño y fuentes

Colores #8CFF2E / #1E1E1E / #F9F9F9. Hubot Sans variable 200–900 y ancho 75–125, normal y cursiva. Poppins Regular y Medium descargadas de https://github.com/google/fonts/tree/main/ofl/poppins; fuentes servidas localmente con swap. Licencias en `licenses/`.

`AnimatedContent` proviene de https://github.com/DavidHDev/react-bits (archivo src/content/Animations/AnimatedContent/AnimatedContent.jsx), con ajuste para mantener visible el contenido sin JavaScript. Licencia MIT + Commons Clause incluida. El aro es una geometría procedural propia de Three.js, con fallback PNG, pausa, movimiento reducido y suspensión fuera de pantalla. No es una conversión automática del PNG ni una reproducción exacta de la imagen conceptual.

## Verificación

Estudio usa Lanyard del repositorio oficial React Bits: geometría y física en Three.js con textura local de Bralipo (`studio-pass.svg`), cinta lima, arrastre y giro. Carga al entrar en pantalla y tiene alternativa estática sin WebGL o con movimiento reducido. Se adaptó la suspensión de renderizado cuando la pestaña está oculta.

El inicio muestra hasta cuatro proyectos publicados, ordenados por fecha de publicación descendente, y un botón final al listado completo. La fecha se edita en Decap; las entradas antiguas sin fecha quedan después de las fechadas y conservan su orden manual. Usa ScrollStack de React Bits con desplazamiento de ventana nativo, sin suavizado ni captura de la rueda; con movimiento reducido o un único proyecto se presenta sin apilado.

La portada usa Grainient con los colores de marca y navegación glass. En escritorio se ajusta a la altura disponible; en móviles o ventanas extremadamente bajas permite crecer para mantener legibles los textos. Labs tiene una entrada de pantalla completa con FaultyTerminal y sus portadas usan TiltedCard. Estos tres componentes provienen del mismo repositorio oficial React Bits y quedan cubiertos por la licencia incluida. Los fondos tienen controles de pausa y las tarjetas se muestran estáticas en dispositivos táctiles o con movimiento reducido.

```sh
npm run build
npm run check
```

La validación recorre todas las páginas generadas, enlaces y recursos locales, H1, idiomas, metadatos y ejemplos. Requiere además comprobación visual y de CMS/formulario en el entorno de destino.
