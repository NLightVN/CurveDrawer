// Shape Tools (Circle, Rectangle, Triangle, Star)

import { GeometryUtils } from '../utils/geometry.js';

export class CircleTool {
    constructor(app) {
        this.app = app;
        this.name = 'circle';
        this.center = null;
        this.radius = 0;
        this.isDrawing = false;
    }

    onMouseDown(pos) {
        this.center = { ...pos };
        this.radius = 0;
        this.isDrawing = true;
    }

    onMouseMove(pos) {
        if (!this.isDrawing) return;
        this.radius = GeometryUtils.distance(this.center, pos);
    }

    onMouseUp(pos) {
        if (!this.isDrawing) return;

        this.radius = GeometryUtils.distance(this.center, pos);

        if (this.radius > 5) {
            const points = GeometryUtils.getCirclePoints(this.center, this.radius);
            this.app.shapes.push({
                id: Date.now(),
                type: 'circle',
                points,
                center: this.center,
                radius: this.radius,
                color: this.app.settings.strokeColor,
                width: this.app.settings.strokeWidth
            });
        }

        this.center = null;
        this.radius = 0;
        this.isDrawing = false;
    }

    onRender(renderer) {
        if (!this.isDrawing || this.radius === 0) return;

        const points = GeometryUtils.getCirclePoints(this.center, this.radius);
        renderer.drawShape(points, {
            color: this.app.settings.strokeColor,
            width: this.app.settings.strokeWidth,
            fill: true
        });
    }
}

export class RectangleTool {
    constructor(app) {
        this.app = app;
        this.name = 'rectangle';
        this.start = null;
        this.end = null;
        this.isDrawing = false;
    }

    onMouseDown(pos) {
        this.start = { ...pos };
        this.end = { ...pos };
        this.isDrawing = true;
    }

    onMouseMove(pos) {
        if (!this.isDrawing) return;
        this.end = { ...pos };
    }

    onMouseUp(pos) {
        if (!this.isDrawing) return;

        this.end = { ...pos };

        const points = GeometryUtils.getRectanglePoints(this.start, this.end);
        this.app.shapes.push({
            id: Date.now(),
            type: 'rectangle',
            points,
            color: this.app.settings.strokeColor,
            width: this.app.settings.strokeWidth
        });

        this.start = null;
        this.end = null;
        this.isDrawing = false;
    }

    onRender(renderer) {
        if (!this.isDrawing) return;

        const points = GeometryUtils.getRectanglePoints(this.start, this.end);
        renderer.drawShape(points, {
            color: this.app.settings.strokeColor,
            width: this.app.settings.strokeWidth,
            fill: true
        });
    }
}

export class TriangleTool {
    constructor(app) {
        this.app = app;
        this.name = 'triangle';
        this.points = [];
        this.currentPos = null;
    }

    onMouseDown(pos) {
        this.points.push({ ...pos });

        if (this.points.length === 3) {
            const trianglePoints = GeometryUtils.getTrianglePoints(...this.points);
            this.app.shapes.push({
                id: Date.now(),
                type: 'triangle',
                points: trianglePoints,
                color: this.app.settings.strokeColor,
                width: this.app.settings.strokeWidth
            });

            this.points = [];
            this.currentPos = null;
        }
    }

    onMouseMove(pos) {
        this.currentPos = { ...pos };
    }

    onMouseUp(pos) {
        // Triangle uses click, not drag
    }

    onRender(renderer) {
        const settings = this.app.settings;

        // Draw existing points
        for (const point of this.points) {
            renderer.drawPoint(point, {
                size: settings.pointSize,
                color: settings.strokeColor,
                state: 'active'
            });
        }

        // Draw preview
        if (this.points.length > 0 && this.currentPos) {
            const previewPoints = [...this.points, this.currentPos];

            if (previewPoints.length === 2) {
                renderer.drawLine(previewPoints[0], previewPoints[1], {
                    color: settings.strokeColor,
                    width: settings.strokeWidth,
                    dashed: true
                });
            } else if (previewPoints.length === 3) {
                const trianglePoints = GeometryUtils.getTrianglePoints(...previewPoints);
                renderer.drawShape(trianglePoints, {
                    color: settings.strokeColor,
                    width: settings.strokeWidth,
                    fill: true
                });
            }
        }
    }
}

export class StarTool {
    constructor(app) {
        this.app = app;
        this.name = 'star';
        this.center = null;
        this.outerRadius = 0;
        this.isDrawing = false;
    }

    onMouseDown(pos) {
        this.center = { ...pos };
        this.outerRadius = 0;
        this.isDrawing = true;
    }

    onMouseMove(pos) {
        if (!this.isDrawing) return;
        this.outerRadius = GeometryUtils.distance(this.center, pos);
    }

    onMouseUp(pos) {
        if (!this.isDrawing) return;

        this.outerRadius = GeometryUtils.distance(this.center, pos);

        if (this.outerRadius > 5) {
            const innerRadius = this.outerRadius * 0.4;
            const points = GeometryUtils.getStarPoints(this.center, this.outerRadius, innerRadius, 5);
            this.app.shapes.push({
                id: Date.now(),
                type: 'star',
                points,
                center: this.center,
                outerRadius: this.outerRadius,
                color: this.app.settings.strokeColor,
                width: this.app.settings.strokeWidth
            });
        }

        this.center = null;
        this.outerRadius = 0;
        this.isDrawing = false;
    }

    onRender(renderer) {
        if (!this.isDrawing || this.outerRadius === 0) return;

        const innerRadius = this.outerRadius * 0.4;
        const points = GeometryUtils.getStarPoints(this.center, this.outerRadius, innerRadius, 5);
        renderer.drawShape(points, {
            color: this.app.settings.strokeColor,
            width: this.app.settings.strokeWidth,
            fill: true
        });
    }
}
