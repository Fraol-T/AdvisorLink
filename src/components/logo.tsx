import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="150"
      height="37.5"
      aria-label="AdvisorLink Logo"
      {...props}
    >
      <rect width="200" height="50" fill="transparent" />
      <text
        x="10"
        y="35"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize="30"
        fill="hsl(var(--primary))"
        className="font-headline"
      >
        AdvisorLink
      </text>
    </svg>
  );
}