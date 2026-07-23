/* ==========================================================
   WEBGIS V6
   COMPONENTE : MAP LOADER
   VERSIONE   : 1.0
   RELEASE    : 0.1
   STATO      : IN TEST

   INDICE

   MAP-LOAD-01  Import
   MAP-LOAD-02  Caricamento HTML della mappa
   MAP-LOAD-03  Cache dell'interfaccia
   MAP-LOAD-04  Validazione dell'interfaccia
========================================================== */

/* #######################################################################
   MAP-LOAD-01
   IMPORT
######################################################################## */

import {
    MAP_COMPONENT_PATH
} from "./mapConfig.js";

import {
    mapState
} from "./mapState.js";

/* #######################################################################
   MAP-LOAD-02
   CARICAMENTO HTML DELLA MAPPA
######################################################################## */

export async function loadMapMarkup() {

    const existingApplication =
        document.getElementById(
            "map-application"
        );

    if (existingApplication) {

        mapState.application =
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

    mapState.application =
        document.getElementById(
            "map-application"
        );
}

/* #######################################################################
   MAP-LOAD-03
   CACHE DELL'INTERFACCIA
######################################################################## */

export function cacheInterfaceElements() {

    mapState.application =
        document.getElementById(
            "map-application"
        );

    mapState.sidebar =
        document.getElementById(
            "map-sidebar"
        );

    mapState.sidebarToggle =
        document.getElementById(
            "map-sidebar-toggle"
        );

    mapState.habitatToggle =
        document.getElementById(
            "map-habitat-toggle"
        );

    mapState.habitatList =
        document.getElementById(
            "map-habitat-list"
        );

    mapState.mapStatus =
        document.getElementById(
            "map-status"
        );

    mapState.scaleDisplay =
        document.getElementById(
            "map-scale-display"
        );
}

/* #######################################################################
   MAP-LOAD-04
   VALIDAZIONE DELL'INTERFACCIA
######################################################################## */

export function validateInterfaceElements() {

    const requiredElements = [
        [
            mapState.application,
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
            mapState.sidebar,
            "#map-sidebar"
        ],
        [
            mapState.sidebarToggle,
            "#map-sidebar-toggle"
        ],
        [
            mapState.habitatToggle,
            "#map-habitat-toggle"
        ],
        [
            mapState.habitatList,
            "#map-habitat-list"
        ],
        [
            mapState.mapStatus,
            "#map-status"
        ],
        [
            mapState.scaleDisplay,
            "#map-scale-display"
        ],
        [
            document.getElementById(
                "map-info-button"
            ),
            "#map-info-button"
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