import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM', // Specify the item type
    item: { item }, // Define the item data
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag} // Attach the drag ref to the component
      style={{
        opacity: isDragging ? 0.5 : 1, // Change opacity when dragging
        cursor: 'move', // Change cursor on drag
        padding: '8px',
        border: '1px solid #000',
        backgroundColor: 'lightgray',
        marginBottom: '4px',
      }}
    >
      {item}
    </div>
  );
};

export default DraggableItem;
