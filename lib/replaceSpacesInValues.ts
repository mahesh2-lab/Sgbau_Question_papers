export function replaceSpacesInValues(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => replaceSpacesInValues(item));
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, replaceSpacesInValues(value)])
    );
  } else if (typeof obj === "string") {
    return obj.replace(/ /g, "_");
  }
  return obj;
}



export function metadataToPath(metadata: Record<string, string>) {
  if (!metadata) return "";

  Object.entries(metadata).forEach(([key, value]) => {
    if (!value) {
      delete metadata[key];
    }
  });

const order = [
    "branch",
    "semester",
    "subject",
    "paperType",
    "solveType",
    "unitOrYear",
].filter((key) => key in metadata && metadata[key]);

  return order
    .map((key) => metadata[key]) // pick values in correct order
    .filter(Boolean) // remove any undefined/null
    .join("/"); // join with slash
}
