import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

const DraggableComponent = () => {
  return (
    <NodeViewWrapper className="draggable-item">
      <div
        className="drag-handle"
        contentEditable="false"
        draggable="true"
        data-drag-handle
      />
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default DraggableComponent;
