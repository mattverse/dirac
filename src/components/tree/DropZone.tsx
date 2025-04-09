"use client" // Next.js client component directive

import { useDrop } from "react-dnd"
import type { DropZoneProps, DragItem } from "../../types/scene"

// Constants for React DnD system
const ITEM_TYPE = "NODE"

/**
 * Drop target component for hierarchy reorganization
 * Handles different drop types (child, between)
 */
export function DropZone({ onDrop, dropType, nodeId, level = 0 }: DropZoneProps) {
    // React DnD drop hook configuration
    const [{ isOver, canDrop }, drop] = useDrop<
        DragItem,
        { dropped: boolean },
        { isOver: boolean; canDrop: boolean }
    >({
        accept: ITEM_TYPE,
        /**
         * Handles drop operations with validation
         * @param item - Dragged item data
         * @returns Drop result indication
         */
        drop: (item) => {
            // Extract base ID without potential position suffixes
            const baseNodeId = nodeId.split("-")[0]

            // Prevent self-drop scenarios
            if (item.id === baseNodeId) {
                console.log("Prevented self-drop attempt")
                return { dropped: false }
            }

            console.log(`Dropping ${item.id} onto ${baseNodeId} as ${dropType}`)
            onDrop(item.id, baseNodeId, dropType)
            return { dropped: true }
        },
        /**
         * Collects drop target state from DnD monitor
         * @param monitor - DnD state monitor
         * @returns Current drop target state
         */
        collect: (monitor) => ({
            isOver: !!monitor.isOver(), // Is item currently over?
            canDrop: !!monitor.canDrop() && // Is drop allowed?
                monitor.getItem()?.id !== nodeId.split("-")[0], // Additional self-drop check
        }),
    })

    // Visual calculations
    const indent = level * 20 // Hierarchy indentation
    const paddingLeft = dropType === "child" ? 0 : indent // Child zones use CSS indentation
    const isBetween = dropType === "between" // Special between-drop styling

    return (
        <div
            ref={drop as (instance: HTMLDivElement | null) => void}
            className={`drop-zone drop-zone-${dropType} ${isOver && canDrop ? "active" : ""}`}
            style={{
                paddingLeft: `${paddingLeft}px`, // Dynamic indentation
                height: isBetween ? "16px" : undefined, // Larger hitbox for between drops
            }}
            data-testid={`drop-zone-${dropType}-${nodeId}`} // Testing identifier
            data-level={level} // Hierarchy level data attribute
            role="dropzone" // Accessibility role
            aria-label={`${dropType} drop zone for ${nodeId}`} // Screen reader label
        />
    )
}