"use client"
import { DropZone } from "./DropZone"
import { TreeNode } from "./TreeNode"
import type { TreeViewProps } from "../../types/scene"

export function TreeView({ nodes, onMoveNode, onSelect, selectedNodeId }: TreeViewProps) {
    const rootNodes = nodes.filter((n) => n.parentId === null)

    // Handle drop at the root level
    const handleRootDrop = (draggedId: string, _: string | null, dropType: string) => {
        if (dropType === "before" || dropType === "between") {
            onMoveNode(draggedId, null, 0)
        } else {
            onMoveNode(draggedId, null, rootNodes.length)
        }
    }

    return (
        <div className="tree-container">
            {/* Single top drop zone for the root level */}
            <DropZone onDrop={handleRootDrop} dropType="before" nodeId="root-top-before" level={0} />

            {rootNodes.map((node, index) => (
                <TreeNode
                    key={node.id}
                    node={{ ...node, index }}
                    nodes={nodes}
                    onMoveNode={onMoveNode}
                    onSelect={onSelect}
                    selectedNodeId={selectedNodeId}
                    level={0}
                    isLastChild={index === rootNodes.length - 1}
                    isRoot={true} // Pass a flag to indicate this is a root node
                />
            ))}

            {/* Single bottom drop zone for the root level */}
            <DropZone onDrop={handleRootDrop} dropType="after" nodeId="root-bottom-after" level={0} />
        </div>
    )
}

