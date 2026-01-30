// Geometry utility functions for CurveDrawer

export class GeometryUtils {
    /**
     * Calculate distance between two points
     */
    static distance(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Find the nearest point within a given radius
     */
    static findNearestPoint(pos, points, maxDistance) {
        let nearest = null;
        let minDist = maxDistance;

        for (const point of points) {
            const dist = this.distance(pos, point);
            if (dist < minDist) {
                minDist = dist;
                nearest = point;
            }
        }

        return nearest;
    }

    /**
     * Catmull-Rom spline interpolation
     * Returns an array of points along the curve
     */
    static catmullRomSpline(points, tension = 0.5, numSegments = 20) {
        if (points.length < 2) return points;
        if (points.length === 2) return points;

        const result = [];
        
        // For each segment between control points
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[Math.max(0, i - 1)];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[Math.min(points.length - 1, i + 2)];

            // Interpolate between p1 and p2
            for (let t = 0; t < numSegments; t++) {
                const tt = t / numSegments;
                const tt2 = tt * tt;
                const tt3 = tt2 * tt;

                const q1 = -tension * tt3 + 2 * tension * tt2 - tension * tt;
                const q2 = (2 - tension) * tt3 + (tension - 3) * tt2 + 1;
                const q3 = (tension - 2) * tt3 + (3 - 2 * tension) * tt2 + tension * tt;
                const q4 = tension * tt3 - tension * tt2;

                const x = p0.x * q1 + p1.x * q2 + p2.x * q3 + p3.x * q4;
                const y = p0.y * q1 + p1.y * q2 + p2.y * q3 + p3.y * q4;

                result.push({ x, y });
            }
        }

        // Add the last point
        result.push(points[points.length - 1]);
        
        return result;
    }

    /**
     * Find the closest point on a curve to a given position
     */
    static findClosestPointOnCurve(pos, curvePoints, controlPoints) {
        let closestPoint = null;
        let closestSegmentIndex = -1;
        let minDist = Infinity;

        for (let i = 0; i < curvePoints.length; i++) {
            const dist = this.distance(pos, curvePoints[i]);
            if (dist < minDist) {
                minDist = dist;
                closestPoint = curvePoints[i];
                closestSegmentIndex = i;
            }
        }

        // Find which two control points this belongs between
        if (controlPoints.length < 2) return { point: closestPoint, insertIndex: 0 };

        const pointsPerSegment = Math.floor(curvePoints.length / (controlPoints.length - 1));
        const insertIndex = Math.min(
            Math.floor(closestSegmentIndex / pointsPerSegment) + 1,
            controlPoints.length
        );

        return { point: closestPoint, insertIndex, distance: minDist };
    }

    /**
     * Calculate circle points
     */
    static getCirclePoints(center, radius, segments = 64) {
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push({
                x: center.x + Math.cos(angle) * radius,
                y: center.y + Math.sin(angle) * radius
            });
        }
        return points;
    }

    /**
     * Calculate rectangle points
     */
    static getRectanglePoints(start, end) {
        return [
            { x: start.x, y: start.y },
            { x: end.x, y: start.y },
            { x: end.x, y: end.y },
            { x: start.x, y: end.y },
            { x: start.x, y: start.y }
        ];
    }

    /**
     * Calculate triangle points
     */
    static getTrianglePoints(p1, p2, p3) {
        return [p1, p2, p3, p1];
    }

    /**
     * Calculate star points
     */
    static getStarPoints(center, outerRadius, innerRadius, points = 5) {
        const result = [];
        const angleStep = Math.PI / points;

        for (let i = 0; i < points * 2; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            result.push({
                x: center.x + Math.cos(angle) * radius,
                y: center.y + Math.sin(angle) * radius
            });
        }
        
        result.push(result[0]); // Close the shape
        return result;
    }
}
