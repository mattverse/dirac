import type React from "react"
import type { ReactNode } from "react"
import type * as THREE from "three"
import type { ThreeElements } from "@react-three/fiber"

export type NodeType = "box" | "sphere" | "cylinder" | "cone" | "group"

export interface SceneNode {
    id: string
    name: string
    type: NodeType
    parentId: string | null
    position: [number, number, number]
    rotation: [number, number, number]
    scale: [number, number, number]
    color?: string
    index?: number
}

export interface TreeNodeProps {
    node: SceneNode
    nodes: SceneNode[]
    onMoveNode: (draggedId: string, newParentId: string | null, newIndex: number) => void
    onSelect: (nodeId: string | null) => void
    selectedNodeId: string | null
    level?: number
    isLastChild?: boolean
    isRoot?: boolean
}

export interface TreeViewProps {
    nodes: SceneNode[]
    onMoveNode: (draggedId: string, newParentId: string | null, newIndex: number) => void
    onSelect: (nodeId: string | null) => void
    selectedNodeId: string | null
}

export interface DropZoneProps {
    onDrop: (draggedId: string, targetId: string | null, dropType: string) => void
    dropType: "before" | "after" | "between" | "child"
    nodeId: string
    level?: number
}

export interface DraggableNodeProps {
    node: SceneNode
    onSelect: (nodeId: string) => void
    selectedNodeId: string | null
}

export interface PropertyEditorProps {
    node: SceneNode
    onUpdateNode: (updatedNode: SceneNode) => void
}

export interface SidebarProps {
    nodes: SceneNode[]
    setNodes: React.Dispatch<React.SetStateAction<SceneNode[]>>
    selectedNodeId: string | null
    setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>
}

export interface SceneEditorProps {
    nodes: SceneNode[]
    selectedNodeId: string | null
    setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>
    setNodes: React.Dispatch<React.SetStateAction<SceneNode[]>>
}

// Define a type for the drag item
export interface DragItem {
    id: string
    parentId: string | null
    type: string
}

// Custom mesh types for different geometries
export type BoxMeshProps = ThreeElements["mesh"] & {
    color?: THREE.Color | string
}

export type SphereMeshProps = ThreeElements["mesh"] & {
    color?: THREE.Color | string
}

export type CylinderMeshProps = ThreeElements["mesh"] & {
    color?: THREE.Color | string
}

export type ConeMeshProps = ThreeElements["mesh"] & {
    color?: THREE.Color | string
}

export type GroupProps = ThreeElements["group"] & {
    children?: ReactNode
}

