# Escape Gaming Zone

Escape Gaming Zone is an immersive, interactive 3D gaming portfolio website built with React Three Fiber. It offers a unique scrolling experience through a dynamic 3D space environment.

## Features

- **Immersive 3D Experience:** Uses `@react-three/fiber` and `@react-three/drei` for stunning 3D rendering.
- **Scroll-driven Animations:** The camera and 3D scenes react dynamically to user scrolling.
- **Optimized Performance:** Implements chunk splitting to ensure faster initial load times by separating vendor dependencies (React, Three.js) from application code.
- **SEO Optimized:** Structured meta tags for improved discoverability.
- **Clean Code Architecture:** Uses the barrel pattern for components, leading to a maintainable and scalable codebase.

## Tech Stack

- **Framework:** React (`vite`)
- **3D Rendering:** Three.js, React Three Fiber, React Three Drei, Postprocessing
- **Styling:** Vanilla CSS
- **Icons:** Lucide React

## Project Structure

```
escape-gaming/
├── src/
│   ├── app/              # Main App entry and routing logic
│   ├── components/       # Reusable components
│   │   ├── canvas/       # 3D canvas and root scene
│   │   ├── layout/       # App layout (header, footer, shell)
│   │   ├── overlay/      # 2D overlay components (UI elements)
│   │   └── three/        # 3D components and scenes
│   ├── config/           # Application configuration
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries and functions
│   ├── styles/           # CSS stylesheets
│   └── main.jsx          # React entry point
├── public/               # Static assets (textures, models, etc.)
├── index.html            # HTML entry point
├── package.json          # Project dependencies
└── vite.config.js        # Vite configuration
```

## Setup & Installation

1. Ensure you have Node.js installed.
2. Clone the repository and navigate to the project directory:
   ```bash
   cd escape-gaming
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

To build the app for production, run:
```bash
npm run build
```
The optimized bundle will be generated in the `dist` directory.
