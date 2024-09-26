/**
 * Function to get the initials from a name.
 * 
 * This function takes in a name and returns the initials of the name.
 * If the name is empty, it returns 'D'.
 * 
 * @param {string} name - The name to get the initials from.
 * @returns {string} - The initials of the name.
 */
export function getInitialsFromName(name: string): string {
  return name ? name[0] : 'D'
}
