/* ==========================================================
   WEBGIS V6
   COMPONENTE : WARNING
   VERSIONE   : 1.2
   RELEASE    : 0.2
   STATO      : IN TEST

   FUNZIONI PRINCIPALI

   - caricamento del componente Warning;
   - apertura dopo il pulsante "Consulta l'Atlante";
   - gestione della conferma dell'utente;
   - blocco del focus nella finestra;
   - intestazione fissa e compattabile durante lo scorrimento.
========================================================== */

const WARNING_COMPONENT_PATH =
    "./components/warning/warning.html";

const WARNING_SESSION_KEY =
    "webgis-warning-accepted";

const WARNING_SCROLL_THRESHOLD =
    16;

let warningOverlay = null;
let warningPanel = null;
let warningStickyTop = null;
let warningScrollArea = null;
let warningTitle = null;
let warningCheckbox = null;
let warningAccessButton = null;
let warningExitButton = null;
let warningValidationMessage = null;
let warningConfirmationArea = null;
let previousFocusedElement = null;
let warningInitialized = false;

/* ==========================================================
   INIZIALIZZAZIONE
========================================================== */

export async function initWarning() {

    if (
        warningInitialized &&
        warningOverlay
    ) {
        return;
    }

    let component =
        document.getElementById(
            "warning-overlay"
        );

    if (!component) {

        const response =
            await fetch(
                WARNING_COMPONENT_PATH
            );

        if (!response.ok) {

            throw new Error(
                `Impossibile caricare il componente Warning: ${response.status}`
            );
        }

        document.body.insertAdjacentHTML(
            "beforeend",
            await response.text()
        );

        component =
            document.getElementById(
                "warning-overlay"
            );
    }

    if (!component) {

        throw new Error(
            "Il componente Warning non contiene #warning-overlay."
        );
    }

    warningOverlay =
        component;

    cacheElements();

    validateElements();

    bindEvents();

    warningInitialized =
        true;
}

/* ==========================================================
   ELEMENTI
========================================================== */

function cacheElements() {

    warningPanel =
        warningOverlay.querySelector(
            ".warning-panel"
        );

    warningStickyTop =
        warningOverlay.querySelector(
            ".warning-sticky-top"
        );

    warningScrollArea =
        warningOverlay.querySelector(
            ".warning-scroll-area"
        );

    warningTitle =
        document.getElementById(
            "warning-title"
        );

    warningCheckbox =
        document.getElementById(
            "warning-confirmation"
        );

    warningAccessButton =
        document.getElementById(
            "warning-access-button"
        );

    warningExitButton =
        document.getElementById(
            "warning-exit-button"
        );

    warningValidationMessage =
        document.getElementById(
            "warning-validation-message"
        );

    warningConfirmationArea =
        warningOverlay.querySelector(
            ".warning-confirmation-area"
        );
}

function validateElements() {

    const missingElements = [];

    if (!warningPanel) {
        missingElements.push(
            ".warning-panel"
        );
    }

    if (!warningStickyTop) {
        missingElements.push(
            ".warning-sticky-top"
        );
    }

    if (!warningScrollArea) {
        missingElements.push(
            ".warning-scroll-area"
        );
    }

    if (!warningTitle) {
        missingElements.push(
            "#warning-title"
        );
    }

    if (!warningCheckbox) {
        missingElements.push(
            "#warning-confirmation"
        );
    }

    if (!warningAccessButton) {
        missingElements.push(
            "#warning-access-button"
        );
    }

    if (!warningExitButton) {
        missingElements.push(
            "#warning-exit-button"
        );
    }

    if (!warningValidationMessage) {
        missingElements.push(
            "#warning-validation-message"
        );
    }

    if (!warningConfirmationArea) {
        missingElements.push(
            ".warning-confirmation-area"
        );
    }

    if (missingElements.length > 0) {

        throw new Error(
            `Elementi mancanti nel Warning: ${missingElements.join(", ")}`
        );
    }
}

/* ==========================================================
   EVENTI
========================================================== */

function bindEvents() {

    document.removeEventListener(
        "webgis:intro-complete",
        handleIntroCompleted
    );

    document.addEventListener(
        "webgis:intro-complete",
        handleIntroCompleted
    );

    warningCheckbox.removeEventListener(
        "change",
        handleCheckboxChanged
    );

    warningCheckbox.addEventListener(
        "change",
        handleCheckboxChanged
    );

    warningAccessButton.removeEventListener(
        "click",
        handleAccess
    );

    warningAccessButton.addEventListener(
        "click",
        handleAccess
    );

    warningExitButton.removeEventListener(
        "click",
        handleExit
    );

    warningExitButton.addEventListener(
        "click",
        handleExit
    );

    warningOverlay.removeEventListener(
        "keydown",
        handleKeyboard
    );

    warningOverlay.addEventListener(
        "keydown",
        handleKeyboard
    );

    warningScrollArea.removeEventListener(
        "scroll",
        handleWarningScroll
    );

    warningScrollArea.addEventListener(
        "scroll",
        handleWarningScroll,
        {
            passive: true
        }
    );
}

/* ==========================================================
   INTRO COMPLETATA
========================================================== */

function handleIntroCompleted() {

    /*
     * Il Warning viene mostrato ogni volta che l'utente
     * preme "Consulta l'Atlante".
     *
     * La sessione viene memorizzata, ma non impedisce
     * all'utente di tornare all'Intro e riaprire il Warning.
     */

    openWarning();
}

/* ==========================================================
   APERTURA
========================================================== */

export function openWarning() {

    if (!warningOverlay) {

        console.warn(
            "Il componente Warning non è ancora stato inizializzato."
        );

        return;
    }

    previousFocusedElement =
        document.activeElement;

    warningCheckbox.checked =
        false;

    warningAccessButton.disabled =
        true;

    hideValidation();

    resetWarningScroll();

    warningOverlay.classList.add(
        "active"
    );

    warningOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    if (!warningTitle.hasAttribute("tabindex")) {

        warningTitle.setAttribute(
            "tabindex",
            "-1"
        );
    }

    window.setTimeout(
        () => {

            resetWarningScroll();

            warningTitle.focus({
                preventScroll: true
            });

        },
        60
    );
}

/* ==========================================================
   CHIUSURA
========================================================== */

export function closeWarning() {

    if (!warningOverlay) {
        return;
    }

    warningOverlay.classList.remove(
        "active"
    );

    warningOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    resetWarningScroll();

    if (
        previousFocusedElement &&
        typeof previousFocusedElement.focus === "function"
    ) {

        previousFocusedElement.focus({
            preventScroll: true
        });
    }
}

/* ==========================================================
   SCORRIMENTO E COMPATTAZIONE DEL BANNER
========================================================== */

function handleWarningScroll() {

    const mustCompact =
        warningScrollArea.scrollTop >
        WARNING_SCROLL_THRESHOLD;

    warningStickyTop.classList.toggle(
        "is-scrolled",
        mustCompact
    );
}

function resetWarningScroll() {

    if (warningScrollArea) {

        warningScrollArea.scrollTop =
            0;
    }

    if (warningPanel) {

        warningPanel.scrollTop =
            0;
    }

    if (warningStickyTop) {

        warningStickyTop.classList.remove(
            "is-scrolled"
        );
    }
}

/* ==========================================================
   CHECKBOX
========================================================== */

function handleCheckboxChanged() {

    warningAccessButton.disabled =
        !warningCheckbox.checked;

    hideValidation();
}

/* ==========================================================
   ACCESSO AL WEBGIS
========================================================== */

function handleAccess() {

    if (!warningCheckbox.checked) {

        showValidation();

        warningCheckbox.focus({
            preventScroll: false
        });

        return;
    }

    sessionStorage.setItem(
        WARNING_SESSION_KEY,
        "true"
    );

    closeWarning();

    document.dispatchEvent(
        new CustomEvent(
            "webgis:warning-accepted",
            {
                detail: {
                    accepted: true
                }
            }
        )
    );
}

/* ==========================================================
   RITORNO ALL'INTRO
========================================================== */

function handleExit() {

    /*
     * Il pulsante Esci rimane sempre disponibile,
     * anche quando la checkbox è selezionata.
     */

    closeWarning();

    document.dispatchEvent(
        new CustomEvent(
            "webgis:warning-exit",
            {
                detail: {
                    returnToIntro: true
                }
            }
        )
    );
}

/* ==========================================================
   VALIDAZIONE
========================================================== */

function showValidation() {

    warningValidationMessage.hidden =
        false;

    warningConfirmationArea.classList.add(
        "has-error"
    );
}

function hideValidation() {

    warningValidationMessage.hidden =
        true;

    warningConfirmationArea.classList.remove(
        "has-error"
    );
}

/* ==========================================================
   SESSIONE
========================================================== */

export function hasAcceptedWarning() {

    return sessionStorage.getItem(
        WARNING_SESSION_KEY
    ) === "true";
}

export function resetWarningSession() {

    sessionStorage.removeItem(
        WARNING_SESSION_KEY
    );
}

/* ==========================================================
   TASTIERA
========================================================== */

function handleKeyboard(event) {

    if (event.key === "Escape") {

        /*
         * Escape non chiude la finestra:
         * l'utente deve scegliere esplicitamente
         * Esci oppure Accedi al WebGIS.
         */

        event.preventDefault();

        return;
    }

    if (event.key === "Tab") {

        trapFocus(
            event
        );
    }
}

/* ==========================================================
   BLOCCO DEL FOCUS
========================================================== */

function trapFocus(event) {

    const focusableElements =
        warningOverlay.querySelectorAll(
            [
                'input:not([disabled])',
                'button:not([disabled])',
                'a[href]',
                '[tabindex]:not([tabindex="-1"])'
            ].join(",")
        );

    if (!focusableElements.length) {
        return;
    }

    const firstFocusableElement =
        focusableElements[0];

    const lastFocusableElement =
        focusableElements[
            focusableElements.length - 1
        ];

    if (
        event.shiftKey &&
        document.activeElement === firstFocusableElement
    ) {

        event.preventDefault();

        lastFocusableElement.focus();

        return;
    }

    if (
        !event.shiftKey &&
        document.activeElement === lastFocusableElement
    ) {

        event.preventDefault();

        firstFocusableElement.focus();
    }
}