/* ==========================================================
   WEBGIS V6
   COMPONENTE : MAP
   VERSIONE   : 2.9
   RELEASE    : 1.9
   STATO      : IN TEST
========================================================== */

import {
    initPopup,
    showPopup,
    hidePopup
} from "../popup/popup.js";

import {
    MAPTILER_CONFIG
} from "./maptiler.config.js";

/* ==========================================================
   PERCORSI E CONFIGURAZIONE
========================================================== */

const MAP_COMPONENT_PATH =
    "./components/map/map.html";

const OPENLAYERS_VERSION =
    "10.9.0";

const OPENLAYERS_SCRIPT_URL =
    `https://cdn.jsdelivr.net/npm/ol@v${OPENLAYERS_VERSION}/dist/ol.js`;

const OPENLAYERS_STYLE_URL =
    `https://cdn.jsdelivr.net/npm/ol@v${OPENLAYERS_VERSION}/ol.css`;

const BOUNDARY_DATA_PATH =
    "./data/Pescopennataro_Limite_amministrativo.geojson";

const SURVEYS_DATA_PATH =
    "./data/Rilievi_Web.geojson";

const ESRI_SATELLITE_TILE_URL =
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

const MAPTILER_TILEJSON_URL =
    `https://api.maptiler.com/tiles/${MAPTILER_CONFIG.tilesId}/tiles.json?key=${encodeURIComponent(MAPTILER_CONFIG.apiKey)}`;

const SURVEY_HIT_TOLERANCE =
    10;

const OVERVIEW_STORAGE_KEY =
    "webgis-v6-overview-collapsed";

const OVERVIEW_FIT_PADDING = [
    22,
    22,
    22,
    22
];

const HABITAT_FIXED_BOTTOM_IDS = [
    "habitat-centri-abitati",
    "habitat-siti-produttivi"
];

const HABITAT_SORT_TIMEOUT =
    15000;

const MAPTILER_FALLBACK_ERROR_THRESHOLD =
    Number.isFinite(
        Number(MAPTILER_CONFIG.fallbackErrorThreshold)
    )
        ? Math.max(1, Number(MAPTILER_CONFIG.fallbackErrorThreshold))
        : 4;

const MAPTILER_SDK_VERSION =
    String(
        MAPTILER_CONFIG.sdkVersion ||
        "3.11.1"
    );

const MAPTILER_SDK_SCRIPT_URL =
    `https://cdn.maptiler.com/maptiler-sdk-js/v${MAPTILER_SDK_VERSION}/maptiler-sdk.umd.min.js`;

const MAPTILER_SDK_STYLE_URL =
    `https://cdn.maptiler.com/maptiler-sdk-js/v${MAPTILER_SDK_VERSION}/maptiler-sdk.css`;

/* ==========================================================
   CONFIGURAZIONE HABITAT
========================================================== */

const HABITAT_CONFIG = [
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

/* ==========================================================
   STATO DEL COMPONENTE
========================================================== */

let mapInitialized =
    false;

let mapApplication =
    null;

let primaryMap =
    null;

let overviewMap =
    null;

let primaryView =
    null;

let overviewView =
    null;

let municipalityExtent =
    null;

let primarySatelliteLayer =
    null;

let primarySatelliteFallbackLayer =
    null;

let primaryOsmLayer =
    null;

let overviewSatelliteLayer =
    null;

let overviewSatelliteFallbackLayer =
    null;

let overviewOsmLayer =
    null;

let boundarySource =
    null;

let surveysSource =
    null;

let primaryBoundaryLayer =
    null;

let overviewBoundaryLayer =
    null;

let primarySurveysLayer =
    null;

let overviewSurveysLayer =
    null;

let overviewExtentSource =
    null;

let overviewExtentFeature =
    null;

let selectedSurveyFeature =
    null;

let selectedSpeciesKey =
    "";

let speciesCatalog =
    new Map();

let speciesFilterReady =
    false;

let habitatLayers =
    new Map();

let currentBasemap =
    "satellite";

let mapTilerAvailable =
    false;

let mapTilerErrorCount =
    0;

let mapTilerFallbackNotified =
    false;

let map3D =
    null;

let map3DLoaded =
    false;

let map3DInitializing =
    false;

let previous2DBasemap =
    "satellite";

let map3DClickHandlerConfigured =
    false;

/* ==========================================================
   ELEMENTI DELL'INTERFACCIA
========================================================== */

let sidebar =
    null;

let sidebarToggle =
    null;

let habitatToggle =
    null;

let habitatList =
    null;

let habitatSelectAllButton =
    null;

let habitatClearAllButton =
    null;

let habitatSelectionSummary =
    null;

let mapStatus =
    null;

let scaleDisplay =
    null;

let overviewPanel =
    null;

let overviewToggle =
    null;

let overviewContent =
    null;

let speciesSelect =
    null;

let speciesZoomButton =
    null;

let speciesResetButton =
    null;

let speciesShowAllButton =
    null;

let speciesGalleryButton =
    null;

let speciesGalleryOverlay =
    null;

let speciesGalleryCloseButton =
    null;

let speciesGalleryTitle =
    null;

let speciesGallerySummary =
    null;

let speciesGalleryContent =
    null;

let speciesGalleryReturnFocusElement =
    null;

let speciesSummary =
    null;

let map3DElement =
    null;

let map3DToolbar =
    null;

let map3DReturnButton =
    null;

let map3DTiltUpButton =
    null;

let map3DTiltDownButton =
    null;

let map3DResetButton =
    null;

let map3DTopButton =
    null;

let map3DNorthButton =
    null;

let scaleUpdateFrameId =
    null;

/* ==========================================================
   INIZIALIZZAZIONE PUBBLICA
========================================================== */

export async function initMap() {

    if (
        mapInitialized &&
        primaryMap &&
        overviewMap
    ) {

        resizeMaps();

        return;
    }

    await loadOpenLayers();

    await loadMapMarkup();

    await initPopup();

    cacheInterfaceElements();

    validateInterfaceElements();

    createSharedSources();

    createBaseLayers();

    createPrimaryLayers();

    createOverviewLayers();

    createHabitatLayers();

    createMaps();

    initializeSpeciesFilter();

    await sortHabitatLayersByArea();

    configureInterfaceEvents();

    updateHabitatBulkControls();

    configureMapEvents();

    configureSurveyEvents();

    restoreOverviewPanelState();

    await waitForBoundary();

    fitMapsToMunicipality();

    updateCurrentExtent();

    updateScaleDisplay();

    hideMapStatus();

    mapInitialized =
        true;

    document.dispatchEvent(
        new CustomEvent(
            "webgis:map-ready",
            {
                detail: {
                    ready: true,
                    basemap: currentBasemap
                }
            }
        )
    );
}

/* ==========================================================
   CARICAMENTO OPENLAYERS
========================================================== */

async function loadOpenLayers() {

    await loadExternalStylesheet(
        "webgis-openlayers-style",
        OPENLAYERS_STYLE_URL
    );

    if (window.ol) {
        return;
    }

    await loadExternalScript(
        "webgis-openlayers-script",
        OPENLAYERS_SCRIPT_URL
    );

    if (!window.ol) {

        throw new Error(
            "OpenLayers non è stato caricato correttamente."
        );
    }
}

function loadExternalStylesheet(
    id,
    url
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const existingElement =
                document.getElementById(id);

            if (existingElement) {

                if (
                    existingElement.dataset.loaded ===
                    "true"
                ) {

                    resolve();

                    return;
                }

                existingElement.addEventListener(
                    "load",
                    resolve,
                    {
                        once: true
                    }
                );

                existingElement.addEventListener(
                    "error",
                    reject,
                    {
                        once: true
                    }
                );

                return;
            }

            const stylesheet =
                document.createElement("link");

            stylesheet.id =
                id;

            stylesheet.rel =
                "stylesheet";

            stylesheet.href =
                url;

            stylesheet.addEventListener(
                "load",
                () => {

                    stylesheet.dataset.loaded =
                        "true";

                    resolve();
                },
                {
                    once: true
                }
            );

            stylesheet.addEventListener(
                "error",
                () => {

                    reject(
                        new Error(
                            `Impossibile caricare il CSS: ${url}`
                        )
                    );
                },
                {
                    once: true
                }
            );

            document.head.appendChild(
                stylesheet
            );
        }
    );
}

function loadExternalScript(
    id,
    url
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const existingElement =
                document.getElementById(id);

            if (existingElement) {

                if (
                    existingElement.dataset.loaded ===
                        "true" ||
                    window.ol
                ) {

                    resolve();

                    return;
                }

                existingElement.addEventListener(
                    "load",
                    resolve,
                    {
                        once: true
                    }
                );

                existingElement.addEventListener(
                    "error",
                    reject,
                    {
                        once: true
                    }
                );

                return;
            }

            const script =
                document.createElement("script");

            script.id =
                id;

            script.src =
                url;

            script.defer =
                true;

            script.addEventListener(
                "load",
                () => {

                    script.dataset.loaded =
                        "true";

                    resolve();
                },
                {
                    once: true
                }
            );

            script.addEventListener(
                "error",
                () => {

                    reject(
                        new Error(
                            `Impossibile caricare OpenLayers: ${url}`
                        )
                    );
                },
                {
                    once: true
                }
            );

            document.head.appendChild(
                script
            );
        }
    );
}

/* ==========================================================
   CARICAMENTO HTML DEL COMPONENTE
========================================================== */

async function loadMapMarkup() {

    const existingApplication =
        document.getElementById(
            "map-application"
        );

    if (existingApplication) {

        mapApplication =
            existingApplication;

        return;
    }

    const response =
        await fetch(
            MAP_COMPONENT_PATH
        );

    if (!response.ok) {

        throw new Error(
            `Impossibile caricare il componente Map: ${response.status}`
        );
    }

    const mapHTML =
        await response.text();

    const applicationContainer =
        document.getElementById(
            "webgis-app"
        );

    if (!applicationContainer) {

        throw new Error(
            "Il contenitore #webgis-app non è disponibile."
        );
    }

    applicationContainer.innerHTML =
        mapHTML;

    mapApplication =
        document.getElementById(
            "map-application"
        );
}

/* ==========================================================
   CACHE E VALIDAZIONE INTERFACCIA
========================================================== */

function cacheInterfaceElements() {

    sidebar =
        document.getElementById(
            "map-sidebar"
        );

    sidebarToggle =
        document.getElementById(
            "map-sidebar-toggle"
        );

    habitatToggle =
        document.getElementById(
            "map-habitat-toggle"
        );

    habitatList =
        document.getElementById(
            "map-habitat-list"
        );

    habitatSelectAllButton =
        document.getElementById(
            "map-habitat-select-all"
        );

    habitatClearAllButton =
        document.getElementById(
            "map-habitat-clear-all"
        );

    habitatSelectionSummary =
        document.getElementById(
            "map-habitat-selection-summary"
        );

    mapStatus =
        document.getElementById(
            "map-status"
        );

    scaleDisplay =
        document.getElementById(
            "map-scale-display"
        );

    overviewPanel =
        document.getElementById(
            "map-overview-panel"
        );

    overviewToggle =
        document.getElementById(
            "map-overview-toggle"
        );

    overviewContent =
        document.getElementById(
            "map-overview-content"
        );

    speciesSelect =
        document.getElementById(
            "map-species-select"
        );

    speciesZoomButton =
        document.getElementById(
            "map-species-zoom"
        );

    speciesResetButton =
        document.getElementById(
            "map-species-reset"
        );

    speciesShowAllButton =
        document.getElementById(
            "map-species-show-all"
        );

    speciesGalleryButton =
        document.getElementById(
            "map-species-gallery"
        );

    speciesGalleryOverlay =
        document.getElementById(
            "map-species-gallery-overlay"
        );

    speciesGalleryCloseButton =
        document.getElementById(
            "map-species-gallery-close"
        );

    speciesGalleryTitle =
        document.getElementById(
            "map-species-gallery-title"
        );

    speciesGallerySummary =
        document.getElementById(
            "map-species-gallery-summary"
        );

    speciesGalleryContent =
        document.getElementById(
            "map-species-gallery-content"
        );

    speciesSummary =
        document.getElementById(
            "map-species-summary"
        );

    map3DElement =
        document.getElementById(
            "map-3d"
        );

    map3DToolbar =
        document.getElementById(
            "map-3d-toolbar"
        );

    map3DReturnButton =
        document.getElementById(
            "map-3d-return"
        );

    map3DTiltUpButton =
        document.getElementById(
            "map-3d-tilt-up"
        );

    map3DTiltDownButton =
        document.getElementById(
            "map-3d-tilt-down"
        );

    map3DResetButton =
        document.getElementById(
            "map-3d-reset"
        );

    map3DTopButton =
        document.getElementById(
            "map-3d-top"
        );

    map3DNorthButton =
        document.getElementById(
            "map-3d-north"
        );
}

function validateInterfaceElements() {

    const requiredElements = [
        [
            mapApplication,
            "#map-application"
        ],
        [
            document.getElementById(
                "map-primary"
            ),
            "#map-primary"
        ],
        [
            document.getElementById(
                "map-overview"
            ),
            "#map-overview"
        ],
        [
            sidebar,
            "#map-sidebar"
        ],
        [
            sidebarToggle,
            "#map-sidebar-toggle"
        ],
        [
            habitatToggle,
            "#map-habitat-toggle"
        ],
        [
            habitatList,
            "#map-habitat-list"
        ],
        [
            habitatSelectAllButton,
            "#map-habitat-select-all"
        ],
        [
            habitatClearAllButton,
            "#map-habitat-clear-all"
        ],
        [
            habitatSelectionSummary,
            "#map-habitat-selection-summary"
        ],
        [
            mapStatus,
            "#map-status"
        ],
        [
            scaleDisplay,
            "#map-scale-display"
        ],
        [
            overviewPanel,
            "#map-overview-panel"
        ],
        [
            overviewToggle,
            "#map-overview-toggle"
        ],
        [
            overviewContent,
            "#map-overview-content"
        ],
        [
            speciesSelect,
            "#map-species-select"
        ],
        [
            speciesZoomButton,
            "#map-species-zoom"
        ],
        [
            speciesResetButton,
            "#map-species-reset"
        ],
        [
            speciesShowAllButton,
            "#map-species-show-all"
        ],
        [
            speciesGalleryButton,
            "#map-species-gallery"
        ],
        [
            speciesGalleryOverlay,
            "#map-species-gallery-overlay"
        ],
        [
            speciesGalleryCloseButton,
            "#map-species-gallery-close"
        ],
        [
            speciesGalleryTitle,
            "#map-species-gallery-title"
        ],
        [
            speciesGallerySummary,
            "#map-species-gallery-summary"
        ],
        [
            speciesGalleryContent,
            "#map-species-gallery-content"
        ],
        [
            speciesSummary,
            "#map-species-summary"
        ],
        [
            map3DElement,
            "#map-3d"
        ],
        [
            map3DToolbar,
            "#map-3d-toolbar"
        ],
        [
            map3DReturnButton,
            "#map-3d-return"
        ],
        [
            map3DTiltUpButton,
            "#map-3d-tilt-up"
        ],
        [
            map3DTiltDownButton,
            "#map-3d-tilt-down"
        ],
        [
            map3DResetButton,
            "#map-3d-reset"
        ],
        [
            map3DTopButton,
            "#map-3d-top"
        ],
        [
            map3DNorthButton,
            "#map-3d-north"
        ]
    ];

    const missingElements =
        requiredElements
            .filter(
                item => !item[0]
            )
            .map(
                item => item[1]
            );

    if (missingElements.length) {

        throw new Error(
            `Elementi mancanti nel componente Map: ${missingElements.join(", ")}`
        );
    }
}

/* ==========================================================
   SORGENTI CONDIVISE
========================================================== */

function createSharedSources() {

    boundarySource =
        new ol.source.Vector({
            url: BOUNDARY_DATA_PATH,
            format: new ol.format.GeoJSON()
        });

    surveysSource =
        new ol.source.Vector({
            url: SURVEYS_DATA_PATH,
            format: new ol.format.GeoJSON()
        });

    overviewExtentSource =
        new ol.source.Vector();
}

/* ==========================================================
   CARTOGRAFIA DI BASE
========================================================== */

function createBaseLayers() {

    const esriSatelliteSource =
        new ol.source.XYZ({
            url: ESRI_SATELLITE_TILE_URL,
            crossOrigin: "anonymous",
            attributions:
                "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
            maxZoom: 19
        });

    const osmSource =
        new ol.source.OSM();

    mapTilerAvailable =
        isMapTilerConfigurationValid();

    const mapTilerSource =
        mapTilerAvailable
            ? createMapTilerSatelliteSource()
            : null;

    primarySatelliteFallbackLayer =
        new ol.layer.Tile({
            source: esriSatelliteSource,
            visible: true,
            zIndex: 0
        });

    overviewSatelliteFallbackLayer =
        new ol.layer.Tile({
            source: esriSatelliteSource,
            visible: true,
            zIndex: 0
        });

    primarySatelliteLayer =
        new ol.layer.Tile({
            source: mapTilerSource,
            visible: mapTilerAvailable,
            zIndex: 1
        });

    overviewSatelliteLayer =
        new ol.layer.Tile({
            source: mapTilerSource,
            visible: mapTilerAvailable,
            zIndex: 1
        });

    primaryOsmLayer =
        new ol.layer.Tile({
            source: osmSource,
            visible: false,
            zIndex: 0
        });

    overviewOsmLayer =
        new ol.layer.Tile({
            source: osmSource,
            visible: false,
            zIndex: 0
        });
}

function isMapTilerConfigurationValid() {

    const apiKey =
        String(
            MAPTILER_CONFIG.apiKey ||
            ""
        ).trim();

    return Boolean(
        MAPTILER_CONFIG.enabled !== false &&
        apiKey &&
        apiKey !== "INCOLLA_QUI_LA_CHIAVE_MAPTILER"
    );
}

function createMapTilerSatelliteSource() {

    const source =
        new ol.source.TileJSON({
            url: MAPTILER_TILEJSON_URL,
            crossOrigin: "anonymous"
        });

    source.on(
        "tileloadend",
        () => {
            mapTilerErrorCount = 0;
        }
    );

    source.on(
        "tileloaderror",
        handleMapTilerTileError
    );

    source.on(
        "change",
        () => {
            if (source.getState() === "error") {
                activateEsriSatelliteFallback();
            }
        }
    );

    return source;
}

function handleMapTilerTileError() {

    mapTilerErrorCount += 1;

    if (
        mapTilerErrorCount >=
        MAPTILER_FALLBACK_ERROR_THRESHOLD
    ) {
        activateEsriSatelliteFallback();
    }
}

function activateEsriSatelliteFallback() {

    if (!mapTilerAvailable) {
        return;
    }

    mapTilerAvailable = false;

    primarySatelliteLayer.setVisible(false);
    overviewSatelliteLayer.setVisible(false);

    if (
        currentBasemap ===
        "satellite"
    ) {
        primarySatelliteFallbackLayer.setVisible(true);
        overviewSatelliteFallbackLayer.setVisible(true);
    }

    if (!mapTilerFallbackNotified) {
        mapTilerFallbackNotified = true;

        showMapStatus(
            "MapTiler non disponibile: è stata attivata automaticamente la vista satellitare Esri."
        );
    }

    document.dispatchEvent(
        new CustomEvent(
            "webgis:satellite-fallback",
            {
                detail: {
                    provider: "esri"
                }
            }
        )
    );
}

/* ==========================================================
   LAYER PRINCIPALI
========================================================== */

function createPrimaryLayers() {

    primaryBoundaryLayer =
        new ol.layer.Vector({
            source: boundarySource,
            visible: true,
            zIndex: 90,
            style: createBoundaryStyle(
                false
            )
        });

    primarySurveysLayer =
        new ol.layer.Vector({
            source: surveysSource,
            visible: true,
            zIndex: 100,
            style: createSurveyStyle(
                false
            )
        });
}

function createOverviewLayers() {

    overviewBoundaryLayer =
        new ol.layer.Vector({
            source: boundarySource,
            visible: true,
            zIndex: 90,
            style: createBoundaryStyle(
                true
            )
        });

    overviewSurveysLayer =
        new ol.layer.Vector({
            source: surveysSource,
            visible: true,
            zIndex: 100,
            style: createSurveyStyle(
                true
            )
        });
}

/* ==========================================================
   LAYER HABITAT
========================================================== */

function createHabitatLayers() {

    HABITAT_CONFIG.forEach(
        (
            habitat,
            index
        ) => {

            const source =
                new ol.source.Vector({
                    url: habitat.path,
                    format:
                        new ol.format.GeoJSON()
                });

            const primaryLayer =
                new ol.layer.Vector({
                    source,
                    visible: false,
                    opacity: 0.58,
                    zIndex:
                        10 + index,
                    style:
                        createHabitatStyle(
                            habitat.color,
                            false
                        )
                });

            const overviewLayer =
                new ol.layer.Vector({
                    source,
                    visible: false,
                    opacity: 0.58,
                    zIndex:
                        10 + index,
                    style:
                        createHabitatStyle(
                            habitat.color,
                            true
                        )
                });

            habitatLayers.set(
                habitat.id,
                {
                    config:
                        habitat,
                    source,
                    primaryLayer,
                    overviewLayer
                }
            );
        }
    );
}

/* ==========================================================
   ORDINAMENTO HABITAT PER SUPERFICIE
========================================================== */

async function sortHabitatLayersByArea() {

    if (
        !habitatList ||
        !habitatLayers.size
    ) {
        return;
    }

    habitatList.setAttribute(
        "aria-busy",
        "true"
    );

    const habitatEntries =
        Array.from(
            habitatLayers.entries()
        );

    const habitatAreas =
        await Promise.all(
            habitatEntries.map(
                async (
                    [
                        habitatId,
                        habitatItem
                    ],
                    originalIndex
                ) => {

                    try {

                        const area =
                            await calculateHabitatAreaFromGeoJson(
                                habitatItem.config.path
                            );

                        return {
                            id:
                                habitatId,
                            item:
                                habitatItem,
                            area,
                            originalIndex,
                            fixedBottomIndex:
                                HABITAT_FIXED_BOTTOM_IDS.indexOf(
                                    habitatId
                                )
                        };

                    } catch (error) {

                        console.warn(
                            `Impossibile calcolare la superficie del layer ${habitatItem.config.name}.`,
                            error
                        );

                        return {
                            id:
                                habitatId,
                            item:
                                habitatItem,
                            area:
                                -1,
                            originalIndex,
                            fixedBottomIndex:
                                HABITAT_FIXED_BOTTOM_IDS.indexOf(
                                    habitatId
                                )
                        };
                    }
                }
            )
        );

    habitatAreas.sort(
        (
            firstHabitat,
            secondHabitat
        ) => {

            const firstIsFixedBottom =
                firstHabitat.fixedBottomIndex >= 0;

            const secondIsFixedBottom =
                secondHabitat.fixedBottomIndex >= 0;

            if (
                firstIsFixedBottom &&
                secondIsFixedBottom
            ) {
                return (
                    firstHabitat.fixedBottomIndex -
                    secondHabitat.fixedBottomIndex
                );
            }

            if (firstIsFixedBottom) {
                return 1;
            }

            if (secondIsFixedBottom) {
                return -1;
            }

            if (
                firstHabitat.area >= 0 &&
                secondHabitat.area >= 0 &&
                firstHabitat.area !==
                    secondHabitat.area
            ) {
                return (
                    secondHabitat.area -
                    firstHabitat.area
                );
            }

            if (
                firstHabitat.area >= 0 &&
                secondHabitat.area < 0
            ) {
                return -1;
            }

            if (
                firstHabitat.area < 0 &&
                secondHabitat.area >= 0
            ) {
                return 1;
            }

            return (
                firstHabitat.originalIndex -
                secondHabitat.originalIndex
            );
        }
    );

    habitatAreas.forEach(
        (
            habitatResult,
            sortedIndex
        ) => {

            const checkbox =
                habitatList.querySelector(
                    `[data-layer-id="${habitatResult.id}"]`
                );

            const row =
                checkbox
                    ? checkbox.closest(
                        ".map-layer-row"
                    )
                    : null;

            if (row) {

                habitatList.appendChild(
                    row
                );

                if (
                    habitatResult.area >= 0
                ) {

                    const areaInHectares =
                        habitatResult.area /
                        10000;

                    row.dataset.areaHectares =
                        areaInHectares.toFixed(
                            2
                        );

                    const label =
                        row.querySelector(
                            ".map-layer-label"
                        );

                    if (label) {
                        label.title =
                            `${habitatResult.item.config.name} — ${formatHabitatArea(areaInHectares)}`;
                    }
                }
            }

            const zIndex =
                10 + sortedIndex;

            habitatResult.item.primaryLayer.setZIndex(
                zIndex
            );

            habitatResult.item.overviewLayer.setZIndex(
                zIndex
            );
        }
    );

    habitatList.setAttribute(
        "aria-busy",
        "false"
    );

    updateHabitatBulkControls();

    document.dispatchEvent(
        new CustomEvent(
            "webgis:habitat-sorted",
            {
                detail: {
                    order:
                        habitatAreas.map(
                            habitatResult => ({
                                id:
                                    habitatResult.id,
                                areaSquareMetres:
                                    habitatResult.area >= 0
                                        ? habitatResult.area
                                        : null,
                                fixedAtBottom:
                                    habitatResult.fixedBottomIndex >= 0
                            })
                        )
                }
            }
        )
    );
}

async function calculateHabitatAreaFromGeoJson(
    geoJsonPath
) {

    const response =
        await fetch(
            geoJsonPath,
            {
                cache:
                    "no-store"
            }
        );

    if (!response.ok) {
        throw new Error(
            `Errore HTTP ${response.status}`
        );
    }

    const geoJson =
        await response.json();

    const features =
        new ol.format.GeoJSON().readFeatures(
            geoJson,
            {
                dataProjection:
                    "EPSG:4326",
                featureProjection:
                    "EPSG:3857"
            }
        );

    return features.reduce(
        (
            totalArea,
            feature
        ) => {

            const geometry =
                feature.getGeometry();

            if (!geometry) {
                return totalArea;
            }

            const geometryType =
                geometry.getType();

            if (
                geometryType !==
                    "Polygon" &&
                geometryType !==
                    "MultiPolygon"
            ) {
                return totalArea;
            }

            try {
                return (
                    totalArea +
                    Math.abs(
                        ol.sphere.getArea(
                            geometry,
                            {
                                projection:
                                    "EPSG:3857"
                            }
                        )
                    )
                );
            } catch (error) {
                console.warn(
                    "Geometria esclusa dal calcolo della superficie.",
                    error
                );

                return totalArea;
            }
        },
        0
    );
}

function formatHabitatArea(
    areaInHectares
) {

    return `${new Intl.NumberFormat(
        "it-IT",
        {
            maximumFractionDigits:
                areaInHectares >= 100
                    ? 0
                    : 1
        }
    ).format(areaInHectares)} ha`;
}

/* ==========================================================
   CREAZIONE MAPPE
========================================================== */

function createMaps() {

    primaryView =
        new ol.View({
            center:
                ol.proj.fromLonLat([
                    14.30,
                    41.87
                ]),
            zoom: 13,
            minZoom: 9,
            maxZoom: 20
        });

    overviewView =
        new ol.View({
            center:
                ol.proj.fromLonLat([
                    14.30,
                    41.87
                ]),
            zoom: 12,
            minZoom: 8,
            maxZoom: 16
        });

    primaryMap =
        new ol.Map({
            target:
                "map-primary",
            layers:
                getPrimaryLayerList(),
            view:
                primaryView,
            controls:
                ol.control.defaults.defaults({
                    rotate:
                        false
                }).extend([
                    new ol.control.ScaleLine({
                        units:
                            "metric"
                    })
                ])
        });

    overviewMap =
        new ol.Map({
            target:
                "map-overview",
            layers:
                getOverviewLayerList(),
            view:
                overviewView,
            controls:
                [
                    new ol.control.ScaleLine({
                        units:
                            "metric",
                        minWidth:
                            52
                    })
                ],
            interactions:
                ol.interaction.defaults.defaults({
                    altShiftDragRotate:
                        false,
                    doubleClickZoom:
                        false,
                    dragPan:
                        false,
                    keyboard:
                        false,
                    mouseWheelZoom:
                        false,
                    pinchRotate:
                        false,
                    pinchZoom:
                        false,
                    shiftDragZoom:
                        false
                })
        });

    overviewExtentFeature =
        new ol.Feature();

    const extentLayer =
        new ol.layer.Vector({
            source:
                overviewExtentSource,
            zIndex:
                500,
            style:
                new ol.style.Style({
                    fill:
                        new ol.style.Fill({
                            color:
                                "rgba(225, 47, 47, 0.14)"
                        }),
                    stroke:
                        new ol.style.Stroke({
                            color:
                                "#e12f2f",
                            width:
                                2.4
                        })
                })
        });

    overviewExtentSource.addFeature(
        overviewExtentFeature
    );

    overviewMap.addLayer(
        extentLayer
    );

    document
        .getElementById(
            "map-overview"
        )
        .classList.add(
            "map-overview-ready"
        );
}

function getPrimaryLayerList() {

    return [
        primarySatelliteFallbackLayer,
        primarySatelliteLayer,
        primaryOsmLayer,
        ...Array.from(
            habitatLayers.values()
        ).map(
            item =>
                item.primaryLayer
        ),
        primaryBoundaryLayer,
        primarySurveysLayer
    ];
}

function getOverviewLayerList() {

    return [
        overviewSatelliteFallbackLayer,
        overviewSatelliteLayer,
        overviewOsmLayer,
        ...Array.from(
            habitatLayers.values()
        ).map(
            item =>
                item.overviewLayer
        ),
        overviewBoundaryLayer,
        overviewSurveysLayer
    ];
}

/* ==========================================================
   STILI
========================================================== */

function createBoundaryStyle(
    overview
) {

    return new ol.style.Style({
        fill:
            new ol.style.Fill({
                color:
                    overview
                        ? "rgba(255, 255, 255, 0.03)"
                        : "rgba(255, 255, 255, 0.02)"
            }),
        stroke:
            new ol.style.Stroke({
                color:
                    "#f4d03f",
                width:
                    overview
                        ? 2
                        : 3,
                lineDash:
                    overview
                        ? [
                            5,
                            4
                        ]
                        : [
                            8,
                            5
                        ]
            })
    });
}

function createSurveyStyle(
    overview
) {

    const standardStyle =
        new ol.style.Style({
            image:
                new ol.style.Circle({
                    radius:
                        overview
                            ? 2.7
                            : 6,
                    fill:
                        new ol.style.Fill({
                            color:
                                "#d83f3f"
                        }),
                    stroke:
                        new ol.style.Stroke({
                            color:
                                "#ffffff",
                            width:
                                overview
                                    ? 1
                                    : 2
                        })
                }),
            zIndex: 100
        });

    const filteredHaloStyle =
        new ol.style.Style({
            image:
                new ol.style.Circle({
                    radius:
                        overview
                            ? 6
                            : 12,
                    fill:
                        new ol.style.Fill({
                            color:
                                overview
                                    ? "rgba(244, 208, 63, 0.30)"
                                    : "rgba(244, 208, 63, 0.24)"
                        }),
                    stroke:
                        new ol.style.Stroke({
                            color:
                                "rgba(244, 208, 63, 0.95)",
                            width:
                                overview
                                    ? 1.4
                                    : 2.2
                        })
                }),
            zIndex: 190
        });

    const filteredPointStyle =
        new ol.style.Style({
            image:
                new ol.style.Circle({
                    radius:
                        overview
                            ? 4
                            : 8,
                    fill:
                        new ol.style.Fill({
                            color:
                                "#d83f3f"
                        }),
                    stroke:
                        new ol.style.Stroke({
                            color:
                                "#ffffff",
                            width:
                                overview
                                    ? 1.5
                                    : 3
                        })
                }),
            zIndex: 200
        });

    return feature => {

        if (
            !isSurveyFeatureVisibleForSpecies(
                feature
            )
        ) {
            return null;
        }

        if (!selectedSpeciesKey) {
            return standardStyle;
        }

        return [
            filteredHaloStyle,
            filteredPointStyle
        ];
    };
}

function createSelectedSurveyStyle() {

    return new ol.style.Style({
        image:
            new ol.style.Circle({
                radius:
                    10,
                fill:
                    new ol.style.Fill({
                        color:
                            "#f4d03f"
                    }),
                stroke:
                    new ol.style.Stroke({
                        color:
                            "#ffffff",
                        width:
                            3
                    })
            }),
        zIndex:
            1000
    });
}

function createHabitatStyle(
    color,
    overview
) {

    return new ol.style.Style({
        fill:
            new ol.style.Fill({
                color:
                    hexToRgba(
                        color,
                        overview
                            ? 0.42
                            : 0.48
                    )
            }),
        stroke:
            new ol.style.Stroke({
                color:
                    color,
                width:
                    overview
                        ? 0.8
                        : 1.3
            })
    });
}

function hexToRgba(
    hexColor,
    opacity
) {

    const normalized =
        hexColor.replace(
            "#",
            ""
        );

    const red =
        Number.parseInt(
            normalized.substring(
                0,
                2
            ),
            16
        );

    const green =
        Number.parseInt(
            normalized.substring(
                2,
                4
            ),
            16
        );

    const blue =
        Number.parseInt(
            normalized.substring(
                4,
                6
            ),
            16
        );

    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

/* ==========================================================
   ATTENDI IL CONFINE COMUNALE
========================================================== */

function waitForBoundary() {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const existingFeatures =
                boundarySource.getFeatures();

            if (existingFeatures.length) {

                resolve();

                return;
            }

            const timeout =
                window.setTimeout(
                    () => {

                        reject(
                            new Error(
                                "Tempo scaduto durante il caricamento del limite amministrativo."
                            )
                        );
                    },
                    15000
                );

            boundarySource.once(
                "change",
                () => {

                    const state =
                        boundarySource.getState();

                    if (
                        state ===
                        "ready"
                    ) {

                        window.clearTimeout(
                            timeout
                        );

                        resolve();
                    }

                    if (
                        state ===
                        "error"
                    ) {

                        window.clearTimeout(
                            timeout
                        );

                        reject(
                            new Error(
                                "Errore durante il caricamento del limite amministrativo."
                            )
                        );
                    }
                }
            );
        }
    );
}

/* ==========================================================
   INQUADRAMENTO DEL TERRITORIO
========================================================== */

function fitMapsToMunicipality() {

    municipalityExtent =
        boundarySource.getExtent();

    if (
        !municipalityExtent ||
        ol.extent.isEmpty(
            municipalityExtent
        )
    ) {

        throw new Error(
            "L'estensione del Comune non è disponibile."
        );
    }

    primaryView.fit(
        municipalityExtent,
        {
            size:
                primaryMap.getSize(),
            padding: [
                54,
                54,
                54,
                54
            ],
            duration:
                600,
            maxZoom:
                15
        }
    );

    fitOverviewToMunicipality();
}

/* ==========================================================
   EVENTI DELL'INTERFACCIA
========================================================== */

function configureInterfaceEvents() {

    sidebarToggle.addEventListener(
        "click",
        toggleSidebar
    );

    habitatToggle.addEventListener(
        "click",
        toggleHabitatList
    );

    habitatSelectAllButton.addEventListener(
        "click",
        () => setAllHabitatVisibility(true)
    );

    habitatClearAllButton.addEventListener(
        "click",
        () => setAllHabitatVisibility(false)
    );

    overviewToggle.addEventListener(
        "click",
        toggleOverviewPanel
    );

    map3DReturnButton.addEventListener(
        "click",
        () => {
            selectBasemapControl(
                previous2DBasemap
            );
        }
    );

    map3DTiltUpButton.addEventListener(
        "click",
        () => change3DPitch(10)
    );

    map3DTiltDownButton.addEventListener(
        "click",
        () => change3DPitch(-10)
    );

    map3DResetButton.addEventListener(
        "click",
        restore3DPerspective
    );

    map3DTopButton.addEventListener(
        "click",
        set3DTopView
    );

    map3DNorthButton.addEventListener(
        "click",
        orient3DToNorth
    );

    speciesSelect.addEventListener(
        "change",
        handleSpeciesSelectionChange
    );

    speciesZoomButton.addEventListener(
        "click",
        zoomToSpeciesResults
    );

    speciesResetButton.addEventListener(
        "click",
        resetSpeciesFilter
    );

    speciesShowAllButton.addEventListener(
        "click",
        showAllSurveyResults
    );

    speciesGalleryButton.addEventListener(
        "click",
        openSpeciesGallery
    );

    speciesGalleryCloseButton.addEventListener(
        "click",
        closeSpeciesGallery
    );

    speciesGalleryOverlay.addEventListener(
        "click",
        event => {
            if (event.target === speciesGalleryOverlay) {
                closeSpeciesGallery();
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape" && !speciesGalleryOverlay.hidden) {
                closeSpeciesGallery();
            }
        }
    );

    document
        .querySelectorAll(
            'input[name="basemap"]'
        )
        .forEach(
            input => {

                input.addEventListener(
                    "change",
                    handleBasemapChange
                );
            }
        );

    document
        .querySelectorAll(
            ".map-layer-input"
        )
        .forEach(
            input => {

                input.addEventListener(
                    "change",
                    handleLayerVisibilityChange
                );
            }
        );

    configureLayerZoomButtons();
}

function toggleSidebar() {

    const collapsed =
        sidebar.classList.toggle(
            "map-sidebar-collapsed"
        );

    sidebarToggle.setAttribute(
        "aria-expanded",
        String(!collapsed)
    );

    sidebarToggle.setAttribute(
        "aria-label",
        collapsed
            ? "Espandi il pannello di controllo"
            : "Riduci il pannello di controllo"
    );

    sidebarToggle.title =
        collapsed
            ? "Espandi il pannello"
            : "Riduci il pannello";

    window.setTimeout(
        resizeMaps,
        320
    );
}

function toggleHabitatList() {

    const collapsed =
        habitatList.classList.toggle(
            "map-habitat-list-collapsed"
        );

    habitatToggle.setAttribute(
        "aria-expanded",
        String(!collapsed)
    );

    habitatToggle
        .querySelector("span")
        .textContent =
        collapsed
            ? "+"
            : "−";
}

function toggleOverviewPanel() {

    const collapsed =
        overviewPanel.classList.toggle(
            "map-overview-panel-collapsed"
        );

    saveOverviewPanelState(
        collapsed
    );

    updateOverviewPanelControls(
        collapsed
    );

    if (!collapsed) {

        window.setTimeout(
            () => {

                resizeOverviewMap();
                fitOverviewToMunicipality();
                updateCurrentExtent();
            },
            260
        );
    }
}

function updateOverviewPanelControls(
    collapsed
) {

    overviewToggle.setAttribute(
        "aria-expanded",
        String(!collapsed)
    );

    overviewToggle.setAttribute(
        "aria-label",
        collapsed
            ? "Espandi il navigatore territoriale"
            : "Riduci il navigatore territoriale"
    );

    overviewToggle.title =
        collapsed
            ? "Espandi il navigatore territoriale"
            : "Riduci il navigatore territoriale";

    const symbol =
        overviewToggle.querySelector(
            "span"
        );

    if (symbol) {
        symbol.textContent =
            collapsed
                ? "+"
                : "−";
    }

}

function saveOverviewPanelState(
    collapsed
) {

    try {
        window.sessionStorage.setItem(
            OVERVIEW_STORAGE_KEY,
            collapsed
                ? "true"
                : "false"
        );
    } catch (error) {
        console.warn(
            "Impossibile memorizzare lo stato del navigatore territoriale.",
            error
        );
    }
}

function restoreOverviewPanelState() {

    let collapsed =
        false;

    try {
        collapsed =
            window.sessionStorage.getItem(
                OVERVIEW_STORAGE_KEY
            ) === "true";
    } catch (error) {
        collapsed =
            false;
    }

    overviewPanel.classList.toggle(
        "map-overview-panel-collapsed",
        collapsed
    );

    updateOverviewPanelControls(
        collapsed
    );
}

function handleBasemapChange(
    event
) {

    const selectedBasemap =
        event.target.value;

    if (
        selectedBasemap !== "satellite" &&
        selectedBasemap !== "osm" &&
        selectedBasemap !== "3d"
    ) {
        return;
    }

    if (selectedBasemap === "3d") {
        activate3DView();
    } else {
        setBasemap(
            selectedBasemap
        );
    }

    updateBasemapOptionStyles();
}

function setBasemap(
    basemapId
) {

    if (
        basemapId !== "satellite" &&
        basemapId !== "osm"
    ) {
        return;
    }

    previous2DBasemap =
        basemapId;

    currentBasemap =
        basemapId;

    deactivate3DView(
        false
    );

    scheduleScaleDisplayUpdate();

    const satelliteVisible =
        basemapId ===
        "satellite";

    primarySatelliteFallbackLayer.setVisible(
        satelliteVisible
    );

    overviewSatelliteFallbackLayer.setVisible(
        satelliteVisible
    );

    primarySatelliteLayer.setVisible(
        satelliteVisible &&
        mapTilerAvailable
    );

    overviewSatelliteLayer.setVisible(
        satelliteVisible &&
        mapTilerAvailable
    );

    primaryOsmLayer.setVisible(
        !satelliteVisible
    );

    overviewOsmLayer.setVisible(
        !satelliteVisible
    );

    document.dispatchEvent(
        new CustomEvent(
            "webgis:basemap-changed",
            {
                detail: {
                    basemap:
                        basemapId
                }
            }
        )
    );
}

function updateBasemapOptionStyles() {

    document
        .querySelectorAll(
            ".map-basemap-option"
        )
        .forEach(
            option => {

                const input =
                    option.querySelector(
                        ".map-basemap-input"
                    );

                option.classList.toggle(
                    "map-basemap-option-active",
                    Boolean(
                        input &&
                        input.checked
                    )
                );
            }
        );
}

function handleLayerVisibilityChange(
    event
) {

    const layerId =
        event.target.dataset.layerId;

    const visible =
        event.target.checked;

    if (
        layerId ===
        "boundary"
    ) {

        primaryBoundaryLayer.setVisible(
            visible
        );

        overviewBoundaryLayer.setVisible(
            true
        );

    } else if (
        layerId ===
        "surveys"
    ) {

        primarySurveysLayer.setVisible(
            visible
        );

        overviewSurveysLayer.setVisible(
            visible
        );

        if (!visible) {

            clearSelectedSurvey();

            hidePopup();
        }

        updateSpeciesFilterInterface();

    } else {

        const habitat =
            habitatLayers.get(
                layerId
            );

        if (!habitat) {
            return;
        }

        habitat.primaryLayer.setVisible(
            visible
        );

        habitat.overviewLayer.setVisible(
            visible
        );
    }

    set3DLayerVisibility(
        layerId,
        visible
    );

    if (habitatLayers.has(layerId)) {
        updateHabitatBulkControls();
    }

    document.dispatchEvent(
        new CustomEvent(
            "webgis:layer-visibility-changed",
            {
                detail: {
                    layerId,
                    visible
                }
            }
        )
    );
}


/* ==========================================================
   AZIONI RAPIDE HABITAT
========================================================== */

function getHabitatCheckboxes() {

    return Array.from(
        habitatList.querySelectorAll(
            '.map-layer-input[data-layer-id^="habitat-"]'
        )
    );
}

function setAllHabitatVisibility(
    visible
) {

    const checkboxes =
        getHabitatCheckboxes();

    checkboxes.forEach(
        checkbox => {

            if (checkbox.checked === visible) {
                return;
            }

            checkbox.checked =
                visible;

            checkbox.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles: true
                    }
                )
            );
        }
    );

    updateHabitatBulkControls();

    document.dispatchEvent(
        new CustomEvent(
            "webgis:habitat-bulk-visibility-changed",
            {
                detail: {
                    visible,
                    total: checkboxes.length
                }
            }
        )
    );
}

function updateHabitatBulkControls() {

    if (
        !habitatSelectAllButton ||
        !habitatClearAllButton ||
        !habitatSelectionSummary
    ) {
        return;
    }

    const checkboxes =
        getHabitatCheckboxes();

    const selectedCount =
        checkboxes.filter(
            checkbox => checkbox.checked
        ).length;

    const totalCount =
        checkboxes.length;

    habitatSelectAllButton.disabled =
        totalCount === 0 ||
        selectedCount === totalCount;

    habitatClearAllButton.disabled =
        selectedCount === 0;

    if (selectedCount === 0) {
        habitatSelectionSummary.textContent =
            "Nessun habitat selezionato.";
    } else if (selectedCount === totalCount) {
        habitatSelectionSummary.textContent =
            `Tutti gli habitat sono selezionati (${totalCount}).`;
    } else {
        habitatSelectionSummary.textContent =
            `${selectedCount} habitat selezionati su ${totalCount}.`;
    }
}

/* ==========================================================
   ZOOM SUI LAYER
========================================================== */

function configureLayerZoomButtons() {

    document
        .querySelectorAll(
            ".map-layer-zoom"
        )
        .forEach(
            button => {

                const accessibleLabel =
                    button.getAttribute(
                        "aria-label"
                    ) ||
                    "Zoom sull’estensione del layer";

                button.dataset.tooltip =
                    accessibleLabel;

                button.title =
                    accessibleLabel;

                button.addEventListener(
                    "click",
                    handleLayerZoomClick
                );
            }
        );
}

function handleLayerZoomClick(
    event
) {

    const button =
        event.currentTarget;

    const layerId =
        button.dataset.zoomLayerId;

    const source =
        getLayerSourceById(
            layerId
        );

    if (!source) {

        showMapMessage(
            "Layer non disponibile."
        );

        return;
    }

    zoomToVectorSource(
        source,
        button
    );
}

function getLayerSourceById(
    layerId
) {

    if (
        layerId ===
        "boundary"
    ) {
        return boundarySource;
    }

    if (
        layerId ===
        "surveys"
    ) {
        return surveysSource;
    }

    const habitat =
        habitatLayers.get(
            layerId
        );

    return habitat
        ? habitat.source
        : null;
}

function zoomToVectorSource(
    source,
    button
) {

    if (
        !primaryMap ||
        !primaryView ||
        !source
    ) {
        return;
    }

    const fitSourceExtent =
        () => {

            const extent =
                source.getExtent();

            if (
                !extent ||
                ol.extent.isEmpty(
                    extent
                )
            ) {

                showMapMessage(
                    "Il layer non contiene elementi visualizzabili."
                );

                return false;
            }

            primaryView.fit(
                extent,
                {
                    size:
                        primaryMap.getSize(),
                    padding: [
                        72,
                        72,
                        72,
                        72
                    ],
                    duration:
                        650,
                    maxZoom:
                        17
                }
            );

            showMapMessage(
                "Zoom sul layer completato."
            );

            return true;
        };

    if (
        source.getState() ===
        "ready"
    ) {

        fitSourceExtent();

        return;
    }

    button.disabled =
        true;

    showMapMessage(
        "Caricamento del layer in corso…"
    );

    const handleSourceChange =
        () => {

            const state =
                source.getState();

            if (
                state !== "ready" &&
                state !== "error"
            ) {
                return;
            }

            source.un(
                "change",
                handleSourceChange
            );

            button.disabled =
                false;

            if (
                state ===
                "error"
            ) {

                showMapMessage(
                    "Impossibile caricare il layer selezionato."
                );

                return;
            }

            fitSourceExtent();
        };

    source.on(
        "change",
        handleSourceChange
    );
}

function showMapMessage(
    message
) {

    if (!mapStatus) {
        return;
    }

    mapStatus.textContent =
        message;

    mapStatus.classList.remove(
        "map-status-hidden"
    );

    window.clearTimeout(
        showMapMessage.timeoutId
    );

    showMapMessage.timeoutId =
        window.setTimeout(
            () => {

                mapStatus.classList.add(
                    "map-status-hidden"
                );
            },
            1800
        );
}

showMapMessage.timeoutId =
    null;

/* ==========================================================
   FILTRO DEI RILIEVI PER SPECIE
========================================================== */

function initializeSpeciesFilter() {

    speciesSelect.disabled =
        true;

    speciesZoomButton.disabled =
        true;

    speciesResetButton.disabled =
        true;

    speciesShowAllButton.disabled =
        true;

    speciesGalleryButton.disabled =
        true;

    const refreshCatalog = () => {

        if (
            surveysSource.getState() !==
                "ready" &&
            !surveysSource.getFeatures().length
        ) {
            return;
        }

        buildSpeciesCatalog();

        populateSpeciesSelect();

        speciesFilterReady =
            true;

        speciesSelect.disabled =
            false;

        updateSpeciesFilterInterface();
    };

    surveysSource.on(
        "change",
        refreshCatalog
    );

    surveysSource.on(
        "addfeature",
        refreshCatalog
    );

    refreshCatalog();
}

function buildSpeciesCatalog() {

    const nextCatalog =
        new Map();

    surveysSource
        .getFeatures()
        .forEach(
            feature => {

                const speciesName =
                    getSurveySpeciesName(
                        feature
                    );

                const speciesKey =
                    normalizeSpeciesKey(
                        speciesName
                    );

                if (!speciesKey) {
                    return;
                }

                const existingEntry =
                    nextCatalog.get(
                        speciesKey
                    );

                if (existingEntry) {
                    existingEntry.count +=
                        1;

                    return;
                }

                nextCatalog.set(
                    speciesKey,
                    {
                        key:
                            speciesKey,
                        label:
                            speciesName,
                        count:
                            1
                    }
                );
            }
        );

    speciesCatalog =
        new Map(
            Array.from(
                nextCatalog.entries()
            ).sort(
                (
                    firstEntry,
                    secondEntry
                ) =>
                    firstEntry[1].label.localeCompare(
                        secondEntry[1].label,
                        "it",
                        {
                            sensitivity:
                                "base"
                        }
                    )
            )
        );

    if (
        selectedSpeciesKey &&
        !speciesCatalog.has(
            selectedSpeciesKey
        )
    ) {
        selectedSpeciesKey =
            "";
    }
}

function populateSpeciesSelect() {

    const previousValue =
        selectedSpeciesKey;

    speciesSelect.replaceChildren();

    const allSpeciesOption =
        document.createElement(
            "option"
        );

    allSpeciesOption.value =
        "";

    allSpeciesOption.textContent =
        "Tutte le specie";

    speciesSelect.appendChild(
        allSpeciesOption
    );

    speciesCatalog.forEach(
        speciesEntry => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                speciesEntry.key;

            option.textContent =
                `${speciesEntry.label} (${speciesEntry.count})`;

            speciesSelect.appendChild(
                option
            );
        }
    );

    speciesSelect.value =
        speciesCatalog.has(
            previousValue
        )
            ? previousValue
            : "";
}

function handleSpeciesSelectionChange() {

    selectedSpeciesKey =
        normalizeSpeciesKey(
            speciesSelect.value
        );

    applySpeciesFilter();

    if (selectedSpeciesKey) {
        zoomToSpeciesResults();
    }
}

function applySpeciesFilter() {

    primarySurveysLayer.changed();

    overviewSurveysLayer.changed();

    applySpeciesFilterTo3D();

    if (
        selectedSurveyFeature &&
        !isSurveyFeatureVisibleForSpecies(
            selectedSurveyFeature
        )
    ) {
        clearSelectedSurvey();
        hidePopup();
    }

    updateSpeciesFilterInterface();

    document.dispatchEvent(
        new CustomEvent(
            "webgis:species-filter-changed",
            {
                detail: {
                    speciesKey:
                        selectedSpeciesKey || null,
                    species:
                        getSelectedSpeciesLabel(),
                    visibleCount:
                        getVisibleSurveyFeatures().length,
                    totalCount:
                        surveysSource.getFeatures().length
                }
            }
        )
    );
}

function resetSpeciesFilter() {

    selectedSpeciesKey =
        "";

    speciesSelect.value =
        "";

    applySpeciesFilter();

    recenterMapOnMunicipality();
}

function showAllSurveyResults() {

    resetSpeciesFilter();
}

function recenterMapOnMunicipality() {

    if (
        !municipalityExtent ||
        ol.extent.isEmpty(
            municipalityExtent
        )
    ) {
        return;
    }

    if (
        currentBasemap ===
        "3d"
    ) {
        fit3DToMunicipality();

        return;
    }

    if (
        primaryMap &&
        primaryView
    ) {
        primaryView.fit(
            municipalityExtent,
            {
                size:
                    primaryMap.getSize(),
                padding: [
                    54,
                    54,
                    54,
                    54
                ],
                duration:
                    650,
                maxZoom:
                    15
            }
        );
    }

    fitOverviewToMunicipality();
}

function fit3DToMunicipality() {

    if (
        !map3D ||
        !map3DLoaded ||
        !municipalityExtent
    ) {
        return;
    }

    const southWest =
        ol.proj.toLonLat([
            municipalityExtent[0],
            municipalityExtent[1]
        ]);

    const northEast =
        ol.proj.toLonLat([
            municipalityExtent[2],
            municipalityExtent[3]
        ]);

    map3D.fitBounds(
        [
            southWest,
            northEast
        ],
        {
            padding:
                90,
            duration:
                650,
            maxZoom:
                15,
            pitch:
                getConfigured3DPitch(),
            bearing:
                getConfigured3DBearing()
        }
    );
}

function zoomToSpeciesResults() {

    zoomToSurveyFeatures(
        getVisibleSurveyFeatures()
    );
}

function zoomToSurveyFeatures(
    features
) {

    if (
        !features.length ||
        !primaryMap ||
        !primaryView
    ) {
        return;
    }

    if (currentBasemap === "3d") {
        zoom3DToSurveyFeatures(
            features
        );

        return;
    }

    const extent =
        ol.extent.createEmpty();

    features.forEach(
        feature => {
            const geometry =
                feature.getGeometry();

            if (geometry) {
                ol.extent.extend(
                    extent,
                    geometry.getExtent()
                );
            }
        }
    );

    if (ol.extent.isEmpty(extent)) {
        return;
    }

    const singlePoint =
        features.length === 1;

    primaryView.fit(
        extent,
        {
            size:
                primaryMap.getSize(),
            padding: [
                90,
                90,
                90,
                90
            ],
            duration:
                550,
            maxZoom:
                singlePoint
                    ? 18
                    : 17
        }
    );
}

function zoom3DToSurveyFeatures(
    features
) {

    if (
        !map3D ||
        !map3DLoaded ||
        !features.length
    ) {
        return;
    }

    const coordinates =
        features
            .map(
                feature => {
                    const geometry =
                        feature.getGeometry();

                    if (
                        !geometry ||
                        geometry.getType() !==
                            "Point"
                    ) {
                        return null;
                    }

                    return ol.proj.toLonLat(
                        geometry.getCoordinates()
                    );
                }
            )
            .filter(
                Boolean
            );

    if (!coordinates.length) {
        return;
    }

    if (coordinates.length === 1) {
        map3D.easeTo({
            center:
                coordinates[0],
            zoom:
                Math.max(
                    map3D.getZoom(),
                    16
                ),
            duration:
                650
        });

        return;
    }

    const bounds =
        coordinates.reduce(
            (
                currentBounds,
                coordinate
            ) =>
                currentBounds.extend(
                    coordinate
                ),
            new window.maptilersdk.LngLatBounds(
                coordinates[0],
                coordinates[0]
            )
        );

    map3D.fitBounds(
        bounds,
        {
            padding:
                90,
            duration:
                650,
            maxZoom:
                17
        }
    );
}

function getVisibleSurveyFeatures() {

    if (
        !primarySurveysLayer ||
        !primarySurveysLayer.getVisible()
    ) {
        return [];
    }

    return surveysSource
        .getFeatures()
        .filter(
            isSurveyFeatureVisibleForSpecies
        );
}

function isSurveyFeatureVisibleForSpecies(
    feature
) {

    if (!selectedSpeciesKey) {
        return true;
    }

    return (
        normalizeSpeciesKey(
            getSurveySpeciesName(
                feature
            )
        ) ===
        selectedSpeciesKey
    );
}

function getSurveySpeciesName(
    feature
) {

    if (
        !feature ||
        typeof feature.get !==
            "function"
    ) {
        return "";
    }

    return String(
        feature.get("Specie") ||
        ""
    ).trim();
}

function normalizeSpeciesKey(
    value
) {

    return String(
        value ||
        ""
    )
        .trim()
        .replace(
            /\s+/g,
            " "
        )
        .toLocaleLowerCase(
            "it"
        );
}

function getSelectedSpeciesLabel() {

    if (!selectedSpeciesKey) {
        return null;
    }

    return (
        speciesCatalog.get(
            selectedSpeciesKey
        )?.label ||
        null
    );
}

function updateSpeciesFilterInterface() {

    if (!speciesFilterReady) {
        return;
    }

    const totalCount =
        surveysSource.getFeatures().length;

    const surveysVisible =
        Boolean(
            primarySurveysLayer &&
            primarySurveysLayer.getVisible()
        );

    const filteredCount =
        surveysSource
            .getFeatures()
            .filter(
                isSurveyFeatureVisibleForSpecies
            ).length;

    const visibleCount =
        surveysVisible
            ? filteredCount
            : 0;

    speciesSummary.textContent =
        `${visibleCount} ${visibleCount === 1 ? "rilievo visibile" : "rilievi visibili"} su ${totalCount}.`;

    speciesZoomButton.disabled =
        visibleCount === 0;

    speciesResetButton.disabled =
        !selectedSpeciesKey;

    speciesShowAllButton.disabled =
        totalCount === 0 ||
        (
            !selectedSpeciesKey &&
            visibleCount === totalCount
        );

    const selectedSpeciesPhotoCount =
        selectedSpeciesKey
            ? getVisibleSurveyFeatures()
                .reduce(
                    (
                        totalPhotos,
                        feature
                    ) =>
                        totalPhotos +
                        getSurveyPhotoUrls(feature).length,
                    0
                )
            : 0;

    speciesGalleryButton.disabled =
        !selectedSpeciesKey ||
        filteredCount === 0 ||
        selectedSpeciesPhotoCount === 0;

    speciesGalleryButton.title =
        !selectedSpeciesKey
            ? "Seleziona una specie per aprire la galleria"
            : selectedSpeciesPhotoCount === 0
                ? "Nessuna fotografia disponibile per la specie selezionata"
                : `Apri ${selectedSpeciesPhotoCount} ${selectedSpeciesPhotoCount === 1 ? "fotografia" : "fotografie"} della specie selezionata`;

    speciesGalleryButton.setAttribute(
        "aria-label",
        speciesGalleryButton.title
    );
}


function openSpeciesGallery() {

    if (!selectedSpeciesKey) {
        return;
    }

    const speciesLabel =
        getSelectedSpeciesLabel() ||
        "Specie selezionata";

    const galleryItems =
        getVisibleSurveyFeatures()
            .flatMap(
                feature =>
                    getSurveyPhotoUrls(feature)
                        .map(
                            (
                                url,
                                photoIndex
                            ) => ({
                                feature,
                                url,
                                photoIndex
                            })
                        )
            );

    speciesGalleryReturnFocusElement =
        document.activeElement instanceof HTMLElement
            ? document.activeElement
            : speciesGalleryButton;

    speciesGalleryTitle.textContent =
        speciesLabel;

    speciesGallerySummary.textContent =
        galleryItems.length
            ? `${galleryItems.length} ${galleryItems.length === 1 ? "fotografia disponibile" : "fotografie disponibili"}. Seleziona un’immagine per raggiungere il relativo rilievo.`
            : "Nessuna fotografia disponibile per i rilievi associati alla specie selezionata.";

    speciesGalleryContent.replaceChildren();

    if (!galleryItems.length) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.className =
            "map-species-gallery-empty";

        emptyMessage.textContent =
            "Le schede dei rilievi restano consultabili direttamente dalla mappa.";

        speciesGalleryContent.appendChild(
            emptyMessage
        );
    } else {
        const grid =
            document.createElement("div");

        grid.className =
            "map-species-gallery-grid";

        galleryItems.forEach(
            (
                galleryItem,
                itemIndex
            ) => {
                const card =
                    document.createElement("button");

                card.type =
                    "button";

                card.className =
                    "map-species-gallery-card";

                card.setAttribute(
                    "aria-label",
                    `Raggiungi il rilievo associato alla fotografia ${itemIndex + 1}`
                );

                const image =
                    document.createElement("img");

                image.className =
                    "map-species-gallery-image";

                image.src =
                    galleryItem.url;

                image.alt =
                    `${speciesLabel}, fotografia ${itemIndex + 1}`;

                image.loading =
                    "lazy";

                image.addEventListener(
                    "error",
                    () => {
                        card.remove();

                        const remainingCards =
                            grid.querySelectorAll(
                                ".map-species-gallery-card"
                            ).length;

                        speciesGallerySummary.textContent =
                            remainingCards
                                ? `${remainingCards} ${remainingCards === 1 ? "fotografia disponibile" : "fotografie disponibili"}. Seleziona un’immagine per raggiungere il relativo rilievo.`
                                : "Nessuna fotografia disponibile per i rilievi associati alla specie selezionata.";

                        if (!remainingCards) {
                            const emptyMessage =
                                document.createElement("p");

                            emptyMessage.className =
                                "map-species-gallery-empty";

                            emptyMessage.textContent =
                                "Le schede dei rilievi restano consultabili direttamente dalla mappa.";

                            speciesGalleryContent.replaceChildren(
                                emptyMessage
                            );
                        }
                    },
                    {
                        once: true
                    }
                );

                const caption =
                    document.createElement("span");

                caption.className =
                    "map-species-gallery-caption";

                caption.textContent =
                    getSurveyGalleryCaption(
                        galleryItem.feature,
                        itemIndex + 1
                    );

                card.append(
                    image,
                    caption
                );

                card.addEventListener(
                    "click",
                    () => {
                        closeSpeciesGallery(false);
                        focusSurveyFromGallery(
                            galleryItem.feature
                        );
                    }
                );

                grid.appendChild(card);
            }
        );

        speciesGalleryContent.appendChild(grid);
    }

    speciesGalleryOverlay.hidden =
        false;

    speciesGalleryOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "map-species-gallery-open"
    );

    window.requestAnimationFrame(
        () => speciesGalleryCloseButton.focus()
    );
}

function closeSpeciesGallery(
    restoreFocus = true
) {

    if (
        !speciesGalleryOverlay ||
        speciesGalleryOverlay.hidden
    ) {
        return;
    }

    if (
        speciesGalleryOverlay.contains(
            document.activeElement
        )
    ) {
        document.activeElement.blur();
    }

    speciesGalleryOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    speciesGalleryOverlay.hidden =
        true;

    document.body.classList.remove(
        "map-species-gallery-open"
    );

    if (
        restoreFocus &&
        speciesGalleryReturnFocusElement &&
        typeof speciesGalleryReturnFocusElement.focus ===
            "function"
    ) {
        speciesGalleryReturnFocusElement.focus();
    }
}

function getSurveyPhotoUrls(
    feature
) {

    if (!feature) {
        return [];
    }

    const properties =
        typeof feature.getProperties === "function"
            ? feature.getProperties()
            : {};

    /*
     * Il campo Foto contiene l'elenco ufficiale delle immagini
     * pubblicate, separate dal carattere |. URLFoto viene usato
     * soltanto come fallback quando Foto è vuoto, evitando di
     * contare due volte la stessa fotografia o URL remoti obsoleti.
     */
    const localPhotoKeys = [
        "Foto",
        "foto",
        "Fotografia",
        "fotografia",
        "Foto_URL",
        "foto_url"
    ];

    const remotePhotoKeys = [
        "URLFoto",
        "urlFoto",
        "URL_Foto",
        "url_foto",
        "Photo",
        "photo",
        "photo_url",
        "image",
        "Image",
        "immagine",
        "Immagine",
        "immagini",
        "Immagini"
    ];

    const collectUrls =
        keys => Array.from(
            new Set(
                keys.flatMap(
                    key =>
                        properties[key] != null
                            ? extractPhotoUrlsFromValue(
                                properties[key]
                            )
                            : []
                )
            )
        );

    const localUrls =
        collectUrls(
            localPhotoKeys
        );

    if (localUrls.length) {
        return localUrls;
    }

    return collectUrls(
        remotePhotoKeys
    );
}

function extractPhotoUrlsFromValue(
    value
) {

    if (Array.isArray(value)) {
        return value.flatMap(
            extractPhotoUrlsFromValue
        );
    }

    if (
        value &&
        typeof value === "object"
    ) {
        return Object.values(value).flatMap(
            extractPhotoUrlsFromValue
        );
    }

    const text =
        String(value || "").trim();

    if (!text) {
        return [];
    }

    const urlMatches =
        text.match(
            /https?:\/\/[^\s,;|]+/gi
        );

    if (urlMatches?.length) {
        return urlMatches.map(
            url => url.replace(/[)\]}>'"]+$/g, "")
        );
    }

    return text
        .split(/\s*[;,|]\s*/)
        .map(item => item.trim())
        .filter(
            item =>
                /\.(?:jpe?g|png|webp|gif)(?:\?.*)?$/i.test(item)
        );
}

function getSurveyGalleryCaption(
    feature,
    fallbackIndex
) {

    const getFirstProperty =
        keys => {
            for (const key of keys) {
                const value =
                    feature.get(key);

                if (
                    value !== undefined &&
                    value !== null &&
                    String(value).trim()
                ) {
                    return String(value).trim();
                }
            }

            return "";
        };

    const surveyNumber =
        getFirstProperty([
            "ID",
            "Id",
            "id",
            "NumPlacemark",
            "fid"
        ]);

    const altitude =
        getFirstProperty([
            "Altitudine",
            "altitudine",
            "Quota",
            "quota"
        ]);

    const details = [];

    if (surveyNumber) {
        details.push(
            `Rilievo n. ${surveyNumber}`
        );
    }

    if (
        altitude &&
        Number(altitude) > 0
    ) {
        details.push(
            /m\s*$/i.test(altitude)
                ? altitude
                : `${altitude} m`
        );
    }

    return details.length
        ? details.join(" · ")
        : `Rilievo fotografico ${fallbackIndex}`;
}

function focusSurveyFromGallery(
    feature
) {

    if (!feature) {
        return;
    }

    if (currentBasemap === "3d") {
        zoom3DToSurveyFeatures([feature]);
        return;
    }

    selectSurveyFeature(feature);
    zoomToSurveyFeatures([feature]);
    showPopup(feature);
}

function applySpeciesFilterTo3D() {

    if (
        !map3D ||
        !map3DLoaded ||
        !map3D.getLayer(
            "webgis-surveys-points-3d"
        )
    ) {
        return;
    }

    if (!selectedSpeciesKey) {
        map3D.setFilter(
            "webgis-surveys-points-3d",
            null
        );

        return;
    }

    map3D.setFilter(
        "webgis-surveys-points-3d",
        [
            "==",
            [
                "downcase",
                [
                    "to-string",
                    [
                        "coalesce",
                        [
                            "get",
                            "Specie"
                        ],
                        ""
                    ]
                ]
            ],
            selectedSpeciesKey
        ]
    );
}

/* ==========================================================
   EVENTI DELLE MAPPE
========================================================== */

function configureMapEvents() {

    primaryMap.on(
        "moveend",
        () => {

            updateCurrentExtent();

            updateScaleDisplay();
        }
    );

    primaryView.on(
        "change:resolution",
        scheduleScaleDisplayUpdate
    );

    overviewMap.on(
        "singleclick",
        handleOverviewMapClick
    );

    window.addEventListener(
        "resize",
        handleWindowResize
    );
}

function handleOverviewMapClick(
    event
) {

    if (
        !primaryView ||
        !event ||
        !event.coordinate
    ) {
        return;
    }

    primaryView.animate({
        center:
            event.coordinate,
        duration:
            420
    });
}

function configureSurveyEvents() {

    primaryMap.on(
        "singleclick",
        handlePrimaryMapClick
    );

    primaryMap.on(
        "pointermove",
        handlePrimaryMapPointerMove
    );

    document.addEventListener(
        "webgis:survey-closed",
        clearSelectedSurvey
    );
}

function handlePrimaryMapClick(
    event
) {

    if (
        !primarySurveysLayer ||
        !primarySurveysLayer.getVisible()
    ) {

        clearSelectedSurvey();

        hidePopup();

        return;
    }

    const selectedFeature =
        primaryMap.forEachFeatureAtPixel(
            event.pixel,
            (
                feature,
                layer
            ) => {

                if (
                    layer ===
                    primarySurveysLayer
                ) {
                    return feature;
                }

                return null;
            },
            {
                hitTolerance:
                    SURVEY_HIT_TOLERANCE,
                layerFilter:
                    layer =>
                        layer ===
                        primarySurveysLayer
            }
        );

    if (!selectedFeature) {

        clearSelectedSurvey();

        hidePopup();

        return;
    }

    selectSurveyFeature(
        selectedFeature
    );

    showPopup(
        selectedFeature
    );
}

function handlePrimaryMapPointerMove(
    event
) {

    if (
        event.dragging ||
        !primaryMap ||
        !primarySurveysLayer ||
        !primarySurveysLayer.getVisible()
    ) {
        return;
    }

    const surveyFound =
        primaryMap.hasFeatureAtPixel(
            event.pixel,
            {
                hitTolerance:
                    SURVEY_HIT_TOLERANCE,
                layerFilter:
                    layer =>
                        layer ===
                        primarySurveysLayer
            }
        );

    const targetElement =
        primaryMap.getTargetElement();

    if (targetElement) {

        targetElement.style.cursor =
            surveyFound
                ? "pointer"
                : "";
    }
}

function selectSurveyFeature(
    feature
) {

    if (
        selectedSurveyFeature ===
        feature
    ) {
        return;
    }

    clearSelectedSurvey();

    selectedSurveyFeature =
        feature;

    selectedSurveyFeature.setStyle(
        createSelectedSurveyStyle()
    );

    const geometry =
        selectedSurveyFeature.getGeometry();

    if (
        geometry &&
        typeof geometry.getCoordinates ===
            "function"
    ) {

        const coordinates =
            geometry.getCoordinates();

        primaryView.animate({
            center:
                coordinates,
            duration:
                300
        });
    }
}

function clearSelectedSurvey() {

    if (!selectedSurveyFeature) {
        return;
    }

    selectedSurveyFeature.setStyle(
        undefined
    );

    selectedSurveyFeature =
        null;
}

/* ==========================================================
   RIDIMENSIONAMENTO
========================================================== */

function handleWindowResize() {

    resizeMaps();
    fitOverviewToMunicipality();
    updateCurrentExtent();
}

function resizeMaps() {

    if (primaryMap) {
        primaryMap.updateSize();
    }

    if (
        map3D &&
        typeof map3D.resize === "function"
    ) {
        map3D.resize();
    }

    resizeOverviewMap();
}

function resizeOverviewMap() {

    if (
        !overviewMap ||
        !overviewPanel ||
        overviewPanel.classList.contains(
            "map-overview-panel-collapsed"
        )
    ) {
        return;
    }

    overviewMap.updateSize();
}

function fitOverviewToMunicipality() {

    if (
        !overviewMap ||
        !overviewView ||
        !municipalityExtent ||
        ol.extent.isEmpty(
            municipalityExtent
        ) ||
        (
            overviewPanel &&
            overviewPanel.classList.contains(
                "map-overview-panel-collapsed"
            )
        )
    ) {
        return;
    }

    const overviewSize =
        overviewMap.getSize();

    if (
        !overviewSize ||
        !overviewSize[0] ||
        !overviewSize[1]
    ) {
        return;
    }

    overviewView.fit(
        municipalityExtent,
        {
            size:
                overviewSize,
            padding:
                OVERVIEW_FIT_PADDING,
            duration:
                0,
            nearest:
                true
        }
    );
}

/* ==========================================================
   RIQUADRO DELLA VISTA CORRENTE
========================================================== */

function updateCurrentExtent() {

    if (
        !primaryMap ||
        !overviewExtentFeature
    ) {
        return;
    }

    const mapSize =
        primaryMap.getSize();

    if (!mapSize) {
        return;
    }

    const currentExtent =
        primaryView.calculateExtent(
            mapSize
        );

    overviewExtentFeature.setGeometry(
        ol.geom.Polygon.fromExtent(
            currentExtent
        )
    );
}

/* ==========================================================
   INDICATORE DI SCALA
========================================================== */

function scheduleScaleDisplayUpdate() {

    if (scaleUpdateFrameId !== null) {
        return;
    }

    scaleUpdateFrameId =
        window.requestAnimationFrame(
            () => {
                scaleUpdateFrameId =
                    null;

                updateScaleDisplay();
            }
        );
}

function updateScaleDisplay() {

    if (!scaleDisplay) {
        return;
    }

    if (
        currentBasemap === "3d" &&
        map3D
    ) {
        update3DScaleDisplay();

        return;
    }

    update2DScaleDisplay();
}

function update2DScaleDisplay() {

    if (!primaryView) {
        return;
    }

    const resolution =
        primaryView.getResolution();

    const projection =
        primaryView.getProjection();

    if (
        !resolution ||
        !projection
    ) {
        return;
    }

    const center =
        primaryView.getCenter();

    const pointResolution =
        ol.proj.getPointResolution(
            projection,
            resolution,
            center,
            "m"
        );

    const scale =
        calculateScaleDenominator(
            pointResolution
        );

    scaleDisplay.textContent =
        `Scala 1:${formatNumber(scale)}`;

    scaleDisplay.title =
        "Scala della vista 2D al centro della mappa";

    scaleDisplay.classList.remove(
        "map-scale-display-approximate"
    );
}

function update3DScaleDisplay() {

    const zoom =
        Number(
            map3D.getZoom()
        );

    const center =
        map3D.getCenter();

    if (
        !Number.isFinite(zoom) ||
        !center ||
        !Number.isFinite(Number(center.lat))
    ) {
        return;
    }

    const latitudeRadians =
        Number(center.lat) *
        Math.PI /
        180;

    const metresPerPixel =
        156543.03392804097 *
        Math.cos(latitudeRadians) /
        Math.pow(2, zoom);

    const scale =
        calculateScaleDenominator(
            metresPerPixel
        );

    scaleDisplay.textContent =
        `Scala indicativa 1:${formatNumber(scale)}`;

    scaleDisplay.title =
        "Scala indicativa calcolata al centro della vista 3D; con terreno e inclinazione non è uniforme su tutto lo schermo";

    scaleDisplay.classList.add(
        "map-scale-display-approximate"
    );
}

function calculateScaleDenominator(
    metresPerPixel
) {

    const dpi =
        96;

    const inchesPerMetre =
        39.37;

    return Math.max(
        1,
        Math.round(
            metresPerPixel *
            dpi *
            inchesPerMetre
        )
    );
}

function formatNumber(
    value
) {

    return new Intl.NumberFormat(
        "it-IT"
    ).format(
        value
    );
}

/* ==========================================================
   STATO DELLA MAPPA
========================================================== */

function showMapStatus(
    message,
    duration = 4200
) {

    if (!mapStatus) {
        return;
    }

    mapStatus.textContent =
        message;

    mapStatus.classList.remove(
        "map-status-hidden"
    );

    window.setTimeout(
        () => {
            mapStatus.classList.add(
                "map-status-hidden"
            );
        },
        duration
    );
}

function hideMapStatus() {

    if (!mapStatus) {
        return;
    }

    mapStatus.textContent =
        "Cartografia pronta.";

    window.setTimeout(
        () => {

            mapStatus.classList.add(
                "map-status-hidden"
            );
        },
        900
    );
}


/* ==========================================================
   VISTA SATELLITARE 3D MAPTILER
========================================================== */

async function activate3DView() {

    if (
        map3DInitializing ||
        currentBasemap === "3d"
    ) {
        return;
    }

    if (
        !isMapTilerConfigurationValid() ||
        MAPTILER_CONFIG.threeD?.enabled === false
    ) {
        showMapStatus(
            "La vista 3D richiede una chiave MapTiler valida. È stata mantenuta la vista satellitare 2D."
        );

        selectBasemapControl(
            "satellite"
        );

        return;
    }

    map3DInitializing =
        true;

    showMapStatus(
        "Caricamento della vista satellitare 3D..."
    );

    try {

        await loadMapTilerSdk();

        if (!map3D) {
            create3DMap();
        }

        show3DContainer();

        if (
            map3D &&
            typeof map3D.resize === "function"
        ) {
            map3D.resize();
        }

        window.requestAnimationFrame(
            () => {
                restore3DPerspective(
                    true
                );
            }
        );

        currentBasemap =
            "3d";

        scheduleScaleDisplayUpdate();

        document.dispatchEvent(
            new CustomEvent(
                "webgis:basemap-changed",
                {
                    detail: {
                        basemap:
                            "3d"
                    }
                }
            )
        );

        hideMapStatus();

    } catch (error) {

        console.error(
            "Impossibile attivare la vista satellitare 3D.",
            error
        );

        deactivate3DView(
            false
        );

        showMapStatus(
            "Vista 3D non disponibile: è stata ripristinata automaticamente la vista satellitare 2D."
        );

        selectBasemapControl(
            "satellite"
        );

    } finally {
        map3DInitializing =
            false;
    }
}

async function loadMapTilerSdk() {

    await loadExternalStylesheet(
        "webgis-maptiler-sdk-style",
        MAPTILER_SDK_STYLE_URL
    );

    if (
        window.maptilersdk &&
        window.maptilersdk.Map
    ) {
        return;
    }

    await loadExternalScript(
        "webgis-maptiler-sdk-script",
        MAPTILER_SDK_SCRIPT_URL
    );

    if (
        !window.maptilersdk ||
        !window.maptilersdk.Map
    ) {
        throw new Error(
            "MapTiler SDK JS non è stato caricato correttamente."
        );
    }
}

function create3DMap() {

    const maptilersdk =
        window.maptilersdk;

    maptilersdk.config.apiKey =
        String(
            MAPTILER_CONFIG.apiKey
        ).trim();

    const primaryCenter =
        primaryView
            ? ol.proj.toLonLat(
                primaryView.getCenter()
            )
            : [
                14.30,
                41.87
            ];

    const primaryZoom =
        primaryView
            ? primaryView.getZoom()
            : 13;

    const threeDConfiguration =
        MAPTILER_CONFIG.threeD ||
        {};

    map3D =
        new maptilersdk.Map({
            container:
                "map-3d",
            style:
                maptilersdk.MapStyle.SATELLITE,
            center:
                primaryCenter,
            zoom:
                Math.min(
                    Number(primaryZoom) || 13,
                    15
                ),
            pitch:
                Number(threeDConfiguration.pitch) || 67,
            bearing:
                Number(threeDConfiguration.bearing) || -24,
            maxPitch:
                Number(threeDConfiguration.maxPitch) || 85,
            terrain:
                true,
            terrainExaggeration:
                Number(threeDConfiguration.terrainExaggeration) || 1.15,
            terrainControl:
                true,
            navigationControl:
                true,
            geolocateControl:
                false,
            fullscreenControl:
                true,
            antialias:
                true
        });

    map3D.on(
        "load",
        () => {
            map3DLoaded =
                true;

            add3DOperationalLayers();
            configure3DSurveyClick();
            synchronize3DLayerVisibility();
            restore3DPerspective(
                false
            );

            map3D.once(
                "idle",
                () => {
                    restore3DPerspective(
                        true
                    );
                }
            );
        }
    );

    map3D.on(
        "error",
        event => {
            console.warn(
                "Errore MapTiler 3D.",
                event?.error || event
            );
        }
    );

    [
        "move",
        "zoom",
        "pitch",
        "rotate",
        "resize"
    ].forEach(
        eventName => {
            map3D.on(
                eventName,
                scheduleScaleDisplayUpdate
            );
        }
    );
}

function get3DConfiguration() {

    return (
        MAPTILER_CONFIG.threeD ||
        {}
    );
}

function getConfigured3DPitch() {

    const configuration =
        get3DConfiguration();

    const pitch =
        Number(
            configuration.pitch
        );

    return Number.isFinite(
        pitch
    )
        ? Math.max(
            0,
            Math.min(
                pitch,
                getConfigured3DMaxPitch()
            )
        )
        : 67;
}

function getConfigured3DMaxPitch() {

    const configuration =
        get3DConfiguration();

    const maxPitch =
        Number(
            configuration.maxPitch
        );

    return Number.isFinite(
        maxPitch
    )
        ? Math.max(
            45,
            Math.min(
                maxPitch,
                85
            )
        )
        : 85;
}

function getConfigured3DBearing() {

    const configuration =
        get3DConfiguration();

    const bearing =
        Number(
            configuration.bearing
        );

    return Number.isFinite(
        bearing
    )
        ? bearing
        : -24;
}

function restore3DPerspective(
    animated = true
) {

    if (!map3D) {
        return;
    }

    const cameraOptions = {
        pitch:
            getConfigured3DPitch(),
        bearing:
            getConfigured3DBearing(),
        duration:
            animated
                ? 700
                : 0,
        essential:
            true
    };

    if (
        typeof map3D.easeTo ===
        "function"
    ) {
        map3D.easeTo(
            cameraOptions
        );
    }
}

function change3DPitch(
    delta
) {

    if (!map3D) {
        return;
    }

    const currentPitch =
        Number(
            map3D.getPitch()
        ) || 0;

    const nextPitch =
        Math.max(
            0,
            Math.min(
                currentPitch + delta,
                getConfigured3DMaxPitch()
            )
        );

    map3D.easeTo({
        pitch:
            nextPitch,
        duration:
            350,
        essential:
            true
    });
}

function set3DTopView() {

    if (!map3D) {
        return;
    }

    map3D.easeTo({
        pitch:
            0,
        bearing:
            0,
        duration:
            550,
        essential:
            true
    });
}

function orient3DToNorth() {

    if (!map3D) {
        return;
    }

    map3D.easeTo({
        bearing:
            0,
        duration:
            450,
        essential:
            true
    });
}

function show3DContainer() {

    const primaryElement =
        document.getElementById(
            "map-primary"
        );

    map3DElement.hidden =
        false;

    map3DElement.setAttribute(
        "aria-hidden",
        "false"
    );

    map3DToolbar.hidden =
        false;

    mapApplication.classList.add(
        "map-mode-3d"
    );

    if (primaryElement) {
        primaryElement.classList.add(
            "map-primary-hidden"
        );
    }
}

function deactivate3DView(
    synchronizeView = true
) {

    if (
        synchronizeView &&
        map3D &&
        primaryView
    ) {
        const center =
            map3D.getCenter();

        if (center) {
            primaryView.setCenter(
                ol.proj.fromLonLat([
                    center.lng,
                    center.lat
                ])
            );
        }

        const zoom =
            map3D.getZoom();

        if (Number.isFinite(zoom)) {
            primaryView.setZoom(
                zoom
            );
        }
    }

    const primaryElement =
        document.getElementById(
            "map-primary"
        );

    if (map3DElement) {
        map3DElement.hidden =
            true;

        map3DElement.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    if (map3DToolbar) {
        map3DToolbar.hidden =
            true;
    }

    if (mapApplication) {
        mapApplication.classList.remove(
            "map-mode-3d"
        );
    }

    if (primaryElement) {
        primaryElement.classList.remove(
            "map-primary-hidden"
        );
    }

    window.setTimeout(
        () => {
            resizeMaps();
            scheduleScaleDisplayUpdate();
        },
        0
    );
}

function selectBasemapControl(
    basemapId
) {

    const radio =
        document.querySelector(
            `input[name="basemap"][value="${basemapId}"]`
        );

    if (!radio) {
        return;
    }

    radio.checked =
        true;

    radio.dispatchEvent(
        new Event(
            "change",
            {
                bubbles:
                    true
            }
        )
    );
}

function add3DOperationalLayers() {

    if (
        !map3D ||
        !map3DLoaded
    ) {
        return;
    }

    add3DGeoJsonSource(
        "webgis-boundary-3d",
        BOUNDARY_DATA_PATH
    );

    add3DLayerSafely({
        id:
            "webgis-boundary-fill-3d",
        type:
            "fill",
        source:
            "webgis-boundary-3d",
        paint: {
            "fill-color":
                "#ffffff",
            "fill-opacity":
                0.025
        }
    });

    add3DLayerSafely({
        id:
            "webgis-boundary-line-3d",
        type:
            "line",
        source:
            "webgis-boundary-3d",
        paint: {
            "line-color":
                "#f4d03f",
            "line-width":
                3,
            "line-dasharray": [
                3,
                2
            ]
        }
    });

    add3DGeoJsonSource(
        "webgis-surveys-3d",
        SURVEYS_DATA_PATH
    );

    add3DLayerSafely({
        id:
            "webgis-surveys-points-3d",
        type:
            "circle",
        source:
            "webgis-surveys-3d",
        paint: {
            "circle-radius":
                5,
            "circle-color":
                "#d83f3f",
            "circle-stroke-color":
                "#ffffff",
            "circle-stroke-width":
                1.7
        }
    });

    HABITAT_CONFIG.forEach(
        habitat => {
            const sourceId =
                `${habitat.id}-3d-source`;

            add3DGeoJsonSource(
                sourceId,
                habitat.path
            );

            add3DLayerSafely({
                id:
                    `${habitat.id}-3d-fill`,
                type:
                    "fill",
                source:
                    sourceId,
                layout: {
                    visibility:
                        "none"
                },
                paint: {
                    "fill-color":
                        habitat.color,
                    "fill-opacity":
                        0.43
                }
            });

            add3DLayerSafely({
                id:
                    `${habitat.id}-3d-line`,
                type:
                    "line",
                source:
                    sourceId,
                layout: {
                    visibility:
                        "none"
                },
                paint: {
                    "line-color":
                        habitat.color,
                    "line-width":
                        1.1
                }
            });
        }
    );

    applySpeciesFilterTo3D();
}

function add3DGeoJsonSource(
    sourceId,
    dataPath
) {

    if (
        !map3D.getSource(
            sourceId
        )
    ) {
        map3D.addSource(
            sourceId,
            {
                type:
                    "geojson",
                data:
                    dataPath
            }
        );
    }
}

function add3DLayerSafely(
    layerConfiguration
) {

    if (
        !map3D.getLayer(
            layerConfiguration.id
        )
    ) {
        map3D.addLayer(
            layerConfiguration
        );
    }
}

function synchronize3DLayerVisibility() {

    document
        .querySelectorAll(
            ".map-layer-input[data-layer-id]"
        )
        .forEach(
            checkbox => {
                set3DLayerVisibility(
                    checkbox.dataset.layerId,
                    checkbox.checked
                );
            }
        );
}

function set3DLayerVisibility(
    layerId,
    visible
) {

    if (
        !map3D ||
        !map3DLoaded
    ) {
        return;
    }

    const visibility =
        visible
            ? "visible"
            : "none";

    let layerIds =
        [];

    if (layerId === "boundary") {
        layerIds = [
            "webgis-boundary-fill-3d",
            "webgis-boundary-line-3d"
        ];
    } else if (layerId === "surveys") {
        layerIds = [
            "webgis-surveys-points-3d"
        ];
    } else if (
        habitatLayers.has(
            layerId
        )
    ) {
        layerIds = [
            `${layerId}-3d-fill`,
            `${layerId}-3d-line`
        ];
    }

    layerIds.forEach(
        mapLayerId => {
            if (
                map3D.getLayer(
                    mapLayerId
                )
            ) {
                map3D.setLayoutProperty(
                    mapLayerId,
                    "visibility",
                    visibility
                );
            }
        }
    );
}

function configure3DSurveyClick() {

    if (
        !map3D ||
        map3DClickHandlerConfigured
    ) {
        return;
    }

    map3DClickHandlerConfigured =
        true;

    map3D.on(
        "mouseenter",
        "webgis-surveys-points-3d",
        () => {
            map3D.getCanvas().style.cursor =
                "pointer";
        }
    );

    map3D.on(
        "mouseleave",
        "webgis-surveys-points-3d",
        () => {
            map3D.getCanvas().style.cursor =
                "";
        }
    );

    map3D.on(
        "click",
        "webgis-surveys-points-3d",
        event => {
            const selectedFeature =
                event.features?.[0];

            if (!selectedFeature) {
                return;
            }

            const popupFeatureAdapter = {
                getProperties() {
                    return {
                        ...(selectedFeature.properties || {})
                    };
                }
            };

            showPopup(
                popupFeatureAdapter
            );
        }
    );
}

/* ==========================================================
   FUNZIONI PUBBLICHE
========================================================== */

export function getPrimaryMap() {

    return primaryMap;
}

export function getOverviewMap() {

    return overviewMap;
}

export function getMunicipalityExtent() {

    return municipalityExtent
        ? [
            ...municipalityExtent
        ]
        : null;
}

export function getSelectedSurveyFeature() {

    return selectedSurveyFeature;
}

export function zoomToMunicipality() {

    if (
        !primaryView ||
        !municipalityExtent
    ) {
        return;
    }

    primaryView.fit(
        municipalityExtent,
        {
            size:
                primaryMap.getSize(),
            padding: [
                54,
                54,
                54,
                54
            ],
            duration:
                600,
            maxZoom:
                15
        }
    );
}

export function setLayerVisibility(
    layerId,
    visible
) {

    const checkbox =
        document.querySelector(
            `[data-layer-id="${layerId}"]`
        );

    if (!checkbox) {

        console.warn(
            `Controllo del layer non trovato: ${layerId}`
        );

        return;
    }

    checkbox.checked =
        Boolean(
            visible
        );

    checkbox.dispatchEvent(
        new Event(
            "change",
            {
                bubbles:
                    true
            }
        )
    );
}

export function setMapBasemap(
    basemapId
) {

    const radio =
        document.querySelector(
            `input[name="basemap"][value="${basemapId}"]`
        );

    if (
        !radio ||
        radio.disabled
    ) {

        console.warn(
            `Cartografia non disponibile: ${basemapId}`
        );

        return;
    }

    radio.checked =
        true;

    radio.dispatchEvent(
        new Event(
            "change",
            {
                bubbles:
                    true
            }
        )
    );
}