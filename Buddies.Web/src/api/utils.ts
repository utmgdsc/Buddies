import React from 'react';
import throttle from 'lodash/throttle';
import { SearchFunc } from './index';

/**
 * Creates a throttled paginated search function.
 * @param searchFunc Function for fetching more results.
 * @param setter Setter for storing results.
 * @param count # of elements to fetch per page.
 */
// (there will be more functions here later)
// eslint-disable-next-line import/prefer-default-export
export const makeThrottledSearch = (
  searchFunc: SearchFunc,
  setter: React.Dispatch<React.SetStateAction<string[]>>,
  count: number,
) => {
  return throttle((search: string, page: number) => {
    searchFunc(search, page, count)
      .then((res) => {
        if (page > 0) {
          setter((prevState) => prevState.concat(res.searches));
        } else {
          setter(res.searches);
        }
      });
  }, 1000);
};
