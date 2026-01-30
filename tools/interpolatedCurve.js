// Interpolated Curve Tool

import { GeometryUtils } from '../utils/geometry.js';

export class InterpolatedCurveTool {
    constructor(app) {
        this.app = app;
        this.name = 'interpolatedCurve';
        this.controlPoints = [];
        this.curvePoints = [];
        this.isInserting = false;
        this.insertingFrom = null;
        this.insertPoint = null;
    }

    onMouseDown(pos) {
        const settings = this.app.settings;

        // Check if clicking on existing curve segment to insert a point
        if (this.controlPoints.length >= 2) {
            const result = GeometryUtils.findClosestPointOnCurve(
                pos,
                this.curvePoints,
                this.controlPoints
            );

            if (result && result.distance < settings.snapDistance) {
                // Start inserting a new point
                this.isInserting = true;
                this.insertingFrom = result;
                this.insertPoint = { ...pos };
                return;
            }
        }

        // Check if clicking on existing point
        const existingPoint = GeometryUtils.findNearestPoint(
            pos,
            this.app.points,
            settings.snapDistance
        );

        let newPoint;
        if (existingPoint) {
            newPoint = existingPoint;
        } else {
            newPoint = { ...pos, id: Date.now() };
            this.app.points.push(newPoint);
        }

        this.controlPoints.push(newPoint);
        this.updateCurve();
    }

    onMouseMove(pos) {
        if (this.isInserting) {
            this.insertPoint = { ...pos };
        }
    }

    onMouseUp(pos) {
        if (this.isInserting && this.insertingFrom) {
            // Insert new control point
            const newPoint = { ...pos, id: Date.now() };
            this.app.points.push(newPoint);

            // Insert at the calculated index
            this.controlPoints.splice(this.insertingFrom.insertIndex, 0, newPoint);

            this.updateCurve();

            this.isInserting = false;
            this.insertingFrom = null;
            this.insertPoint = null;
        }
    }

    updateCurve() {
        if (this.controlPoints.length < 2) {
            this.curvePoints = this.controlPoints;
            return;
        }

        const settings = this.app.settings;
        this.curvePoints = GeometryUtils.catmullRomSpline(
            this.controlPoints,
            settings.curveTension,
            20
        );
    }

    finishCurve() {
        if (this.controlPoints.length >= 2) {
            this.app.curves.push({
                id: Date.now(),
                controlPoints: [...this.controlPoints],
                curvePoints: [...this.curvePoints],
                color: this.app.settings.strokeColor,
                width: this.app.settings.strokeWidth,
                tension: this.app.settings.curveTension
            });
        }

        this.controlPoints = [];
        this.curvePoints = [];
    }

    reset() {
        this.controlPoints = [];
        this.curvePoints = [];
        this.isInserting = false;
        this.insertingFrom = null;
        this.insertPoint = null;
    }

    onRender(renderer) {
        const settings = this.app.settings;

        // Draw influence radius for control points
        if (settings.showInfluenceRadius) {
            for (const point of this.controlPoints) {
                renderer.drawInfluenceRadius(point, settings.curveRadius);
            }
        }

        // Draw the curve
        if (this.curvePoints.length >= 2) {
            renderer.drawCurve(this.curvePoints, {
                color: settings.strokeColor,
                width: settings.strokeWidth
            });
        }

        // Draw preview for point insertion
        if (this.isInserting && this.insertingFrom && this.insertPoint) {
            renderer.drawLine(this.insertingFrom.point, this.insertPoint, {
                color: settings.strokeColor,
                width: settings.strokeWidth,
                dashed: true
            });

            renderer.drawPoint(this.insertPoint, {
                size: settings.pointSize,
                color: settings.strokeColor,
                state: 'active'
            });
        }
    }
}
