import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { v4 as uuid } from 'uuid';
import { NodeViewWrapper } from '@tiptap/react';

const getRandomElement = (list) => {
  return list[Math.floor(Math.random() * list.length)];
};

const PaperComponent = ({ node, updateAttributes }) => {
  const [color, setColor] = useState(
    getRandomElement([
      '#A975FF',
      '#FB5151',
      '#FD9170',
      '#FFCB6B',
      '#68CEF8',
      '#80CBC4',
      '#9DEF8F',
    ])
  );
  const [size, setSize] = useState(Math.ceil(Math.random() * Math.floor(10)));
  const [svg, setSvg] = useState(null);
  const [path, setPath] = useState(null);
  const [points, setPoints] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [id, setId] = useState(uuid());
  const canvasRef = useRef();

  useEffect(() => {
    setSvg(d3.select(canvasRef.current));

    const svgElement = d3.select(canvasRef.current);
    svgElement.on('mousedown', onStartDrawing);
    svgElement.on('mouseup', onEndDrawing);
    svgElement.on('mouseleave', onEndDrawing);
    svgElement.on('touchstart', onStartDrawing);
    svgElement.on('touchend', onEndDrawing);
    svgElement.on('touchleave', onEndDrawing);
  }, [canvasRef.current]);

  const onStartDrawing = (event) => {
    setDrawing(true);
    setPoints([]);
    setPath(
      svg
        .append('path')
        .data([points])
        .attr('id', `id-${id}`)
        .attr('stroke', color)
        .attr('stroke-width', size)
    );

    const moveEvent = event.type === 'mousedown' ? 'mousemove' : 'touchmove';
    svg.on(moveEvent, onMove);
  };

  const onMove = (event) => {
    event.preventDefault();
    setPoints([...points, d3.pointers(event)[0]]);
    // setPoints((prevPoints) => [...prevPoints, d3.pointers(event)[0]]);
    tick();
  };

  const onEndDrawing = () => {
    svg.on('mousemove', null);
    svg.on('touchmove', null);

    if (!drawing) {
      return;
    }

    setDrawing(false);
    svg.select(`#id-${id}`).remove();
    setId(uuid());
  };

  const tick = () => {
    requestAnimationFrame(() => {
      if (path !== null) {
        path.attr('d', (points) => {
          const path = d3.line().curve(d3.curveBasis)(points);
          // updateAttributes function needs to be implemented

          updateAttributes({
            lines: [
              ...node.attrs.lines,
              {
                id: id,
                color: color,
                size: size,
                path: path,
              },
            ],
          });

          return path;
        });
      }
    });
  };

  const clear = () => {
    // updateAttributes function needs to be implemented
    updateAttributes({
      lines: [],
    });
  };

  return (
    <NodeViewWrapper>
      <div className="draw">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="10"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <button onClick={clear}>clear</button>
        <svg viewBox="0 0 500 250" ref={canvasRef}>
          {/* Render paths here */}
        </svg>
      </div>
    </NodeViewWrapper>
  );
};

export default PaperComponent;
