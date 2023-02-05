import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Collapse from '@mui/material/Collapse';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { TransitionGroup } from 'react-transition-group';
import LayoutTypesDialogListItem from './LayoutTypesDialogListItem';

function LayoutTypesDialogRaw(props) {
  const { onClose, open, layoutTypes, setLayoutTypes, ...other } = props;
  const radioGroupRef = useRef(null);

  const handleentering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleOk = () => {
    onClose();
  };

  // react-beautiful-dnd
  const onDragStart = (start, provided) => {
    provided.announce(
      `You have lifted the layout type in position ${start.source.index + 1}`
    );
  };

  const onDragUpdate = (update, provided) => {
    const message = update.destination
      ? `You have moved the layout type to position ${
          update.destination.index + 1
        }`
      : 'You are currently not over a droppable area';

    provided.announce(message);
  };

  const onDragEnd = (result, provided) => {
    const message = result.destination
      ? `You have moved the layout type from position ${
          result.source.index + 1
        } to ${result.destination.index + 1}`
      : `The layout type has been returned to its starting position of ${
          result.source.index + 1
        }`;

    provided.announce(message);

    const { destination, source, draggableId } = result;

    // destination can be null (e.g. dragged outside)
    if (!destination) return;
    // check that destination has changed
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // reorder layoutTypes based on type (unique) - used for draggableId in LayoutTypesDialogListItem
    // create arr of layoutTypes types
    const layoutTypesTypeArr = layoutTypes.map((item) => item.type);
    layoutTypesTypeArr.splice(source.index, 1);
    layoutTypesTypeArr.splice(destination.index, 0, draggableId);
    // re-order based on new type order
    const newState = layoutTypesTypeArr.map(
      (type) => layoutTypes.filter((item) => item.type === type)[0]
    );
    setLayoutTypes(newState);
  };

  return (
    <Dialog
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          onClose(event, reason);
        }
      }}
      maxWidth="lg"
      sx={{ width: '100vw', '& div': { mx: '5px' } }}
      TransitionProps={{ onEntering: handleentering }}
      aria-labelledby="PowerPoint layout options"
      open={open}
      // eslint-disable-next-line
      {...other}
    >
      <DialogTitle id="layout-options" sx={{ textAlign: 'center' }}>
        PowerPoint layout options - select 1 or more
      </DialogTitle>
      <DialogContent
        dividers
        style={{ margin: '2px' }}
        sx={{
          overflowY: 'unset',
          px: { xs: 0, md: 1.5 },
          py: 0,
          mx: { xs: 0, md: 0.3 },
        }}
      >
        <FormControl required component="fieldset" sx={{ display: 'flex' }}>
          <FormGroup
            style={{
              margin: 0,
            }}
          >
            <DragDropContext
              onDragStart={onDragStart}
              onDragUpdate={onDragUpdate}
              onDragEnd={onDragEnd}
            >
              <Droppable droppableId="LayoutTypes">
                {/* provided is an object */}
                {/* droppable uses render prop pattern, needs a child that is a function that returns a component */}
                {(provided) => (
                  // eslint-disable-next-line
                    <List ref={provided.innerRef} {...provided.droppableProps}  sx={{
                      padding: 0,
                      '& div': {
                        margin: 0,
                      },
                    }}
                  >
                    <TransitionGroup>
                      {layoutTypes.map((list, i) => (
                        <Collapse
                          key={list.type}
                          sx={{
                            '& div': {
                              margin: 0,
                            },
                          }}
                        >
                          <LayoutTypesDialogListItem
                            id={list.type}
                            key={list.type}
                            list={list}
                            index={i}
                            layoutTypes={layoutTypes}
                            setLayoutTypes={setLayoutTypes}
                          />
                        </Collapse>
                      ))}
                      {/* it is an element that increases space when needed during drag */}
                      {provided.placeholder}
                    </TransitionGroup>
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          </FormGroup>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleOk} color="primary" type="submit">
          Ok
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function LayoutTypesDialog({ layoutTypes, setLayoutTypes }) {
  const [open, setOpen] = useState(false);

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickListItem}
        aria-haspopup="true"
        aria-controls="Select layouts - menu"
        aria-label="Select ppt layouts"
        sx={{ mt: 3, mb: 3, ml: 0 }}
      >
        Select PowerPoint layouts
      </Button>
      <LayoutTypesDialogRaw
        open={open}
        onClose={handleClose}
        layoutTypes={layoutTypes}
        setLayoutTypes={setLayoutTypes}
      />
    </div>
  );
}

LayoutTypesDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  layoutTypes: PropTypes.array.isRequired,
  setLayoutTypes: PropTypes.func.isRequired,
};

LayoutTypesDialog.propTypes = {
  layoutTypes: PropTypes.array.isRequired,
  setLayoutTypes: PropTypes.func.isRequired,
};
