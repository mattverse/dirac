import { DropZone } from "./DropZone"
import { DraggableNode } from "./DraggableNode"
import type { TreeNodeProps } from "../../types/scene"

/**
 * Recursive tree node component for hierarchical scene structure
 * Handles node rendering, drop zones, and hierarchy management
 */
export function TreeNode({
    node,
    nodes,
    onMoveNode,
    onSelect,
    selectedNodeId,
    level = 0,
    isLastChild = false,
    isRoot = false,
}: TreeNodeProps) {
    // Filter direct children of this node
    const children = nodes.filter((n) => n.parentId === node.id)

    /**
     * Handles drop operations from react-dnd
     * @param draggedId - ID of dragged node
     * @param targetId - ID of target node
     * @param dropType - Type of drop (before/after/child/between)
     */
    const handleDrop = (draggedId: string, targetId: string | null, dropType: string) => {
        console.log(`Dropping ${draggedId} onto ${targetId} as ${dropType}`)

        // Prevent self-drop
        if (draggedId === targetId) {
            console.log("Prevented self-drop")
            return
        }

        // Check for circular parent-child relationships
        let currentNode = nodes.find((n) => n.id === targetId)
        while (currentNode && currentNode.parentId) {
            if (currentNode.parentId === draggedId) {
                console.log("Prevented circular reference")
                return
            }
            currentNode = nodes.find((n) => n.id === currentNode?.parentId)
        }

        // Handle different drop types
        switch (dropType) {
            case "before":
            case "between":
                // Move before current node in parent's children
                onMoveNode(draggedId, node.parentId, node.index || 0)
                break
            case "after":
                // Move after current node in parent's children
                onMoveNode(draggedId, node.parentId, (node.index || 0) + 1)
                break
            case "child":
                // Move as first child of this node
                onMoveNode(draggedId, node.id, 0)
                break
            default:
                break
        }
    }

    // Find next sibling for between drop zone placement
    const nextSibling = nodes.find(
        (n) => n.parentId === node.parentId && n.index === (node.index || 0) + 1
    )

    return (
        <div className={`tree-node ${level === 0 ? "tree-node-level-0" : ""}`}>
            {/* Top drop zone for inserting before this node */}
            {!isRoot && (
                <DropZone
                    onDrop={handleDrop}
                    dropType="before"
                    nodeId={`${node.id}-before`}
                    level={level}
                />
            )}

            {/* Main node content */}
            <div className="tree-node-content">
                <DraggableNode
                    node={node}
                    onSelect={onSelect}
                    selectedNodeId={selectedNodeId}
                />
            </div>

            {/* Child drop zone (appears below node) */}
            <DropZone
                onDrop={handleDrop}
                dropType="child"
                nodeId={`${node.id}-child`}
                level={level}
            />

            {/* Recursive children rendering */}
            <div className="tree-node-children">
                {children.map((child, index) => (
                    <TreeNode
                        key={child.id}
                        node={{ ...child, index }}
                        nodes={nodes}
                        onMoveNode={onMoveNode}
                        onSelect={onSelect}
                        selectedNodeId={selectedNodeId}
                        level={level + 1}
                        isLastChild={index === children.length - 1}
                    />
                ))}
            </div>

            {/* Between drop zone (only if there's a next sibling) */}
            {nextSibling && (
                <DropZone
                    onDrop={handleDrop}
                    dropType="between"
                    nodeId={`${node.id}-between-${nextSibling.id}`}
                    level={level}
                />
            )}

            {/* Bottom drop zone for inserting after this node */}
            {!isRoot && (isLastChild || children.length === 0) && (
                <DropZone
                    onDrop={handleDrop}
                    dropType="after"
                    nodeId={`${node.id}-after`}
                    level={level}
                />
            )}
        </div>
    )
}