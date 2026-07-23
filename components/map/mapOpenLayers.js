/* ==========================================================
   WEBGIS V6
   COMPONENTE : MAP OPENLAYERS
   VERSIONE   : 1.0
   RELEASE    : 0.1
   STATO      : IN TEST

   INDICE

   MAP-OL-01  Import configurazione
   MAP-OL-02  Caricamento pubblico di OpenLayers
   MAP-OL-03  Caricamento foglio di stile esterno
   MAP-OL-04  Caricamento script esterno
========================================================== */

/* #######################################################################
   MAP-OL-01
   IMPORT CONFIGURAZIONE
######################################################################## */

import {
    OPENLAYERS_SCRIPT_URL,
    OPENLAYERS_STYLE_URL
} from "./mapConfig.js";

/* #######################################################################
   MAP-OL-02
   CARICAMENTO PUBBLICO DI OPENLAYERS
######################################################################## */

export async function loadOpenLayers() {

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

/* #######################################################################
   MAP-OL-03
   CARICAMENTO FOGLIO DI STILE ESTERNO
######################################################################## */

function loadExternalStylesheet(
    id,
    url
) {

    return new Promise(
        (resolve, reject) => {

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
                document.createElement(
                    "link"
                );

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

/* #######################################################################
   MAP-OL-04
   CARICAMENTO SCRIPT ESTERNO
######################################################################## */

function loadExternalScript(
    id,
    url
) {

    return new Promise(
        (resolve, reject) => {

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
                document.createElement(
                    "script"
                );

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