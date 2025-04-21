import _ from 'lodash';
import { ACTIONS } from '../constants';
import { getDefaultTheme } from '@/lib/themeUtils';

const NODE_LABEL_COLOR = {
  light: '#000',
  dark: '#fff',
};
const EDGE_LABEL_COLOR = {
  light: '#000',
  dark: '#fff',
};
const defaultTheme = getDefaultTheme();

// https://visjs.github.io/vis-network/docs/network/edges.html
const initialState = {
  theme: defaultTheme,
  nodeLabels: [],
  queryHistory: [],
  isPhysicsEnabled: true,
  nodeLimit: 100,
  networkOptions: {
    physics: {
      forceAtlas2Based: {
        gravitationalConstant: -26,
        centralGravity: 0.005,
        springLength: 230,
        springConstant: 0.18,
        avoidOverlap: 1.5,
      },
      maxVelocity: 40,
      solver: 'forceAtlas2Based',
      timestep: 0.35,
      stabilization: {
        enabled: true,
        iterations: 50,
        updateInterval: 25,
      },
    },
    nodes: {
      shape: 'dot',
      size: 20,
      borderWidth: 1,
      font: {
        color: NODE_LABEL_COLOR[defaultTheme],
        size: 11,
      },
      // opacity: 1.0,
      // color: {},
      // shadow: {
      //   enabled: true,
      //   color: 'rgba(0, 0, 0, 0.5)',
      //   x: 2,
      //   y: 2,
      //   size: 5,
      //   opacity: 0.2,
      // },
    },
    edges: {
      width: 2,
      font: {
        color: EDGE_LABEL_COLOR[defaultTheme],
        size: 11,
        strokeWidth: 0,
      },
      smooth: {
        type: 'dynamic',
      },
    },
  },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_IS_PHYSICS_ENABLED: {
      const isPhysicsEnabled = _.get(action, 'payload', true);
      return { ...state, isPhysicsEnabled };
    }
    case ACTIONS.ADD_QUERY_HISTORY: {
      return {
        ...state,
        queryHistory: [...state.queryHistory, action.payload],
      };
    }
    case ACTIONS.CLEAR_QUERY_HISTORY: {
      return { ...state, queryHistory: [] };
    }
    case ACTIONS.SET_NODE_LABELS: {
      const nodeLabels = _.get(action, 'payload', []);
      return { ...state, nodeLabels };
    }
    case ACTIONS.ADD_NODE_LABEL: {
      const nodeLabels = [...state.nodeLabels, {}];
      return { ...state, nodeLabels };
    }
    case ACTIONS.EDIT_NODE_LABEL: {
      const editIndex = action.payload.id;
      const editedNodeLabel = action.payload.nodeLabel;

      if (state.nodeLabels[editIndex]) {
        const nodeLabels = [
          ...state.nodeLabels.slice(0, editIndex),
          editedNodeLabel,
          ...state.nodeLabels.slice(editIndex + 1),
        ];
        return { ...state, nodeLabels };
      }
      return state;
    }
    case ACTIONS.REMOVE_NODE_LABEL: {
      const removeIndex = action.payload;
      if (removeIndex < state.nodeLabels.length) {
        const nodeLabels = [
          ...state.nodeLabels.slice(0, removeIndex),
          ...state.nodeLabels.slice(removeIndex + 1),
        ];
        return { ...state, nodeLabels };
      }
      return state;
    }
    case ACTIONS.SET_NODE_LIMIT: {
      const nodeLimit = action.payload;
      return { ...state, nodeLimit };
    }
    case ACTIONS.SET_THEME: {
      const theme = action.payload;
      return {
        ...state,
        theme,
        networkOptions: {
          ...state.networkOptions,
          nodes: {
            ...state.networkOptions.nodes,
            font: {
              ...state.networkOptions.nodes.font,
              color: NODE_LABEL_COLOR[theme],
            },
          },
          edges: {
            ...state.networkOptions.edges,
            font: {
              ...state.networkOptions.edges.font,
              color: EDGE_LABEL_COLOR[theme],
            },
          },
        },
      };
    }
    default:
      return state;
  }
};
