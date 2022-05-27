# Introducción
Uno de los problemas que enfrenta la computación gráfica es el de cómo se puede representar una forma o un modelo 3D en una monitor o pantalla 2D. Este es relevante, debido a que los monitores sobre los cuales se muestran las imágenes no son espacios continuos como lo es el mundo real, en cambio, este está representado por una cuadrícula de pixeles, los cuales son una unidad discreta que solo puede tomar un valor de color. 

El computador entonces guarda el modelo de la representación de la escena, que va a ser mostrado en la pantalla, este proceso es llamado renderización, y es un proceso llevado a cabo en la animación, videojuegos, modelizaciones 3D, entre otros.

En el presente trabajo se va a presentar cómo el proceso de rendering, conocida como la tubería de renderizado (o por su nombre en ingles *graphic pipeline*) permite una perspectiva forzada de los cuales se basa el juego **Superliminal**.

# Renderización

Cuando se renderiza una escena, el objetivo principal es de escoger un modelo el cual se va a renderizar (va a tener su propia posición, orientación y zoom) y una “pantalla" representada en dos dimensiones, a la cual la figura va a ser traducida. La renderización se hace por medio del cambio de distintos espacios de coordenadas. Estos espacios de cooordenadas son:

## Espacio del Modelo

Este es el espacio de coordenadas x,y,z bajo el cual está definida la geometría del objeto, usualmente el objeto se define mediante primitivas en este espacio.

![3](https://github.com/ggarciarom/NewProyect/blob/master/model.png?raw=true)

![1](https://docs.blender.org/manual/en/latest/_images/modeling_meshes_primitives_all.png)



## Mundo

El mundo es el espacio bajo el cual toda la escena está definida, este tiene su origen en el centro de la escena. Se puede pasar del espacio del modelo al espacio del mundo por medio de una transformación de modelos.

![2](https://github.com/ggarciarom/NewProyect/blob/master/world.png?raw=true)

## Cámara u ojo

Es el espacio coordinado con origen en el centro de la proyección. La cámara es el punto de vista desde el cual se ve el mundo, este forma un *campo de visión* formado a partir de cuatro rayos. Cada objeto quede dentro del espectro de los cuatro rayos será percibido por la cámara, esto lo hace dado que los puntos en el mundo se reflejan como rayos hacia la cámara.

![4](https://github.com/ggarciarom/NewProyect/blob/master/camera.png?raw=true)

### Zoom

Unas de las características del espacio de cámara es el zoom. Este se origina dado que el campo de visión, forma ángulos con los ejes coordinados x y y. Entre más grande sean estos ángulos, de más espacio del mundo se tendrá una proyección y viceversa.

![Angles](https://github.com/ggarciarom/NewProyect/blob/master/angles.png?raw=true)
El zoom le permitiría a la cámara aumentar el espacio que percibe por medio del aumento de sus ángulos, siempre y cuando estos conserven la proporcionalidad de la imagen.

![7](https://github.com/ggarciarom/NewProyect/blob/master/zoom_final.png?raw=true)

##  Espacio de pantalla

El espacio de la pantalla es una proyección de la cámara a un espacio en 2D. Este se utiliza para proyectar lo del espacio de la cámara a una representación en monitores como se conoce hoy en día en los computadores.

![5](https://github.com/ggarciarom/NewProyect/blob/master/pantalla.png?raw=true)

# Tubería de renderización

Este es un proceso que decribe los pasos de la renderización de un objeto a su forma 2D o, mejor dicho, del espacio del objeto al espacio de la pantalla.

![6](https://github.com/ggarciarom/NewProyect/blob/master/gpipeline.png?raw=true)

# Superliminal

Superliminal es un videojuego desde la perspectiva de primera persona. La trama del juego consiste en un jugador que se encuentra atrapado en un lugar surreal llamado el *espacio de sueños* y este debe hallar maneras de escapar de ese lugar. Sin embargo, una características del espacio de sueños mencionados es que el jugador puede cambiar el tamaño de los objetos utilizando la perspectiva forzada.

![9](https://64.media.tumblr.com/ff884ea4cd5d9ff63f26522de7b27e73/aa67fda6eca56129-d3/s540x810/61f9ade56837fe91c4e3b8a69b9df2876a114a55.gifv)

![7](https://thumbs.gfycat.com/DescriptiveOddballEft-size_restricted.gif)

![8](https://c.tenor.com/dF43bBFb7dQAAAAd/superliminal.gif)

##  Perspectiva forzada

La perspectiva forzada es un fenómeno en el que el observador es engañado acerca del tamaño de un objeto, es decir, este puede parecer más grande o más pequeño de lo que en realidad es. Esto ocurre ya que la representación de la escena en el ojo humano, en este caso la cámara, percibe el objeto de una manera que parece distinta a la realidad.

{{< katex display >}} f(x) = \int_{-\infty}^\infty\hat f(\xi),e^{2 \pi i \xi x},d\xi {{< /katex >}}


![10](https://media.istockphoto.com/photos/tourists-at-uyuni-salt-flats-aka-salar-de-uyuni-in-bolivia-south-picture-id1209960044?k=20&m=1209960044&s=612x612&w=0&h=SY5bmp58AGofNOTI4qXbPcvcsoaBV5BxeZaWGGUkhjg=)

![11](https://portraitsrefined.com/wp-content/uploads/2021/02/forced-perspective-tower-piza-cone-person.jpg)

En el caso específico del juego, el jugador tiene el control de la perspectiva forzada, en cuanto este puede en el mundo aumentar y disminuir el tamaño de los objetos sin que, bajo la perspectiva de la cámara se cambie el tamaño. Esto se logra porque ante el espacio de la pantalla que es generado ante el proceso de renderización, la scena creada no cambia a pesar de que en el mundo el objeto sí este cambiando.

![12](https://thumbs.gfycat.com/RedJointGrison-size_restricted.gif)