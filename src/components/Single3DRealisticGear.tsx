import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Single3DRealisticGearProps {
  size?: number; // width & height in px
  speedSeconds?: number;
  active?: boolean;
  className?: string;
}

// Global cached studio environment map for metallic reflections
let cachedStudioEnvMap: THREE.Texture | null = null;

function getStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  if (cachedStudioEnvMap) return cachedStudioEnvMap;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color("#05080c");

  // Overhead cold daylight softbox
  const topSoftbox = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 16),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0xf0f6ff) }),
  );
  topSoftbox.position.set(0, 8, 4);
  topSoftbox.rotateX(Math.PI / 2.2);
  envScene.add(topSoftbox);

  // High-specular white rim reflector panel
  const rimStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 18),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffffff) }),
  );
  rimStrip.position.set(-8, 3, -2);
  rimStrip.rotateY(Math.PI / 3);
  envScene.add(rimStrip);

  // Subtle steel reflection panel
  const steelAccent = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 14),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0xdce7f5) }),
  );
  steelAccent.position.set(7, 2, -1);
  steelAccent.rotateY(-Math.PI / 3);
  envScene.add(steelAccent);

  // Deep ground absorption
  const groundPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0x020305) }),
  );
  groundPanel.position.set(0, -8, 2);
  groundPanel.rotateX(-Math.PI / 2);
  envScene.add(groundPanel);

  cachedStudioEnvMap = pmremGenerator.fromScene(envScene, 0.04).texture;
  pmremGenerator.dispose();
  return cachedStudioEnvMap;
}

/**
 * Creates a procedural circular lathe-turned micro-groove texture
 * for authentic real-world CNC machined steel appearance.
 */
function createMachinedSteelBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 512, 512);

  const cx = 256;
  const cy = 256;

  // Concentric lathe grooves
  ctx.lineWidth = 1;
  for (let r = 8; r < 250; r += 1.8) {
    const alpha = 0.04 + Math.random() * 0.08;
    ctx.strokeStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Radial fine tool chatter lines
  for (let i = 0; i < 480; i++) {
    const angle = (i * Math.PI) / 240;
    const len = 25 + Math.random() * 220;
    const alpha = 0.02 + Math.random() * 0.04;
    ctx.strokeStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 20, cy + Math.sin(angle) * 20);
    ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Single3DRealisticGear:
 * An authentic 3D cold-rolled machined steel gear.
 * Rendered with physical chrome/steel PBR materials, true chamfered bevels,
 * lathe-machined tool grooves, lightening holes, and 3-point studio lighting.
 */
export function Single3DRealisticGear({
  size = 150,
  speedSeconds = 3.2,
  active = true,
  className = "",
}: Single3DRealisticGearProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const gearGroupRef = useRef<THREE.Group | null>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.z = 4.2;

    // 2. WEBGL RENDERER
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // 3. STUDIO ENVIRONMENT & LIGHTING
    const envMap = getStudioEnvironment(renderer);
    scene.environment = envMap;

    // Cold Key Light (bright specular chrome highlights)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    // Rim Backlight (edges & chamfers definition)
    const rimLight = new THREE.DirectionalLight(0xcfdff5, 3.0);
    rimLight.position.set(-5, 3, -3);
    scene.add(rimLight);

    // Glancing Fill Light (metallic bottom reflections)
    const fillLight = new THREE.DirectionalLight(0x8faac8, 1.8);
    fillLight.position.set(2, -4, 3);
    scene.add(fillLight);

    // Ambient cold fill
    const ambientLight = new THREE.AmbientLight(0x1a2433, 1.0);
    scene.add(ambientLight);

    // 4. REAL HARDENED STEEL PBR MATERIAL
    const bumpMap = createMachinedSteelBumpMap();
    const steelMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#dbe5f1"), // Polished industrial silver steel
      metalness: 0.98,
      roughness: 0.15,
      bumpMap: bumpMap,
      bumpScale: 0.003,
      envMapIntensity: 2.2,
    });

    // Darker oxidized carbon steel for the recessed web inner ring
    const carbonSteelMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#8897a8"),
      metalness: 0.94,
      roughness: 0.28,
      bumpMap: bumpMap,
      bumpScale: 0.004,
      envMapIntensity: 1.5,
    });

    // 5. 3D ISOMETRIC GEAR ASSEMBLY
    const rootAssembly = new THREE.Group();
    rootAssembly.rotation.x = 0.44; // ~25 deg pitch tilt
    rootAssembly.rotation.y = 0.24; // ~14 deg yaw
    scene.add(rootAssembly);

    const gearGroup = new THREE.Group();
    rootAssembly.add(gearGroup);
    gearGroupRef.current = gearGroup;

    // --- A. OUTER TOOTHED STEEL RIM (16 Machined Involute Teeth) ---
    const teeth = 16;
    const outerRadius = 1.0;
    const rootRadius = 0.77;
    const rimInnerRadius = 0.73;
    const rimThickness = 0.26;
    const rimBevel = 0.035;

    const rimShape = new THREE.Shape();
    const toothAngle = (Math.PI * 2) / teeth;

    for (let i = 0; i < teeth; i++) {
      const a0 = i * toothAngle;
      const a1 = a0 + toothAngle * 0.22;
      const a2 = a0 + toothAngle * 0.38;
      const a3 = a0 + toothAngle * 0.62;
      const a4 = a0 + toothAngle * 0.78;
      const a5 = (i + 1) * toothAngle;

      const r0x = Math.cos(a0) * rootRadius;
      const r0y = Math.sin(a0) * rootRadius;
      if (i === 0) rimShape.moveTo(r0x, r0y);
      else rimShape.lineTo(r0x, r0y);

      const f1x = Math.cos(a1) * (rootRadius + (outerRadius - rootRadius) * 0.45);
      const f1y = Math.sin(a1) * (rootRadius + (outerRadius - rootRadius) * 0.45);
      rimShape.lineTo(f1x, f1y);

      const t2x = Math.cos(a2) * outerRadius;
      const t2y = Math.sin(a2) * outerRadius;
      rimShape.lineTo(t2x, t2y);

      const t3x = Math.cos(a3) * outerRadius;
      const t3y = Math.sin(a3) * outerRadius;
      rimShape.lineTo(t3x, t3y);

      const f4x = Math.cos(a4) * (rootRadius + (outerRadius - rootRadius) * 0.45);
      const f4y = Math.sin(a4) * (rootRadius + (outerRadius - rootRadius) * 0.45);
      rimShape.lineTo(f4x, f4y);

      const r5x = Math.cos(a5) * rootRadius;
      const r5y = Math.sin(a5) * rootRadius;
      rimShape.lineTo(r5x, r5y);
    }
    rimShape.closePath();

    const innerRimHole = new THREE.Path();
    innerRimHole.absarc(0, 0, rimInnerRadius, 0, Math.PI * 2, true);
    rimShape.holes.push(innerRimHole);

    const rimGeom = new THREE.ExtrudeGeometry(rimShape, {
      depth: rimThickness - rimBevel * 2,
      bevelEnabled: true,
      bevelThickness: rimBevel,
      bevelSize: rimBevel * 0.8,
      bevelSegments: 3,
      curveSegments: 32,
    });
    rimGeom.center();
    rimGeom.computeVertexNormals();
    const rimMesh = new THREE.Mesh(rimGeom, steelMaterial);
    gearGroup.add(rimMesh);

    // --- B. RECESSED WEB WITH 5 BEVELED LIGHTENING HOLES ---
    const hubRadius = 0.35;
    const webShape = new THREE.Shape();
    webShape.absarc(0, 0, rimInnerRadius * 1.01, 0, Math.PI * 2, false);

    const webHole = new THREE.Path();
    webHole.absarc(0, 0, hubRadius * 0.95, 0, Math.PI * 2, true);
    webShape.holes.push(webHole);

    const cutoutDist = (rimInnerRadius + hubRadius) * 0.52;
    const cutoutRadius = 0.11;
    for (let h = 0; h < 5; h++) {
      const hAngle = (h * Math.PI * 2) / 5;
      const hx = Math.cos(hAngle) * cutoutDist;
      const hy = Math.sin(hAngle) * cutoutDist;
      const ch = new THREE.Path();
      ch.absarc(hx, hy, cutoutRadius, 0, Math.PI * 2, true);
      webShape.holes.push(ch);
    }

    const webGeom = new THREE.ExtrudeGeometry(webShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
      curveSegments: 28,
    });
    webGeom.center();
    webGeom.computeVertexNormals();
    const webMesh = new THREE.Mesh(webGeom, carbonSteelMaterial);
    gearGroup.add(webMesh);

    // --- C. MACHINED CENTRAL HUB COLLAR WITH AXLE BORE & BROACHED KEYWAY ---
    const boreRadius = 0.16;
    const hubShape = new THREE.Shape();
    hubShape.absarc(0, 0, hubRadius, 0, Math.PI * 2, false);

    const borePath = new THREE.Path();
    const kwW = 0.07;
    const kwH = 0.07;
    const boreSegs = 28;

    for (let s = 0; s <= boreSegs; s++) {
      const angle = (s / boreSegs) * Math.PI * 2;
      if (angle >= Math.PI * 0.44 && angle <= Math.PI * 0.56) {
        if (s === Math.floor(boreSegs * 0.25)) {
          borePath.lineTo(-kwW / 2, boreRadius);
          borePath.lineTo(-kwW / 2, boreRadius + kwH);
          borePath.lineTo(kwW / 2, boreRadius + kwH);
          borePath.lineTo(kwW / 2, boreRadius);
        }
      } else {
        const bx = Math.cos(angle) * boreRadius;
        const by = Math.sin(angle) * boreRadius;
        if (s === 0) borePath.moveTo(bx, by);
        else borePath.lineTo(bx, by);
      }
    }
    borePath.closePath();
    hubShape.holes.push(borePath);

    const hubGeom = new THREE.ExtrudeGeometry(hubShape, {
      depth: 0.32,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: 28,
    });
    hubGeom.center();
    hubGeom.computeVertexNormals();
    const hubMesh = new THREE.Mesh(hubGeom, steelMaterial);
    gearGroup.add(hubMesh);

    // 6. CONTINUOUS DELTA-TIME ROTATION ANIMATION LOOP
    const clock = new THREE.Clock();
    const radPerSec = (Math.PI * 2) / speedSeconds;
    let animId: number;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      if (gearGroupRef.current) {
        if (!prefersReducedMotion) {
          gearGroupRef.current.rotation.z += radPerSec * delta;
        }

        // Render continuously when active or occasionally to keep scene updated
        if (activeRef.current) {
          renderer?.render(scene, camera);
        }
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer?.dispose();
      rimGeom.dispose();
      webGeom.dispose();
      hubGeom.dispose();
      steelMaterial.dispose();
      carbonSteelMaterial.dispose();
      bumpMap.dispose();
      if (renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size, speedSeconds]);

  return (
    <div
      ref={mountRef}
      className={`relative flex items-center justify-center filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)] drop-shadow-[0_0_20px_rgba(200,220,245,0.35)] ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
