// Main Application Controller

import { Renderer } from './utils/renderer.js';
import { GeometryUtils } from './utils/geometry.js';
import { StraightLineTool } from './tools/straightLine.js';
import { InterpolatedCurveTool } from './tools/interpolatedCurve.js';
import { CircleTool, RectangleTool, TriangleTool, StarTool } from './tools/shapes.js';

class CurveDrawerApp {
    constructor() {
        this.canvas = document.getElementById('drawingCanvas');
        this.renderer = new Renderer(this.canvas);

        // Data structures
        this.points = [];
        this.lines = [];
        this.curves = [];
        this.shapes = [];

        // Settings
        this.settings = {
            strokeWidth: 2,
            strokeColor: '#6366f1',
            pointSize: 6,
            snapDistance: 20,
            curveRadius: 50,
            curveTension: 0.5,
            showInfluenceRadius: false
        };

        // Tools
        this.tools = {
            straightLine: new StraightLineTool(this),
            interpolatedCurve: new InterpolatedCurveTool(this),
            circle: new CircleTool(this),
            rectangle: new RectangleTool(this),
            triangle: new TriangleTool(this),
            star: new StarTool(this)
        };

        this.currentTool = this.tools.straightLine;
        this.hoveredPoint = null;
        this.mousePos = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.setupUI();
        this.startRenderLoop();
    }

    setupCanvas() {
        this.renderer.resize();
        window.addEventListener('resize', () => {
            this.renderer.resize();
        });
    }

    setupEventListeners() {
        // Mouse events on canvas
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    setupUI() {
        // Tool buttons
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const toolName = btn.dataset.tool;
                this.switchTool(toolName);

                // Update UI
                toolButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update status
                document.getElementById('toolStatus').textContent = btn.querySelector('span').textContent;
            });
        });

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearCanvas();
        });

        // Settings
        this.setupSettingSlider('strokeWidth', (value) => {
            this.settings.strokeWidth = parseFloat(value);
        });

        this.setupSettingSlider('pointSize', (value) => {
            this.settings.pointSize = parseFloat(value);
        });

        this.setupSettingSlider('snapDistance', (value) => {
            this.settings.snapDistance = parseFloat(value);
        });

        this.setupSettingSlider('curveRadius', (value) => {
            this.settings.curveRadius = parseFloat(value);
        });

        this.setupSettingSlider('tension', (value) => {
            this.settings.curveTension = parseFloat(value);
            if (this.currentTool.name === 'interpolatedCurve') {
                this.currentTool.updateCurve();
            }
        });

        // Stroke color
        document.getElementById('strokeColor').addEventListener('input', (e) => {
            this.settings.strokeColor = e.target.value;
        });

        // Show curve settings when curve tool is active
        this.updateSettingsVisibility();
    }

    setupSettingSlider(id, callback) {
        const slider = document.getElementById(id);
        const valueSpan = document.getElementById(id + 'Value');

        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            valueSpan.textContent = value;
            callback(value);
        });
    }

    switchTool(toolName) {
        // Finish current tool if needed
        if (this.currentTool.name === 'interpolatedCurve' && this.currentTool.controlPoints.length > 0) {
            this.currentTool.finishCurve();
        }
        if (this.currentTool.reset) {
            this.currentTool.reset();
        }

        this.currentTool = this.tools[toolName];
        this.updateSettingsVisibility();
    }

    updateSettingsVisibility() {
        const curveSettings = document.getElementById('curveSettings');
        const curveTension = document.getElementById('curveTension');

        if (this.currentTool.name === 'interpolatedCurve') {
            curveSettings.style.display = 'block';
            curveTension.style.display = 'block';
        } else {
            curveSettings.style.display = 'none';
            curveTension.style.display = 'none';
        }
    }

    clearCanvas() {
        if (confirm('Are you sure you want to clear the canvas?')) {
            this.points = [];
            this.lines = [];
            this.curves = [];
            this.shapes = [];

            // Reset current tool
            if (this.currentTool.reset) {
                this.currentTool.reset();
            }
            if (this.currentTool.name === 'interpolatedCurve') {
                this.currentTool.controlPoints = [];
                this.currentTool.curvePoints = [];
            }
        }
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        this.currentTool.onMouseDown(pos);
    }

    handleMouseMove(e) {
        const pos = this.getMousePos(e);
        this.mousePos = pos;

        // Update coordinate status
        document.getElementById('coordinateStatus').textContent =
            `X: ${Math.round(pos.x)}, Y: ${Math.round(pos.y)}`;

        // Check for hovered point
        this.hoveredPoint = GeometryUtils.findNearestPoint(
            pos,
            this.points,
            this.settings.snapDistance
        );

        this.currentTool.onMouseMove(pos);
    }

    handleMouseUp(e) {
        const pos = this.getMousePos(e);
        this.currentTool.onMouseUp(pos);
    }

    render() {
        this.renderer.clear();

        // Render all lines
        for (const line of this.lines) {
            this.renderer.drawLine(line.start, line.end, {
                color: line.color,
                width: line.width
            });
        }

        // Render all curves
        for (const curve of this.curves) {
            this.renderer.drawCurve(curve.curvePoints, {
                color: curve.color,
                width: curve.width
            });

            // Draw control points
            for (const point of curve.controlPoints) {
                this.renderer.drawPoint(point, {
                    size: this.settings.pointSize * 0.8,
                    color: curve.color,
                    state: 'normal'
                });
            }
        }

        // Render all shapes
        for (const shape of this.shapes) {
            this.renderer.drawShape(shape.points, {
                color: shape.color,
                width: shape.width,
                fill: true
            });
        }

        // Render current tool preview
        if (this.currentTool.onRender) {
            this.currentTool.onRender(this.renderer);
        }

        // Render all standalone points
        for (const point of this.points) {
            const state = point === this.hoveredPoint ? 'hover' : 'normal';
            this.renderer.drawPoint(point, {
                size: this.settings.pointSize,
                color: this.settings.strokeColor,
                state
            });
        }
    }

    startRenderLoop() {
        const loop = () => {
            this.render();
            requestAnimationFrame(loop);
        };
        loop();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CurveDrawerApp();
});
