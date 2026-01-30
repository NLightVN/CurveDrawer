# CurveDrawer

A modern, interactive web-based drawing application for creating lines, curves, and shapes with an intuitive point-based interface.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Drawing Tools

- **Straight Line Tool** - Click and drag to create straight lines between points. Automatically snaps to existing points.
- **Interpolated Curve Tool** - Create smooth Catmull-Rom spline curves through multiple control points. Insert new points by clicking on the curve.
- **Circle Tool** - Click center and drag to set radius
- **Rectangle Tool** - Click and drag to create rectangles
- **Triangle Tool** - Click three points to define vertices
- **Star Tool** - Click center and drag to create a 5-pointed star

### Advanced Features

- **Point Snapping** - Automatically snap to nearby points for precise connections
- **Curve Interpolation** - Smooth curves using Catmull-Rom spline algorithm
- **Adjustable Settings** - Customize stroke width, colors, point size, snap distance, and curve parameters
- **Visual Feedback** - Hover effects, active states, and preview rendering
- **Modern UI** - Dark mode with glassmorphism effects and smooth animations

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (Python, Node.js, or any HTTP server)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NLightVN/CurveDrawer.git
cd CurveDrawer
```

2. Start a local web server:

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Node.js:**
```bash
npx http-server -p 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## 📖 Usage

### Straight Line Tool

1. Select the "Straight Line" tool from the toolbar
2. Click and hold to create a starting point (or click on an existing point)
3. Drag to the end position
4. Release to create the line (snaps to existing points if nearby)

### Interpolated Curve Tool

1. Select the "Interpolated Curve" tool
2. Click multiple points to define the curve path
3. The curve automatically interpolates smoothly through all points
4. To insert a new control point:
   - Click and hold on the curve between two existing points
   - Drag to the desired position
   - Release to insert the point

### Shape Tools

- **Circle**: Click center → drag to set radius → release
- **Rectangle**: Click one corner → drag to opposite corner → release
- **Triangle**: Click three points in sequence
- **Star**: Click center → drag to set size → release

### Settings Panel

- **Stroke Width** - Adjust the thickness of lines and shapes
- **Stroke Color** - Choose the color for new drawings
- **Point Size** - Control the size of point markers
- **Snap Distance** - Set how close you need to be to snap to existing points
- **Curve Influence Radius** - (Curve tool only) Control point influence area
- **Curve Tension** - (Curve tool only) Adjust curve smoothness

## 🏗️ Project Structure

```
CurveDrawer/
├── index.html          # Main HTML structure
├── style.css           # Modern CSS with design system
├── app.js             # Application controller
├── tools/
│   ├── straightLine.js      # Straight line tool
│   ├── interpolatedCurve.js # Curve tool with spline interpolation
│   └── shapes.js            # Circle, Rectangle, Triangle, Star tools
└── utils/
    ├── geometry.js    # Geometry calculations and algorithms
    └── renderer.js    # Canvas rendering utilities
```

## 🎨 Design Features

- **Dark Mode UI** - Easy on the eyes with vibrant accent colors
- **Glassmorphism** - Modern frosted glass effect on panels
- **Smooth Animations** - Transitions and hover effects
- **Responsive Layout** - Works on different screen sizes
- **Custom Scrollbars** - Styled to match the theme

## 🔧 Technical Details

### Technologies Used

- **Vanilla JavaScript (ES6 Modules)** - No framework dependencies
- **HTML5 Canvas** - High-performance 2D rendering
- **CSS3** - Modern styling with custom properties
- **Catmull-Rom Spline** - Smooth curve interpolation algorithm

### Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 👨‍💻 Author

Created by NLightVN

