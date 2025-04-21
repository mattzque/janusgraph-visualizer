import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircleX, Loader2, ScanSearch, AlertCircle } from 'lucide-react';
import { ACTIONS, SETTINGS_ENDPOINT } from '../../constants';
import { useGremlinQuery } from '@/hooks/useGremlinQuery';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function EndpointForm() {
  const dispatch = useDispatch();
  const { sendQuery, cancelQuery } = useGremlinQuery();
  const {
    loading,
    host,
    port,
    traversalSource,
    query,
    error,
    initializing,
    nodeLabels,
    nodeLimit,
  } = useSelector((state) => ({
    loading: state.gremlin.loading,
    host: state.gremlin.host,
    port: state.gremlin.port,
    traversalSource: state.gremlin.traversalSource,
    query: state.gremlin.query,
    error: state.gremlin.error,
    initializing: state.gremlin.initializing,
    nodeLabels: state.options.nodeLabels,
    nodeLimit: state.options.nodeLimit,
  }));

  const onHostChanged = (host) => {
    dispatch({ type: ACTIONS.SET_HOST, payload: host });
  };

  const onPortChanged = (port) => {
    dispatch({ type: ACTIONS.SET_PORT, payload: port });
  };

  const onTraversalSourceChange = (traversalSource) => {
    dispatch({ type: ACTIONS.SET_TRAVERSAL_SOURCE, payload: traversalSource });
  };

  return (
    <div className='flex flex-col gap-2 py-2'>
      <div className=''>
        <Label>Hostname</Label>
        <Input
          className='h-8'
          value={host}
          onChange={(event) => onHostChanged(event.target.value)}
        />
      </div>
      <div className=''>
        <Label>Port</Label>
        <Input
          className='h-8'
          value={port}
          onChange={(event) => onPortChanged(event.target.value)}
        />
      </div>
      <div className=''>
        <Label>Gremlin Traversal Source</Label>
        <Input
          className='h-8'
          value={traversalSource}
          onChange={(event) => onTraversalSourceChange(event.target.value)}
        />
      </div>
    </div>
  );
}
