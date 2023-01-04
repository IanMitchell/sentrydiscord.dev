export default function getColor(level: string) {
  switch (level) {
    case "debug":
      return parseInt("fbe14f", 16);
    case "info":
      return parseInt("2788ce", 16);
    case "warning":
      return parseInt("f18500", 16);
    case "fatal":
      return parseInt("d20f2a", 16);
    case "error":
    default:
      return parseInt("e03e2f", 16);
  }
}
