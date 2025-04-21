import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { ThemeProvider } from '@/components/Theme/ThemeProvider';
import { ThemeToggle } from '@/components/Theme/ThemeToggle';
import { SidebarToggle } from '@/components/Sidebar/SidebarToggle';
import {
  ACTIONS,
  COMMON_GREMLIN_ERROR,
  QUERY_ENDPOINT,
  SETTINGS_ENDPOINT,
} from '@/constants';
import { onFetchQuery } from '@/logics/actionHelper';
import {
  CircleX,
  Focus,
  Loader2,
  RefreshCcw,
  ScanSearch,
  SearchSlash,
  AlertCircle,
} from 'lucide-react';
import { useGremlinQuery } from '@/hooks/useGremlinQuery';

let cancelTokenSource;

export function RefreshButton() {
  const dispatch = useDispatch();
  const { sendQuery, cancelQuery } = useGremlinQuery();

  const clearGraph = () => {
    dispatch({ type: ACTIONS.CLEAR_GRAPH });
    dispatch({ type: ACTIONS.CLEAR_QUERY_HISTORY });
  };

  return (
    <Button
      variant='outline'
      className='height-9'
      onClick={(event) => {
        clearGraph();
        sendQuery();
      }}
    >
      <RefreshCcw />
      <span className='text'>Refresh</span>
    </Button>
  );
}
