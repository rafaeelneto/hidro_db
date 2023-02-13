import React from 'react';
import { Transition } from 'react-transition-group';

const duration = 300;

const defaultStyle = (side) => {
  return {
    transition: `width ${duration}ms ease-in-out`,
    width: 0,
  };
};

const transitionStyles = (size) => {
  return {
    entering: { width: size },
    entered: { width: size },
    exiting: { width: 0 },
    exited: { width: 0 },
  };
};

const CollapseSide = ({ children, in: inProp, size }) => {
  return (
    <Transition in={inProp} timeout={duration}>
      {(state) => (
        <div
          style={{
            ...defaultStyle(),
            ...transitionStyles(size)[state],
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
};

export default CollapseSide;
