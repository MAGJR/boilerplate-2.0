/**
 * Converts a hexadecimal color code to HSL (Hue, Saturation, Lightness) format.
 *
 * @param {string} hex - The hexadecimal color code to be converted.
 * @returns {string} The HSL representation of the color.
 */
export function hexToHsl(hex: string): string {
  // Remove the "#" character if present
  hex = hex.replace('#', '')

  // Convert the hexadecimal value to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255

  // Find the maximum and minimum values of the RGB components
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  // Calculate the lightness (lightness)
  const lightness = (max + min) / 2

  let hue, saturation

  if (max === min) {
    // Special case: grayscale tones
    hue = 0
    saturation = 0
  } else {
    const delta = max - min

    // Calculate the saturation (saturation)
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    // Calculate the hue (hue)
    if (max === r) {
      hue = (g - b) / delta + (g < b ? 6 : 0)
    } else if (max === g) {
      hue = (b - r) / delta + 2
    } else {
      hue = (r - g) / delta + 4
    }

    hue /= 6
  }

  // Round the values and format the HSL string
  const h = Math.round(hue * 360)
  const s = Math.round(saturation * 100)
  const l = Math.round(lightness * 100)

  return `${h}, ${s}%, ${l}%`
}
