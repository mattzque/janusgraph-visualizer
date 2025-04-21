import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import _ from 'lodash';
import { JsonToTable } from 'react-json-to-table';
import { ACTIONS, COMMON_GREMLIN_ERROR, QUERY_ENDPOINT } from '../../constants';
import axios from 'axios';
import { onFetchQuery } from '../../logics/actionHelper';
import { stringifyObjectValues } from '../../logics/utils';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '../ui/separator';
import { Eye } from 'lucide-react';
import { Button } from '../ui/button';

function formatId(id) {
  if (_.isNumber(id)) {
    return id;
  } else {
    try {
      const edgeId = JSON.parse(id);
      return `relationId = ${edgeId.relationId}`;
    } catch (e) {
      return id;
    }
  }
}

function NodeOrEdgeDetail({ type, label, id, properties }) {
  const typeLabel = type === 'node' ? 'Node' : 'Edge';
  const idLabel = formatId(id);

  return (
    <div className='w-full flex flex-col'>
      <div className='flex flex-col'>
        <h1 className='text-xs text-sidebar-foreground/70 p-4'>
          {typeLabel} Details
        </h1>
        <Table>
          <TableBody>
            <TableRow className='border-0'>
              <TableCell className='text-xs w-[64px] text-sidebar-foreground/70 text-right'>
                ID
              </TableCell>
              <TableCell className='text-xs max-w-4 text-nowrap truncate'>
                {idLabel}
              </TableCell>
              <TableCell className='text-xs text-right'>
                <Button variant='icon' className='h-3'>
                  <Eye />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className='border-0'>
              <TableCell className='text-xs w-[64px] text-sidebar-foreground/70 text-right'>
                Label
              </TableCell>
              <TableCell className='text-xs text-nowrap truncate'>
                {label}
              </TableCell>
              <TableCell className='text-xs text-right flex justify-end'>
                <Button variant='icon' className='h-3'>
                  <Eye />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Separator className='mt-4' />
      <div className='flex flex-col'>
        <h1 className='text-xs text-sidebar-foreground/70 p-4'>
          {typeLabel} Properties
        </h1>
        <Table>
          <TableBody>
            {Object.keys(properties).map((key) => (
              <TableRow className='border-0'>
                <TableCell className='text-xs w-[64px] text-sidebar-foreground/70 text-right'>
                  {key}
                </TableCell>
                <TableCell className='text-xs max-w-[98px] text-nowrap truncate'>
                  {properties[key]}
                </TableCell>
                <TableCell className='text-xs text-right'>
                  <Button variant='icon' className='h-3'>
                    <Eye />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function DetailSidebar() {
  const dispatch = useDispatch();
  const {
    host,
    port,
    traversalSource,
    network,
    selectedNode,
    selectedEdge,
    queryHistory,
    nodeLabels,
    nodeLimit,
    isPhysicsEnabled,
  } = useSelector((state) => ({
    host: state.gremlin.host,
    port: state.gremlin.port,
    traversalSource: state.gremlin.traversalSource,
    network: state.graph.network,
    selectedNode: state.graph.selectedNode,
    selectedEdge: state.graph.selectedEdge,
    queryHistory: state.options.queryHistory,
    nodeLabels: state.options.nodeLabels,
    nodeLimit: state.options.nodeLimit,
    isPhysicsEnabled: state.options.isPhysicsEnabled,
  }));

  // TODO/WIP clunky

  const selected = useMemo(() => {
    let type, element;
    if (!_.isEmpty(selectedNode)) {
      type = 'node';
      element = selectedNode;
    } else if (!_.isEmpty(selectedEdge)) {
      type = 'edge';
      element = selectedEdge;
    }
    if (element) {
      return {
        type: 'edge',
        label: _.get(element, 'type'),
        id: _.get(element, 'id'),
        properties: _.get(element, 'properties'),
      };
    }
    return null;
  }, [selectedNode, selectedEdge]);

  if (selected) {
    return (
      <div className='flex w-full'>
        <NodeOrEdgeDetail {...selected} />
      </div>
    );
  } else {
    return null;
  }
}
