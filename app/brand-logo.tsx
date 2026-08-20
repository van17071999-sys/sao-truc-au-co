export default function BrandLogo({ size = 46, radius = 8, className }: { size?: number; radius?: number; className?: string }) {
  return (
    <img
      className={className}
      src="/logo.jpg"
      alt="Logo Sáo Trúc Âu Cơ"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "cover", borderRadius: radius, flex: "0 0 auto" }}
    />
  );
}
