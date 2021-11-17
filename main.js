import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { fromLonLat, get as getProjection } from "ol/proj";
import { getWidth } from "ol/extent";
import OLCesium from "olcs/OLCesium.js";


const map = new Map({
  target: "map",
  view: new View({
    zoom: 5,
    center: fromLonLat([5, 45])
  })
});

const resolutions = [];
const matrixIds = [];
const proj3857 = getProjection("EPSG:3857");
const maxResolution = getWidth(proj3857.getExtent()) / 256;

for (let i = 0; i < 20; i++) {
  matrixIds[i] = i.toString();
  resolutions[i] = maxResolution / Math.pow(2, i);
}

const tileGrid = new WMTSTileGrid({
  origin: [-20037508, 20037508],
  resolutions: resolutions,
  matrixIds: matrixIds
});

// For more information about the IGN API key see
// https://geoservices.ign.fr/blog/2021/01/29/Maj_Cles_Geoservices.html

const ign_source = new WMTS({
  url: "https://wxs.ign.fr/choisirgeoportail/geoportail/wmts",
  layer: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2",
  matrixSet: "PM",
  format: "image/png",
  projection: "EPSG:3857",
  tileGrid: tileGrid,
  style: "normal",
  attributions:
    '<a href="https://www.ign.fr/" target="_blank">' +
    '<img src="https://wxs.ign.fr/static/logos/IGN/IGN.gif" title="Institut national de l\'' +
    'information géographique et forestière" alt="IGN"></a>'
});

const ign = new TileLayer({
  source: ign_source
});

map.addLayer(ign);

const ol3d = new OLCesium({
  map: map
});
document.getElementById('enable').addEventListener('click', () => ol3d.setEnabled(!ol3d.getEnabled()));
