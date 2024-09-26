import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Concatenates multiple class names into a single string.
 * 
 * This function takes in a variable number of arguments, each of which can be a string, an array of strings, or an object.
 * It uses the `clsx` library to merge the inputs into a single string of class names, and then uses `twMerge` to merge
 * any duplicate or conflicting class names according to Tailwind CSS's rules.
 * 
 * @param {...ClassValue} inputs - The class names or objects to merge.
 * @returns {string} - The merged string of class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
