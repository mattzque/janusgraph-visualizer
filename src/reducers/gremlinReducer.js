import { ACTIONS } from '../constants';

const initialState = {
  loading: false,
  initializing: true,
  host: 'init...',
  port: 'init...',
  query: 'init...',
  traversalSource: 'init...',
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_INITIALIZING: {
      return { ...state, initializing: action.payload };
    }
    case ACTIONS.SET_LOADING: {
      return { ...state, loading: action.payload };
    }
    case ACTIONS.SET_HOST: {
      return { ...state, host: action.payload };
    }
    case ACTIONS.SET_PORT: {
      return { ...state, port: action.payload };
    }
    case ACTIONS.SET_QUERY: {
      return { ...state, query: action.payload, error: null };
    }
    case ACTIONS.SET_TRAVERSAL_SOURCE: {
      return { ...state, traversalSource: action.payload, error: null };
    }
    case ACTIONS.SET_ERROR: {
      return { ...state, error: action.payload };
    }
    default:
      return state;
  }
};
