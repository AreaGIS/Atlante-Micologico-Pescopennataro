/* ==========================================================
   WEBGIS V6
   FILE PRINCIPALE DI AVVIO
   VERSIONE : 2.1
   RELEASE  : 0.3
   STATO    : IN TEST
========================================================== */

import {
    initIntro,
    showIntro
} from "../components/intro/intro.js";

import {
    initWarning
} from "../components/warning/warning.js";

import {
    initLoading,
    openLoading,
    closeLoading,
    setLoadingStep,
    completeLoading
} from "../components/loading/loading.js";

import {
    initMap
} from "../components/map/map.js";

import {
    initInfo
} from "./info.js";

import {
    initAnalytics
} from "../analytics/analytics.js";

/* ==========================================================
   STATO DELL'APPLICAZIONE
========================================================== */

let mapInitializationStarted = false;
let mapInitializationCompleted = false;

/* ==========================================================
   AVVIO DELL'APPLICAZIONE
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    startWebGIS
);

/* ==========================================================
   INIZIALIZZAZIONE GENERALE
========================================================== */

async function startWebGIS() {

    try {

        await initAnalytics();

        configureApplicationEvents();

        await loadComponentStyles();

        await initWarning();

        await initLoading();

        await initIntro();

        console.info(
            "WebGIS_v6 inizializzato correttamente."
        );

    } catch (error) {

        console.error(
            "Errore durante l'avvio di WebGIS_v6:",
            error
        );

        showStartupError();
    }
}

/* ==========================================================
   CARICAMENTO DEI FOGLI DI STILE
========================================================== */

async function loadComponentStyles() {

    const stylesheets = [

        {
            id: "webgis-intro-style",
            path: "./components/intro/intro.css"
        },

        {
            id: "webgis-warning-style",
            path: "./components/warning/warning.css"
        },

        {
            id: "webgis-loading-style",
            path: "./components/loading/loading.css"
        },

        {
            id: "webgis-map-style",
            path: "./components/map/map.css"
        },

        {
            id: "webgis-info-style",
            path: "./css/info.css"
        }

    ];

    await Promise.all(
        stylesheets.map(
            stylesheet =>
                loadStylesheet(
                    stylesheet.id,
                    stylesheet.path
                )
        )
    );
}

/* ==========================================================
   CARICAMENTO DI UN FOGLIO DI STILE
========================================================== */

function loadStylesheet(
    id,
    path
) {

    return new Promise(
        (resolve, reject) => {

            const existingStylesheet =
                document.getElementById(
                    id
                );

            if (existingStylesheet) {

                if (
                    existingStylesheet.dataset.loaded ===
                    "true"
                ) {

                    resolve();

                    return;
                }

                existingStylesheet.addEventListener(
                    "load",
                    () => resolve(),
                    {
                        once: true
                    }
                );

                existingStylesheet.addEventListener(
                    "error",
                    () => {

                        reject(
                            new Error(
                                `Impossibile caricare il foglio di stile: ${path}`
                            )
                        );

                    },
                    {
                        once: true
                    }
                );

                return;
            }

            const stylesheet =
                document.createElement(
                    "link"
                );

            stylesheet.id =
                id;

            stylesheet.rel =
                "stylesheet";

            stylesheet.href =
                path;

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
                            `Impossibile caricare il foglio di stile: ${path}`
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

/* ==========================================================
   EVENTI GENERALI DELL'APPLICAZIONE
========================================================== */

function configureApplicationEvents() {

    document.addEventListener(
        "webgis:intro-complete",
        handleIntroComplete
    );

    document.addEventListener(
        "webgis:warning-exit",
        handleWarningExit
    );

    document.addEventListener(
        "webgis:warning-accepted",
        handleWarningAccepted
    );

    document.addEventListener(
        "webgis:loading-progress",
        handleLoadingProgress
    );

    document.addEventListener(
        "webgis:loading-complete",
        handleLoadingComplete
    );

    document.addEventListener(
        "webgis:map-ready",
        handleMapReady
    );

    document.addEventListener(
        "webgis:basemap-changed",
        handleBasemapChanged
    );

    document.addEventListener(
        "webgis:layer-visibility-changed",
        handleLayerVisibilityChanged
    );
}

/* ==========================================================
   INTRO COMPLETATA
========================================================== */

function handleIntroComplete() {

    console.info(
        "Finestra introduttiva completata."
    );

    /*
     * Il componente Warning ascolta direttamente
     * l'evento webgis:intro-complete.
     */
}

/* ==========================================================
   USCITA DAL WARNING
========================================================== */

function handleWarningExit(
    event
) {

    if (
        event.detail?.returnToIntro !== true
    ) {
        return;
    }

    console.info(
        "Ritorno alla schermata introduttiva."
    );

    showIntro();
}

/* ==========================================================
   WARNING ACCETTATO
========================================================== */

async function handleWarningAccepted(
    event
) {

    if (
        event.detail?.accepted !== true
    ) {
        return;
    }

    if (mapInitializationStarted) {

        console.warn(
            "L'inizializzazione della mappa è già stata avviata."
        );

        return;
    }

    mapInitializationStarted =
        true;

    console.info(
        "Avvertenze lette. Avvio della cartografia."
    );

    try {

        openLoading();

        setLoadingStep(
            "application"
        );

        await wait(
            350
        );

        setLoadingStep(
            "components"
        );

        await wait(
            350
        );

        setLoadingStep(
            "cartography"
        );

        /*
         * initMap carica:
         * - OpenLayers;
         * - HTML della mappa;
         * - mappa satellitare;
         * - OpenStreetMap;
         * - limite amministrativo;
         * - rilievi;
         * - habitat;
         * - Mini Mappa di Inquadramento.
         */

        await initMap();

        /*
         * Il componente Informazioni viene inizializzato
         * dopo la mappa, perché il pulsante #map-info-button
         * è contenuto nel componente map.html.
         */

        await initInfo();

    } catch (error) {

        mapInitializationStarted =
            false;

        console.error(
            "Errore durante l'inizializzazione della mappa:",
            error
        );

        closeLoading();

        showStartupError(
            "Non è stato possibile caricare la cartografia del WebGIS."
        );
    }
}

/* ==========================================================
   MAPPA PRONTA
========================================================== */

async function handleMapReady(
    event
) {

    if (
        event.detail?.ready !== true ||
        mapInitializationCompleted
    ) {
        return;
    }

    try {

        setLoadingStep(
            "data"
        );

        await wait(
            450
        );

        setLoadingStep(
            "layers"
        );

        await wait(
            450
        );

        mapInitializationCompleted =
            true;

        completeLoading();

        await wait(
            900
        );

        closeLoading();

        console.info(
            "Mappa pronta. Loading chiuso."
        );

        document.dispatchEvent(
            new CustomEvent(
                "webgis:application-ready",
                {
                    detail: {
                        ready: true,
                        basemap:
                            event.detail?.basemap ||
                            "satellite"
                    }
                }
            )
        );

    } catch (error) {

        console.error(
            "Errore durante il completamento dell'avvio:",
            error
        );

        closeLoading();

        showStartupError(
            "La mappa è stata caricata, ma non è stato possibile completare l'avvio."
        );
    }
}

/* ==========================================================
   PROGRESSO DEL LOADING
========================================================== */

function handleLoadingProgress(
    event
) {

    const progress =
        event.detail?.progress;

    const message =
        event.detail?.message;

    console.info(
        `Loading ${progress}%: ${message}`
    );
}

/* ==========================================================
   LOADING COMPLETATO
========================================================== */

function handleLoadingComplete(
    event
) {

    if (
        event.detail?.completed !== true
    ) {
        return;
    }

    console.info(
        "Loading completato al 100%."
    );
}

/* ==========================================================
   CAMBIO CARTOGRAFIA
========================================================== */

function handleBasemapChanged(
    event
) {

    const basemap =
        event.detail?.basemap;

    console.info(
        `Cartografia attiva: ${basemap}`
    );
}

/* ==========================================================
   VISIBILITÀ DEI LAYER
========================================================== */

function handleLayerVisibilityChanged(
    event
) {

    const layerId =
        event.detail?.layerId;

    const visible =
        event.detail?.visible;

    console.info(
        `Layer ${layerId}: ${
            visible
                ? "visibile"
                : "nascosto"
        }`
    );
}

/* ==========================================================
   ATTESA
========================================================== */

function wait(
    milliseconds
) {

    return new Promise(
        resolve => {

            window.setTimeout(
                resolve,
                milliseconds
            );
        }
    );
}

/* ==========================================================
   GESTIONE ERRORE DI AVVIO
========================================================== */

function showStartupError(
    customMessage =
        "Non è stato possibile avviare correttamente il WebGIS."
) {

    const existingMessage =
        document.getElementById(
            "webgis-startup-error"
        );

    if (existingMessage) {
        return;
    }

    const errorMessage =
        document.createElement(
            "div"
        );

    errorMessage.id =
        "webgis-startup-error";

    errorMessage.setAttribute(
        "role",
        "alert"
    );

    errorMessage.style.position =
        "fixed";

    errorMessage.style.inset =
        "0";

    errorMessage.style.zIndex =
        "10000";

    errorMessage.style.display =
        "flex";

    errorMessage.style.alignItems =
        "center";

    errorMessage.style.justifyContent =
        "center";

    errorMessage.style.padding =
        "24px";

    errorMessage.style.background =
        "#17452d";

    errorMessage.style.color =
        "#ffffff";

    errorMessage.style.fontFamily =
        "Arial, sans-serif";

    errorMessage.style.textAlign =
        "center";

    errorMessage.innerHTML = `
        <div
            style="
                width: min(560px, 100%);
                padding: 30px;
                background: rgba(0, 0, 0, 0.14);
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 18px;
            "
        >
            <h1
                style="
                    margin: 0;
                    font-size: 2rem;
                "
            >
                Errore di caricamento
            </h1>

            <p
                style="
                    margin: 18px 0 0;
                    font-size: 1rem;
                    line-height: 1.6;
                "
            >
                ${customMessage}
            </p>

            <p
                style="
                    margin: 12px 0 0;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    opacity: 0.8;
                "
            >
                Verificare che il progetto sia aperto tramite Live Server
                e che tutti i file GeoJSON siano presenti nella cartella
                <strong>data</strong>.
            </p>
        </div>
    `;

    document.body.appendChild(
        errorMessage
    );
}
