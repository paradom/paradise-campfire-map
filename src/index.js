import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl/dist/mapboxgl-overrides';
import './styles.css';

import { serverInfo } from './common/config';
import { updateVega } from './common/vega-spec';
import { 
  getConnection, 
  getConnectionStatus, 
  saveConnection 
} from './common/mapd-connector';
import { initMap } from './components/map';
import { initSlider } from './components/slider';
import { initTimeLabel } from './components/time-label';
import { initPlayPauseButton } from './components/play-pause-control';

// main app bootstrapping on content loaded
document.addEventListener('DOMContentLoaded', main);
function main() {
  // render markup for our UI
  document.querySelector("#app").innerHTML = `
    <div class="header">
      <img class="logo" height="75px" width="75px" src="images/mapd-logo.png" />
      <div class="title-bar">
        <h2 class="title">Paradise, CA 2018 Campfire</h2>
      </div>
    </div>
    <div class="slider-controls">
      <input class="slider" type="range" min="0" max="11" step="1" value="0" />
      <button class="play-pause-button">&#9654;</button><!-- play -->
      <label class="time-label"></label>
    </div>
    <div id="map"></div>
    <div class='legend-box'>
      <div class='legend-title'>Buildings:</div>
      <div class='legend-scale'>
        <ul class='legend-labels'>
          <li><span style='background: rgba(234,85,69,1);'></span>Destroyed (>50%)</li>
          <li><span style='background: rgba(189,207,50,1);'></span>Affected (1-9%)</li>
          <li><span style='background: rgba(179,61,198,1);'></span>Minor (10-25%)</li>
          <li><span style='background: rgba(239,155,32,1);'></span>Major (26-50%)</li>
          <li><span style='background: rgba(39,174,239,1);'></span>Other</li>
        </ul>
      </div>
      <div class='legend-source'>Source: <a href="#link to source">Name of source</a></div>
    </div>`;

  // initialize app controls
  const map = initMap();
  const slider = initSlider();
  initTimeLabel();
  initPlayPauseButton();

  // connect to the mapd backend
  getConnection(serverInfo)
    .then(connection => {
      // save connection for later use
      saveConnection(connection);
      // check connection status
      return getConnectionStatus(connection);
    })
    .then(status => {
      if (status && status[0] && status[0].rendering_enabled) {
        // render updated vega spec and add it to the map
        updateVega(map);
      } else {
        throw Error("MapD back-end rendering is not enabled :(");
      }
    })
    .catch(error => {
      throw error;
    });
}
