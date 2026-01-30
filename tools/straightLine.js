// Straight Line Tool

import { GeometryUtils } from '../utils/geometry.js';

export class StraightLineTool {
    constructor(app) {
        this.app = app;
        this.name = 'straightLine';
        this.startPoint = null;
        this.endPoint = null;
        this.isDrawing = false;
    }

    onMouseDown(pos) {
        const settings = this.app.settings;

        // Check if clicking on existing point
        const existingPoint = GeometryUtils.findNearestPoint(
            pos,
            this.app.points,
            settings.snapDistance
        );

        if (existingPoint) {
            // Start from existing point
            this.startPoint = existingPoint;
        } else {
            // Create new point
            this.startPoint = { ...pos, id: Date.now() };
            this.app.points.push(this.startPoint);
        }

        this.isDrawing = true;
        this.endPoint = { ...pos };
    }

    onMouseMove(pos) {
        if (!this.isDrawing) return;

        const settings = this.app.settings;

        // Check for snap to existing point
        const snapPoint = GeometryUtils.findNearestPoint(
            pos,
            this.app.points.filter(p => p !== this.startPoint),
            settings.snapDistance
        );

        this.endPoint = snapPoint || pos;
    }

    onMouseUp(pos) {
        if (!this.isDrawing) return;

        const settings = this.app.settings;

        // Check if ending on existing point
        const existingEndPoint = GeometryUtils.findNearestPoint(
            pos,
            this.app.points.filter(p => p !== this.startPoint),
            settings.snapDistance
        );

        let finalEndPoint;
        if (existingEndPoint) {
            finalEndPoint = existingEndPoint;
        } else {
            finalEndPoint = { ...pos, id: Date.now() };
            this.app.points.push(finalEndPoint);
        }

        // Create line
        this.app.lines.push({
            id: Date.now(),
            start: this.startPoint,
            end: finalEndPoint,
            color: settings.strokeColor,
            width: settings.strokeWidth
        });

        this.startPoint = null;
        this.endPoint = null;
        this.isDrawing = false;
    }

    onRender(renderer) {
        if (!this.isDrawing || !this.startPoint || !this.endPoint) return;

        const settings = this.app.settings;

        // Draw preview line
        renderer.drawPreview(this.startPoint, this.endPoint, {
            color: settings.strokeColor,
            width: settings.strokeWidth
        });
    }
}
