interface PostImageProps {
  url: string;
}

export function PostImage({ url }: PostImageProps) {
  return (
    <div
      className="w-full"
      style={{
        height: 340,
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
