# 🎬 Moviefy - Explora Películas y Series

![Moviefy](https://img.shields.io/badge/React-18.2.0-blue.svg?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF.svg?style=flat&logo=vite)
![TMDB API](https://img.shields.io/badge/TMDB_API-Enabled-green.svg)

Moviefy es una aplicación web moderna y premium para explorar películas y series. Construida con React y Vite, utiliza la API de The Movie Database (TMDB) para ofrecer resultados en tiempo real, tendencias y un buscador optimizado.

## ✨ Características Principales

- **Diseño Glassmorphism Premium**: Una paleta de colores oscura y atractiva (Dark Theme) con desenfoques fluidos e interfaces refinadas.
- **Buscador en Tiempo Real**: Un buscador integrado y reactivo para películas y series, ordenando resultados por popularidad y relevancia.
- **Hero Banner Interactivo**: Visualización destacada en la página principal con el tráiler o película tendencia del día.
- **Scroll Infinito Independiente**: Navegación tipo "infinite scroll" gestionada de forma eficiente por pestañas (Películas / Series) usando `IntersectionObserver`.
- **Gestión de Favoritos**: Guarda tus películas o series preferidas pulsando en el botón del corazón. Estas se guardan directamente en el navegador (`localStorage`) para persistencia de datos.
- **Totalmente Responsive**: Diseño adaptable listo para verse increíble en móviles, tablets y monitores gigantes.

## 🚀 Instalación y Desarrollo Local

Sigue estos pasos para arrancar el proyecto en tu máquina (Windows/Mac/Linux):

1. **Instalar dependencias**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Configurar las variables de entorno**:
   - Crea un archivo \`.env\` en la raíz del proyecto.
   - Añade tu clave de la API de TMDB:
     \`\`\`env
     VITE_TMDB_API_KEY=TU_API_KEY_AQUI
     \`\`\`

3. **Arrancar el servidor de desarrollo**:
   \`\`\`bash
   npm run dev
   \`\`\`
   Abre [http://localhost:5173](http://localhost:5173) para ver la aplicación.

## 🌍 Cómo Desplegar a Producción (Vercel)

Vercel es la plataforma ideal y más fácil para proyectos de Vite + React. Sigue estos pasos:

1. Asegúrate de tener una cuenta en [Vercel](https://vercel.com).
2. Tienes dos opciones principales:

   **Opción A: Vercel CLI (Super Rápido)**
   - Instala Vercel de forma global en tu consola: \`npm i -g vercel\`
   - Ejecuta \`vercel\` en la carpeta de este proyecto y sigue las instrucciones.
   - ¡NO olvides ir al panel de Vercel e insertar tu Variable de Entorno (\`VITE_TMDB_API_KEY\`) para ese proyecto!

   **Opción B: GitHub + Vercel (Recomendado)**
   - Sube este proyecto a un repositorio en tu perfil de **GitHub**.
   - Entra en vercel.com, pulsa **"Add New..."** 👉 **"Project"** y selecciona este repositorio de GitHub.
   - En la sección **Environment Variables** antes de pulsar "Deploy", debes configurar tu clave de TMDB de la siguiente manera:
     - Name: \`VITE_TMDB_API_KEY\`
     - Value: \`TU_CLAVE_DE_TMDB_AQUÍ\`
   - Dale al botón azul **Deploy**. Vercel detectará que es Vite y construirá y publicará la web completa.

## 🛠 Comandos Útiles

- \`npm run dev\`: Arranca el servidor local.
- \`npm run build\`: Compila la app para producción. Los archivos generados acabarán en la carpeta \`/dist/\`.
- \`npm run lint\`: Analiza el estilo del código para encontrar errores.

## 👨‍💻 Autor

Creado y diseñado con mucho entusiasmo ✨.