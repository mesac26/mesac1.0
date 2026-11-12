export type GearVariant =
  | "home"
  | "achievements"
  | "events"
  | "team"
  | "downloads"
  | "academic"
  | "placements"
  | "gallery"
  | "contact"
  | "default";

interface PageBackgroundProps {
  variant?: GearVariant;
  className?: string;
}

const variantBackgroundMap: Record<GearVariant, string> = {
  home: "bg-gradient-to-b from-[#0b1020] via-[#060812] to-[#000000]",
  placements: "bg-gradient-to-b from-[#0c1232] via-[#080a1e] to-[#040510]",
  achievements: "bg-gradient-to-b from-[#141008] via-[#090804] to-[#000000]",
  events: "bg-gradient-to-b from-[#0a1226] via-[#060b18] to-[#020308]",
  team: "bg-gradient-to-b from-[#0c1222] via-[#070b16] to-[#020409]",
  downloads: "bg-gradient-to-b from-[#071328] via-[#050c1c] to-[#02040b]",
  academic: "bg-gradient-to-b from-[#091124] via-[#060b18] to-[#020309]",
  gallery: "bg-gradient-to-b from-[#0e0f14] via-[#08080c] to-[#000000]",
  contact: "bg-gradient-to-b from-[#0b1020] via-[#060914] to-[#000000]",
  default: "bg-gradient-to-b from-[#0b1122] via-[#060a16] to-[#000000]",
};

/**
 * PageGearBackground:
 * Restores the rich, authentic dark industrial background color, metallic gradients,
 * and ambient lighting that accompanied the gears across all page headers,
 * with the mechanical gears themselves removed as requested.
 */
export function PageGearBackground({ variant = "default", className = "" }: PageBackgroundProps) {
  const bgGradient = variantBackgroundMap[variant] || variantBackgroundMap.default;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden select-none ${bgGradient} ${className}`}
    >
      {/* 1. BASE MACHINED METALLIC STRIATIONS */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* 2. ATMOSPHERIC AMBIENT RADIAL BEAMS & HIGHLIGHT FLARES */}
      {variant === "home" && (
        <>
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full opacity-55"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.28) 0%, rgba(37, 99, 235, 0.14) 40%, transparent 72%)",
              filter: "blur(65px)",
            }}
          />
          <div
            className="absolute top-1/4 -right-16 h-[420px] w-[420px] rounded-full opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />
        </>
      )}

      {variant === "achievements" && (
        <>
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 h-[580px] w-[850px] rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.32) 0%, rgba(217, 119, 6, 0.18) 45%, transparent 75%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute bottom-0 right-12 h-80 w-80 rounded-full opacity-45"
            style={{
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
        </>
      )}

      {variant === "placements" && (
        <>
          <div
            className="absolute -top-28 left-1/2 -translate-x-1/2 h-[620px] w-[950px] rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.28) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 75%)",
              filter: "blur(65px)",
            }}
          />
          <div
            className="absolute top-1/3 -left-20 h-[380px] w-[380px] rounded-full opacity-35"
            style={{
              background: "radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 65%)",
              filter: "blur(55px)",
            }}
          />
        </>
      )}

      {variant === "events" && (
        <>
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-55"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.3) 0%, rgba(236, 72, 153, 0.12) 45%, transparent 75%)",
              filter: "blur(65px)",
            }}
          />
          <div
            className="absolute top-1/3 -right-12 h-80 w-80 rounded-full opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 65%)",
              filter: "blur(50px)",
            }}
          />
        </>
      )}

      {variant === "team" && (
        <>
          <div
            className="absolute -top-28 left-1/2 -translate-x-1/2 h-[600px] w-[920px] rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.26) 0%, rgba(99, 102, 241, 0.15) 45%, transparent 75%)",
              filter: "blur(65px)",
            }}
          />
          <div
            className="absolute top-1/4 -left-12 h-80 w-80 rounded-full opacity-35"
            style={{
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 65%)",
              filter: "blur(50px)",
            }}
          />
        </>
      )}

      {variant === "downloads" && (
        <>
          <div
            className="absolute -top-28 left-1/2 -translate-x-1/2 h-[620px] w-[960px] rounded-full opacity-55"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.25) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 75%)",
              filter: "blur(65px)",
            }}
          />
          <div
            className="absolute bottom-8 right-8 h-80 w-80 rounded-full opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)",
              filter: "blur(55px)",
            }}
          />
        </>
      )}

      {variant === "academic" && (
        <>
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-55"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.28) 0%, rgba(16, 185, 129, 0.14) 45%, transparent 75%)",
              filter: "blur(65px)",
            }}
          />
          <div
            className="absolute top-1/3 -left-16 h-80 w-80 rounded-full opacity-35"
            style={{
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 65%)",
              filter: "blur(55px)",
            }}
          />
        </>
      )}

      {variant === "gallery" && (
        <>
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 h-[580px] w-[880px] rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.24) 0%, rgba(168, 85, 247, 0.12) 45%, transparent 75%)",
              filter: "blur(65px)",
            }}
          />
        </>
      )}

      {variant === "contact" && (
        <>
          <div
            className="absolute -top-28 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-55"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.28) 0%, rgba(37, 99, 235, 0.15) 45%, transparent 75%)",
              filter: "blur(65px)",
            }}
          />
          <div
            className="absolute bottom-10 left-10 h-80 w-80 rounded-full opacity-35"
            style={{
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 65%)",
              filter: "blur(50px)",
            }}
          />
        </>
      )}

      {variant === "default" && (
        <>
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 h-[580px] w-[880px] rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.25) 0%, rgba(37, 99, 235, 0.12) 45%, transparent 75%)",
              filter: "blur(60px)",
            }}
          />
        </>
      )}
    </div>
  );
}
