interface PhotoTileProps {
  url: string;
}

export function PhotoTile({ url }: PhotoTileProps) {
  return (
    <div
      className="flex-1"
      style={{
        height: 100,
        borderRadius: 12,
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
