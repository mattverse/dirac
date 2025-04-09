import { useDrag } from "react-dnd"
import type { DraggableNodeProps, DragItem } from "../../types/scene"

// Constants for React DnD 
const ITEM_TYPE = "NODE"

/**
 * Draggable tree node component for scene hierarchy
 * Handles drag-and-drop functionality and selection state
 */
export function DraggableNode({ node, onSelect, selectedNodeId }: DraggableNodeProps) {
    // React DnD drag hook configuration
    const [{ isDragging }, drag, preview] = useDrag<DragItem, unknown, { isDragging: boolean }>({
        type: ITEM_TYPE,
        // Data payload for drag operations
        item: () => ({
            id: node.id,
            parentId: node.parentId,
            type: ITEM_TYPE,
        }),
        // Collect drag state from monitor
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    })

    // Selection state management
    const isSelected = selectedNodeId === node.id

    return (
        <div
            ref={preview as (instance: HTMLDivElement | null) => void}
            className={`draggable-node ${isDragging ? "dragging" : ""} ${isSelected ? "selected" : ""}`}
            onClick={(e) => {
                e.stopPropagation() // Prevent parent node selection
                onSelect(node.id)
            }}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            {/* Main node content */}
            <div style={{ display: "flex", alignItems: "center" }}>
                {/* Drag handle with icon */}
                <div
                    ref={drag as (instance: HTMLDivElement | null) => void}
                    className="drag-handle"
                    role="button"
                    aria-label="Drag handle"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M8 6H16M8 12H16M8 18H16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                {/* Node name display */}
                <span className="node-name">{node.name}</span>
            </div>

            {/* Node type badge */}
            <span className="node-type">{node.type}</span>
        </div>
    )
}