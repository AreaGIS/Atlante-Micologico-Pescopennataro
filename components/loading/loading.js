/* ==========================================================
   WEBGIS V6
   COMPONENTE : LOADING
   VERSIONE   : 1.1
   RELEASE    : 0.1
   STATO      : IN TEST
========================================================== */

const LOADING_COMPONENT_PATH =
    "./components/loading/loading.html";

const LOADING_STEPS = [
    {
        id: "application",
        progress: 10,
        message: "Inizializzazione dell’applicazione..."
    },
    {
        id: "components",
        progress: 30,
        message: "Caricamento dei componenti..."
    },
    {
        id: "cartography",
        progress: 50,
        message: "Preparazione della cartografia..."
    },
    {
        id: "data",
        progress: 70,
        message: "Caricamento dei dati..."
    },
    {
        id: "layers",
        progress: 90,
        message: "Configurazione dei layer..."
    },
    {
        id: "ready",
        progress: 100,
        message: "WebGIS pronto."
    }
];

let loadingOverlay = null;
let loadingProgressBar = null;
let loadingProgressTrack = null;
let loadingPercentage = null;
let loadingCurrentMessage = null;
let loadingStepElements = [];

let loadingInitialized = false;
let loadingRunning = false;
let currentProgress = 0;

/* ==========================================================
   INIZIALIZZAZIONE
========================================================== */

export async function initLoading() {

    if (
        loadingInitialized &&
        loadingOverlay
    ) {
        return;
    }

    let existingOverlay =
        document.getElementById(
            "loading-overlay"
        );

    if (!existingOverlay) {

        const response =
            await fetch(
                LOADING_COMPONENT_PATH
            );

        if (!response.ok) {

            throw new Error(
                `Impossibile caricare il componente Loading: ${response.status}`
            );
        }

        const loadingHTML =
            await response.text();

        document.body.insertAdjacentHTML(
            "beforeend",
            loadingHTML
        );

        existingOverlay =
            document.getElementById(
                "loading-overlay"
            );
    }

    if (!existingOverlay) {

        throw new Error(
            "Il componente Loading non contiene #loading-overlay."
        );
    }

    loadingOverlay =
        existingOverlay;

    cacheLoadingElements();

    validateLoadingElements();

    resetLoading();

    loadingInitialized =
        true;
}

/* ==========================================================
   ELEMENTI
========================================================== */

function cacheLoadingElements() {

    loadingProgressBar =
        document.getElementById(
            "loading-progress-bar"
        );

    loadingProgressTrack =
        document.getElementById(
            "loading-progress-track"
        );

    loadingPercentage =
        document.getElementById(
            "loading-percentage"
        );

    loadingCurrentMessage =
        document.getElementById(
            "loading-current-message"
        );

    loadingStepElements =
        Array.from(
            loadingOverlay.querySelectorAll(
                ".loading-step"
            )
        );
}

/* ==========================================================
   VALIDAZIONE
========================================================== */

function validateLoadingElements() {

    const missingElements = [];

    if (!loadingProgressBar) {

        missingElements.push(
            "#loading-progress-bar"
        );
    }

    if (!loadingProgressTrack) {

        missingElements.push(
            "#loading-progress-track"
        );
    }

    if (!loadingPercentage) {

        missingElements.push(
            "#loading-percentage"
        );
    }

    if (!loadingCurrentMessage) {

        missingElements.push(
            "#loading-current-message"
        );
    }

    if (!loadingStepElements.length) {

        missingElements.push(
            ".loading-step"
        );
    }

    if (missingElements.length > 0) {

        throw new Error(
            `Elementi mancanti nel Loading: ${missingElements.join(", ")}`
        );
    }
}

/* ==========================================================
   APERTURA
========================================================== */

export function openLoading() {

    if (!loadingOverlay) {

        console.warn(
            "Il componente Loading non è ancora stato inizializzato."
        );

        return;
    }

    resetLoading();

    loadingOverlay.classList.add(
        "active"
    );

    loadingOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}

/* ==========================================================
   CHIUSURA
========================================================== */

export function closeLoading() {

    if (!loadingOverlay) {
        return;
    }

    loadingOverlay.classList.remove(
        "active"
    );

    loadingOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    loadingRunning =
        false;
}

/* ==========================================================
   RESET
========================================================== */

export function resetLoading() {

    currentProgress =
        0;

    updateProgressBar(
        0
    );

    updateMessage(
        "Inizializzazione dell’applicazione..."
    );

    loadingStepElements.forEach(
        stepElement => {

            stepElement.classList.remove(
                "loading-step-active",
                "loading-step-completed"
            );
        }
    );

    const firstStep =
        getStepElement(
            "application"
        );

    if (firstStep) {

        firstStep.classList.add(
            "loading-step-active"
        );
    }
}

/* ==========================================================
   AGGIORNAMENTO PUBBLICO
========================================================== */

export function updateLoading(
    progress,
    message,
    activeStepId
) {

    if (!loadingOverlay) {

        console.warn(
            "Il componente Loading non è ancora stato inizializzato."
        );

        return;
    }

    const normalizedProgress =
        normalizeProgress(
            progress
        );

    currentProgress =
        normalizedProgress;

    updateProgressBar(
        normalizedProgress
    );

    if (message) {

        updateMessage(
            message
        );
    }

    if (activeStepId) {

        updateSteps(
            activeStepId
        );
    }

    document.dispatchEvent(
        new CustomEvent(
            "webgis:loading-progress",
            {
                detail: {
                    progress:
                        normalizedProgress,

                    message:
                        message ||
                        loadingCurrentMessage.textContent,

                    step:
                        activeStepId ||
                        null
                }
            }
        )
    );
}

/* ==========================================================
   IMPOSTAZIONE DI UNA FASE
========================================================== */

export function setLoadingStep(
    stepId
) {

    const step =
        LOADING_STEPS.find(
            item =>
                item.id === stepId
        );

    if (!step) {

        console.warn(
            `Fase Loading non riconosciuta: ${stepId}`
        );

        return;
    }

    updateLoading(
        step.progress,
        step.message,
        step.id
    );
}

/* ==========================================================
   COMPLETAMENTO
========================================================== */

export function completeLoading() {

    setLoadingStep(
        "ready"
    );

    loadingRunning =
        false;

    /*
     * Nella Release 0.1 il Loading resta visibile al 100%.
     * Nella Release 0.2 sarà la mappa, quando pronta,
     * a richiamare closeLoading().
     */

    document.dispatchEvent(
        new CustomEvent(
            "webgis:loading-complete",
            {
                detail: {
                    completed: true,
                    progress: 100
                }
            }
        )
    );
}

/* ==========================================================
   SEQUENZA DIMOSTRATIVA RELEASE 0.1
========================================================== */

export async function runLoadingDemo() {

    if (loadingRunning) {
        return;
    }

    loadingRunning =
        true;

    openLoading();

    const sequence = [
        {
            step: "application",
            delay: 900
        },
        {
            step: "components",
            delay: 1000
        },
        {
            step: "cartography",
            delay: 1100
        },
        {
            step: "data",
            delay: 1200
        },
        {
            step: "layers",
            delay: 1100
        }
    ];

    for (const item of sequence) {

        if (!loadingRunning) {
            return;
        }

        setLoadingStep(
            item.step
        );

        await wait(
            item.delay
        );
    }

    completeLoading();
}

/* ==========================================================
   BARRA DI AVANZAMENTO
========================================================== */

function updateProgressBar(
    progress
) {

    loadingProgressBar.style.width =
        `${progress}%`;

    loadingPercentage.textContent =
        `${progress}%`;

    loadingProgressTrack.setAttribute(
        "aria-valuenow",
        String(progress)
    );
}

/* ==========================================================
   MESSAGGIO
========================================================== */

function updateMessage(
    message
) {

    loadingCurrentMessage.textContent =
        message;
}

/* ==========================================================
   STATO DELLE FASI
========================================================== */

function updateSteps(
    activeStepId
) {

    const activeStepIndex =
        LOADING_STEPS.findIndex(
            item =>
                item.id === activeStepId
        );

    loadingStepElements.forEach(
        stepElement => {

            const stepId =
                stepElement.dataset.loadingStep;

            const stepIndex =
                LOADING_STEPS.findIndex(
                    item =>
                        item.id === stepId
                );

            stepElement.classList.remove(
                "loading-step-active",
                "loading-step-completed"
            );

            if (
                stepIndex >= 0 &&
                stepIndex < activeStepIndex
            ) {

                stepElement.classList.add(
                    "loading-step-completed"
                );

                return;
            }

            if (
                stepId === activeStepId
            ) {

                stepElement.classList.add(
                    "loading-step-active"
                );
            }
        }
    );
}

/* ==========================================================
   RICERCA DI UNA FASE
========================================================== */

function getStepElement(
    stepId
) {

    return loadingStepElements.find(
        stepElement =>
            stepElement.dataset.loadingStep ===
            stepId
    );
}

/* ==========================================================
   NORMALIZZAZIONE DELLA PERCENTUALE
========================================================== */

function normalizeProgress(
    progress
) {

    const numericProgress =
        Number(
            progress
        );

    if (
        !Number.isFinite(
            numericProgress
        )
    ) {

        return currentProgress;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(
                numericProgress
            )
        )
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