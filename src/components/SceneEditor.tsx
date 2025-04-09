"use client" // Enables client-side execution for Next.js

// Core React and Three.js imports
import { useRef, useEffect, useState } from "react"
import { OrbitControls, GizmoHelper, GizmoViewport, PivotControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { SceneLights } from "./SceneLights.tsx"
import { Selection, Select, EffectComposer, Outline, ToneMapping } from "@react-three/postprocessing"
import { ToneMappingMode } from "postprocessing"
import * as THREE from "three"

// Type safety imports
import type { SceneEditorProps } from "../types/scene"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import type { ThreeEvent } from "@react-three/fiber"

export function SceneEditor({ nodes, selectedNodeId, setSelectedNodeId, setNodes }: SceneEditorProps) {
    // Ref for camera controls with proper typing
    const controlsRef = useRef<OrbitControlsImpl>(null!)

    // Three.js hooks
    const { camera } = useThree()

    // Stores references to all scene objects
    const objectRefs = useRef<{ [key: string]: THREE.Object3D | null }>({})

    // State to force pivot controls refresh
    const [pivotControlsKey, setPivotControlsKey] = useState<number>(0)

    // Camera initialization - sets initial view target
    useEffect(() => {
        camera.lookAt(0, 0, 0) // Focus camera on scene origin
    }, [camera])

    // Refresh pivot controls when selection changes
    useEffect(() => {
        if (selectedNodeId) {
            // Increment key to force component remount
            setPivotControlsKey((prev) => prev + 1)
        }
    }, [selectedNodeId])

    // Node click handler with proper event typing
    const handleNodeClick = (e: ThreeEvent<MouseEvent>, nodeId: string) => {
        e.stopPropagation() // Prevent parent element triggers
        setSelectedNodeId(nodeId) // Update selected node state
    }

    // Background click handler for deselection
    const handleBackgroundClick = () => {
        setSelectedNodeId(null) // Clear current selection
    }

    // Transforms matrix updates to component state
    const updateNodeTransform = (nodeId: string, matrix: THREE.Matrix4) => {
        // Temporary vectors for matrix decomposition
        const position = new THREE.Vector3()
        const quaternion = new THREE.Quaternion()
        const scale = new THREE.Vector3()

        // Extract transform components from matrix
        matrix.decompose(position, quaternion, scale)

        // Convert quaternion to Euler angles (XYZ order)
        const euler = new THREE.Euler().setFromQuaternion(quaternion)

        // Update state with new transform values
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === nodeId ? {
                    ...node,
                    position: [position.x, position.y, position.z],
                    rotation: [euler.x, euler.y, euler.z],
                    scale: [scale.x, scale.y, scale.z]
                } : node
            )
        )
    }

    // Constructs matrix from transform components
    const createMatrix = (
        position: [number, number, number],
        rotation: [number, number, number] = [0, 0, 0],
        scale: [number, number, number],
    ) => {
        return new THREE.Matrix4().compose(
            new THREE.Vector3(...position), // Position vector
            new THREE.Quaternion().setFromEuler( // Rotation quaternion
                new THREE.Euler(...rotation)),
            new THREE.Vector3(...scale) // Scale vector
        )
    }

    // Ensures all nodes have rotation property
    useEffect(() => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.rotation ? node : { ...node, rotation: [0, 0, 0] }
            )
        )
    }, [setNodes]) // Runs when setNodes function changes

    // Renders all nodes with absolute positioning (flat hierarchy)
    const renderAllNodes = () => {
        // Exclude root node from visual representation
        const renderableNodes = nodes.filter((node) => node.id !== "root")

        return renderableNodes.map((node) => {
            const isSelected = node.id === selectedNodeId
            const rotation = node.rotation || [0, 0, 0] // Fallback rotation

            // Group Node Handling
            if (node.type === "group") {
                return (
                    <group key={node.id}>
                        {/* Selection Wrapper */}
                        <Select enabled={isSelected}>
                            {/* Empty group for selection handling */}
                            <group
                                ref={(el) => {
                                    if (el) objectRefs.current[node.id] = el
                                }}
                                position={node.position}
                                rotation={rotation}
                                scale={node.scale}
                                onClick={(e) => handleNodeClick(e, node.id)}
                            />
                        </Select>

                        {/* Transformation Controls */}
                        {isSelected && (
                            <PivotControls
                                key={`pivot-${node.id}-${pivotControlsKey}`} // Force remount
                                scale={75} // Visual size
                                depthTest={false} // Always visible
                                fixed // Screen-space fixed size
                                lineWidth={2} // Control line thickness
                                axisColors={["#ff2060", "#20df80", "#2080ff"]} // XYZ colors
                                hoveredColor="#ffff40" // Hover state
                                matrix={createMatrix(node.position, rotation, node.scale)}
                                onDrag={(matrix) => {
                                    updateNodeTransform(node.id, matrix)
                                }}
                            />
                        )}
                    </group>
                )
            } else {
                // Primitive Geometry Handling
                let geometry
                switch (node.type) {
                    case "box":
                        geometry = <boxGeometry /> // Unit cube
                        break
                    case "sphere":
                        geometry = <sphereGeometry /> // Unit sphere
                        break
                    case "cylinder":
                        geometry = <cylinderGeometry args={[1, 1, 1]} /> // RadiusTop, RadiusBottom, Height
                        break
                    case "cone":
                        geometry = <coneGeometry args={[1, 2]} /> // Radius, Height
                        break
                    default:
                        return null // Skip invalid types
                }

                return (
                    <group key={node.id}>
                        {/* Selectable Mesh */}
                        <Select enabled={isSelected}>
                            <mesh
                                ref={(el) => {
                                    if (el) objectRefs.current[node.id] = el
                                }}
                                position={node.position}
                                rotation={rotation}
                                scale={node.scale}
                                castShadow // Enable shadow casting
                                onClick={(e) => handleNodeClick(e, node.id)}
                            >
                                {geometry}
                                {/* Material with default color */}
                                <meshStandardMaterial
                                    color={node.color ? new THREE.Color(node.color) : "orange"}
                                    transparent={true}
                                    opacity={0.8}
                                />
                            </mesh>
                        </Select>

                        {/* Transformation Gizmo */}
                        {isSelected && (
                            <PivotControls
                                key={`pivot-${node.id}-${pivotControlsKey}`}
                                scale={75}
                                depthTest={false}
                                fixed
                                lineWidth={2}
                                axisColors={["#ff2060", "#20df80", "#2080ff"]}
                                hoveredColor="#ffff40"
                                matrix={createMatrix(node.position, rotation, node.scale)}
                                onDrag={(matrix) => {
                                    updateNodeTransform(node.id, matrix)
                                }}
                            />
                        )}
                    </group>
                )
            }
        })
    }

    // Main Component Return
    return (
        <>
            {/* Camera Controls */}
            <OrbitControls ref={controlsRef} makeDefault />

            {/* Lighting Configuration */}
            <SceneLights />

            {/* Selection & Post-processing */}
            <Selection>
                <EffectComposer
                    enableNormalPass={false} // Disable normal buffer
                    multisampling={8} // Anti-aliasing quality
                    autoClear={false} // Manual buffer management
                >
                    {/* Color Grading */}
                    <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />

                    {/* Selection Outline Effect */}
                    <Outline
                        blur={true} // Enable outline blur
                        visibleEdgeColor={0xffffff} // Selected color
                        edgeStrength={100} // Outline intensity
                        width={1000} // Coverage
                        hiddenEdgeColor={0xffffff} // Deselected color
                    />
                </EffectComposer>

                {/* Clickable Scene Background */}
                <group onClick={handleBackgroundClick}>
                    {renderAllNodes()}
                </group>
            </Selection>

            {/* Grid Visualization */}
            <gridHelper
                args={[20, 20, "#aaaaaa", "#555555"]} // Size, Divisions, Center, Edge
                position={[0, -0.001, 0]} // Z-fighting prevention
                renderOrder={-1} // Early rendering
                onClick={handleBackgroundClick}
            />

            {/* Coordinate System Helper */}
            <axesHelper args={[5]} renderOrder={1} />

            {/* Viewport Orientation Widget */}
            <GizmoHelper
                alignment="bottom-right" // Screen position
                margin={[80, 80]} // Pixel offsets
                renderPriority={2} // Render order
            >
                <GizmoViewport
                    labelColor="white"
                    axisHeadScale={1} // Arrow size
                />
            </GizmoHelper>
        </>
    )
}