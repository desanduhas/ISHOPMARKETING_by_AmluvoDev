import './ambient-background.css';

/** Decorative layers sit behind content and never take pointer or keyboard input. */
export default function AmbientBackground({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className={`ambient-background${reverse ? ' ambient-reverse' : ''}`} aria-hidden="true">
      <div className="ambient-glow ambient-glow-primary" />
      <div className="ambient-glow ambient-glow-secondary" />
      <svg className="ambient-curves" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" focusable="false">
        <path d="M-180 870C145 1010 335 480 685 338C1020 201 1260 383 1620-95" vectorEffect="non-scaling-stroke" />
        <path d="M-190 914C165 1053 382 518 715 376C1050 233 1295 412 1660-60" vectorEffect="non-scaling-stroke" />
        <path className="ambient-curve-faint" d="M360-160C-20 225 1220 210 1015 660C925 855 1260 1050 1620 755" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="ambient-grain" />
    </div>
  );
}
