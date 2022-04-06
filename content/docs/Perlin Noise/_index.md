---
bookCollapseSection: true
---

# Ruido de Perlin

El ruido de perlin es una función utilizada en la computación gráfica para crear texturas primitivas. Este fue desarrollado por Ken Perlin en 1983, cuando publicó un artículo llamado [An Image Synthesizer](http://www.cs.cmu.edu/afs/cs.cmu.edu/academic/class/15869-f11/www/readings/perlin85_imagesynthesizer.pdf). 

## ¿Qué es ruido?

El ruido es una función pseudo-aleatoria a partir de la cual se pueden generar texturas. Esta se puede representar como una rejilla como la mostrada a continuación:

![1](https://upload.wikimedia.org/wikipedia/commons/0/09/PerlinNoiseGradientGrid.png)

En donde cada vértice tiene asociado un vector gradiente pseudo aleatorio.

![2](https://upload.wikimedia.org/wikipedia/commons/2/24/PerlinNoiseDotProducts.png)

Así, el valor del ruido Perlin en el punto se calcula como un producto punto entre el punto entre los vectores de gradiente en los vértices de la grilla y los vectores desde el punto dado a estos vértices. 

Para finalizar, de interpola el resultado con una función. Generalmente se utiliza este polinomio cúbico:

<div style="text-align: center;">
3x^2 -2x^3
</div>


### Características

Entre sus características están:

* Pseudo-aleatoria
* Invariante estadísticamente bajo la rotación y translación
* Tiene un filtro pasa bandas en su frecuencia

Esto permite crear superficies a diferentes escalas, y sin perder el control del efecto al rotar y trasladar.

## Naturalidad

El objetivo de Perlin con el diseño del algoritmo era la generación de gráficos que fueran más *naturales*, es decir, que emulen movimientos y texturas de la naruraleza, obteniendo texturas "realistas". Esto lo hace al crear secuencias naturalmente ordenadas y suaves de números pseudoaleatorios. 

Es por esta razón que el ruido de Perlin se ha utilizado para crear representaciones convincentes de nubes, fuego, agua, estrellas, tierra, entre otros.


# Referencias

Michot-Roberto, S., Garcia-Hernández, A., Dopazo-Hilario, S., & Dawson, A. (2021). The spherical primitive and perlin noise method to recreate realistic aggregate shapes. *Granular Matter*, 23(2), 1-11.

Perlin, K. (1985). An image synthesizer. *ACM Siggraph Computer Graphics*, 19(3), 287-296.

Tatarinov, A. (2008). Perlin noise in real-time computer graphics. In *GraphiCon* (pp. 177-183).

En.wikipedia.org. 2022. Perlin noise - Wikipedia. \[online\] Available at: <https://en.wikipedia.org/wiki/Perlin_noise> [Accessed 5 April 2022].






