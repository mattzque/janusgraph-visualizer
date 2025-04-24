import React, { useEffect, useMemo, useState } from 'react';
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
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeftRightEllipsis,
  ChevronUp,
  Copy,
  Eye,
  MoveLeft,
  MoveRight,
  Replace,
  Shrink,
  Tag,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useGremlinQuery } from '@/hooks/useGremlinQuery';
import { ScrollArea } from '../ui/scroll-area';

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

// 'hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors border-0'

function DetailCell({ children, className }) {
  return (
    <div
      className={`px-1 py-3 first:pl-4 last:pr-4 text-xs overflow-hidden text-ellipsis whitespace-nowrap group-hover:bg-muted/50 transition select-none cursor-pointer ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

function DetailCellHeader({ children, className }) {
  return (
    <DetailCell
      className={`text-sidebar-foreground/70 text-left ${className ?? ''}`}
    >
      {children}
    </DetailCell>
  );
}

function DetailCellContent({ children, className }) {
  return <DetailCell className={className}>{children}</DetailCell>;
}

function DetailCellAction({ children, className }) {
  return (
    <DetailCell className={`text-right justify-end flex ${className ?? ''}`}>
      {children}
    </DetailCell>
  );
}

function DetailRow({ children, onClick }) {
  return (
    <div className='contents group' onClick={onClick}>
      {children}
    </div>
  );
}

function DetailTable({ children }) {
  return (
    <div class='grid grid-cols-[minmax(80px,auto)_1fr_auto] auto-rows-min'>
      {children}
    </div>
  );
}

const DetailPropertyCollapseToggle = ({ isOpen }) => {
  return (
    <Button variant='icon' className='h-2 w-2'>
      {isOpen ? <ChevronUp /> : <ChevronDown />}
    </Button>
  );
};

const DetailPropertyRow = ({ title, value, valueClassName, isNodeCaption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <DetailRow onClick={handleToggle}>
        <DetailCellHeader className={`${isOpen ? 'bg-muted/50' : ''}`}>
          {title}
        </DetailCellHeader>
        <DetailCellContent
          className={`${isOpen ? 'bg-muted/50' : ''} ${valueClassName ?? ''}`}
        >
          {isOpen ? '' : value}
        </DetailCellContent>
        <DetailCellAction className={isOpen ? 'bg-muted/50' : ''}>
          {isNodeCaption && (
            <div className='flex flex-col h-4 w-3 mr-2 items-center justify-center'>
              <Tag className='h-3 w-4' />
            </div>
          )}

          <DetailPropertyCollapseToggle isOpen={isOpen} />
        </DetailCellAction>
      </DetailRow>
      {isOpen && (
        <div className={`col-span-3 text-xs px-4 pt-0 pb-4 bg-muted/50`}>
          <div className={` break-word ${valueClassName}`}>{value}</div>

          {!isNodeCaption && (
            <div className='pt-4'>
              <Button variant='outline'>
                <Tag /> Use Caption
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

// <DetailRow>
//   <DetailCellHeader>Name 1:</DetailCellHeader>
//   <DetailCellContent>
//     Very long value that might overflow
//   </DetailCellContent>
//   <DetailCellAction>[Action]</DetailCellAction>
// </DetailRow>

function NodeOrEdgeDetail({
  type,
  label,
  id,
  properties,
  graphCaption,
  submitButtonQuery,
}) {
  const typeLabel = type === 'node' ? 'Node' : 'Edge';
  const idLabel = formatId(id);

  console.log('graphCaption', graphCaption);

  return (
    <div className='w-full flex flex-col'>
      <div className='flex flex-col'>
        <h1 className='text-xs text-sidebar-foreground/70 p-4'>
          {typeLabel} Details
        </h1>

        <DetailTable>
          <DetailPropertyRow title='ID' value={idLabel} />
          <DetailPropertyRow title='Label' value={label} />
        </DetailTable>

        {type === 'node' && (
          <div className='flex flex-row p-4 gap-4 justify-center'>
            <Button
              variant='outline'
              onClick={() => submitButtonQuery(`g.V('${id}')`, true)}
            >
              <Copy />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => submitButtonQuery(`g.V('${id}').out()`)}
            >
              <ChevronRight />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => submitButtonQuery(`g.V('${id}').in()`)}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => submitButtonQuery(`g.V('${id}').both()`)}
            >
              <ChevronsLeftRightEllipsis />
            </Button>
          </div>
        )}
      </div>
      <Separator className='mt-4' />
      <div className='flex flex-col'>
        <h1 className='text-xs text-sidebar-foreground/70 p-4'>
          {typeLabel} Properties
        </h1>

        <DetailTable>
          {Object.keys(properties).map((key) => (
            <DetailPropertyRow
              key={key}
              title={key}
              value={properties[key]}
              valueClassName='font-mono'
              isNodeCaption={graphCaption && graphCaption.field === key}
            />
          ))}
        </DetailTable>
      </div>
    </div>
  );
}

export default function DetailSidebar() {
  const { sendQuery, cancelQuery } = useGremlinQuery();
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

  console.log('nodeLabels', nodeLabels);
  // onRefresh
  // onAddNodeLabel

  const submitButtonQuery = (query, setAndRunQuery = false) => {
    if (setAndRunQuery) {
      dispatch({ type: ACTIONS.CLEAR_GRAPH });
      dispatch({ type: ACTIONS.CLEAR_QUERY_HISTORY });
      dispatch({ type: ACTIONS.SET_QUERY, payload: query });
      // setTimeout(() => {
      //   sendQuery();
      // }, 3);
    } else {
      axios
        .post(
          QUERY_ENDPOINT,
          { host, port, query, nodeLimit, traversalSource },
          { headers: { 'Content-Type': 'application/json' } }
        )
        .then((response) => {
          onFetchQuery(response, query, nodeLabels, dispatch);
        })
        .catch(() => {
          dispatch({ type: ACTIONS.SET_ERROR, payload: COMMON_GREMLIN_ERROR });
        });
    }
  };

  // const query = `g.V('${nodeId}').${direction}()`;
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
      const label = _.get(element, 'type');
      const graphCaption = nodeLabels.find(({ type, field }) => type === label);

      return {
        type,
        label: _.get(element, 'type'),
        id: _.get(element, 'id'),
        properties: _.get(element, 'properties'),
        graphCaption,
      };
    }
    return null;
  }, [selectedNode, selectedEdge, nodeLabels]);

  console.log(selectedNode, selectedEdge);

  if (selected) {
    return (
      <div className='flex w-full'>
        <ScrollArea className='w-full'>
          <NodeOrEdgeDetail
            submitButtonQuery={submitButtonQuery}
            {...selected}
          />
        </ScrollArea>
      </div>
    );
  } else {
    return (
      <div className='flex w-full p-4 justify-center'>
        <span className='text-xs text-sidebar-foreground/70'>
          Select node or edge to view details.
        </span>
      </div>
    );
  }
}
