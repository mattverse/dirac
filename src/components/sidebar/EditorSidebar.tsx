import type React from "react"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid" // For generating unique IDs
import { TreeView } from "../tree/TreeView.tsx"
import { PropertyEditor } from "./PropertyEditor.tsx"
import type { SidebarProps, SceneNode } from "../../types/scene"

/**
 * Moves a node within the scene hierarchy
 * @param nodes - Array of all scene nodes
 * @param draggedId - ID of the node being moved
 * @param newParentId - ID of the new parent node (null for root)
 * @param newIndex - Position index in the new parent's children
 * @returns Updated array of nodes
 */
function moveNode(
    nodes: SceneNode[],
    draggedId: string,
    newParentId: string | null,
    newIndex: number
): SceneNode[] {
    console.log(`Moving ${draggedId} to parent ${newParentId} at index ${newIndex}`)

    // Find the node being dragged
    const draggedNode = nodes.find((n) => n.id === draggedId)
    if (!draggedNode) {
        console.error("Dragged node not found:", draggedId)
        return nodes
    }

    // Create new array without the dragged node
    const newNodes = nodes.filter((n) => n.id !== draggedId)

    // Update the dragged node's parent reference
    const updatedNode = { ...draggedNode, parentId: newParentId }

    return [...newNodes, updatedNode]
}

/**
 * Main sidebar component for the 3D scene editor
 * Handles object creation, hierarchy management, and property editing
 */
export function EditorSidebar({
    nodes,
    setNodes,
    selectedNodeId,
    setSelectedNodeId,
}: SidebarProps) {
    // State for new object creation form
    const [newName, setNewName] = useState<string>("")
    const [newType, setNewType] = useState<"box" | "sphere" | "cylinder" | "cone" | "group">("box")

    // State for sidebar collapse/expand
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)

    // Counter for grid-based object positioning
    const [objectCount, setObjectCount] = useState<number>(0)

    /**
     * Handles creation of new 3D primitive objects
     * @param e - Form submit event
     */
    const handleAddPrimitive = (e: React.FormEvent) => {
        e.preventDefault()

        // Calculate grid position based on object count
        const row = Math.floor(objectCount / 3)
        const col = objectCount % 3

        // Create new scene node with default values
        const newNode: SceneNode = {
            id: uuidv4(),
            name: newName || `${newType} ${nodes.length}`, // Default name if not provided
            type: newType,
            parentId: "root",
            position: [col * 2 - 2, 0, row * 2 - 2], // 3x3 grid centered at origin
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: "#ff8800", // Default orange color
        }

        // Update state with new node
        setNodes([...nodes, newNode])
        setNewName("")
        setObjectCount(objectCount + 1)
        setSelectedNodeId(newNode.id) // Auto-select new node
    }

    /**
     * Handles node movement in the hierarchy
     * @param draggedId - ID of moved node
     * @param newParentId - New parent ID
     * @param newIndex - Position in new parent's children
     */
    const handleMoveNode = (
        draggedId: string,
        newParentId: string | null,
        newIndex: number
    ) => {
        // Prevent invalid parent assignment
        if (draggedId === newParentId) {
            console.log("Prevented moving node to itself")
            return
        }

        setNodes((prevNodes) => moveNode(prevNodes, draggedId, newParentId, newIndex))
    }

    /**
     * Updates node properties when changed in PropertyEditor
     * @param updatedNode - Modified node object
     */
    const handleUpdateNode = (updatedNode: SceneNode) => {
        setNodes(nodes.map((node) =>
            node.id === updatedNode.id ? updatedNode : node
        ))
    }

    /** Toggles sidebar collapse/expand state */
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    // Find currently selected node for property editing
    const selectedNode = nodes.find((node) => node.id === selectedNodeId)

    return (
        <div className={`sidebar ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
            {/* Collapse/expand toggle button */}
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <path
                        d="M6.5 1L1.5 6L6.5 11"
                        stroke="#666"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <div className="sidebar-content">
                {/* Panel header section */}
                <div className="panel-header">
                    <h2 className="panel-title">3D Scene Editor</h2>
                    <p className="panel-subtitle">Add and organize 3D objects in your scene</p>
                </div>

                {/* Tab navigation */}
                <div className="tabs">
                    <button
                        className={`tab-button ${!selectedNode ? "active" : ""}`}
                        onClick={() => setSelectedNodeId(null)}
                    >
                        Add Objects
                    </button>
                    <button
                        className={`tab-button ${selectedNode ? "active" : ""}`}
                        disabled={!selectedNode}
                    >
                        Properties
                    </button>
                </div>

                {/* Conditional content based on selection state */}
                {!selectedNode ? (
                    // Add Objects tab content
                    <>
                        <form onSubmit={handleAddPrimitive}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="form-control"
                                />
                                <select
                                    value={newType}
                                    onChange={(e) =>
                                        setNewType(e.target.value as "box" | "sphere" | "cylinder" | "cone" | "group")
                                    }
                                    className="form-control"
                                >
                                    <option value="box">Box</option>
                                    <option value="sphere">Sphere</option>
                                    <option value="cylinder">Cylinder</option>
                                    <option value="cone">Cone</option>
                                    <option value="group">Group</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                                Add Object
                            </button>
                        </form>

                        {/* Scene hierarchy tree view */}
                        <TreeView
                            nodes={nodes}
                            onMoveNode={handleMoveNode}
                            onSelect={setSelectedNodeId}
                            selectedNodeId={selectedNodeId}
                        />
                    </>
                ) : (
                    // Properties tab content
                    <PropertyEditor node={selectedNode} onUpdateNode={handleUpdateNode} />
                )}
            </div>
        </div>
    )
}