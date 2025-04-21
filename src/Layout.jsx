import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/Theme/ThemeProvider';
import { ThemeToggle } from '@/components/Theme/ThemeToggle';
import { SidebarToggle } from '@/components/Sidebar/SidebarToggle';
import { RefreshButton } from './components/QueryForm/RefreshButton';
import { Button } from './components/ui/button';
import { Info, PanelRightOpen } from 'lucide-react';
import DetailSidebar from './components/DetailSidebar/DetailSidebar';

export default function Layout({ children }) {
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
              <Button variant='outline' size='icon' onClick={(event) => {}}>
                <Info />
              </Button>
            </div>
          </header>
          <main
            className='flex flex-1 flex-row gap-4 p-4'
            style={{ maxHeight: 'calc(100vh - var(--spacing) * 16)' }}
          >
            <div className='flex w-9/12 h-full rounded-xl bg-muted/50'>
              {children}
            </div>
            <div className='flex w-3/12 h-full rounded-xl bg-muted/50'>
              <DetailSidebar />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
