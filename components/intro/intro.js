/* ==========================================================
   WEBGIS V6
   COMPONENTE : INTRO
   VERSIONE   : 1.1
   RELEASE    : 0.1
   STATO      : IN TEST
========================================================== */

const INTRO_COMPONENT_PATH = "./components/intro/intro.html";

let introOverlay = null;
let consultButton = null;
let introInitialized = false;
let introTransitionTimer = null;

/* ==========================================================
   INIZIALIZZAZIONE
========================================================== */

export async function initIntro() {

    if (introInitialized && introOverlay) {
        return;
    }

    try {

        let existingOverlay =
            document.getElementById("intro-overlay");

        if (!existingOverlay) {

            const response =
                await fetch(INTRO_COMPONENT_PATH);

            if (!response.ok) {

                throw new Error(
                    `Impossibile caricare il componente Intro: ${response.status}`
                );
            }

            const introHTML =
                await response.text();

            existingOverlay =
                document.createElement("section");

            existingOverlay.id =
                "intro-overlay";

            existingOverlay.className =
                "intro-overlay";

            existingOverlay.setAttribute(
                "aria-label",
                "Introduzione all'Atlante Micologico di Pescopennataro"
            );

            existingOverlay.innerHTML =
                introHTML;

            document.body.appendChild(
                existingOverlay
            );
        }

        introOverlay =
            existingOverlay;

        consultButton =
            introOverlay.querySelector(
                "#consulta-atlante"
            );

        if (!consultButton) {

            throw new Error(
                "Il pulsante #consulta-atlante non è presente in intro.html."
            );
        }

        configureIntro();

        introInitialized = true;

        showIntro();

    } catch (error) {

        introInitialized = false;

        console.error(
            "Errore durante l'inizializzazione del componente Intro:",
            error
        );

        throw error;
    }
}

/* ==========================================================
   CONFIGURAZIONE
========================================================== */

function configureIntro() {

    consultButton.removeEventListener(
        "click",
        handleConsultButtonClick
    );

    consultButton.addEventListener(
        "click",
        handleConsultButtonClick
    );

    introOverlay.removeEventListener(
        "keydown",
        handleIntroKeyboard
    );

    introOverlay.addEventListener(
        "keydown",
        handleIntroKeyboard
    );
}

/* ==========================================================
   APERTURA
========================================================== */

export function showIntro() {

    if (!introOverlay) {

        console.warn(
            "Il componente Intro non è ancora stato inizializzato."
        );

        return;
    }

    if (introTransitionTimer) {

        window.clearTimeout(
            introTransitionTimer
        );

        introTransitionTimer = null;
    }

    if (consultButton) {
        consultButton.disabled = false;
    }

    introOverlay.classList.remove(
        "intro-nascosta"
    );

    introOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    window.setTimeout(
        () => {

            if (consultButton) {

                consultButton.focus({
                    preventScroll: true
                });
            }

        },
        50
    );
}

/* ==========================================================
   PULSANTE CONSULTA L'ATLANTE
========================================================== */

function handleConsultButtonClick() {

    hideIntro();
}

/* ==========================================================
   CHIUSURA
========================================================== */

export function hideIntro() {

    if (!introOverlay) {
        return;
    }

    if (consultButton) {
        consultButton.disabled = true;
    }

    introOverlay.classList.add(
        "intro-nascosta"
    );

    introOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    introTransitionTimer =
        window.setTimeout(
            completeIntro,
            350
        );
}

/* ==========================================================
   COMPLETAMENTO INTRO
========================================================== */

function completeIntro() {

    introTransitionTimer = null;

    document.body.style.overflow =
        "";

    document.dispatchEvent(
        new CustomEvent(
            "webgis:intro-complete",
            {
                detail: {
                    completed: true
                }
            }
        )
    );
}

/* ==========================================================
   TASTIERA
========================================================== */

function handleIntroKeyboard(event) {

    if (
        event.key === "Enter" &&
        document.activeElement === consultButton
    ) {

        event.preventDefault();

        hideIntro();

        return;
    }

    if (event.key === "Tab") {

        keepFocusInsideIntro(
            event
        );
    }
}

/* ==========================================================
   BLOCCO DEL FOCUS
========================================================== */

function keepFocusInsideIntro(event) {

    const focusableElements =
        introOverlay.querySelectorAll(
            [
                "a[href]",
                "button:not([disabled])",
                'input:not([disabled])',
                'select:not([disabled])',
                'textarea:not([disabled])',
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