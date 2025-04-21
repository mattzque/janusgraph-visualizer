import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  TextField,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import axios from 'axios';
import {
  ACTIONS,
  QUERY_ENDPOINT,
  COMMON_GREMLIN_ERROR,
  SETTINGS_ENDPOINT,
} from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';

let cancelTokenSource;

export default function HeaderComponent() {
  const dispatch = useDispatch();
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

  const clearGraph = () => {
    dispatch({ type: ACTIONS.CLEAR_GRAPH });
    dispatch({ type: ACTIONS.CLEAR_QUERY_HISTORY });
  };

  const sendQuery = () => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    cancelTokenSource = axios.CancelToken.source();

    axios
      .post(
        QUERY_ENDPOINT,
        { host, port, query, nodeLimit, traversalSource },
        {
          headers: { 'Content-Type': 'application/json' },
          cancelToken: cancelTokenSource.token,
        }
      )
      .then((response) => {
        onFetchQuery(response, query, nodeLabels, dispatch);
      })
      .catch(() => {
        dispatch({ type: ACTIONS.SET_ERROR, payload: COMMON_GREMLIN_ERROR });
      })
      .finally(() => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      });
  };

  const cancel = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel();
      cancelTokenSource = null;
    }
  };

  const onHostChanged = (host) => {
    dispatch({ type: ACTIONS.SET_HOST, payload: host });
  };

  const onPortChanged = (port) => {
    dispatch({ type: ACTIONS.SET_PORT, payload: port });
  };

  const onTraversalSourceChange = (traversalSource) => {
    dispatch({ type: ACTIONS.SET_TRAVERSAL_SOURCE, payload: traversalSource });
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

  return (
    <div className={'header'}>
      <form noValidate autoComplete='off'>
        <TextField
          value={host}
          onChange={(event) => onHostChanged(event.target.value)}
          id='standard-basic'
          label='host'
          style={{ width: '10%' }}
        />
        <TextField
          value={port}
          onChange={(event) => onPortChanged(event.target.value)}
          id='standard-basic'
          label='port'
          style={{ width: '10%' }}
        />
        <TextField
          value={traversalSource}
          onChange={(event) => onTraversalSourceChange(event.target.value)}
          id='standard-basic'
          label='Gremlin Traversal Source'
          style={{ width: '20%' }}
        />
        <TextField
          value={query}
          onChange={(event) => onQueryChanged(event.target.value)}
          id='standard-basic'
          label='gremlin query'
          style={{ width: '60%' }}
        />
        <Button
          variant='contained'
          disabled={loading}
          color='primary'
          onClick={sendQuery}
          style={{ width: '150px' }}
        >
          Execute
        </Button>
        <Button
          variant='outlined'
          color='secondary'
          onClick={clearGraph}
          style={{ width: '150px' }}
        >
          Clear Graph
        </Button>
        {loading && (
          <>
            <LinearProgress />
            <Button
              variant='contained'
              color='warn'
              onClick={cancel}
              style={{ width: '150px' }}
            >
              Cancel
            </Button>
          </>
        )}
        {initializing && (
          <Dialog open={true}>
            <DialogTitle>{'Initializing...'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Getting initial values from API...
              </DialogContentText>
            </DialogContent>
          </Dialog>
        )}
      </form>

      <br />
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  );
}
