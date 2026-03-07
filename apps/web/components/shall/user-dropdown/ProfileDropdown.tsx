import { Avatar } from '@/components/avatar';
import {
  Dropdown,
  DropdownItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/dropdown';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

export function ProfileDropdown() {
  const [menuOpen, setMenuOpen] = useState(false);

  const options = [
    {
      label: 'Profile 1',
      value: '1',
    },
    {
      label: 'Profile 2',
      value: '2',
    },
  ];

  const currentOption = options[0];

  return (
    <Dropdown open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button
          data-testid="user-dropdown-trigger-button"
          className={cn(
            'hover:bg-emphasis todesktop:bg-transparent! group mx-0 flex w-full cursor-pointer appearance-none items-center rounded-full px-2 py-1.5 text-left outline-none transition focus:outline-none focus:ring-0 md:rounded-none lg:rounded',
          )}
        >
          <span className="flex w-full grow items-center justify-around gap-2 text-sm font-medium leading-none">
            <Avatar alt={currentOption?.label || ''} size="xsm" />
            <span className="block w-20 overflow-hidden text-ellipsis whitespace-nowrap">
              {currentOption?.label}
            </span>
            {menuOpen ? (
              <ChevronUpIcon className="group-hover:text-subtle text-muted h-4 w-4 shrink-0 transition rtl:mr-4" />
            ) : (
              <ChevronDownIcon className="group-hover:text-subtle text-muted h-4 w-4 shrink-0 transition rtl:mr-4" />
            )}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          align="start"
          onInteractOutside={() => {
            setMenuOpen(false);
          }}
          className="min-w-56 hariom group overflow-hidden rounded-md"
        >
          <DropdownMenuItem className="p-3 uppercase">
            <span>Switch to</span>
          </DropdownMenuItem>
          {options.map((option) => {
            const isSelected = currentOption?.value === option.value;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => {
                  setMenuOpen(false);
                  if (isSelected) return;
                }}
                className={cn(
                  'flex w-full',
                  isSelected ? 'bg-subtle text-emphasis' : '',
                )}
              >
                <DropdownItem
                  type="button"
                  childrenClassName={cn(
                    'flex w-full justify-between items-center',
                  )}
                >
                  <span>
                    <Avatar alt={option.label || ''} size="xsm" />
                    <span className="ml-2">{option.label}</span>
                  </span>
                  {isSelected ? (
                    <CheckIcon className="ml-2 inline h-4 w-4" />
                  ) : null}
                </DropdownItem>
              </DropdownMenuItem>
            );
          })}

          {/* <DropdownMenuSeparator /> */}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </Dropdown>
  );
}
