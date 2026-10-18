const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export const ArrowUpRight = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} strokeWidth={2.2} {...base}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const ArrowLeft = () => (
  <svg width={18} height={18} strokeWidth={2.2} {...base}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const ArrowRight = () => (
  <svg width="1em" height="1em" strokeWidth={2.4} {...base}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);
