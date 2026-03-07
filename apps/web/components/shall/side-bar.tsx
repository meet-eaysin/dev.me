import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navigation } from './navigation/navigation';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon, ArrowRightIcon, LogOut } from 'lucide-react';
import { Avatar } from '../ui/avatar';

export type SideBarProps = {
  bannersHeight?: number;
};

export function SideBarContainer(props: SideBarProps) {
  return <SideBar {...props} />;
}

export function SideBar({ bannersHeight = 0 }: SideBarProps) {
  const pathname = usePathname();
  const isPlatformPages = pathname?.startsWith('/settings/platform');

  const sidebarStylingAttributes = {
    maxHeight: `calc(100vh - ${bannersHeight}px)`,
    top: `${bannersHeight}px`,
  };

  return (
    <div className="relative">
      <aside
        style={!isPlatformPages ? sidebarStylingAttributes : {}}
        className={cn(
          'bg-cal-muted border-muted fixed left-0 hidden h-full w-14 flex-col overflow-y-auto overflow-x-hidden border-r md:sticky md:flex lg:w-56 lg:px-3',
          !isPlatformPages && 'max-h-screen',
        )}
      >
        <div className="flex h-full flex-col justify-between py-3 lg:pt-4">
          <header className="todesktop:-mt-3 todesktop:flex-col-reverse todesktop:[-webkit-app-region:drag] items-center justify-between md:hidden lg:flex">
            <Link href="/" className="w-full px-1.5 cursor-pointer">
              <div className="flex items-center gap-2 font-medium">
                <Avatar
                  alt={`Mock User`}
                  imageSrc="https://cal.com/api/logo?type=favicon-32"
                  size="xsm"
                />
                <p className="text line-clamp-1 text-sm">
                  <span>Mock User</span>
                </p>
              </div>
            </Link>

            <div className="flex w-full justify-end rtl:space-x-reverse">
              <button
                color="minimal"
                onClick={() => window.history.back()}
                className="todesktop:block hover:text-emphasis text-subtle group hidden text-sm font-medium"
              >
                <ArrowLeftIcon className="group-hover:text-emphasis text-subtle h-4 w-4 shrink-0" />
              </button>
              <button
                color="minimal"
                onClick={() => window.history.forward()}
                className="todesktop:block hover:text-emphasis text-subtle group hidden text-sm font-medium"
              >
                <ArrowRightIcon className="group-hover:text-emphasis text-subtle h-4 w-4 shrink-0" />
              </button>
            </div>
          </header>
          {/* logo icon for tablet */}
          <Link href="/event-types" className="text-center md:inline lg:hidden">
            <LogOut />
          </Link>
          <Navigation />
        </div>
      </aside>
    </div>
  );
}
