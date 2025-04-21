import { Moon, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function SidebarToggle({ className, onClick, ...props }) {
  const { toggleSidebar, open } = useSidebar();

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
    >
      {open ? <PanelLeftClose /> : <PanelLeftOpen />}
    </Button>
  );
}
