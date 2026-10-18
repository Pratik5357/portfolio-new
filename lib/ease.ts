/* GSAP's curves from the original, as cubic-béziers for Motion */
export type Bezier = [number, number, number, number];

export const expoOut: Bezier = [0.16, 1, 0.3, 1];
export const expoIn: Bezier = [0.7, 0, 0.84, 0];
export const power3Out: Bezier = [0.33, 1, 0.68, 1];
export const power2In: Bezier = [0.32, 0, 0.67, 0];
/* on-screen movement (the page wipe) */
export const easeInOut: Bezier = [0.77, 0, 0.175, 1];

/* "top 90%" style ScrollTrigger starts, as viewport margins */
export const startAt = (pct: number) => ({ once: true, margin: `0px 0px -${100 - pct}% 0px` });
