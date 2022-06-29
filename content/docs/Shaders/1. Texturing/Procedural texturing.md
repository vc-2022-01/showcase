# Procedural texturing
## Ejercicio 3

Las texturas procedimentales son aquellas que se realizan por medio de un una definición matemática. Estas utilizan variables del entorno como el tiempo, la posición del mouse, la posición de los vértices y pixeles entre otras para asignar una textura a una imagen. 

Para realizar una textura sobre un objeto es necesario realizar un mapero entra las coordenadas de la figura y el modelo de la figura, siendo este mapeo usualmente lineal. Sin embargo, si se utiliza otras funciones para mapear del espacio del modelo hacia la figura se obtienen distintos patrones sobre la figura.

![](https://www.scratchapixel.com/images/upload/shading-intro/shad-sinewave2.png?)

También se pueden utilizar funciones dicretas de manera que el cambio en la textura no sea continuo sino por pasos.

![](https://www.scratchapixel.com/images/upload/shading-intro/shad-fmod.png?)

De esta manera se pueden obtener diversas figuras (líneas, curvas, círculos, entre otros) por medio de la apliación de funciones no lineales a las coordenadas de texturas.

## Aplicación

Entonces, se pueden crear las texturas por medio de un fragment shader. Este recibe la información de pixel a pixel y, de acuerdo a sus coordenadas *ST*, se mapea un color sobre la figura de la siguiente manera:

```javascript
vec2 tile (vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}
```
En esta sección del código se reciben las coordenas ST y un atributo llamado `_zoom`. En esta función, se modifican las coordenadas de cada pixel de manera que se devuelva su parte fraccional.

{{< katex display >}}  f(x) = x - floor(x) {{< /katex >}} 

Esta función es luego usada para asignar el color de cada pixel sobre la figura:

```javascript
st = tile(st,u_zoom*0.5);
gl_FragColor = vec4(vec3(step(st.x,st.y)),1.0);
```

Este es el proceso mediante el cual se generan texturas procedimentales. Para crear nuevas texturas se pueden utilizar nuevas funciones matemáticas. A continuación, se muestran varios ejempos de texturas procedimentales sobre varias figuras.

{{< hint info >}} **Instrucciones** 
- En el primer selector, selecciona la figura sobre la cual aplicar la textura
- En el segundo slector, selecciona la textura a aplicar
- Mueve el mouse para cambiar el tamaño de la textura
- Haz cliz y mueve el mouse para cambiar de perspectiva de la cámara 
{{< /hint >}} 
{{< p5-iframe sketch="/showcase/sketches/ProcText.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="400" height="400">}}