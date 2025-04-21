import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Accordion as ExpansionPanel,
  AccordionSummary as ExpansionPanelSummary,
  Typography,
  AccordionDetails as ExpansionPanelDetails,
  List,
  ListItem,
  ListItemText,
  TextField,
  Fab,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  FormControlLabel,
  Switch,
  Divider,
  Tooltip,
} from '@mui/material';
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

export default function DetailsComponent() {
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

  const onAddNodeLabel = () => {
    dispatch({ type: ACTIONS.ADD_NODE_LABEL });
  };

  const onEditNodeLabel = (index, nodeLabel) => {
    dispatch({
      type: ACTIONS.EDIT_NODE_LABEL,
      payload: { id: index, nodeLabel },
    });
  };

  const onRemoveNodeLabel = (index) => {
    dispatch({ type: ACTIONS.REMOVE_NODE_LABEL, payload: index });
  };

  const onEditNodeLimit = (limit) => {
    dispatch({ type: ACTIONS.SET_NODE_LIMIT, payload: limit });
  };

  const onRefresh = () => {
    dispatch({ type: ACTIONS.REFRESH_NODE_LABELS, payload: nodeLabels });
  };

  const onTraverse = (nodeId, direction) => {
    const query = `g.V('${nodeId}').${direction}()`;
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
  };

  const onTogglePhysics = (enabled) => {
    dispatch({ type: ACTIONS.SET_IS_PHYSICS_ENABLED, payload: enabled });
    if (network) {
      const edges = {
        smooth: {
          type: enabled ? 'dynamic' : 'continuous',
        },
      };
      network.setOptions({ physics: enabled, edges });
    }
  };

  const generateList = (list) => {
    return list.map((value, key) => (
      <ListItem key={key}>
        <ListItemText primary={value} />
      </ListItem>
    ));
  };

  const generateNodeLabelList = (nodeLabels) => {
    return nodeLabels.map((nodeLabel, index) => (
      <ListItem key={index}>
        <TextField
          id='standard-basic'
          label='Node Type'
          InputLabelProps={{ shrink: true }}
          value={nodeLabel.type}
          onChange={(event) => {
            const type = event.target.value;
            const field = nodeLabel.field;
            onEditNodeLabel(index, { type, field });
          }}
        />
        <TextField
          id='standard-basic'
          label='Label Field'
          InputLabelProps={{ shrink: true }}
          value={nodeLabel.field}
          onChange={(event) => {
            const field = event.target.value;
            const type = nodeLabel.type;
            onEditNodeLabel(index, { type, field });
          }}
        />
        <IconButton
          aria-label='delete'
          size='small'
          onClick={() => onRemoveNodeLabel(index)}
        >
          <DeleteIcon fontSize='small' />
        </IconButton>
      </ListItem>
    ));
  };

  let hasSelected = false;
  let selectedType = null;
  let selectedId = null;
  let selectedProperties = null;
  let selectedHeader = null;

  if (!_.isEmpty(selectedNode)) {
    hasSelected = true;
    selectedType = _.get(selectedNode, 'type');
    selectedId = _.get(selectedNode, 'id');
    selectedProperties = _.get(selectedNode, 'properties');
    stringifyObjectValues(selectedProperties);
    selectedHeader = 'Node';
  } else if (!_.isEmpty(selectedEdge)) {
    hasSelected = true;
    selectedType = _.get(selectedEdge, 'type');
    selectedId = _.get(selectedEdge, 'id');
    selectedProperties = _.get(selectedEdge, 'properties');
    stringifyObjectValues(selectedProperties);
    selectedHeader = 'Edge';
  }

  return (
    <div className={'details'}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography>Query History</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List dense={true}>{generateList(queryHistory)}</List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography>Settings</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                  <Tooltip
                    title='Automatically stabilize the graph'
                    aria-label='add'
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isPhysicsEnabled}
                          onChange={() => {
                            onTogglePhysics(!isPhysicsEnabled);
                          }}
                          value='physics'
                          color='primary'
                        />
                      }
                      label='Enable Physics'
                    />
                  </Tooltip>
                  <Divider />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Tooltip
                    title='Number of maximum nodes which should return from the query. Empty or 0 has no restrictions.'
                    aria-label='add'
                  >
                    <TextField
                      label='Node Limit'
                      type='Number'
                      variant='outlined'
                      value={nodeLimit}
                      onChange={(event) => {
                        const limit = event.target.value;
                        onEditNodeLimit(limit);
                      }}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography>Node Labels</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <List dense={true}>{generateNodeLabelList(nodeLabels)}</List>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Fab
                    variant='extended'
                    color='primary'
                    size='small'
                    onClick={onRefresh}
                  >
                    <RefreshIcon />
                    Refresh
                  </Fab>
                  <Fab variant='extended' size='small' onClick={onAddNodeLabel}>
                    <AddIcon />
                    Add Node Label
                  </Fab>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        {hasSelected && (
          <Grid item xs={12} sm={12} md={12}>
            <h2>Information: {selectedHeader}</h2>
            {selectedHeader === 'Node' && (
              <Grid item xs={12} sm={12} md={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={6} md={6}>
                    <Fab
                      variant='extended'
                      size='small'
                      onClick={() => onTraverse(selectedId, 'out')}
                    >
                      Traverse Out Edges
                      <ArrowForwardIcon />
                    </Fab>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <Fab
                      variant='extended'
                      size='small'
                      onClick={() => onTraverse(selectedId, 'in')}
                    >
                      Traverse In Edges
                      <ArrowBackIcon />
                    </Fab>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid item xs={12} sm={12} md={12}>
              <Grid container>
                <Table aria-label='simple table'>
                  <TableBody>
                    <TableRow key={'type'}>
                      <TableCell scope='row'>Type</TableCell>
                      <TableCell align='left'>{String(selectedType)}</TableCell>
                    </TableRow>
                    <TableRow key={'id'}>
                      <TableCell scope='row'>ID</TableCell>
                      <TableCell align='left'>{String(selectedId)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <JsonToTable json={selectedProperties} />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
