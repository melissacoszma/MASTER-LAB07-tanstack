# Casas rurales — TanStack Start

Portal de alquiler vacacional de casas rurales desarrollado con **TanStack Start**,
TypeScript y Tailwind CSS, como parte del laboratorio de MetaFrameworks del Máster Front End
de Lemoncode. Es la tercera implementación de la misma aplicación, después de las versiones
con Next.js y Nuxt, y la que cierra la comparativa entre los tres enfoques. Los datos
provienen del mock `api-server` del enunciado.

## La aplicación

Dos pantallas. El **listado** muestra el catálogo en una rejilla responsive de tarjetas con
imagen, ubicación, descripción resumida, capacidad y precio por noche, con un buscador que
filtra en tiempo real. El **detalle** amplía la ficha con dirección completa, servicios,
opiniones de huéspedes y un botón de reserva. Ambas conectadas con navegación de cliente.

## Arquitectura

La diferencia más característica de TanStack frente a los otros dos es que **las rutas no
solo se colocan, se declaran**. Cada archivo de `src/routes/` exporta un objeto `Route`
creado con `createFileRoute('/ruta')`, y a partir de ahí se genera automáticamente un árbol
de rutas tipado, `routeTree.gen.ts`.

Eso tiene una consecuencia: los enlaces están comprobados por el compilador. 
`<Link to="/houses/$id" params={{ id }} />` falla en el editor si esa ruta no existe o si no 
le pasamos los parámetros que necesita. Durante el desarrollo de este proyecto ocurrió que al 
añadir parámetros de búsqueda a la ruta `/`, TypeScript señaló de inmediato todos los enlaces 
de la aplicación que quedaban incompletos, en archivos que ni siquiera estaban abiertos. 
En Next o Nuxt ese fallo no habría aparecido hasta pinchar el enlace en el navegador.

La carga de datos tampoco vive en el componente, sino en la ruta, mediante un **loader**. El
router lo ejecuta, espera a que resuelva y solo entonces renderiza, de modo que el componente
recibe los datos ya listos y correctamente tipados a través de `Route.useLoaderData()`. 
En la primera visita el loader corre en el servidor; al navegar entre páginas, en el navegador.

El documento HTML se escribe a mano en `src/routes/__root.tsx`, con sus etiquetas `<html>`,
`<head>` y `<body>` literales. Es el framework que más control da sobre el documento y, en
consecuencia, el que menos asume por ti.

## Estrategias de rendering

Aquí aparece la diferencia de fondo con los otros dos: **TanStack Start no tiene ISR**. No
existe un equivalente al `revalidate` de Next ni al `isr` de Nuxt. Las opciones son renderizar
en servidor en cada petición (que es el comportamiento por defecto) o prerenderizar en tiempo
de compilación. 

Para un catálogo de seis casas que cambia poco, se ha optado por **prerenderizar la
aplicación completa**. Se configura en el plugin de Vite, activando el rastreo de enlaces: el
proceso parte del listado, sigue los enlaces de cada tarjeta y genera una página por casa. Es
el mismo mecanismo por descubrimiento de Nuxt, pero aquí sí funciona sin ayuda, porque
el listado también se prerenderiza y sirve de punto de partida.

Salida del `npm run build`:

```
[prerender] Crawling: /
[prerender] Crawling: /houses/1
[prerender] Crawling: /houses/2
...
[prerender] Prerendered 7 pages
```

Y el resultado en disco, bajo `.output/public/`: un `index.html` y una carpeta por cada casa.
La aplicación entera se sirve como archivos estáticos.

La contrapartida frente a Nuxt es que dar de alta una casa nueva obliga a recompilar,
mientras que allí el listado se refrescaba solo cada minuto.

## Funcionalidades opcionales

**Búsqueda por nombre y ubicación, con el término en la URL.** Es la implementación que más
se aprovecha de las particularidades del framework. TanStack Router trata los parámetros de
búsqueda como VIPs, se declaran con `validateSearch`, que los valida y los tipa, y se leen 
con `useSearch` igual que cualquier otro dato de la ruta. El resultado es que `/?q=granada` 
es un enlace compartible, el botón de atrás funciona (con `replace` para no apilar una entrada 
por tecla pulsada) y el estado sobrevive a una recarga.

En las versiones de Next y Nuxt la búsqueda se resolvió con estado local del componente,
porque llevarla a la URL habría convertido la ruta en dinámica y habría costado el rendering
estático. Aquí no, porque el filtrado sigue ocurriendo en memoria sobre los datos del loader:
el parámetro de búsqueda no forma parte de las dependencias del loader, así que teclear no
dispara ninguna petición.

**Botón de reserva** en la pantalla de detalle, con confirmación y bloqueo tras el envío.

**Optimización de imágenes con unpic**, con la particularidad que se detalla más abajo.

## Un poco más

Jerarquía de manejo de errores en dos niveles: el router define un `defaultNotFoundComponent`
y un `defaultErrorComponent` genéricos, y la ruta de detalle los especializa con su propio
"Casa no encontrada". Metadatos por ruta mediante la opción `head`, que recibe los datos del
loader y construye el título con el nombre de la casa.

En accesibilidad: HTML semántico, idioma del documento, etiqueta asociada al buscador,
anuncio de resultados con `aria-live`, equivalente textual para las valoraciones con
estrellas e indicador de foco visible al navegar con teclado.

## Comparativa de los tres frameworks

**Dónde está la frontera entre servidor y cliente.** Next la hace explícita con `"use client"`
y obliga a decidirla en cada funcionalidad interactiva. Nuxt no la traza: todos sus
componentes son universales. TanStack tampoco, pero por motivos distintos, su unidad de
separación no es el componente sino la ruta, y lo que corre en servidor es el loader.

**Dónde se declara el rendering.** Next, en cada página. Nuxt, centralizado en `routeRules`.
TanStack, en la configuración del plugin de Vite. Y solo los dos primeros ofrecen ISR; el
tercero elige entre servidor y estático, sin punto intermedio.

**Cómo se averiguan las rutas estáticas.** Next es declarativo, con `generateStaticParams`.
Nuxt y TanStack trabajan por descubrimiento, rastreando enlaces, con la diferencia de que en
Nuxt hubo que recurrir a un hook explícito porque el listado era ISR y no servía de punto de
partida.

**Qué garantiza el tipado.** Aquí TanStack gana sin discusión ya que es el único que comprueba en
tiempo de compilación que los enlaces apuntan a rutas existentes y que los parámetros de ruta
y de búsqueda son los correctos.

**Cuánta "ceremonia" exige.** El orden se invierte: Nuxt es el más escueto, con
auto-importación de componentes y composables y `v-model` para los formularios. Next queda en
medio. TanStack es el más verboso, porque cada ruta se declara explícitamente.

**Optimización de imágenes.** Tres filosofías distintas. Next y Nuxt incluyen su propio
servidor de optimización —`/_next/image` e `/_ipx/` respectivamente—, y por eso ambos obligan
a autorizar los dominios de origen. Unpic parte de la idea contraria: no despliega
infraestructura, solo reescribe URLs de CDNs que reconoce.

**Variables de entorno.** Next inyecta las `NEXT_PUBLIC_` en tiempo de compilación. Nuxt
resuelve `runtimeConfig` al arrancar el servidor, de modo que el mismo build sirve para
distintos entornos. TanStack, al apoyarse en Vite, vuelve al modelo de compilación: las
`VITE_` quedan incrustadas en el bundle, y el propio build lo advierte recordando que en
producción hay que definirlas como variables de plataforma.

## Decisiones y limitaciones

**Unpic no se activa con el mock.** Al no ser un CDN reconocido, unpic no transforma nada y no
genera `srcset` ni aplica estilos, y deja pasar las propiedades al elemento. Se ha mantenido
de todos modos el uso canónico del componente, con su `layout` y sus dimensiones, para que la
optimización funcione sin tocar código el día que las imágenes estuvieran en un CDN. Mientras
tanto, los beneficios reales se consiguen con atributos nativos: `width` y `height` reservan
el espacio y evitan saltos de maquetación, `loading="lazy"` difiere las tarjetas y
`fetchpriority="high"` prioriza la imagen principal del detalle.

**La reserva es únicamente de interfaz**, porque el mock solo expone dos endpoints `GET`.

**El filtrado ocurre en cliente** sobre los datos ya cargados. Con un catálogo real, la
búsqueda se resolvería en servidor con paginación, aunque en este caso el término ya está en
la URL, que era la mitad del problema.

## Conclusión personal

Habiendo implementado la misma aplicación tres veces, me decanto sin duda por **Next.js**. 
Es el que me ha resultado más manejable e intuitivo con mi nivel: la configuración del rendering 
vive junto a la página que afecta, la documentación es abundante y la separación explícita entre 
servidor y cliente, aunque al principio cuesta, acaba siendo una ayuda porque te obliga a tener 
claro dónde se ejecuta cada cosa. Para este tipo de proyecto y con mi experiencia actual, Next 
es con el que me he sentido más cómoda trabajando/aprendiendo.

---

La aplicación consume el mock `api-server` del enunciado, necesario tanto en desarrollo como
durante el build, ya que el prerenderizado consulta la API de verdad. Su dirección se
configura con `VITE_API_URL`; si no se define, se usa `http://localhost:3001`.

Con el mock levantado: `npm install` y `npm run dev`.