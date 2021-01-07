import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Minion } from '@hbt-org/core';

import Text from '@suspension/components/Text';

import MinionComponent, { EditProps } from './Minion';

interface MinionsProps {
  data: Minion[];
  onChange: React.Dispatch<React.SetStateAction<Minion[]>>;
}

const useStyles = makeStyles((theme) => ({
  container: {
    width: 785,
    minHeight: 150,
    display: 'flex',
    justifyContent: 'center',
    border: '2px dashed #eee',
    marginTop: theme.spacing(2),
  },
  minion: {
    width: 112,
    userSelect: 'none',
    marginTop: -theme.spacing(2),
    position: 'relative',
    '& > div': {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Minions: React.FC<MinionsProps> = ({ data, onChange }) => {
  const classes = useStyles();

  return (
    <Droppable droppableId="minions" direction="horizontal">
      {(provided) => (
        <div
          className={classes.container}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {data.length ? (
            data.map((minion, index) => {
              const handleChange = (props: EditProps) => {
                onChange((prevState) => {
                  minion.change(props);
                  const newMinions = Array.from(prevState);
                  newMinions[index] = minion;
                  return newMinions;
                });
              };

              return (
                <Draggable
                  draggableId={minion.id.toString()}
                  index={index}
                  key={minion.id}
                >
                  {(draggableProvided) => (
                    <div
                      className={classes.minion}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      style={{
                        ...draggableProvided.draggableProps.style,
                      }}
                    >
                      <MinionComponent
                        minion={minion}
                        type="minions"
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })
          ) : (
            <Text className={classes.center} stroke={false} color="#666">
              你可以拖动上方随从到这里编辑你的阵容
            </Text>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Minions;
