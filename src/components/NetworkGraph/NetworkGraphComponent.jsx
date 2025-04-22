import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Network } from 'vis-network';
import { ACTIONS } from '../../constants';

export default function NetworkGraphComponent() {
  const networkRef = useRef(null);
  const dispatch = useDispatch();

  const nodeHolder = useSelector((state) => state.graph.nodeHolder);
  const edgeHolder = useSelector((state) => state.graph.edgeHolder);
  const networkOptions = useSelector((state) => state.options.networkOptions);

  useEffect(() => {
    const data = {
      nodes: nodeHolder,
      edges: edgeHolder,
    };

    const network = new Network(networkRef.current, data, networkOptions);

    network.on('click', (params) => {
      dispatch({
        type: ACTIONS.SET_SELECTED_NODE,
        payload: params.nodes.length > 0 ? params.nodes[0] : null,
      });
      dispatch({
        type: ACTIONS.SET_SELECTED_EDGE,
        payload: params.edges.length > 0 ? params.edges[0] : null,
      });
    });

    dispatch({ type: ACTIONS.SET_NETWORK, payload: network });

    // Cleanup on component unmount
    return () => {
      network.destroy();
    };
  }, [nodeHolder, edgeHolder, networkOptions, dispatch]);

  return <div ref={networkRef} className='flex-1 overflow-hidden' />;
}
