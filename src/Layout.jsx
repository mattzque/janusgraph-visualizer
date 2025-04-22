import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/Theme/ThemeProvider';
import { ThemeToggle } from '@/components/Theme/ThemeToggle';
import { SidebarToggle } from '@/components/Sidebar/SidebarToggle';
import { RefreshButton } from './components/QueryForm/RefreshButton';
import { Button } from './components/ui/button';
import { Info, PanelRightClose, PanelRightOpen } from 'lucide-react';
import DetailSidebar from './components/DetailSidebar/DetailSidebar';
import { useState } from 'react';
import { Separator } from './components/ui/separator';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function Layout({ children }) {
  const [showDetail, setShowDetail] = useState(true);

  const toggleShowDetail = () => {
    setShowDetail((prev) => !prev);
  };

  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
            <div className='flex flex-1 items-center gap-2'>
              <SidebarToggle />
              <RefreshButton />
            </div>
            <div className='flex flex-1 items-center justify-end gap-2'>
              <ThemeToggle />
              <Button variant='outline' size='icon' onClick={toggleShowDetail}>
                {showDetail ? <PanelRightClose /> : <PanelRightOpen />}
              </Button>
            </div>
          </header>
          <main
            className='flex flex-1 flex-row'
            style={{ maxHeight: 'calc(100vh - var(--spacing) * 16)' }}
          >
            <ResizablePanelGroup direction='horizontal'>
              <ResizablePanel>
                <div className='flex h-full bg-muted/30'>{children}</div>
              </ResizablePanel>
              {showDetail && <ResizableHandle />}
              {showDetail && (
                <ResizablePanel
                  defaultSize={25}
                  minSize={20}
                  className='flex w-[420px] h-full bg-muted/50'
                >
                  <DetailSidebar />
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
