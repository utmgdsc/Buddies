import React from 'react';

// there will be more functions in the file later
// eslint-disable-next-line import/prefer-default-export
export const scrollHandler = (e: React.SyntheticEvent, func: () => void) => {
  const listboxNode = e.currentTarget;
  if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
    func();
  }
};
