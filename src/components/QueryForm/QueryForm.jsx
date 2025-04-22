import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircleX, Loader2, ScanSearch, AlertCircle } from 'lucide-react';
import { ACTIONS, SETTINGS_ENDPOINT } from '../../constants';
import { useGremlinQuery } from '@/hooks/useGremlinQuery';

export function QueryForm() {
  const dispatch = useDispatch();
  const { sendQuery, cancelQuery } = useGremlinQuery();
  const { loading, query, error, initializing } = useSelector((state) => ({
    loading: state.gremlin.loading,
    query: state.gremlin.query,
    error: state.gremlin.error,
    initializing: state.gremlin.initializing,
  }));

  const clearGraph = () => {
    dispatch({ type: ACTIONS.CLEAR_GRAPH });
    dispatch({ type: ACTIONS.CLEAR_QUERY_HISTORY });
  };

  const onQueryChanged = (query) => {
    dispatch({ type: ACTIONS.SET_QUERY, payload: query });
  };

  useEffect(() => {
    axios.get(SETTINGS_ENDPOINT).then((response) => {
      dispatch({ type: ACTIONS.SET_HOST, payload: response.data.GREMLIN_HOST });
      dispatch({ type: ACTIONS.SET_PORT, payload: response.data.GREMLIN_PORT });
      dispatch({
        type: ACTIONS.SET_TRAVERSAL_SOURCE,
        payload: response.data.GREMLIN_TRAVERSAL_SOURCE,
      });
      dispatch({
        type: ACTIONS.SET_QUERY,
        payload: response.data.GREMLIN_DEFAULT_QUERY,
      });
      dispatch({ type: ACTIONS.SET_INITIALIZING, payload: false });
    });
  }, [dispatch]);

  const [isInitialized, setIsInitalized] = React.useState(false);

  useEffect(() => {
    if (!isInitialized && !initializing) {
      console.log('initial load here', initializing);
      sendQuery();
      setIsInitalized(true);
    }
  }, [initializing, sendQuery]);

  if (initializing) {
    return (
      <div className='flex flex-col gap-4 py-2'>
        <div className='flex flex-col items-center justify-center pt-1 pb-3 text-xs text-secondary'>
          <span>Getting initial values from API...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 py-2'>
      <Textarea
        id='query'
        label='Query'
        className='bg-background font-mono text-xs md:text-xs'
        value={query}
        onChange={(event) => onQueryChanged(event.target.value)}
      />

      <div className='flex flex-row gap-2'>
        <Button
          variant='outline'
          className='h-8 flex-1'
          disabled={loading}
          onClick={sendQuery}
        >
          <ScanSearch />
          <span className='text'>Execute</span>
        </Button>
        <Button variant='outline' className='h-8 flex-1' onClick={clearGraph}>
          <CircleX />
          <span className='text'>Clear</span>
        </Button>
      </div>

      {loading && (
        <div className='flex flex-col gap-1'>
          <div className='flex flex-col items-center justify-center pt-1 pb-0 text-xs text-secondary'>
            <span>Loading results...</span>
          </div>

          <Button variant='outline' onClick={cancelQuery}>
            <Loader2 className='animate-spin' />
            <span className='text'>Cancel</span>
          </Button>
        </div>
      )}

      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
