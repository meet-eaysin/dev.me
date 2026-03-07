// Mocked missing modules
const useFlagMap = () => ({}) as Record<string, boolean>;
const isKeyInObject = (key: string, obj: object): key is keyof typeof obj =>
  key in obj;

import type { NavigationItemType } from './NavigationItem';

export function useShouldDisplayNavigationItem(item: NavigationItemType) {
  const flags = useFlagMap();
  if (isKeyInObject(item.name, flags)) return flags[item.name];
  return true;
}
