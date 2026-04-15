# 🏛️ Instituto Tecnológico de Pachuca

<p align="center">
  <img src="https://img.shields.io/badge/CARRERA-Ingeniería%20en%20Sistemas%20Computacionales-004d40?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MATERIA-Graficación-orange?style=for-the-badge" />
</p>

---

### 🎮 Examen de Unidades III y IV: Videojuego 2D con Canvas

| 👤 Información de la Evaluación | 📋 Detalle |
| :--- | :--- |
| **Autor** | `Ramirez Vera David Adolfo` |
| **No. de Control** | `23200883` |
| **Profesor** | M.T.I. Luis Alejandro Santana Valadez |
| **Fecha** | 15 de abril de 2026 |
| **Semestre** | Enero - Junio 2026 |

---

### 🌍 Contexto
<div align="justify">
El presente proyecto se desarrolla como evaluación práctica de las Unidades III y IV de la asignatura de Graficación. Consiste en la programación desde cero de un entorno interactivo en dos dimensiones renderizado directamente en el navegador, aplicando la API Canvas nativa de HTML5 sin el uso de motores gráficos externos.
</div>

### 🎯 Objetivo
<div align="justify">
Desarrollar un videojuego 2D aplicando la API Canvas que mantenga en pantalla exactamente 25 objetos simultáneos desplazándose aleatoriamente en 4 direcciones distintas (arriba, abajo, diagonal y circular). El sistema debe gestionar eventos de ratón para la eliminación de entidades, resolver físicas de colisión elástica con animaciones de rebote, e implementar un control de versiones mediante Git publicado en GitHub Pages.
</div>

### 💡 Justificación
<div align="justify">
La creación de este videojuego mediante Vanilla JavaScript y la API Canvas permite consolidar los fundamentos de la graficación por computadora de bajo nivel. Al programar matemáticamente el motor de físicas (teorema de Pitágoras para detección de colisiones circulares), el Game Loop (requestAnimationFrame) y la gestión de estado de los objetos, se adquiere una comprensión profunda de cómo operan internamente los motores gráficos modernos. Adicionalmente, el uso de Bootstrap en línea asegura una interfaz de usuario responsiva y profesional.
</div>

### ⚙️ Operación del Videojuego (Reglas y Jugabilidad)
<div align="justify">
El juego operado bajo el título "Downloading HPLang: Caza-Peluches" consiste en un desafío contrarreloj de 60 segundos donde el usuario debe atrapar personajes en pantalla.
</div>

* **Interacción Principal:** Al hacer clic izquierdo sobre un objeto, este se elimina, suma puntos al marcador y reaparece aleatoriamente en los bordes para mantener siempre 25 elementos activos.
* **Habilidad Especial:** El clic derecho despliega una "red expansiva" que atrapa múltiples objetos en un radio determinado. Posee un tiempo de recarga de 5 segundos.
* **Progresión (Niveles):** Cada 20 puntos obtenidos, el jugador avanza de nivel. Esto suma +15 segundos al temporizador, cambia dinámicamente la imagen de fondo y aumenta gradualmente la velocidad de los objetos.
* **Power-Ups (Objetos Especiales):**
  * **Bolita RGB:** Objeto raro que, al ser clickeado, libera una ráfaga de 8 proyectiles automáticos en todas direcciones (metralla) que eliminan a los enemigos que tocan.
  * **Bolita Gris:** Objeto muy raro que ralentiza drásticamente el tiempo y la velocidad de todos los objetos en pantalla durante 5 segundos.
* **Físicas:** Los objetos colisionan entre sí aplicando rebotes elásticos y emitiendo partículas de choque.

### 📌 Conclusiones
<div align="justify">
El desarrollo del proyecto demostró con éxito la viabilidad de crear simulaciones gráficas interactivas y escalables nativas en la web. Se superaron retos técnicos importantes, tales como la persistencia de audio continuo (.wav) sorteando las políticas de autoplay de los navegadores, y la optimización del rendimiento al gestionar decenas de partículas y objetos con imágenes redibujándose a 60 FPS (Frames Per Second). El uso de un entorno estructurado y el despliegue mediante repositorios garantiza el control y mantenimiento del código.
</div>

---

### 🔗 Enlaces del Proyecto

* 🌐 **Despliegue (GitHub Pages):** `https://tokisakidk.github.io/graf-Juego/
* 📁 **Repositorio (Código Fuente):** `https://github.com/TokisakiDK/graf-Juego.git

---

### 🛠️ Herramientas Utilizadas

* ![Canvas API](https://img.shields.io/badge/HTML5_Canvas-E34F26?style=flat-square&logo=html5&logoColor=white) **Canvas API** - Motor de renderizado 2D nativo para el dibujado de imágenes, textos y formas geométricas en cada *frame*.
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) **JavaScript (ES6+)** - Lógica orientada a objetos (clases) para el comportamiento de enemigos, temporizador, partículas y *Game Loop*.
* ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=flat-square&logo=bootstrap&logoColor=white) **Bootstrap 5** - Framework CSS cargado mediante CDN para el maquetado estructurado del Header, Main y Footer.
* ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) **Git & GitHub** - Control de versiones local y alojamiento en la nube para integración y despliegue continuo (Pages).
* ![VSC](https://img.shields.io/badge/IDE-VS_Code-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white) **VS Code** - Entorno de desarrollo integrado utilizado para la escritura del código.

---
<p align="center">
  <sub>ITP - Ingeniería en Sistemas Computacionales 2026</sub>
</p>
