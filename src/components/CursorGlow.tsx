import { useEffect, useRef, useState } from "react";

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  width: number;
  color: string;
}

interface MotionSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

interface WakeRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
  color: string;
}

interface SplashDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

interface SplashRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
  decay: number;
  color: string;
}

interface SplashFlash {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  decay: number;
  color: string;
}

export function CursorGlow() {
  const [isTouch, setIsTouch] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Disable on touch devices or if fine pointer is unavailable or reduced motion is preferred
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || isTouchDevice || prefersReducedMotion) {
      setIsTouch(true);
      return;
    }

    setIsTouch(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    let mouseX = -500;
    let mouseY = -500;
    let prevMouseX = -500;
    let prevMouseY = -500;
    let smoothX = -500;
    let smoothY = -500;
    let lastWakeX = -500;
    let lastWakeY = -500;
    let isVisible = false;
    let isHoveringInteractive = false;
    let targetHaloRadius = 18;
    let currentHaloRadius = 18;
    let currentVelocity = 0;

    let lastHoveredElement: HTMLElement | null = null;
    let lastSplashTime = 0;

    // Movement trail points & sparks
    const trailPoints: TrailPoint[] = [];
    const motionSparks: MotionSpark[] = [];
    const wakeRipples: WakeRipple[] = [];

    // Sudden splash collections
    const splashDroplets: SplashDroplet[] = [];
    const splashRipples: SplashRipple[] = [];
    const splashFlashes: SplashFlash[] = [];

    const sparkColors = ["#38bdf8", "#06b6d4", "#22d3ee", "#fbbf24", "#f59e0b", "#ffffff"];

    const triggerSplash = (x: number, y: number, mode: "hover" | "click" | "interactive") => {
      const isClick = mode === "click";
      const isInteractive = mode === "interactive";

      const count = isClick ? 28 : isInteractive ? 16 : 10;
      const baseSpeed = isClick ? 6.5 : isInteractive ? 4.2 : 3.0;
      const palette =
        isInteractive || isClick
          ? ["#38bdf8", "#06b6d4", "#22d3ee", "#e0f2fe", "#ffffff"]
          : ["#fbbf24", "#f59e0b", "#d97706", "#fef3c7", "#ffffff"];

      splashFlashes.push({
        x,
        y,
        radius: isClick ? 50 : 28,
        alpha: isClick ? 0.8 : 0.45,
        decay: isClick ? 0.88 : 0.84,
        color: isInteractive || isClick ? "rgba(56, 189, 248, " : "rgba(245, 158, 11, ",
      });

      splashRipples.push({
        x,
        y,
        radius: 6,
        maxRadius: isClick ? 85 : 45,
        speed: isClick ? 3.5 : 2.0,
        alpha: 0.8,
        decay: 0.93,
        color: isInteractive || isClick ? "rgba(56, 189, 248, " : "rgba(245, 158, 11, ",
      });

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = (0.4 + Math.random() * 0.9) * baseSpeed;
        splashDroplets.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: Math.random() * (isClick ? 3.2 : 2.2) + 1.0,
          alpha: 1.0,
          decay: 0.91 + Math.random() * 0.04,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      isVisible = true;

      const dx = mouseX - (prevMouseX > -100 ? prevMouseX : mouseX);
      const dy = mouseY - (prevMouseY > -100 ? prevMouseY : mouseY);
      const speed = Math.hypot(dx, dy);
      currentVelocity = speed;

      const target = e.target as HTMLElement | null;

      const isInteractiveNow =
        !!target &&
        (!!target.closest("a, button, input, textarea, select, [role='button'], [tabindex]") ||
          target.classList.contains("cursor-pointer") ||
          window.getComputedStyle(target).cursor === "pointer");

      isHoveringInteractive = isInteractiveNow;
      targetHaloRadius = isInteractiveNow ? 32 : 18;

      const now = performance.now();

      trailPoints.push({
        x: mouseX,
        y: mouseY,
        alpha: 0.85,
        width: Math.min(4.8, 2.2 + speed * 0.07),
        color: isInteractiveNow ? "#38bdf8" : "#fbbf24",
      });
      if (trailPoints.length > 24) {
        trailPoints.shift();
      }

      const sparkCount = speed > 30 ? 3 : speed > 10 ? 2 : 1;
      const moveAngle = Math.atan2(dy, dx);
      for (let i = 0; i < sparkCount; i++) {
        const angle = moveAngle + Math.PI + (Math.random() - 0.5) * 1.4;
        const sparkSpeed = 0.6 + Math.random() * (1.2 + speed * 0.08);
        motionSparks.push({
          x: mouseX + (Math.random() - 0.5) * 6,
          y: mouseY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * sparkSpeed,
          vy: Math.sin(angle) * sparkSpeed,
          size: 1.0 + Math.random() * 1.6,
          alpha: 0.9,
          decay: 0.89 + Math.random() * 0.04,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
        });
      }
      if (motionSparks.length > 70) {
        motionSparks.splice(0, motionSparks.length - 70);
      }

      const wakeDist = Math.hypot(mouseX - lastWakeX, mouseY - lastWakeY);
      if (wakeDist > 26) {
        wakeRipples.push({
          x: mouseX,
          y: mouseY,
          radius: 3,
          maxRadius: Math.min(44, 22 + speed * 0.4),
          alpha: isInteractiveNow ? 0.55 : 0.38,
          decay: 0.88,
          color: isInteractiveNow ? "rgba(56, 189, 248, " : "rgba(245, 158, 11, ",
        });
        lastWakeX = mouseX;
        lastWakeY = mouseY;
        if (wakeRipples.length > 30) {
          wakeRipples.shift();
        }
      }

      if (target && target !== lastHoveredElement) {
        if (target !== document.body && target !== document.documentElement) {
          if (now - lastSplashTime > 65) {
            triggerSplash(mouseX, mouseY, isInteractiveNow ? "interactive" : "hover");
            lastSplashTime = now;
          }
        }
        lastHoveredElement = target;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      triggerSplash(e.clientX, e.clientY, "click");
    };

    const onMouseLeave = () => {
      isVisible = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    let rafId = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (smoothX < -100) {
        smoothX = mouseX;
        smoothY = mouseY;
      } else {
        smoothX += (mouseX - smoothX) * 0.32;
        smoothY += (mouseY - smoothY) * 0.32;
      }

      currentHaloRadius += (targetHaloRadius - currentHaloRadius) * 0.18;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let i = splashFlashes.length - 1; i >= 0; i--) {
        const f = splashFlashes[i];
        f.alpha *= f.decay;
        if (f.alpha < 0.01) {
          splashFlashes.splice(i, 1);
          continue;
        }
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
        grad.addColorStop(0, `${f.color}${f.alpha})`);
        grad.addColorStop(1, `${f.color}0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = splashRipples.length - 1; i >= 0; i--) {
        const r = splashRipples[i];
        r.radius += r.speed;
        r.alpha *= r.decay;
        if (r.alpha < 0.02 || r.radius >= r.maxRadius) {
          splashRipples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `${r.color}${r.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = wakeRipples.length - 1; i >= 0; i--) {
        const w = wakeRipples[i];
        w.radius += 1.3;
        w.alpha *= w.decay;
        if (w.alpha < 0.02 || w.radius >= w.maxRadius) {
          wakeRipples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `${w.color}${w.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (trailPoints.length > 2) {
        for (let i = 0; i < trailPoints.length - 1; i++) {
          const pt = trailPoints[i];
          const next = trailPoints[i + 1];
          const progress = i / trailPoints.length;
          ctx.strokeStyle = pt.color;
          ctx.globalAlpha = pt.alpha * progress * 0.7;
          ctx.lineWidth = pt.width * progress;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
      }

      for (let i = splashDroplets.length - 1; i >= 0; i--) {
        const d = splashDroplets[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.94;
        d.vy *= 0.94;
        d.alpha *= d.decay;
        if (d.alpha < 0.02) {
          splashDroplets.splice(i, 1);
          continue;
        }
        ctx.fillStyle = d.color;
        ctx.globalAlpha = d.alpha;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = motionSparks.length - 1; i >= 0; i--) {
        const s = motionSparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
        s.alpha *= s.decay;
        if (s.alpha < 0.02) {
          motionSparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      if (isVisible && smoothX > 0 && smoothY > 0) {
        const haloGrad = ctx.createRadialGradient(
          smoothX,
          smoothY,
          0,
          smoothX,
          smoothY,
          currentHaloRadius * 2.2,
        );
        const haloColor = isHoveringInteractive ? "rgba(56, 189, 248, " : "rgba(251, 191, 36, ";

        haloGrad.addColorStop(0, `${haloColor}0.38)`);
        haloGrad.addColorStop(0.45, `${haloColor}0.18)`);
        haloGrad.addColorStop(1, `${haloColor}0)`);

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(smoothX, smoothY, currentHaloRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isHoveringInteractive
          ? "rgba(56, 189, 248, 0.75)"
          : "rgba(251, 191, 36, 0.65)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(smoothX, smoothY, currentHaloRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(smoothX, smoothY, isHoveringInteractive ? 3.4 : 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isTouch) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[999] h-full w-full"
    />
  );
}
