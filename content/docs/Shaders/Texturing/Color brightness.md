# color brightness tools

## Ejercicio 2: Texture Sampling

El modelo de color *HSV* ( Hue, Saturation, Value. Por sus siglas en inglés) también es llamado *HSB* (Hue, Saturation, Brightness - Matiz) fue creado en 1978 por Alvy Ray Smith.

Es una transformación no lineal de color RGB y se usa para progreciones de color, este no es el mismo HSL, el modelo HSL se explicará más adelante.

![1](https://es.wikipedia.org/wiki/Modelo_de_color_HSV#/media/Archivo:Cono_de_la_coloraci%C3%B3n_HSV.png)

En la imagen podemos ver el cono del modelo HSV, podemos movernos a través del mismo con un vector de 3 dimensiones de forma:

- 0º = RGB(1, 0, 0)
- 60º = RGB(1, 1, 0)
- 120º = RGB(0, 1, 0)
- 180º = RGB(0, 1, 1)
- 240º = RGB(0, 0, 1)
- 300º = RGB(1, 0, 1)
- 360º = 0º

a continuación se muestra un ejemplo de esto:

{{< p5-iframe sketch="/showcase/sketches/hsl1.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="675" height="525" >}}

Foto de Md. Noor Hossain: https://www.pexels.com/es-es/foto/vacaciones-gente-multitud-ceremonia-8443591/


*HSL* (Hue, Saturation, Lightness. Por sus siglas en inglés), también llamado *HSI* (Hue, Saturation, Intensity. Por sus siglas en inglés), tiene dos vertices que representan el blanco y el negro, el ángulo se corresponde con el _Hue_, la distancia con la _Saturation_ y la distancia al eje blanco-negro con el _Lightness_

![2](https://es.wikipedia.org/wiki/Modelo_de_color_HSL#/media/Archivo:Doble_cono_de_la_coloraci%C3%B3n_HSL.png)

transformaciones a *HSV* y *HSL*

{{< p5-iframe sketch="/showcase/sketches/hsl2.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="675" height="525" >}}

Foto de Belle Co: https://www.pexels.com/es-es/foto/foto-de-una-tortuga-bajo-el-agua-847393/
