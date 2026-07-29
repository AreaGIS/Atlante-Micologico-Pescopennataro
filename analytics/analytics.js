/* ==========================================================
   ATLANTE MICOLOGICO
   MODULO ANALYTICS
   VERSIONE : 2.0
   STATO    : IN TEST
========================================================== */

import {
    createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

import {
    ANALYTICS_CONFIG
} from "./analytics.config.js";

/* ==========================================================
   COSTANTI
========================================================== */

const SESSION_STORAGE_KEY =
    "atlante_micologico_session_id";

const MAX_EVENT_DATA_LENGTH =
    5000;

/* ==========================================================
   STATO DEL MODULO
========================================================== */

let analyticsInitialized = false;
let supabaseClient = null;
let sessionId = null;

/* ==========================================================
   INIZIALIZZAZIONE
========================================================== */

export async function initAnalytics() {

    if (analyticsInitialized) {

        debugLog(
            "Modulo Analytics già inizializzato."
        );

        return;
    }

    if (!ANALYTICS_CONFIG.enabled) {

        debugLog(
            "Modulo Analytics disattivato dalla configurazione."
        );

        return;
    }

    validateConfiguration();

    sessionId =
        getOrCreateSessionId();

    supabaseClient =
        createClient(
            ANALYTICS_CONFIG.supabaseUrl,
            ANALYTICS_CONFIG.supabasePublishableKey,
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                }
            }
        );

    configureAnalyticsEvents();

    analyticsInitialized = true;

    await trackEvent(
        "page_view",
        {
            application:
                ANALYTICS_CONFIG.applicationName,
            referrer_present:
                Boolean(document.referrer)
        }
    );

    debugLog(
        "Modulo Analytics inizializzato correttamente."
    );
}

/* ==========================================================
   REGISTRAZIONE DI UN EVENTO
========================================================== */

export async function trackEvent(
    eventName,
    eventData = {}
) {

    if (
        !ANALYTICS_CONFIG.enabled ||
        !analyticsInitialized ||
        !supabaseClient
    ) {
        return false;
    }

    const normalizedEventName =
        normalizeText(
            eventName,
            100
        );

    if (!normalizedEventName) {

        console.warn(
            "[Analytics] Nome evento non valido."
        );

        return false;
    }

    const payload = {
        session_id:
            sessionId,

        event_name:
            normalizedEventName,

        page_path:
            normalizeText(
                window.location.pathname || "/",
                500
            ) || "/",

        page_title:
            normalizeText(
                document.title,
                250
            ),

        device_type:
            detectDeviceType(),

        browser_language:
            normalizeText(
                navigator.language,
                20
            ),

        screen_width:
            getPositiveInteger(
                window.screen?.width
            ),

        screen_height:
            getPositiveInteger(
                window.screen?.height
            ),

        event_data:
            sanitizeEventData(
                eventData
            )
    };

    try {

        const {
            error
        } = await supabaseClient
            .from(
                ANALYTICS_CONFIG.tableName
            )
            .insert(
                payload
            );

        if (error) {
            throw error;
        }

        debugLog(
            `Evento registrato: ${normalizedEventName}`,
            payload.event_data
        );

        return true;

    } catch (error) {

        console.warn(
            `[Analytics] Impossibile registrare l'evento "${normalizedEventName}":`,
            error
        );

        return false;
    }
}

/* ==========================================================
   EVENTI DEL WEBGIS
========================================================== */

function configureAnalyticsEvents() {

    document.addEventListener(
        "webgis:application-ready",
        handleApplicationReady
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
   ATLANTE APERTO
========================================================== */

function handleApplicationReady(
    event
) {

    trackEvent(
        "atlas_open",
        {
            ready:
                event.detail?.ready === true,

            basemap:
                normalizeText(
                    event.detail?.basemap,
                    100
                ) || "satellite"
        }
    );
}

/* ==========================================================
   CAMBIO CARTOGRAFIA
========================================================== */

function handleBasemapChanged(
    event
) {

    trackEvent(
        "map_interaction",
        {
            interaction_type:
                "basemap_changed",

            basemap:
                normalizeText(
                    event.detail?.basemap,
                    100
                )
        }
    );
}

/* ==========================================================
   VISIBILITÀ DI UN LAYER
========================================================== */

function handleLayerVisibilityChanged(
    event
) {

    trackEvent(
        "map_interaction",
        {
            interaction_type:
                "layer_visibility_changed",

            layer_id:
                normalizeText(
                    event.detail?.layerId,
                    150
                ),

            visible:
                event.detail?.visible === true
        }
    );
}

/* ==========================================================
   CONFIGURAZIONE
========================================================== */

function validateConfiguration() {

    const url =
        ANALYTICS_CONFIG.supabaseUrl;

    const key =
        ANALYTICS_CONFIG.supabasePublishableKey;

    if (
        typeof url !== "string" ||
        !url.startsWith("https://") ||
        !url.includes(".supabase.co")
    ) {

        throw new Error(
            "Project URL Supabase non valido in analytics.config.js."
        );
    }

    if (
        typeof key !== "string" ||
        key.length < 20 ||
        key.includes("INCOLLA_QUI") ||
        key.includes("INSERISCI_")
    ) {

        throw new Error(
            "Publishable key Supabase non configurata in analytics.config.js."
        );
    }
}

/* ==========================================================
   IDENTIFICATIVO DI SESSIONE
========================================================== */

function getOrCreateSessionId() {

    try {

        let currentSessionId =
            window.sessionStorage.getItem(
                SESSION_STORAGE_KEY
            );

        if (!isUuid(currentSessionId)) {

            currentSessionId =
                createUuid();

            window.sessionStorage.setItem(
                SESSION_STORAGE_KEY,
                currentSessionId
            );
        }

        return currentSessionId;

    } catch (error) {

        console.warn(
            "[Analytics] sessionStorage non disponibile. Verrà usato un identificativo temporaneo.",
            error
        );

        return createUuid();
    }
}

function createUuid() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {
        return window.crypto.randomUUID();
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
        .replace(
            /[xy]/g,
            character => {

                const randomValue =
                    Math.floor(
                        Math.random() * 16
                    );

                const value =
                    character === "x"
                        ? randomValue
                        : (randomValue & 0x3) | 0x8;

                return value.toString(16);
            }
        );
}

function isUuid(
    value
) {

    return typeof value === "string" &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            .test(value);
}

/* ==========================================================
   DATI TECNICI DEL DISPOSITIVO
========================================================== */

function detectDeviceType() {

    const userAgent =
        navigator.userAgent || "";

    if (
        /tablet|ipad|playbook|silk/i
            .test(userAgent)
    ) {
        return "tablet";
    }

    if (
        /mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i
            .test(userAgent)
    ) {
        return "smartphone";
    }

    return "desktop";
}

function getPositiveInteger(
    value
) {

    const number =
        Number(value);

    if (
        !Number.isInteger(number) ||
        number <= 0
    ) {
        return null;
    }

    return number;
}

/* ==========================================================
   NORMALIZZAZIONE DEI DATI
========================================================== */

function normalizeText(
    value,
    maximumLength
) {

    if (
        value === null ||
        value === undefined
    ) {
        return null;
    }

    const normalizedValue =
        String(value).trim();

    if (!normalizedValue) {
        return null;
    }

    return normalizedValue.slice(
        0,
        maximumLength
    );
}

function sanitizeEventData(
    eventData
) {

    if (
        !eventData ||
        typeof eventData !== "object" ||
        Array.isArray(eventData)
    ) {
        return {};
    }

    try {

        const serializedData =
            JSON.stringify(eventData);

        if (
            serializedData.length >
            MAX_EVENT_DATA_LENGTH
        ) {

            console.warn(
                "[Analytics] event_data troppo esteso. Evento registrato senza dettagli."
            );

            return {};
        }

        return JSON.parse(
            serializedData
        );

    } catch (error) {

        console.warn(
            "[Analytics] event_data non serializzabile.",
            error
        );

        return {};
    }
}

/* ==========================================================
   LOG DI SVILUPPO
========================================================== */

function debugLog(
    message,
    data = null
) {

    if (!ANALYTICS_CONFIG.debug) {
        return;
    }

    if (data === null) {

        console.info(
            `[Analytics] ${message}`
        );

        return;
    }

    console.info(
        `[Analytics] ${message}`,
        data
    );
}
