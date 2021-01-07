import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Droppable, Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { FixedSizeList as List, areEqual } from 'react-window';
import { Minion } from '@hbt-org/core';

import MinionComponent from './Minion';

function getStyle(provided: DraggableProvided, style?: React.CSSProperties) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
}

const useStyles = makeStyles(() => ({
  root: {
    '&::-webkit-scrollbar': {
      height: 8,
    },
    '&::-webkit-scrollbar-track': {
      borderRadius: 10,
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
      },
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 10,
      background: 'rgba(0,0,0,0.2)',
      '&:hover': {
        background: 'rgba(0,0,0,0.4)',
      },
    },
  },
  storeMinion: {
    userSelect: 'none',
    position: 'relative',
    '& > div': {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },
}));

interface ItemProps {
  data: Minion;
  index: number;
  // eslint-disable-next-line react/require-default-props
  style?: React.CSSProperties;
  provided: DraggableProvided;
}
const Item = React.memo<ItemProps>(({ data, index, style, provided }) => {
  const classes = useStyles();
  return (
    <div
      className={classes.storeMinion}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={getStyle(provided, style)}
      data-index={index}
    >
      <MinionComponent minion={data} type="store" />
    </div>
  );
});
Item.displayName = 'Item';

interface ColumnProps {
  data: Minion[];
  index: number;
  // eslint-disable-next-line react/require-default-props
  style?: React.CSSProperties;
}
const Column = React.memo(({ data, index, style }: ColumnProps) => {
  const minion = data[index];

  return (
    <Draggable draggableId={minion.id.toString()} index={index} key={minion.id}>
      {(provided) => (
        <Item
          data={minion}
          index={index}
          style={{ margin: 0, ...style }}
          provided={provided}
        />
      )}
    </Draggable>
  );
}, areEqual);
Column.displayName = 'Column';

interface StoreProps {
  data: Minion[];
}

const Store: React.FC<StoreProps> = ({ data }) => {
  const classes = useStyles();

  return (
    <Droppable
      droppableId="store"
      mode="virtual"
      direction="horizontal"
      renderClone={(provided, _, rubric) => (
        <Item
          data={data[rubric.source.index]}
          index={rubric.source.index}
          style={{ margin: 0 }}
          provided={provided}
        />
      )}
    >
      {(provided) => (
        <List
          className={classes.root}
          style={{ overflowY: 'hidden' }}
          width={785}
          height={150}
          itemCount={data.length}
          itemSize={112}
          layout="horizontal"
          outerRef={provided.innerRef}
          itemData={data}
        >
          {Column}
        </List>
      )}
    </Droppable>
  );
};

export default Store;
