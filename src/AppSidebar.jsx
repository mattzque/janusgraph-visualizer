import {
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  Search,
  Settings,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { useState } from 'react';

import { QueryForm } from '@/components/QueryForm/QueryForm';
import { EndpointForm } from '@/components/EndpointForm/EndpointForm';
import { Separator } from './components/ui/separator';

// on collapsible:
// defaultOpen?: boolean;
// open?: boolean;
// disabled?: boolean;
// onOpenChange?(open: boolean): void;

function AppSidebarGroup({ label, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      className='group/collapsible'
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SidebarGroup className='gap-0'>
        <SidebarGroupLabel asChild>
          <SidebarMenuButton asChild>
            <CollapsibleTrigger>
              {label}
              <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
            </CollapsibleTrigger>
          </SidebarMenuButton>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>{children}</SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className='gap-0'>
        <div className='flex flex-col items-center justify-center pt-1 pb-3 text-xs text-secondary'>
          <div className='flex items-center justify-center h-16'>
            <img src='/janusgraph.png' alt='JanusGraph' className='h-15' />
          </div>
          <span>JanusGraph Visualizer</span>
        </div>
        <Separator />
        <AppSidebarGroup label='Gremlin Query' defaultOpen>
          <QueryForm />
        </AppSidebarGroup>
        <Separator />
        <AppSidebarGroup label='History'>todo.</AppSidebarGroup>
        <Separator />
        <AppSidebarGroup label='Settings'>todo.</AppSidebarGroup>
        <Separator />
        <AppSidebarGroup label='Endpoint'>
          <EndpointForm />
        </AppSidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
