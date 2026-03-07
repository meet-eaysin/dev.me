import { useMemo, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const useIsEmbed = () => false;
const useMobileMoreItems = () => [];
const useIsStandalone = () => false;

import type { NavigationItemType } from './navigation-item';
import {
  NavigationItem,
  MobileNavigationItem,
  MobileNavigationMoreItem,
} from './navigation-item';
import { cn } from '@/lib/utils';

export const MORE_SEPARATOR_NAME = 'more';

const getNavigationItems = (): NavigationItemType[] => [
  {
    name: 'Dashboard',
    href: '/',
    icon: 'layout-dashboard',
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: 'file-text',
  },
  {
    name: 'Knowledge Graph',
    href: '/graph',
    icon: 'blocks',
  },
  {
    name: 'Search & Ask',
    href: '/search',
    icon: 'search',
  },
  {
    name: 'Daily Review',
    href: '/review',
    icon: 'book-open',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: 'chart-line',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: 'settings',
  },
];

const useNavigationItems = () => {
  return useMemo(() => {
    const items = getNavigationItems();
    const MAX_MOBILE_ITEMS = 4;

    return {
      desktopNavigationItems: items,
      mobileNavigationBottomItems: items.slice(0, MAX_MOBILE_ITEMS),
      mobileNavigationMoreItems: items.slice(MAX_MOBILE_ITEMS),
    };
  }, []);
};

export const Navigation = () => {
  const { desktopNavigationItems } = useNavigationItems();

  return (
    <nav className="mt-2 flex-1 md:px-2 lg:mt-4 lg:px-0">
      {desktopNavigationItems.map((item) => (
        <NavigationItem key={item.name} item={item} />
      ))}
    </nav>
  );
};

export function MobileNavigationContainer() {
  const isStandalone = useIsStandalone();
  if (isStandalone) return null;
  return <MobileNavigation />;
}

const MobileNavigation = () => {
  const isEmbed = useIsEmbed();
  const { mobileNavigationBottomItems, mobileNavigationMoreItems } =
    useNavigationItems();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav
        className={cn(
          'pwa:pb-[max(0.25rem,env(safe-area-inset-bottom))] pwa:-mx-2 bg-muted/40 border-muted fixed bottom-0 left-0 z-30 flex w-full border-t px-1 shadow backdrop-blur-md md:hidden',
          isEmbed && 'hidden',
        )}
      >
        {mobileNavigationBottomItems.map((item) => (
          <MobileNavigationItem key={item.name} item={item} />
        ))}
        {mobileNavigationMoreItems.length > 0 && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <button className="text-muted-foreground hover:text-emphasis flex flex-1 flex-col items-center justify-center py-2 transition-colors focus:outline-none">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="text-[10px] font-medium leading-none mt-1">
                    More
                  </span>
                </button>
              }
            />
            <SheetContent side="bottom" className="rounded-t-xl p-0 pb-10">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-left text-base">Menu</SheetTitle>
              </SheetHeader>
              <div className="p-2">
                <ul className="grid grid-cols-1 gap-1">
                  {mobileNavigationMoreItems.map((item) => (
                    <li key={item.name} onClick={() => setIsOpen(false)}>
                      <MobileNavigationMoreItem item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </nav>
      {/* add padding to content for mobile navigation*/}
      <div className="block pt-20 md:hidden" />
    </>
  );
};

export const MobileNavigationMoreItems = () => {
  const { mobileNavigationMoreItems } = useNavigationItems();
  const bottomItems = useMobileMoreItems();

  const allItems: NavigationItemType[] = [
    ...mobileNavigationMoreItems,
    ...bottomItems,
  ];

  return (
    <ul className="border-subtle mt-2 rounded-md border">
      {allItems.map((item) => (
        <MobileNavigationMoreItem key={item.name} item={item} />
      ))}
    </ul>
  );
};
