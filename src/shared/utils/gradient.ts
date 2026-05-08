export function gradientBg(stops: string[], deg = 135): string {
  return `linear-gradient(${deg}deg, ${stops
    .map((c, i) => `${c} ${(i / (stops.length - 1)) * 100}%`)
    .join(", ")})`;
}

export function gradientText(stops: string[], deg = 90): React.CSSProperties {
  return {
    background: `linear-gradient(${deg}deg, ${stops
      .map((c, i) => `${c} ${(i / (stops.length - 1)) * 100}%`)
      .join(", ")})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  };
}
