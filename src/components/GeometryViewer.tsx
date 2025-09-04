import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Shape = 'cube' | 'sphere' | 'cylinder';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const GeometryViewer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentShape, setCurrentShape] = useState<Shape>('cube');
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 200;

    let animationId: number;

    const animate = () => {
      if (isAnimating) {
        setRotation(prev => ({
          x: prev.x + 0.02,
          y: prev.y + 0.01
        }));
      }

      drawShape(ctx, canvas.width, canvas.height);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [currentShape, isAnimating]);

  const project3DTo2D = (point: Point3D, width: number, height: number): { x: number, y: number } => {
    const distance = 5;
    const scale = 80;
    
    // Apply rotation
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);

    // Rotate around Y axis
    const x1 = point.x * cosY - point.z * sinY;
    const z1 = point.x * sinY + point.z * cosY;
    
    // Rotate around X axis
    const y1 = point.y * cosX - z1 * sinX;
    const z2 = point.y * sinX + z1 * cosX;

    // Project to 2D
    const perspective = distance / (distance + z2);
    
    return {
      x: width / 2 + x1 * scale * perspective,
      y: height / 2 + y1 * scale * perspective
    };
  };

  const drawShape = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;

    switch (currentShape) {
      case 'cube':
        drawCube(ctx, width, height);
        break;
      case 'sphere':
        drawSphere(ctx, width, height);
        break;
      case 'cylinder':
        drawCylinder(ctx, width, height);
        break;
    }
  };

  const drawCube = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const vertices: Point3D[] = [
      { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back face
      [4, 5], [5, 6], [6, 7], [7, 4], // front face
      [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
    ];

    const projectedVertices = vertices.map(v => project3DTo2D(v, width, height));

    edges.forEach(([start, end]) => {
      const startPoint = projectedVertices[start];
      const endPoint = projectedVertices[end];
      
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();
    });
  };

  const drawSphere = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const rings = 8;
    const segments = 12;

    // Draw longitude lines
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      ctx.beginPath();
      
      for (let j = 0; j <= rings; j++) {
        const phi = (j / rings) * Math.PI;
        const point: Point3D = {
          x: Math.sin(phi) * Math.cos(angle),
          y: Math.cos(phi),
          z: Math.sin(phi) * Math.sin(angle)
        };
        
        const projected = project3DTo2D(point, width, height);
        
        if (j === 0) {
          ctx.moveTo(projected.x, projected.y);
        } else {
          ctx.lineTo(projected.x, projected.y);
        }
      }
      ctx.stroke();
    }

    // Draw latitude lines
    for (let i = 1; i < rings; i++) {
      const phi = (i / rings) * Math.PI;
      ctx.beginPath();
      
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        const point: Point3D = {
          x: Math.sin(phi) * Math.cos(angle),
          y: Math.cos(phi),
          z: Math.sin(phi) * Math.sin(angle)
        };
        
        const projected = project3DTo2D(point, width, height);
        
        if (j === 0) {
          ctx.moveTo(projected.x, projected.y);
        } else {
          ctx.lineTo(projected.x, projected.y);
        }
      }
      ctx.stroke();
    }
  };

  const drawCylinder = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const segments = 16;
    const h = 1.5;

    // Draw top circle
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const point: Point3D = {
        x: Math.cos(angle),
        y: h,
        z: Math.sin(angle)
      };
      
      const projected = project3DTo2D(point, width, height);
      
      if (i === 0) {
        ctx.moveTo(projected.x, projected.y);
      } else {
        ctx.lineTo(projected.x, projected.y);
      }
    }
    ctx.stroke();

    // Draw bottom circle
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const point: Point3D = {
        x: Math.cos(angle),
        y: -h,
        z: Math.sin(angle)
      };
      
      const projected = project3DTo2D(point, width, height);
      
      if (i === 0) {
        ctx.moveTo(projected.x, projected.y);
      } else {
        ctx.lineTo(projected.x, projected.y);
      }
    }
    ctx.stroke();

    // Draw vertical lines
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const topPoint: Point3D = {
        x: Math.cos(angle),
        y: h,
        z: Math.sin(angle)
      };
      const bottomPoint: Point3D = {
        x: Math.cos(angle),
        y: -h,
        z: Math.sin(angle)
      };
      
      const topProjected = project3DTo2D(topPoint, width, height);
      const bottomProjected = project3DTo2D(bottomPoint, width, height);
      
      ctx.beginPath();
      ctx.moveTo(topProjected.x, topProjected.y);
      ctx.lineTo(bottomProjected.x, bottomProjected.y);
      ctx.stroke();
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1">
        <Button
          variant={currentShape === 'cube' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentShape('cube')}
          className="text-xs"
        >
          Cube
        </Button>
        <Button
          variant={currentShape === 'sphere' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentShape('sphere')}
          className="text-xs"
        >
          Sphere
        </Button>
        <Button
          variant={currentShape === 'cylinder' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentShape('cylinder')}
          className="text-xs"
        >
          Cylinder
        </Button>
      </div>

      <Card>
        <CardContent className="p-2 flex justify-center">
          <canvas
            ref={canvasRef}
            className="border rounded"
            style={{ width: '160px', height: '160px' }}
          />
        </CardContent>
      </Card>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsAnimating(!isAnimating)}
        className="w-full text-xs"
      >
        {isAnimating ? 'Pause' : 'Play'}
      </Button>
    </div>
  );
};