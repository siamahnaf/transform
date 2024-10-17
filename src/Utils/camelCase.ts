export function camelCase(str: string): string {
    if (!str) return str;

    // Split the string by non-alphanumeric characters and transitions from lowercase to uppercase
    const words = str
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Add a space between camel case transitions
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // Separate words in cases like "UPPERCase"
        .replace(/([a-z])([0-9])/g, "$1 $2") // Separate words in cases like "lowercase123"
        .replace(/([0-9])([A-Z])/g, "$1 $2") // Separate words in cases like "123UPPERcase", but not "123lowercase"
        .trim()
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean);

    if (words.length === 0) {
        return "";
    }

    const camelCasedWords = words.map((word, index) => {
        return index < 1
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return camelCasedWords.join("");
}
