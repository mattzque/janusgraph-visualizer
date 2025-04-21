import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useCallback } from 'react';
import { ACTIONS, QUERY_ENDPOINT, COMMON_GREMLIN_ERROR } from '../constants';
import { onFetchQuery } from '../logics/actionHelper';

let cancelTokenSource;

// TODO causes warnings

export const useGremlinQuery = () => {
  const dispatch = useDispatch();
  const { host, port, traversalSource, query, nodeLabels, nodeLimit } =
    useSelector((state) => ({
      host: state.gremlin.host,
      port: state.gremlin.port,
      traversalSource: state.gremlin.traversalSource,
      query: state.gremlin.query,
      nodeLabels: state.options.nodeLabels,
      nodeLimit: state.options.nodeLimit,
    }));

  const sendQuery = useCallback(() => {
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
  }, [dispatch, host, port, query, nodeLimit, traversalSource, nodeLabels]);

  const cancelQuery = useCallback(() => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel();
      cancelTokenSource = null;
    }
  }, [cancelTokenSource]);

  return { sendQuery, cancelQuery };
};
