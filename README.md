# Model Tree and 3D View

This project is a single-page web application in TypeScript + React with a tree model component and a 3D view using ThreeJS that allows a user to input geometric primitives to create a composite model hierarchy, with nested subassemblies and bottom-level parts.

Live Demo: https://dirac-rho.vercel.app/

## Core Technology & Libraries Used 
- **React**: Frontend UI framework
- **TypeScript**: Type-safe JavaScript
- **Three.js**: 3D rendering library
- **React Three Fiber**: React renderer for Three.js
- **React DnD**: Drag and drop functionality
- **Vite**: Build tool and development server


## Features
- **Create 3D Primitives**: Add boxes, spheres, cylinders, cones, and groups to your scene
- **Hierarchical Organization**: Arrange objects in a tree structure with parent-child relationships
- **Drag & Drop**: Easily reorganize / re-order your scene hierarchy
- **Property Editing**: Modify position, rotation, scale, and color of objects
- **Direct Manipulation**: Transform objects directly in the 3D view using pivot controls
- **Collapsible Sidebar**: Toggle the sidebar to maximize your workspace
- **Visual Feedback**: Selected objects are highlighted in the 3D scene

## Installation

1. Clone the repository:

```shellscript
git clone https://github.com/mattverse/3d-scene-editor.git
cd 3d-scene-editor
```


2. Install dependencies:

```shellscript
npm install
```


3. Start the development server:

```shellscript
npm run dev
```


4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
project-root/
├── public/                      # Static assets
├── src/                         # Source code
│   ├── components/              # React components
│   │   ├── sidebar/             # Sidebar components
│   │   │   ├── EditorSidebar.tsx    # Main sidebar container with tabs and state management
│   │   │   │                        # - Handles adding new objects
│   │   │   │                        # - Manages sidebar collapse state
│   │   │   │                        # - Switches between object list and property editor
│   │   │   │
│   │   │   └── PropertyEditor.tsx   # Form for editing selected object properties
│   │   │                            # - Position, rotation, scale controls
│   │   │                            # - Color picker for objects
│   │   │                            # - Name editing
│   │   │
│   │   ├── tree/                # Tree view components for scene hierarchy
│   │   │   ├── DraggableNode.tsx    # Draggable node component for tree items
│   │   │   │                        # - Implements React DnD for drag functionality
│   │   │   │                        # - Displays node name and type
│   │   │   │                        # - Handles selection
│   │   │   │
│   │   │   ├── DropZone.tsx         # Drop target zones between and within nodes
│   │   │   │                        # - Implements React DnD for drop targets
│   │   │   │                        # - Visual indicators for valid drop locations
│   │   │   │                        # - Handles different drop types (before, after, child)
│   │   │   │
│   │   │   ├── TreeNode.tsx         # Individual node in the tree with its children
│   │   │   │                        # - Recursive component that renders child nodes
│   │   │   │                        # - Manages drop zones around the node
│   │   │   │                        # - Handles node hierarchy visualization
│   │   │   │
│   │   │   └── TreeView.tsx         # Container for the entire tree structure
│   │   │                            # - Renders root level nodes
│   │   │                            # - Manages overall tree state
│   │   │                            # - Handles root-level drops
│   │   │
│   │   ├── SceneEditor.tsx      # Main 3D scene component
│   │   └── SceneLights.tsx      # Lighting setup
│   ├── styles/                  # CSS styles
│   │   └── style.css
│   ├── types/                   # TypeScript type definitions
│   │   ├── global.d.ts
│   │   └── scene.ts
│   ├── index.html               # HTML entry point
│   └── index.tsx                # Main application entry point
│   └── App.tsx                  # React Root Component
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tsconfig.app.json            # App-specific TypeScript configuration
├── tsconfig.node.json           # Node-specific TypeScript configuration
├── vite.config.ts               # Vite configuration
└── README.md                    # Project documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Milestones

- Use Tailwind for better maintainability
- Use `IstancedMesh`(https://threejs.org/docs/#api/en/objects/InstancedMesh) to improve performance of 3d rendering. 

## 🚀 Performance Metrics

**Test Device**
- Model: MacBook Pro (M4, 2024)
- RAM: 48 GB
- GPU: Apple M4 GPU (integrated)
- OS: macOS 14.x Sonoma
- Browser: Chrome 135.0 
- Screen Resolution: 3024x1964 (default scaled)

**Performance Metrics**
- FPS: 120 (stable)
- GPU Time: 1–3 ms/frame
- CPU Time: 0.1-1.2ms/frame
ance tab
