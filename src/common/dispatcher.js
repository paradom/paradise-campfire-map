import { dispatch } from 'd3-dispatch';
import { updateVega } from './vega-spec';
import { getMap } from '../components/map';
import { updateTimeLabel } from '../components/time-label';
import { timeFormatter } from './time-utils';

// use d3's dispatch module to handle updating the map on user events
export const dispatcher = dispatch('sliderInput', 'mapMove');

dispatcher.on('sliderInput', (date) => {
  updateVega(getMap(), timeFormatter(date));
  updateTimeLabel(date);
});

dispatcher.on('mapMove', () => {
  updateVega(getMap());
});


export function debounce(funct, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) {
        funct.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      funct.apply(context, args);
    }
  };
};
