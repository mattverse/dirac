import type React from "react"
import type { PropertyEditorProps } from "../../types/scene"

/**
 * Property editor component for modifying 3D object properties
 * Handles position, rotation, scale, color, and name updates
 */
export function PropertyEditor({ node, onUpdateNode }: PropertyEditorProps) {
    // Early return if no node is selected
    if (!node) return null

    /**
     * Handles name changes for the selected node
     * @param e - Input change event
     */
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateNode({ ...node, name: e.target.value })
    }

    /**
     * Updates position values for specific axis
     * @param axis - 0 (X), 1 (Y), or 2 (Z)
     * @param value - New position value
     */
    const handlePositionChange = (axis: number, value: string) => {
        const newPosition = [...node.position]
        newPosition[axis] = Number.parseFloat(value) || 0 // Fallback to 0 on invalid input
        onUpdateNode({
            ...node,
            position: newPosition as [number, number, number],
        })
    }

    /**
     * Updates rotation values for specific axis (in degrees)
     * @param axis - 0 (X), 1 (Y), or 2 (Z)
     * @param value - New rotation value
     */
    const handleRotationChange = (axis: number, value: string) => {
        const newRotation = [...(node.rotation || [0, 0, 0])] // Default to [0,0,0] if undefined
        newRotation[axis] = Number.parseFloat(value) || 0
        onUpdateNode({
            ...node,
            rotation: newRotation as [number, number, number],
        })
    }

    /**
     * Updates scale values with minimum value constraint
     * @param axis - 0 (X), 1 (Y), or 2 (Z)
     * @param value - New scale value
     */
    const handleScaleChange = (axis: number, value: string) => {
        const newScale = [...node.scale]
        const parsedValue = Number.parseFloat(value) || 0.1 // Minimum fallback
        newScale[axis] = Math.max(0.1, parsedValue) // Enforce minimum scale
        onUpdateNode({ ...node, scale: newScale as [number, number, number] })
    }

    /**
     * Handles color changes with color picker input
     * @param e - Color input change event
     */
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateNode({ ...node, color: e.target.value })
    }

    return (
        <div className="property-editor">
            <h3 className="property-editor-title">Properties</h3>

            {/* Name Input Section */}
            <div className="property-group">
                <label className="property-label">Name</label>
                <input
                    type="text"
                    value={node.name}
                    onChange={handleNameChange}
                    className="form-control"
                />
            </div>

            {/* Position Controls */}
            <div className="property-group">
                <label className="property-label">Position</label>
                <div className="property-row">
                    {[0, 1, 2].map((axis) => (
                        <div key={axis} className="property-axis">
                            <span className="axis-label">
                                {["X", "Y", "Z"][axis]}
                            </span>
                            <input
                                type="number"
                                value={node.position[axis]}
                                onChange={(e) => handlePositionChange(axis, e.target.value)}
                                step="0.1"
                                className="form-control"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Rotation Controls */}
            <div className="property-group">
                <label className="property-label">Rotation</label>
                <div className="property-row">
                    {[0, 1, 2].map((axis) => (
                        <div key={axis} className="property-axis">
                            <span className="axis-label">
                                {["X", "Y", "Z"][axis]}
                            </span>
                            <input
                                type="number"
                                value={(node.rotation || [0, 0, 0])[axis]}
                                onChange={(e) => handleRotationChange(axis, e.target.value)}
                                step="0.1"
                                className="form-control"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Scale Controls */}
            <div className="property-group">
                <label className="property-label">Scale</label>
                <div className="property-row">
                    {[0, 1, 2].map((axis) => (
                        <div key={axis} className="property-axis">
                            <span className="axis-label">
                                {["X", "Y", "Z"][axis]}
                            </span>
                            <input
                                type="number"
                                value={node.scale[axis]}
                                onChange={(e) => handleScaleChange(axis, e.target.value)}
                                step="0.1"
                                min="0.1"
                                className="form-control"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Conditional Color Picker */}
            {node.type !== "group" && (
                <div className="property-group">
                    <label className="property-label">Color</label>
                    <input
                        type="color"
                        value={node.color || "#ff8800"}
                        onChange={handleColorChange}
                        className="color-picker"
                    />
                </div>
            )}

            {/* Help Text */}
            <div className="property-group">
                <p className="property-note">
                    You can also directly manipulate the object in the 3D view
                    using the pivot controls when selected.
                </p>
            </div>
        </div>
    )
}