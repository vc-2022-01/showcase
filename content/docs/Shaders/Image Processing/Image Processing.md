## Que es el Image Processing 

El image Processing es el uso de computadores para procesar imagenes digitales mediante algun algoritmo, en este se permiten un aplio rango de algoritmos para ser aplicados sobre la entrada, ademas puede evitar problemas como el ruido y las distorciones.

En este caso se usan matrices de convolucion o mascaras, se les tiende a llamar matrices de convolucion por el proceso que tienen para empezar se crea una matriz de n*m
{{< katex display >}}  \begin{vmatrix} 0 & 0 & 0\\ 0 & 1 & 0\\ 0 & 0 & 0 \end{vmatrix}\ {{< /katex >}} 
en este caso de 3x3 esta matriz recorrera la matriz original de la imagen y genera una nueva imagen, en este caso al ser la matriz identidad la imagen generada es la misma, estas imagenes tienden a destacar atributos de la imagen por ejemplo 
{{< katex display >}}  \begin{vmatrix} -1 & -1 & -1\\ -1 & 8 & -1\\-1 & -1 & -1 \end{vmatrix}{{< /katex >}} 
esta matris se usa para identificar los cambios de relieve de una 
imagen

## Image processing Tool

en esta herramienta se implementaron diferentes matrices de convolucion para poder procesar una imagen y se genero un foco para poder ver donde se aplica 

{{< p5-iframe sketch="/showcase/sketches/shadersImage.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="675" height="525" >}}

## Video processing Tool

Gracias al mismo principio se puede usar en videos ya que estos son una serie de imagenes solo se debe aplicar la mascara a cada frame 

{{< p5-iframe sketch="/showcase/sketches/shadersVideo.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="675" height="525" >}}