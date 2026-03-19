export const tokenCategories = [
  { id: "typography", label: "Typography" },
  { id: "palette", label: "Palette" },
  { id: "icons", label: "Icons" },
  { id: "radius", label: "Radius" },
] as const;

export type TokenCategory = (typeof tokenCategories)[number]["id"];

export const defaultTokenCategory: TokenCategory = tokenCategories[0].id;

export const tokenCategoryIds = tokenCategories.map((category) => category.id);

const tokenCategorySet = new Set<string>(tokenCategoryIds);

export const isTokenCategory = (value: string): value is TokenCategory => {
  return tokenCategorySet.has(value);
};
