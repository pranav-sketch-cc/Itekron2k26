export type HomeTransitionMotion = {
  aboutProgress: number;
  eventsProgress: number;
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const clamped = clamp(value);
  return clamped * clamped * (3 - 2 * clamped);
}

/**
 * Maps the finite Home handoff to two intentionally overlapping depth tracks.
 * The foreground Events layer begins to rise shortly after the outgoing About
 * layer starts receding, then settles before the sticky transition releases.
 */
export function getHomeTransitionMotion(progress: number, reducedMotion = false): HomeTransitionMotion {
  if (reducedMotion) {
    return { aboutProgress: 1, eventsProgress: 1 };
  }

  const normalized = clamp(progress);
  return {
    aboutProgress: smoothstep(normalized / 0.84),
    eventsProgress: smoothstep((normalized - 0.08) / 0.58),
  };
}
