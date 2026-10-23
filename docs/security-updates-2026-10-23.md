# Actualización de seguridad de los templates

Los tres templates conservan sus paquetes y locks independientes. Next.js pasa
de 16.3.0-preview.6 a 16.4.3. React y React DOM quedan juntos en 19.2.8.
Las actualizaciones nativas del lock también reparan DOMPurify, Mermaid,
PostCSS, sharp, nanoid y source-map-js.

KaTeX 0.16.47 permite que opciones heredadas alteren las restricciones de
confianza cuando ya existe contaminación de prototipos. La corrección de
[GHSA-238p-pmpm-9mq7](https://github.com/KaTeX/KaTeX/security/advisories/GHSA-238p-pmpm-9mq7)
es 0.18.2. Los padres `@streamdown/math`, Mermaid, `micromark-extension-math`
y `rehype-katex` todavía piden 0.16. El override de KaTeX a 0.18.2 es deliberado.
Se verifican las fórmulas con rehype y Mermaid y el rechazo de `trust` heredado.
Retirar el override cuando los padres admitan una versión corregida.

Eve 0.28.0 fija undici 8.9.0. El override está limitado a la dependencia undici
de Eve y conserva la versión mayor 8 con `^8.12.3`. Las otras copias de undici
se resuelven dentro de los rangos de sus propios padres. No cambia la API ni
el código de los agentes.

Para comprobar cada template desde su directorio:

```sh
npm ci
npm run typecheck
npm run build
```

Node 24.22.1 se usa para la verificación local. La actualización del repositorio
requiere reconstruir y publicar cada agente que ya estaba en funcionamiento.
Las comprobaciones locales no confirman una publicación en producción.
