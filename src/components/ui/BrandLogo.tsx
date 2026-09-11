import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  decorative?: boolean;
  priority?: boolean;
  src?: string;
  variant?: "on-light" | "on-dark";
  width?: number;
  height?: number;
}

export default function BrandLogo({
  className = "",
  decorative = false,
  priority = false,
  src,
  variant = "on-light",
  width,
  height,
}: BrandLogoProps) {
  const isBackendLogo = Boolean(src);

  return (
    <Image
      src={src || `/brand/korankuid-${variant}.svg`}
      alt={decorative ? "" : "korankuid"}
      aria-hidden={decorative || undefined}
      width={width || (isBackendLogo ? 978 : 470)}
      height={height || (isBackendLogo ? 629 : 132)}
      priority={priority}
      unoptimized={isBackendLogo}
      className={className}
    />
  );
}
