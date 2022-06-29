---
bookCollapseSection: true
---
# Texturing

Las texturas en la computación gráfica son elementos los cuales añaden detalles a una imagen. Se pueden pensar las texturas como una imagen que cubre el objeto. Así como cuando se cubre un regalo con una envoltura, se debe asignar cada punto del objeto a un punto de la envoltura.

![](https://s3-us-west-2.amazonaws.com/dunndiy.com/project-images/Dunn_DIY_Wrapping_Paper-3407_191211_105449.jpg)

Es por esta razón que, cuando se trata de texturas, es necesario dividir la imagen en partes más pequeñas para que concuerden con cada parte de la imagen de la textura. 

No obstante, para aplicar la textura sobre una figura es necesario utilizar las coordenadas de textura o las coordenadas *UV* o *ST*. Estas son un espacio en 2 dimensiones formado por los vértices de la figura:

![1](https://www.scratchapixel.com/images/upload/shading-intro/shad-texturecoord.png?)

![](http://www.opengl-tutorial.org/assets/images/tuto-5-textured-cube/UVintro.png)

De esta manera, para aplicar una textura sobre una figura, se hace un mapeo entre las coordenadas de la textura hacia las coordenadas de la figura. Como este mapero este mapeo se hace pixel por pixel, los shaders son utilizados, especialmente los *fragment shaders*, ya que estos posibilitan dividir la figura en fragmentos pequeños, conocidos como los pixeles para hacer el mapeo de estas coordenadas, todo esto de manera paralela.
