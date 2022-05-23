# Introducción
Uno de los problemas que enfrenta la computación gráfica es el de cómo se puede representar una imagen o un modelo 3D en una monitor o pantalla 2D. Este es relevante, debido a que los monitores sobre los cuales se muestran las imágenes no son espacios continuos como lo es el mundo real, en cambio, este está representado por una cuadrícula de pixeles, los cuales son una unidad discreta que solo puede tomar un valor de color. 

El computador entonces guarda el modelo de la representación de la escena, ya sea 2D o 3D, que va a ser mostrado en la pantalla, este proceso es llamado renderización, y es un proceso llevado a cabo en la animación, videojuegos, modelizaciones 3D, entre otros.

En el presente artículo se va a presentar cómo el proceso de rendering, conocida como la tubería de renderizado (o por su nombre en ingles *graphic pipeline*) permite una perspectiva forzada de los cuales se basa el juego **Superliminal**.

# Renderización

Cuando se renderiza una escena, el objetivo principal es de escoger una escena de la cual se va a renderizar (va a tener su propia posición, orientación y zoom) y una “ventana” o mejor conocida en computación gráfica como pantalla, a la cual la figura va a ser traducida.La renderización se hace por medio del cambio de distintos espacios de coordenadas. Estos espacios de cooordenadas son:

## Espacio del Modelo

Este es el espacio de coordenadas x,y,z bajo el cual está definida la geometría del objeto, usualmente el objeto se realiza mediante el  vértices y superficies normales.

![1](https://docs.blender.org/manual/en/latest/_images/modeling_meshes_primitives_all.png)

![3](https://help.autodesk.com/cloudhelp/2015/ENU/MayaLT/images/GUID-BB1C65CF-70BB-4B06-AC52-D50AAC0988FC.png)

## Mundo

El mundo es el espacio bajo el cual toda la escena está definida, este tiene su origen en el centro de la escena. Se puede pasar del espacio del modelo al espacio del mundo por medio de una transformación de modelos.

![2](https://help.autodesk.com/cloudhelp/2015/ENU/MayaLT/images/GUID-8B7AD211-47B4-4790-8543-82777029C75A.png)

## Cámara u ojo

La cámara  el punto de vista desde el cual se ve el mundo. Es el un espacio coordinado con origen en el centro de la proyección.

![4](http://ycpcs.github.io/cs470-fall2014/labs/images/lab07/viewSystem.png)

##  Espacio de pantalla

El espacio de la pantalla es una proyección de la cámara a un espacio en 2D. Este se utiliza para proyectar lo del espacio de la cámara a una representación en monitores como se conoce hoy en día en los computadores.

![5](https://i.stack.imgur.com/7wLHO.png)

# Tubería de renderización

Este es un proceso que decribe los pasos de la renderización de un objeto a su forma 2D o, mejor dicho, del espacio del objeto al espacio de la pantalla.

![6](http://findnerd.s3.amazonaws.com/imagedata/3115/3115.jpg)

# Superliminal

Superliminal es un videojuego desde la perspectiva de primera persona. La trama del juego consiste en un jugador que se encuentra atrapado en un lugar surreal llamado el *espacio de sueños* y este debe hallar maneras de escapar de ese lugar. Sin embargo, una características del espacio de sueños mencionados es que el jugador puede cambiar el tamaño de los objetos utilizando la perspectiva forzada.

![9](https://memestatic.fjcdn.com/gifs/Game+superliminal_19df52_7918238.gif)

![7](https://thumbs.gfycat.com/DescriptiveOddballEft-size_restricted.gif)

![8](https://c.tenor.com/dF43bBFb7dQAAAAd/superliminal.gif)

##  Perspectiva forzada

La perspectiva forzada es un fenómeno en el que el observador es engañado acerca del tamaño de un objeto, es decir, este puede parecer más grande o más pequeño de lo que en realidad es. Esto ocurre ya que la representación de la escena en el ojo humano, en este caso la cámara, percibe el objeto de una manera que parece distinta a la realidad.


![10](https://media.istockphoto.com/photos/tourists-at-uyuni-salt-flats-aka-salar-de-uyuni-in-bolivia-south-picture-id1209960044?k=20&m=1209960044&s=612x612&w=0&h=SY5bmp58AGofNOTI4qXbPcvcsoaBV5BxeZaWGGUkhjg=)

![11](https://portraitsrefined.com/wp-content/uploads/2021/02/forced-perspective-tower-piza-cone-person.jpg)

En el caso específico del juego, el jugador tiene el control de la perspectiva forzada, en cuanto este puede en el mundo aumentar y disminuir el tamaño de los objetos sin que, bajo la perspectiva de la cámara se cambie el tamaño. 

[11]({video-url})

Esto se logra porque ante el espacio de la pantalla que es generado ante el proceso de renderización, la scena creada no cambia a pesar de que en el mundo el objeto sí este cambiando.