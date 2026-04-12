import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function defaults(props: IconProps) {
  const { size = 24, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...defaults(props)}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

export function PlugIcon(props: IconProps) {
  return (
    <svg {...defaults(props)}>
      <path d="M12 22v-5" />
      <path d="M9 8V2M15 8V2" />
      <path d="M6 8h12a2 2 0 012 2v1a6 6 0 01-6 6h-4a6 6 0 01-6-6v-1a2 2 0 012-2z" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...defaults(props)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <svg {...defaults(props)}>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
    </svg>
  );
}

export function FileCheckIcon(props: IconProps) {
  return (
    <svg {...defaults(props)}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  );
}

export function OpenSourceIcon(props: IconProps) {
  return (
    <svg {...defaults(props)}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...defaults({ size: 20, ...props })}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...defaults({ size: 16, ...props })}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const iconMap = {
  search: SearchIcon,
  plug: PlugIcon,
  globe: GlobeIcon,
  clipboard: ClipboardIcon,
  filecheck: FileCheckIcon,
  opensource: OpenSourceIcon,
} as const;

export type IconName = keyof typeof iconMap;

export function Icon({ name, ...props }: { name: IconName } & IconProps) {
  const Component = iconMap[name];
  return <Component {...props} />;
}
