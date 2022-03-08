export function randomColor() {
  let hex = Math.floor(Math.random() * 0xe51030)
  let color = '#' + hex.toString(16)

  return color
}
