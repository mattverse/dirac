"use client"

import { useState } from "react"
import "./styles/style.css"
import { Canvas } from "@react-three/fiber"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { SceneEditor } from "./components/SceneEditor"
import { EditorSidebar } from "./components/sidebar/EditorSidebar"
import type { SceneNode } from "./types/scene"

export function App() {
    const [nodes, setNodes] = useState<SceneNode[]>([
        {
            id: "root",
            name: "Root",
            type: "group",
            parentId: null,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
        },
    ])

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

    return (
        <DndProvider backend={HTML5Backend}>
            <EditorSidebar
                nodes={nodes}
                setNodes={setNodes}
                selectedNodeId={selectedNodeId}
                setSelectedNodeId={setSelectedNodeId}
            />
            <Canvas
                shadows
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 200,
                    position: [5, 5, 5],
                }}
                gl={{ antialias: true }}
            >
                <color attach="background" args={["#000000"]} />
                <SceneEditor
                    nodes={nodes}
                    setNodes={setNodes}
                    selectedNodeId={selectedNodeId}
                    setSelectedNodeId={setSelectedNodeId}
                />
            </Canvas>
        </DndProvider>
    )
}

