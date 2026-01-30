// Renderer utility for drawing to canvas

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
    }

    /**
     * Resize canvas to match container
     */
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * this.dpr;
        this.canvas.height = rect.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    /**
     * Clear the entire canvas
     */
    clear() {
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
    }

    /**
     * Draw a point
     */
    drawPoint(point, options = {}) {
        const {
            size = 6,
            color = '#6366f1',
            state = 'normal' // normal, hover, active, selected
        } = options;

        this.ctx.save();

        // Draw glow for special states
        if (state === 'hover' || state === 'active') {
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = color;
        }

        // Draw outer circle
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // Draw inner circle for contrast
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, size * 0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = state === 'active' ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
        this.ctx.fill();

        // Draw border
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Draw a line
     */
    drawLine(start, end, options = {}) {
        const {
            width = 2,
            color = '#6366f1',
            dashed = false
        } = options;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';

        if (dashed) {
            this.ctx.setLineDash([5, 5]);
        }

        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Draw a curve through points
     */
    drawCurve(points, options = {}) {
        if (points.length < 2) return;

        const {
            width = 2,
            color = '#6366f1'
        } = options;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Draw a shape (closed path)
     */
    drawShape(points, options = {}) {
        if (points.length < 2) return;

        const {
            width = 2,
            color = '#6366f1',
            fill = false,
            fillColor = 'rgba(99, 102, 241, 0.1)'
        } = options;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }

        this.ctx.closePath();

        if (fill) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Draw influence radius circle
     */
    drawInfluenceRadius(point, radius, options = {}) {
        const {
            color = 'rgba(99, 102, 241, 0.1)',
            borderColor = 'rgba(99, 102, 241, 0.3)'
        } = options;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([3, 3]);
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Draw preview line (semi-transparent)
     */
    drawPreview(start, end, options = {}) {
        const {
            width = 2,
            color = '#6366f1'
        } = options;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.strokeStyle = color;
        this.ctx.globalAlpha = 0.5;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';
        this.ctx.setLineDash([5, 5]);
        this.ctx.stroke();
        this.ctx.restore();
    }
}
