'use client';

import React, { useEffect, useRef } from 'react';

interface Vec3 {
  x: number;
  y: number;
  z: number;
  isCore?: boolean;
}

interface ProjectedVertex {
  px: number;
  py: number;
  pz: number;
  scale: number;
  isCore?: boolean;
}

/**
 * Symmetric 3D Low-Poly Cybernetic Face Mesh
 * Coordinates in normalized space roughly [-1.2, 1.2]
 * Y+ is down in canvas space, so negative Y is forehead/crown and positive Y is chin.
 */
const BASE_VERTICES: Vec3[] = [
  // Centerline (0 - 9)
  { x: 0.0, y: -1.15, z: -0.15 },                  // 0: Top crown
  { x: 0.0, y: -0.82, z: 0.28 },                   // 1: Upper forehead center
  { x: 0.0, y: -0.48, z: 0.45, isCore: true },     // 2: Glabella (between brows)
  { x: 0.0, y: -0.18, z: 0.62 },                   // 3: Nasal bridge mid
  { x: 0.0, y: 0.08, z: 0.82, isCore: true },      // 4: Nose tip
  { x: 0.0, y: 0.18, z: 0.58 },                    // 5: Subnasale (under nose)
  { x: 0.0, y: 0.32, z: 0.60 },                    // 6: Upper lip peak
  { x: 0.0, y: 0.48, z: 0.56 },                    // 7: Lower lip center
  { x: 0.0, y: 0.66, z: 0.48 },                    // 8: Mentolabial sulcus (above chin)
  { x: 0.0, y: 0.92, z: 0.46, isCore: true },      // 9: Chin apex (Menton)

  // Left Hemisphere (10 - 30)
  { x: -0.42, y: -1.05, z: -0.10 },                // 10: L Crown lateral
  { x: -0.38, y: -0.76, z: 0.22 },                 // 11: L Forehead
  { x: -0.72, y: -0.68, z: -0.18 },                // 12: L Temple upper
  { x: -0.22, y: -0.46, z: 0.44 },                 // 13: L Inner brow
  { x: -0.52, y: -0.48, z: 0.32 },                 // 14: L Outer brow
  { x: -0.35, y: -0.30, z: 0.36, isCore: true },   // 15: L Eye pupil core
  { x: -0.18, y: -0.28, z: 0.38 },                 // 16: L Eye inner canthus
  { x: -0.50, y: -0.28, z: 0.28 },                 // 17: L Eye outer canthus
  { x: -0.35, y: -0.16, z: 0.40 },                 // 18: L Infraorbital rim
  { x: -0.78, y: -0.30, z: -0.15 },                // 19: L Zygomatic temple
  { x: -0.64, y: -0.04, z: 0.28, isCore: true },   // 20: L Cheekbone (Malar) peak
  { x: -0.20, y: 0.12, z: 0.56 },                  // 21: L Nose alar wing
  { x: -0.38, y: 0.16, z: 0.44 },                  // 22: L Mid-cheek (Maxilla)
  { x: -0.26, y: 0.38, z: 0.46 },                  // 23: L Mouth corner
  { x: -0.72, y: 0.24, z: -0.08 },                 // 24: L Jaw upper (Gonion upper)
  { x: -0.56, y: 0.56, z: 0.10 },                  // 25: L Jaw angle (Gonion)
  { x: -0.30, y: 0.80, z: 0.34 },                  // 26: L Chin lateral
  { x: -0.36, y: 1.18, z: -0.12 },                 // 27: L Neck upper conduit
  { x: -0.48, y: 1.45, z: -0.25 },                 // 28: L Neck lower conduit

  // Right Hemisphere (29 - 47) — Mirrored X
  { x: 0.42, y: -1.05, z: -0.10 },                 // 29: R Crown lateral
  { x: 0.38, y: -0.76, z: 0.22 },                  // 30: R Forehead
  { x: 0.72, y: -0.68, z: -0.18 },                 // 31: R Temple upper
  { x: 0.22, y: -0.46, z: 0.44 },                  // 32: R Inner brow
  { x: 0.52, y: -0.48, z: 0.32 },                  // 33: R Outer brow
  { x: 0.35, y: -0.30, z: 0.36, isCore: true },    // 34: R Eye pupil core
  { x: 0.18, y: -0.28, z: 0.38 },                  // 35: R Eye inner canthus
  { x: 0.50, y: -0.28, z: 0.28 },                  // 36: R Eye outer canthus
  { x: 0.35, y: -0.16, z: 0.40 },                  // 37: R Infraorbital rim
  { x: 0.78, y: -0.30, z: -0.15 },                 // 38: R Zygomatic temple
  { x: 0.64, y: -0.04, z: 0.28, isCore: true },    // 39: R Cheekbone (Malar) peak
  { x: 0.20, y: 0.12, z: 0.56 },                   // 40: R Nose alar wing
  { x: 0.38, y: 0.16, z: 0.44 },                   // 41: R Mid-cheek (Maxilla)
  { x: 0.26, y: 0.38, z: 0.46 },                   // 42: R Mouth corner
  { x: 0.72, y: 0.24, z: -0.08 },                  // 43: R Jaw upper (Gonion upper)
  { x: 0.56, y: 0.56, z: 0.10 },                   // 44: R Jaw angle (Gonion)
  { x: 0.30, y: 0.80, z: 0.34 },                   // 45: R Chin lateral
  { x: 0.36, y: 1.18, z: -0.12 },                  // 46: R Neck upper conduit
  { x: 0.48, y: 1.45, z: -0.25 },                  // 47: R Neck lower conduit
];

/**
 * Triangulated wireframe edges connecting vertex indices
 */
const EDGES: [number, number][] = [
  // Centerline spine
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],

  // Left hemisphere triangulation
  [0, 10], [10, 11], [1, 11], [10, 12], [11, 12],
  [1, 13], [2, 13], [11, 13], [11, 14], [12, 14], [13, 14],
  // Left orbital & eye diamond
  [13, 16], [14, 17], [16, 15], [15, 17], [13, 15], [14, 15],
  [16, 18], [17, 18], [15, 18], [2, 16], [3, 16],
  // Left temple & cheekbone
  [12, 19], [14, 19], [17, 19], [17, 20], [18, 20], [19, 20],
  // Left nose & mid-face
  [3, 18], [3, 21], [4, 21], [5, 21], [18, 21], [18, 22], [20, 22], [21, 22],
  // Left mouth & jaw
  [6, 23], [7, 23], [21, 23], [22, 23],
  [19, 24], [20, 24], [20, 25], [22, 25], [24, 25],
  [23, 25], [23, 26], [8, 23], [8, 26], [9, 26], [25, 26],
  // Left neck cyber conduits
  [9, 27], [26, 27], [25, 27], [27, 28],

  // Right hemisphere triangulation
  [0, 29], [29, 30], [1, 30], [29, 31], [30, 31],
  [1, 32], [2, 32], [30, 32], [30, 33], [31, 33], [32, 33],
  // Right orbital & eye diamond
  [32, 35], [33, 36], [35, 34], [34, 36], [32, 34], [33, 34],
  [35, 37], [36, 37], [34, 37], [2, 35], [3, 35],
  // Right temple & cheekbone
  [31, 38], [33, 38], [36, 38], [36, 39], [37, 39], [38, 39],
  // Right nose & mid-face
  [3, 37], [3, 40], [4, 40], [5, 40], [37, 40], [37, 41], [39, 41], [40, 41],
  // Right mouth & jaw
  [6, 42], [7, 42], [40, 42], [41, 42],
  [38, 43], [39, 43], [39, 44], [41, 44], [43, 44],
  [42, 44], [42, 45], [8, 42], [8, 45], [9, 45], [44, 45],
  // Right neck cyber conduits
  [9, 46], [45, 46], [44, 46], [46, 47],

  // Cross-axis structural bridges
  [10, 29], [11, 30], [13, 32], [21, 40], [23, 42], [26, 45], [27, 46],
];

export function CyberFaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Smooth mouse parallax state
    const mouse = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
    };

    // Dynamic glitch engine state
    const glitch = {
      active: false,
      intensity: 0,
      endTime: 0,
      nextTriggerTime: performance.now() + 2400,
      sliceY: 0,
      sliceHeight: 0,
      sliceOffset: 0,
    };

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize cursor coordinates to [-1, 1]
      mouse.targetX = (e.clientX / Math.max(width, 1)) * 2 - 1;
      mouse.targetY = (e.clientY / Math.max(height, 1)) * 2 - 1;
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const projectMesh = (
      rotX: number,
      rotY: number,
      floatX: number,
      floatY: number,
      baseScale: number,
      now: number
    ): ProjectedVertex[] => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const fov = 3.4;
      const centerX = width * 0.5 + floatX;
      const centerY = height * 0.48 + floatY;

      return BASE_VERTICES.map((v, idx) => {
        // Subtle autonomous vertex breathing
        const pulse = Math.sin(now * 0.002 + idx * 0.45) * 0.012;
        let vx = v.x * (1 + pulse);
        let vy = v.y * (1 + pulse);
        let vz = v.z;

        // Rotate around Y axis (yaw)
        const x1 = vx * cosY + vz * sinY;
        const z1 = -vx * sinY + vz * cosY;

        // Rotate around X axis (pitch)
        const y2 = vy * cosX - z1 * sinX;
        const z2 = vy * sinX + z1 * cosX;

        const perspective = fov / (fov - z2 * 0.85);
        let px = centerX + x1 * baseScale * perspective;
        let py = centerY + y2 * baseScale * perspective;

        // Apply sharp horizontal vertex jitter during active glitch bursts
        if (glitch.active) {
          if (Math.abs(py - glitch.sliceY) < glitch.sliceHeight) {
            px += glitch.sliceOffset;
          }
          if ((idx + Math.floor(now * 0.05)) % 5 === 0) {
            px += (Math.random() - 0.5) * 26 * glitch.intensity;
            py += (Math.random() - 0.5) * 8 * glitch.intensity;
          }
        }

        return {
          px,
          py,
          pz: z2,
          scale: perspective,
          isCore: v.isCore,
        };
      });
    };

    const drawWireframePass = (
      projected: ProjectedVertex[],
      strokeColor: string,
      nodeColor: string,
      offsetX: number,
      offsetY: number,
      drawNodes: boolean
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.1;

      for (let i = 0; i < EDGES.length; i++) {
        const [aIdx, bIdx] = EDGES[i];
        const a = projected[aIdx];
        const b = projected[bIdx];
        if (!a || !b) continue;

        ctx.moveTo(a.px + offsetX, a.py + offsetY);
        ctx.lineTo(b.px + offsetX, b.py + offsetY);
      }
      ctx.stroke();

      if (drawNodes) {
        for (let i = 0; i < projected.length; i++) {
          const p = projected[i];
          const radius = p.isCore ? 3.1 * p.scale : 1.75 * p.scale;

          if (p.isCore) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(129, 140, 248, 0.22)';
            ctx.arc(p.px + offsetX, p.py + offsetY, radius * 2.6, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.beginPath();
          ctx.fillStyle = nodeColor;
          ctx.arc(p.px + offsetX, p.py + offsetY, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const render = (now: number) => {
      // 1. Update Glitch Engine State
      if (!glitch.active && now >= glitch.nextTriggerTime) {
        glitch.active = true;
        glitch.intensity = 0.65 + Math.random() * 0.75;
        const duration = 70 + Math.random() * 190;
        glitch.endTime = now + duration;
        glitch.sliceY = height * (0.2 + Math.random() * 0.6);
        glitch.sliceHeight = 35 + Math.random() * 95;
        glitch.sliceOffset = (Math.random() > 0.5 ? 1 : -1) * (14 + Math.random() * 28);
      } else if (glitch.active && now >= glitch.endTime) {
        glitch.active = false;
        glitch.intensity = 0;
        // Schedule next glitch (either a double-tap micro-glitch or 1.8s–4.5s pause)
        const isDoubleTap = Math.random() < 0.28;
        glitch.nextTriggerTime = now + (isDoubleTap ? 120 + Math.random() * 220 : 1800 + Math.random() * 2800);
      }

      // 2. Smoothly interpolate mouse coordinates for 60 FPS inertia
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.065;
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.065;

      // 3. Clear Canvas with Deep Obsidian Dark Mode (#0a0a0c)
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient cybernetic core glow behind the face
      const glowRadius = Math.min(width, height) * 0.45;
      const radial = ctx.createRadialGradient(
        width * 0.5 + mouse.currentX * 28,
        height * 0.48 + mouse.currentY * 22,
        10,
        width * 0.5,
        height * 0.48,
        glowRadius
      );
      radial.addColorStop(0, 'rgba(99, 102, 241, 0.09)');
      radial.addColorStop(0.55, 'rgba(79, 70, 229, 0.03)');
      radial.addColorStop(1, 'rgba(10, 10, 12, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // 4. Calculate 3D rotation & floating drift
      const floatX = Math.sin(now * 0.0011) * 14 + mouse.currentX * 32;
      const floatY = Math.cos(now * 0.0014) * 12 + mouse.currentY * 24;
      const rotY = mouse.currentX * 0.42 + Math.sin(now * 0.0007) * 0.08;
      const rotX = -mouse.currentY * 0.28 + Math.cos(now * 0.0009) * 0.05;
      const baseScale = Math.min(width, height) * 0.255;

      const projected = projectMesh(rotX, rotY, floatX, floatY, baseScale, now);

      // 5. RGB Chromatic Aberration Passes during Active Glitches
      if (glitch.active) {
        const shift = (6 + Math.random() * 10) * glitch.intensity;

        // Red Chromatic Shift Pass: rgba(239, 68, 68)
        drawWireframePass(
          projected,
          'rgba(239, 68, 68, 0.42)',
          'rgba(239, 68, 68, 0.65)',
          -shift,
          -1.5,
          false
        );

        // Cyan Chromatic Shift Pass: rgba(6, 182, 212)
        drawWireframePass(
          projected,
          'rgba(6, 182, 212, 0.42)',
          'rgba(6, 182, 212, 0.65)',
          shift,
          1.5,
          false
        );
      }

      // 6. Primary Cyber Indigo Wireframe & Glowing Vertex Nodes
      drawWireframePass(
        projected,
        'rgba(99, 102, 241, 0.2)',
        'rgba(129, 140, 248, 0.7)',
        0,
        0,
        true
      );

      // 7. Terminal Scanlines & Interference Artifacts during Active Glitches
      if (glitch.active) {
        ctx.fillStyle = 'rgba(129, 140, 248, 0.035)';
        for (let y = 0; y < height; y += 4) {
          ctx.fillRect(0, y, width, 1);
        }

        // Glitch slice highlight band
        ctx.fillStyle = 'rgba(6, 182, 212, 0.06)';
        ctx.fillRect(0, glitch.sliceY - glitch.sliceHeight * 0.5, width, glitch.sliceHeight);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
        ctx.fillRect(
          0,
          glitch.sliceY + (Math.random() - 0.5) * 40,
          width,
          2 + Math.random() * 6
        );
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
}

export default CyberFaceBackground;
