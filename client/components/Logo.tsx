export function Logo({ size = 40, showImage = true }: { size?: number; showImage?: boolean }) {
  if (showImage) {
    return (
      <img
        src="https://cdn.builder.io/api/v1/image/assets%2Fc14e50b1d8924051b1d1901f9fb27cdb%2Fb5c9a1cb60b84f80ad2c8df42d0e7603?format=webp&width=800"
        alt="Posso Ajudar Logo"
        width={size}
        height={size}
        className="drop-shadow-lg"
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Top Left Circle */}
      <circle cx="60" cy="35" r="18" fill="#14B8A6" opacity="0.9" />

      {/* Top Right Circle */}
      <circle cx="120" cy="35" r="18" fill="#14B8A6" opacity="0.9" />

      {/* Main Hand Shape */}
      {/* Thumb */}
      <path
        d="M 60 80 Q 50 85 45 100 Q 42 115 50 125"
        stroke="#14B8A6"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Index Finger */}
      <path
        d="M 75 60 L 75 140 Q 75 155 85 160"
        stroke="#14B8A6"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Middle Finger */}
      <path
        d="M 100 50 L 100 155 Q 100 170 110 175"
        stroke="#14B8A6"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Ring Finger */}
      <path
        d="M 125 60 L 125 150 Q 125 165 135 170"
        stroke="#14B8A6"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Pinky Finger */}
      <path
        d="M 145 75 L 145 140 Q 145 155 155 160"
        stroke="#14B8A6"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Palm/Hand Base */}
      <path
        d="M 60 80 L 75 60 L 100 50 L 125 60 L 145 75 Q 150 85 148 100 Q 145 120 140 140 Q 130 160 100 170 Q 70 160 60 140 Q 55 120 58 100 Q 60 85 60 80"
        fill="#14B8A6"
        opacity="0.85"
      />
    </svg>
  );
}
