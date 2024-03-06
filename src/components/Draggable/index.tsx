import { useDraggable } from '@dnd-kit/core';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export const Draggable: React.FC<Props> = ({ children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};
