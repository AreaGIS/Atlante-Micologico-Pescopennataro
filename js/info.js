/* ==========================================================
   WEBGIS V6
   COMPONENTE : INFO
   VERSIONE   : 1.4
   RELEASE    : 0.5
   STATO      : IN TEST

   INDICE

   INFO-01  Configurazione
   INFO-02  Stato del componente
   INFO-03  Inizializzazione pubblica
   INFO-04  Caricamento HTML
   INFO-05  Cache e validazione
   INFO-06  Collegamento degli eventi
   INFO-07  Apertura automatica
   INFO-08  Apertura manuale
   INFO-09  Apertura della finestra
   INFO-10  Chiusura della finestra
   INFO-11  Gestione tastiera
   INFO-12  Gestione del focus
   INFO-13  API pubbliche
========================================================== */

/* #######################################################################
   INFO-01
   CONFIGURAZIONE
######################################################################## */

const INFO_COMPONENT_PATH =
    "./components/info/info.html";

const INFO_OVERLAY_ID =
    "info-overlay";

const INFO_MODAL_ID =
    "info-modal";

const INFO_OPEN_BUTTON_ID =
    "map-info-button";

const INFO_CLOSE_BUTTON_ID =
    "btn-close-info";

const INFO_AUTOMATIC_OPEN_DELAY =
    500;

/* #######################################################################
   INFO-02
   STATO DEL COMPONENTE
######################################################################## */

let infoInitialized =
    false;

let automaticOpeningCompleted =
    false;

let automaticOpeningScheduled =
    false;

let infoOverlay =
    null;

let infoModal =
    null;

let infoOpenButton =
    null;

let infoCloseButton =
    null;

let previousFocusedElement =
    null;

let automaticOpeningTimer =
    null;

/* #######################################################################
   INFO-03
   INIZIALIZZAZIONE PUBBLICA
######################################################################## */

export async function initInfo() {

    if (infoInitialized) {

        cacheInfoElements();

        return;
    }

    await loadInfoMarkup();

    cacheInfoElements();

    validateInfoElements();

    configureInfoEvents();

    infoInitialized =
        true;

    console.info(
        "WebGIS_v6: componente Informazioni inizializzato."
    );
}

/* #######################################################################
   INFO-04
   CARICAMENTO HTML
######################################################################## */

async function loadInfoMarkup() {

    const existingOverlay =
        document.getElementById(
            INFO_OVERLAY_ID
        );

    if (existingOverlay) {
        return;
    }

    const response =
        await fetch(
            INFO_COMPONENT_PATH
        );

    if (!response.ok) {

        throw new Error(
            `Impossibile caricare il componente Informazioni: ${response.status}`
        );
    }

    const infoHTML =
        await response.text();

    if (!infoHTML.trim()) {

        throw new Error(
            "Il file components/info/info.html è vuoto."
        );
    }

    const template =
        document.createElement(
            "template"
        );

    template.innerHTML =
        infoHTML.trim();

    const componentRoot =
        template.content.firstElementChild;

    if (!componentRoot) {

        throw new Error(
            "La struttura HTML del componente Informazioni non è valida."
        );
    }

    document.body.appendChild(
        template.content
    );
}

/* #######################################################################
   INFO-05
   CACHE E VALIDAZIONE
######################################################################## */

function cacheInfoElements() {

    infoOverlay =
        document.getElementById(
            INFO_OVERLAY_ID
        );

    infoModal =
        document.getElementById(
            INFO_MODAL_ID
        );

    infoOpenButton =
        document.getElementById(
            INFO_OPEN_BUTTON_ID
        );

    infoCloseButton =
        document.getElementById(
            INFO_CLOSE_BUTTON_ID
        );
}

function validateInfoElements() {

    const requiredElements = [
        [
            infoOverlay,
            `#${INFO_OVERLAY_ID}`
        ],
        [
            infoModal,
            `#${INFO_MODAL_ID}`
        ],
        [
            infoOpenButton,
            `#${INFO_OPEN_BUTTON_ID}`
        ],
        [
            infoCloseButton,
            `#${INFO_CLOSE_BUTTON_ID}`
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
            `Elementi mancanti nel componente Informazioni: ${missingElements.join(", ")}`
        );
    }
}

/* #######################################################################
   INFO-06
   COLLEGAMENTO DEGLI EVENTI
######################################################################## */

function configureInfoEvents() {

    infoOpenButton.addEventListener(
        "click",
        handleManualOpen
    );

    infoCloseButton.addEventListener(
        "click",
        closeInfo
    );

    infoOverlay.addEventListener(
        "click",
        handleOverlayClick
    );

    document.addEventListener(
        "keydown",
        handleDocumentKeydown
    );

    document.addEventListener(
        "webgis:application-ready",
        handleApplicationReady
    );
}

function handleOverlayClick(
    event
) {

    if (
        event.target !==
        infoOverlay
    ) {
        return;
    }

    closeInfo();
}

/* #######################################################################
   INFO-07
   APERTURA AUTOMATICA
######################################################################## */

function handleApplicationReady(
    event
) {

    if (
        event.detail?.ready !== true ||
        automaticOpeningScheduled ||
        automaticOpeningCompleted
    ) {
        return;
    }

    automaticOpeningScheduled =
        true;

    automaticOpeningTimer =
        window.setTimeout(
            () => {

                automaticOpeningTimer =
                    null;

                automaticOpeningCompleted =
                    true;

                openInfo(
                    {
                        automatic:
                            true
                    }
                );

            },
            INFO_AUTOMATIC_OPEN_DELAY
        );
}

/* #######################################################################
   INFO-08
   APERTURA MANUALE
######################################################################## */

function handleManualOpen() {

    cancelAutomaticOpening();

    automaticOpeningCompleted =
        true;

    openInfo(
        {
            automatic:
                false
        }
    );
}

function cancelAutomaticOpening() {

    if (
        automaticOpeningTimer ===
        null
    ) {
        return;
    }

    window.clearTimeout(
        automaticOpeningTimer
    );

    automaticOpeningTimer =
        null;
}

/* #######################################################################
   INFO-09
   APERTURA DELLA FINESTRA
######################################################################## */

export function openInfo(
    options = {}
) {

    const automatic =
        options.automatic === true;

    if (
        !infoInitialized ||
        !infoOverlay ||
        !infoModal
    ) {

        console.warn(
            "Il componente Informazioni non è ancora disponibile."
        );

        return;
    }

    if (isInfoOpen()) {
        return;
    }

    previousFocusedElement =
        document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;

    infoOverlay.classList.add(
        "info-overlay-visible"
    );

    infoOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "info-modal-open"
    );

    window.requestAnimationFrame(
        () => {

            infoModal.focus();
        }
    );

    document.dispatchEvent(
        new CustomEvent(
            "webgis:info-opened",
            {
                detail: {
                    open:
                        true,

                    automatic
                }
            }
        )
    );
}

/* #######################################################################
   INFO-10
   CHIUSURA DELLA FINESTRA
######################################################################## */

export function closeInfo() {

    if (
        !infoOverlay ||
        !isInfoOpen()
    ) {
        return;
    }

    infoOverlay.classList.remove(
        "info-overlay-visible"
    );

    infoOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "info-modal-open"
    );

    restorePreviousFocus();

    document.dispatchEvent(
        new CustomEvent(
            "webgis:info-closed",
            {
                detail: {
                    open:
                        false
                }
            }
        )
    );
}

function restorePreviousFocus() {

    if (
        previousFocusedElement &&
        document.contains(
            previousFocusedElement
        )
    ) {

        previousFocusedElement.focus();
    }

    previousFocusedElement =
        null;
}

/* #######################################################################
   INFO-11
   GESTIONE TASTIERA
######################################################################## */

function handleDocumentKeydown(
    event
) {

    if (!isInfoOpen()) {
        return;
    }

    if (
        event.key ===
        "Escape"
    ) {

        event.preventDefault();

        closeInfo();

        return;
    }

    if (
        event.key ===
        "Tab"
    ) {

        keepFocusInsideModal(
            event
        );
    }
}

/* #######################################################################
   INFO-12
   GESTIONE DEL FOCUS
######################################################################## */

function keepFocusInsideModal(
    event
) {

    if (!infoModal) {
        return;
    }

    const focusableElements =
        Array.from(
            infoModal.querySelectorAll(
                [
                    "a[href]",
                    "button:not([disabled])",
                    "input:not([disabled])",
                    "select:not([disabled])",
                    "textarea:not([disabled])",
                    '[tabindex]:not([tabindex="-1"])'
                ].join(",")
            )
        ).filter(
            element =>
                element instanceof HTMLElement &&
                element.offsetParent !== null
        );

    if (!focusableElements.length) {

        event.preventDefault();

        infoModal.focus();

        return;
    }

    const firstElement =
        focusableElements[0];

    const lastElement =
        focusableElements[
            focusableElements.length - 1
        ];

    if (
        event.shiftKey &&
        document.activeElement ===
            firstElement
    ) {

        event.preventDefault();

        lastElement.focus();

        return;
    }

    if (
        !event.shiftKey &&
        document.activeElement ===
            lastElement
    ) {

        event.preventDefault();

        firstElement.focus();
    }
}

/* #######################################################################
   INFO-13
   API PUBBLICHE
######################################################################## */

export function isInfoOpen() {

    return Boolean(
        infoOverlay &&
        infoOverlay.classList.contains(
            "info-overlay-visible"
        )
    );
}