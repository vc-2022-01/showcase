---
bookCollapseSection: true
---

# Shaders

La renderización es un proceso mediante el cual se transformauna figura o modelo a una pantalla de 2D, haciendo diversas transformaciones entre espacios coordenados. Sin embargo, este proceso ha representado una gran complejidad en la computación gráfica, debido que los monitores que se presentan alcanzan a tener millones de pixeles que procesar. 

![Various Pipelines](https://thebookofshaders.com/01/00.jpeg)
*Tomada de: The book of shaders https://thebookofshaders.com/01/*


Esto representa un problema, teniendo en cuenta que tradicionalmente los procesadores realizan estas tareas de manera secuencial, es decir que por cada frame mostrado en un monitor, se deben realizar millones de operaciones, sin tener en cuenta los otros procesos que lleva a cabo el computador fuera de estas tareas. Asimismo, esto también ignora que normalmente una pantalla muestra de 30 a 60 frames cada segundo. A pesar de la velocidad de los procesadores actuales, un solo procesador en insuficiente para realizar la cantidad de procesos mencionada.

![Various Pipelines](https://thebookofshaders.com/01/03.jpeg)
*Tomada de: The book of shaders https://thebookofshaders.com/01/*

Como solución al problema mencionado, se presentan los shaders. Estos son programas que se corren en una unidad de procesamiento gráfico (GPU), las cuales tienen dentro de ellas múltiples núcleos de procesamiento. Por lo tanto, esto significa que las tareas van a ser ahora paralelizables, es decir, que se realicen de manera simultánea. Con el uso de shaders es posible reducir el tiempo de renderización al realizar operaciones sobre varios pixeles al mismo tiempo.

![Various Pipelines](https://thebookofshaders.com/01/04.jpeg)
*Tomada de: The book of shaders https://thebookofshaders.com/01/*

Los shaders son un concepto que por completo cambiaron la computación gráfica, ya que estos permiten el procesamento de características de distintos objetos de manera paralalela por medio de las unidades de procesamiento, permitiendo su realización más rápida y dettallada, permitiendo añadir a las imágenes características como la iluminación, textura y sombreado.Es por esta razón que es utilizada en animación, video juegos, creaciónd de modelos 3D, entre otras.

## Vertex Shaders

Estos son programas que obtienen imformación de los vertices de la figura a renderizar, este se encarga del tratamiento de cada vértice individualmente. Las variables de cada vértice que puede tratar son:
 
 - La posición en x, y, z
 - El color
 - La textura
 - La ilumincación

Como se muestra en la siguiente imagen, los puntos que se muestran en azul son los vértices, los cuales serán tratados por el vertex shader cuando se renderice la figura.

 ![Vertex shader](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOZQ-rGzaXcPqIcyaZyjSt8aeYGZip0uGLOA&usqp=CAU)

 Otra función del vertex shader es de interpolar atributos al fragment shader.

## Fragment shaders

Estos son programas que obtienen imformación de cada pixel de la figura a renderizar, este se encarga del tratamiento de cada uno de los pixeles individualmente, recibiendo atributos del vertex shader. Las variables de cada pixel que se puede tratar son:
 
 - La posición en x, y, z
 - El color
 - La textura
 - La ilumincación

Ahora, son todos los elementos de la figura, no solo los vértices, los que se trataran en el fragment shader.

 ![Vertex shader](https://www.earthslab.com/wp-content/uploads/2019/03/transparent-spheres-background.png)

 
 Normalmente, los vertex shaders son utilizados para la modificación de la geometría de la figura y los framgment shader para modificar atributos como color, textura e iluminación.

 A continuación, se mostrarán los ejercicios realizados en clase de las apliaciones de los shaders.
