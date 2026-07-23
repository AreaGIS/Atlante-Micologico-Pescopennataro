/* ==========================================================
   WEBGIS V6
   COMPONENTE : MAP CONFIG
   VERSIONE   : 1.0
   RELEASE    : 0.1
   STATO      : IN TEST

   INDICE

   MAP-CFG-01  Percorsi del componente
   MAP-CFG-02  Configurazione OpenLayers
   MAP-CFG-03  Percorsi dei dati principali
   MAP-CFG-04  Configurazione cartografia
   MAP-CFG-05  Configurazione habitat
========================================================== */

/* #######################################################################
   MAP-CFG-01
   PERCORSI DEL COMPONENTE
######################################################################## */

export const MAP_COMPONENT_PATH =
    "./components/map/map.html";

/* #######################################################################
   MAP-CFG-02
   CONFIGURAZIONE OPENLAYERS
######################################################################## */

export const OPENLAYERS_VERSION =
    "10.9.0";

export const OPENLAYERS_SCRIPT_URL =
    `https://cdn.jsdelivr.net/npm/ol@v${OPENLAYERS_VERSION}/dist/ol.js`;

export const OPENLAYERS_STYLE_URL =
    `https://cdn.jsdelivr.net/npm/ol@v${OPENLAYERS_VERSION}/ol.css`;

/* #######################################################################
   MAP-CFG-03
   PERCORSI DEI DATI PRINCIPALI
######################################################################## */

export const BOUNDARY_DATA_PATH =
    "./data/Pescopennataro_Limite_amministrativo.geojson";

export const SURVEYS_DATA_PATH =
    "./data/Rilievi_Web.geojson";

/* #######################################################################
   MAP-CFG-04
   CONFIGURAZIONE CARTOGRAFIA
######################################################################## */

export const SATELLITE_TILE_URL =
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

export const DEFAULT_MAP_CENTER = [
    14.30,
    41.87
];

export const DEFAULT_PRIMARY_ZOOM =
    13;

export const DEFAULT_OVERVIEW_ZOOM =
    12;

export const PRIMARY_MIN_ZOOM =
    9;

export const PRIMARY_MAX_ZOOM =
    20;

export const OVERVIEW_MIN_ZOOM =
    8;

export const OVERVIEW_MAX_ZOOM =
    16;

export const PRIMARY_FIT_PADDING = [
    54,
    54,
    54,
    54
];

export const OVERVIEW_FIT_PADDING = [
    14,
    14,
    14,
    14
];

export const PRIMARY_FIT_MAX_ZOOM =
    15;

export const BOUNDARY_LOADING_TIMEOUT =
    15000;

/* #######################################################################
   MAP-CFG-05
   CONFIGURAZIONE HABITAT
######################################################################## */

export const HABITAT_CONFIG = [
    {
        id: "habitat-abetine",
        name: "Abetine dell’Appennino centrale e meridionale",
        path: "./data/Abetine dell’Appennino centrale e meridionale.geojson",
        color: "#1f6b43"
    },
    {
        id: "habitat-conifere-alloctone",
        name: "Boschi di conifere alloctone o fuori dal loro areale",
        path: "./data/Boschi di conifere alloctone o fuori dal loro areale.geojson",
        color: "#3a8756"
    },
    {
        id: "habitat-ostrya",
        name: "Boschi di Ostrya carpinifolia",
        path: "./data/Boschi di Ostrya carpinifolia.geojson",
        color: "#7b5b38"
    },
    {
        id: "habitat-pioppi",
        name: "Boschi ripariali a pioppi",
        path: "./data/Boschi ripariali a pioppi.geojson",
        color: "#5db4aa"
    },
    {
        id: "habitat-salici",
        name: "Boschi ripariali temperati di salici",
        path: "./data/Boschi ripariali temperati di salici.geojson",
        color: "#70c6ba"
    },
    {
        id: "habitat-centri-abitati",
        name: "Centri abitati e infrastrutture viarie e ferroviarie",
        path: "./data/Centri abitati e infrastrutture viarie e ferroviarie.geojson",
        color: "#bb6e6e"
    },
    {
        id: "habitat-cespuglieti",
        name: "Cespuglieti temperati a latifoglie decidue dei suoli ricchi",
        path: "./data/Cespuglieti temperati a latifoglie decidue dei suoli ricchi.geojson",
        color: "#8b9f4c"
    },
    {
        id: "habitat-colture",
        name: "Colture estensive",
        path: "./data/Colture estensive.geojson",
        color: "#d4b44d"
    },
    {
        id: "habitat-faggete",
        name: "Faggete dell'Italia meridionale",
        path: "./data/Faggete dell'Italia meridionale.geojson",
        color: "#2f7f4e"
    },
    {
        id: "habitat-ginepreti",
        name: "Ginepreti collinari e montani",
        path: "./data/Ginepreti collinari e montani.geojson",
        color: "#63875d"
    },
    {
        id: "habitat-praterie-sfalcio",
        name: "Praterie da sfalcio planiziali, collinari e montane",
        path: "./data/Praterie da sfalcio planiziali, collinari e montane.geojson",
        color: "#d7df71"
    },
    {
        id: "habitat-praterie-mesiche",
        name: "Praterie mesiche temperate e supramediterranee",
        path: "./data/Praterie mesiche temperate e supramediterranee.geojson",
        color: "#c9d861"
    },
    {
        id: "habitat-praterie-mesofile",
        name: "Praterie mesofile pascolate",
        path: "./data/Praterie mesofile pascolate.geojson",
        color: "#b7cd55"
    },
    {
        id: "habitat-praterie-xeriche",
        name: "Praterie xeriche dell'Italia centrale e meridionale",
        path: "./data/Praterie xeriche dell'Italia centrale e meridionale.geojson",
        color: "#ddbf5a"
    },
    {
        id: "habitat-querceti",
        name: "Querceti temperati a cerro",
        path: "./data/Querceti temperati a cerro.geojson",
        color: "#5d713b"
    },
    {
        id: "habitat-rupi",
        name: "Rupi carbonatiche dei rilievi del Mediterraneo occidentale",
        path: "./data/Rupi carbonatiche dei rilievi del Mediterraneo occidentale.geojson",
        color: "#a59c91"
    },
    {
        id: "habitat-siti-produttivi",
        name: "Siti produttivi, commerciali e grandi nodi infrastrutturali",
        path: "./data/Siti produttivi, commerciali e grandi nodi infrastrutturali.geojson",
        color: "#8e8e98"
    }
];