## Movimiento de partículas a través de un campo de perlin noise

En el siguiente frame se puede ver el movimiento con rastro de partículas a través de un campo de perlin noise

{{< p5-iframe  sketch="/showcase/sketches/camposCP3.js" width="425" height="425" >}}
{{< p5-iframe  sketch="/showcase/sketches/camposCP.js" width="425" height="425" >}}
{{< p5-iframe  sketch="/showcase/sketches/camposCP2.js" width="425" height="425" >}}

si jugamos con la rejilla y la dirección de los vectores, se pueden generar texturas o efectos visuales más complejos

### Snow

{{< p5-iframe  sketch="/showcase/sketches/snow.js" width="425" height="425" >}}

### Grass

{{< p5-iframe  sketch="/showcase/sketches/grass.js" width="425" height="425" >}}

Según lo explica **Andre Tatarinov** en su paper titulado __Perlin noise in Real-time Computer Graphics__, esto también se puede usar para generar efectos dinámicos volumétricos como fuego, una explosión o humo, esto solo cambiando la dirección y el comportamiento de los vectores asociados a la rejilla.


