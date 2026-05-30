"use client";

function ShimmerBar({ width, height = 10 }: { width: string; height?: number }) {
  return (
    <div
      className="rounded bg-border-dim"
      style={{
        width,
        height,
        animation: "shimmer 1.5s infinite",
        backgroundImage:
          "linear-gradient(90deg, #191a24 25%, #22232e 50%, #191a24 75%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}

export function SkeletonLoader() {
  return (
    <div className="px-6 py-5 flex flex-col gap-6" style={{ animation: "fade-in 0.2s ease-out" }}>
      {/* Title */}
      <ShimmerBar width="40%" height={18} />

      {/* Paragraph */}
      <div className="flex flex-col gap-2">
        <ShimmerBar width="100%" />
        <ShimmerBar width="95%" />
        <ShimmerBar width="80%" />
      </div>

      {/* Subtitle */}
      <ShimmerBar width="30%" height={14} />

      {/* Table-like rows */}
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-3">
          <ShimmerBar width="20%" />
          <ShimmerBar width="35%" />
          <ShimmerBar width="35%" />
        </div>
        <div className="flex gap-3">
          <ShimmerBar width="20%" />
          <ShimmerBar width="30%" />
          <ShimmerBar width="40%" />
        </div>
        <div className="flex gap-3">
          <ShimmerBar width="20%" />
          <ShimmerBar width="25%" />
          <ShimmerBar width="45%" />
        </div>
      </div>

      {/* Subtitle */}
      <ShimmerBar width="25%" height={14} />

      {/* List items */}
      <div className="flex flex-col gap-2">
        <ShimmerBar width="90%" />
        <ShimmerBar width="85%" />
        <ShimmerBar width="75%" />
        <ShimmerBar width="88%" />
      </div>

      {/* Another subtitle */}
      <ShimmerBar width="35%" height={14} />

      {/* More content */}
      <div className="flex flex-col gap-2">
        <ShimmerBar width="100%" />
        <ShimmerBar width="92%" />
        <ShimmerBar width="60%" />
      </div>
    </div>
  );
}
