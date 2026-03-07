import type { NavigationItemType } from './navigation-item';

const useBottomNavItems = (): NavigationItemType[] => [
  {
    name: 'documents',
    label: 'Documents',
    href: '/documents',
    icon: 'file-text' as const,
  },
  {
    name: 'search',
    label: 'Search',
    href: '/search',
    icon: 'search' as const,
  },
  {
    name: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: 'settings' as const,
  },
];

export function useMobileMoreItems(): NavigationItemType[] {
  const bottomNavItems = useBottomNavItems();

  const filteredBottomNavItems = bottomNavItems.filter(
    (item: NavigationItemType) => item.name !== 'documents',
  );
  return filteredBottomNavItems;
}
