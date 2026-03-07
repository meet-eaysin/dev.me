import Link from 'next/link';
const useIsEmbed = () => false;
const useIsStandalone = () => false;
import { UserDropdown } from './user-dropdown/UserDropdown';
import { LogOut, SettingsIcon } from 'lucide-react';

export function TopNavContainer() {
  const isStandalone = useIsStandalone();
  if (isStandalone) return null;
  return <TopNav />;
}

function TopNav() {
  const isEmbed = useIsEmbed();

  return (
    <>
      <nav
        style={isEmbed ? { display: 'none' } : {}}
        className="bg-cal-muted/50 border-subtle sticky top-0 z-40 flex w-full items-center justify-between border-b px-4 py-1.5 backdrop-blur-lg sm:p-4 md:hidden"
      >
        <Link href="/event-types">
          <LogOut />
        </Link>
        <div className="flex items-center gap-2 self-center">
          <button className="hover:bg-cal-muted hover:text-subtle text-muted rounded-full p-1 transition focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
            <span className="sr-only">Settings</span>
            <Link href="/settings/my-account/profile">
              <SettingsIcon className="text-default h-4 w-4" />
            </Link>
          </button>
          <UserDropdown small />
        </div>
      </nav>
    </>
  );
}
