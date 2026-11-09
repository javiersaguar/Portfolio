# Portfolio

Portfolio de Javier Saguar, construido con [Astro](https://astro.build), salida estática y alojamiento en Vercel.

```bash
npm ci
npm run dev      # http://localhost:4321
npm run build    # Genera dist/
```

En WSL, si Node está instalado con nvm, activar primero `source ~/.nvm/nvm.sh`.

La entrada ensambla el nombre durante 2,8 segundos a partir de las imágenes originales, mediante máscaras por letra, fragmentos y un barrido láser. La animación es nativa de la web y no reproduce vídeo. Después aparece un menú con ocho marcianos volumétricos y un cañón 3D con blindaje, reactor, iluminación y retroceso. Un clic sobre un objetivo dispara una descarga de plasma desde la boca del modelo y abre su apartado. En pantallas táctiles, el primer toque apunta y muestra la descripción; el segundo abre el apartado. Tab, flechas y las teclas 1-8 seleccionan objetivos; Intro permite acceder directamente. El sonido se activa voluntariamente.

Los modelos de Three.js se cargan al mostrar el menú. El cañón dibuja cuando cambia la orientación, el tema, el tamaño o el retroceso; los marcianos comparten una superficie y una flotación limitada a treinta renders por segundo. Ambos se detienen al abrir un apartado u ocultar la pestaña. La alternativa de píxeles se reserva para un fallo real de WebGL y permanece oculta durante la carga normal. La barra de desarrollo de Astro está desactivada.

Las rutas `/`, `/es/` y `/zh/` generan el contenido en inglés, español y chino simplificado. La primera visita usa inglés. El selector guarda la elección en `localStorage`, conserva la sección actual y reutiliza el idioma en visitas posteriores. El tema sigue el sistema hasta que se elige uno manualmente. La intro aparece una vez por sesión de pestaña, puede saltarse y se omite con movimiento reducido o enlaces directos a secciones.

Cada apartado muestra únicamente su contenido, conserva su diseño y su ancla original y ofrece el botón «Back to arcade menu». El cambio de idioma conserva el apartado abierto y el historial permite volver atrás o avanzar. El acceso directo abre el perfil. Sin JavaScript se muestran el menú estático, los enlaces de idioma y el contenido completo.

Fuentes de contenido:

- `src/data/site.ts`: proyectos, enlaces, perfil y tecnologías.
- `src/data/translations.json` y `src/data/i18n.ts`: traducciones de los apartados existentes.
- `src/data/background.ts`: estudios, experiencia, idiomas y soft skills basados en el CV.
- `src/data/arcade-copy.ts`: textos de navegación.
- `src/data/arcade-sprites.ts`: marcianos y alternativa del cañón, con el sistema de píxeles del portfolio.
- `src/scripts/cannon3d.ts`: geometría, materiales, orientación, iluminación y retroceso del cañón 3D.
- `src/scripts/aliens3d.ts`: marcianos volumétricos sobre sus enlaces accesibles.
- `src/scripts/shot-effects.ts`: descarga, núcleo de plasma y fragmentación.
- `src/scripts/section-view.ts`: aislamiento de los apartados.
- `src/components/Intro.astro`, `src/scripts/intro.ts` y `public/intro/name-*.webp`: animación nativa y arte del nombre para cada tema. Los originales se conservan fuera del repositorio.

El calendario de contribuciones se consulta durante la compilación y se actualiza en cada despliegue. Si falla la consulta, se muestra el enlace a GitHub.
