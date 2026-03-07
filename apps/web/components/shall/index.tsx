'use client';

import { useRouter } from 'next/navigation';
import type {
  Dispatch,
  JSX,
  ReactElement,
  ReactNode,
  SetStateAction,
} from 'react';
import React, { cloneElement } from 'react';

import { MobileNavigationContainer } from './navigation/Navigation';
import { Provider as TooltipProvider } from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
import { SideBarContainer } from './SideBar';
import { TopNavContainer } from './TopNav';
import { Button } from '../button';

const Layout = (props: LayoutProps) => {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1" data-testid="dashboard-shell">
          {props.SidebarContainer ? (
            cloneElement(props.SidebarContainer)
          ) : (
            <SideBarContainer bannersHeight={0} />
          )}
          <div className="flex w-0 flex-1 flex-col">
            <MainContainer {...props} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

type DrawerState = [
  isOpen: boolean,
  setDrawerOpen: Dispatch<SetStateAction<boolean>>,
];

export type LayoutProps = {
  centered?: boolean;
  title?: string;
  description?: string;
  heading?: ReactNode;
  subtitle?: ReactNode;
  headerClassName?: string;
  children: ReactNode;
  CTA?: ReactNode;
  large?: boolean;
  MobileNavigationContainer?: ReactNode;
  SidebarContainer?: ReactElement;
  TopNavContainer?: ReactNode;
  drawerState?: DrawerState;
  HeadingLeftIcon?: ReactNode;
  backPath?: string | boolean; // renders back button to specified path
  // use when content needs to expand with flex
  flexChildrenContainer?: boolean;
  isPublic?: boolean;
  withoutMain?: boolean;
  // Gives the ability to include actions to the right of the heading
  actions?: JSX.Element;
  beforeCTAactions?: JSX.Element;
  afterHeading?: ReactNode;
  smallHeading?: boolean;
  isPlatformUser?: boolean;
  disableSticky?: boolean;
};

export default function Shell(props: LayoutProps) {
  return <Layout {...props} />;
}

export function ShellMain(props: LayoutProps) {
  const router = useRouter();

  return (
    <>
      {(props.heading || !!props.backPath) && (
        <div
          className={cn(
            'bg-default mb-0 flex items-center md:mb-6 md:mt-0',
            props.smallHeading ? 'lg:mb-7' : 'lg:mb-8',
            !props.disableSticky && 'sticky top-0 z-10',
          )}
        >
          {!!props.backPath && (
            <Button
              variant="icon"
              size="sm"
              color="minimal"
              onClick={() =>
                typeof props.backPath === 'string'
                  ? router.push(props.backPath as string)
                  : router.back()
              }
              StartIcon="arrow-left"
              aria-label="Go Back"
              className="rounded-md ltr:mr-2 rtl:ml-2"
              data-testid="go-back-button"
            />
          )}
          {props.heading && (
            <header
              className={cn(
                props.large && 'py-8',
                'flex w-full max-w-full items-center truncate',
              )}
            >
              {props.HeadingLeftIcon && (
                <div className="ltr:mr-4">{props.HeadingLeftIcon}</div>
              )}
              <div
                className={cn(
                  'w-full truncate ltr:mr-4 rtl:ml-4 md:block',
                  props.headerClassName,
                )}
              >
                {props.heading && (
                  <h3
                    className={cn(
                      'font-cal text-emphasis max-w-28 sm:max-w-72 md:max-w-80 hidden truncate text-lg font-semibold tracking-wide sm:text-xl md:block xl:max-w-full',
                      props.smallHeading ? 'text-base' : 'text-xl',
                    )}
                  >
                    {props.heading}
                  </h3>
                )}
                {props.subtitle && (
                  <p
                    className="text-default hidden text-sm md:block"
                    data-testid="subtitle"
                  >
                    {props.subtitle}
                  </p>
                )}
              </div>
              {props.beforeCTAactions}
              {props.CTA && (
                <div
                  className={cn(
                    props.backPath
                      ? 'relative'
                      : 'pwa:bottom-[max(7rem,calc(5rem+env(safe-area-inset-bottom)))] fixed bottom-20 z-40 ltr:right-4 rtl:left-4 md:z-auto md:ltr:right-0 md:rtl:left-0',
                    'shrink-0 [-webkit-app-region:no-drag] md:relative md:bottom-auto md:right-auto',
                  )}
                >
                  {props.CTA}
                </div>
              )}
              {props.actions && props.actions}
            </header>
          )}
        </div>
      )}
      {props.afterHeading && <>{props.afterHeading}</>}
      <div
        className={cn(props.flexChildrenContainer && 'flex flex-1 flex-col')}
      >
        {props.children}
      </div>
    </>
  );
}

function MainContainer({
  isPlatformUser,
  MobileNavigationContainer: MobileNavigationContainerProp = (
    <MobileNavigationContainer isPlatformNavigation={isPlatformUser} />
  ),
  TopNavContainer: TopNavContainerProp = <TopNavContainer />,
  ...props
}: LayoutProps) {
  return (
    <main className="bg-default relative z-0 flex-1 focus:outline-none">
      {/* show top navigation for md and smaller (tablet and phones) */}
      {TopNavContainerProp}
      <div className="max-w-full p-2 sm:p-4 lg:p-6">
        {!props.withoutMain ? (
          <ShellMain {...props}>{props.children}</ShellMain>
        ) : (
          props.children
        )}
        {/* show bottom navigation for md and smaller (tablet and phones) on pages where back button doesn't exist */}
        {!props.backPath ? MobileNavigationContainerProp : null}
      </div>
    </main>
  );
}
