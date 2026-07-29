/* ==========================================================
   ATLANTE MICOLOGICO
   MODULO ANALYTICS
   VERSIONE : 3.1
   STATO    : IN TEST

   INDICATORI DISPONIBILI:
   - visualizzazioni totali: eventi page_view;
   - sessioni: session_id distinti;
   - visitatori distinti: visitor_id distinti.

   Il visitor_id è anonimo, specifico per questo WebGIS
   e viene conservato nel browser per un massimo di 13 mesi.
========================================================== */

import {
    createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

import {
    ANALYTICS_CONFIG
} from "./analytics.config.js";

console.info(
    "[Analytics] Step 1 - Modulo analytics.js caricato."
);

/* ==========================================================
   COSTANTI
========================================================== */

const SESSION_STORAGE_KEY =
    "atlante_micologico_session_id";

const VISITOR_STORAGE_KEY =
    "atlante_micologico_visitor";

const VISITOR_RETENTION_DAYS =
    395;

const MAX_EVENT_DATA_LENGTH =
    5000;

/* ==========================================================
   STATO DEL MODULO
========================================================== */

let analyticsInitialized = false;
let supabaseClient = null;
let sessionId = null;
let visitorId = null;

/* ==========================================================
   INIZIALIZZAZIONE
========================================================== */

export async function initAnalytics() {

    console.info(
        "[Analytics] Step 2 - initAnalytics() avviato."
    );

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

    console.info(
        "[Analytics] Step 3 - Configurazione caricata."
    );

    validateConfiguration();

    console.info(
        "[Analytics] Step 4 - Configurazione validata."
    );

    console.info(
        "[Analytics] Step 5 - Libreria Supabase caricata."
    );

    sessionId =
        getOrCreateSessionId();

    visitorId =
        getOrCreateVisitorId();

    console.info(
        "[Analytics] Step 6 - Identificativi anonimi disponibili."
    );

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

    console.info(
        "[Analytics] Step 7 - Client Supabase creato."
    );

    configureAnalyticsEvents();

    console.info(
        "[Analytics] Step 8 - Eventi WebGIS collegati."
    );

    analyticsInitialized = true;

    const pageViewRegistered =
        await trackEvent(
            "page_view",
            {
                application:
                    ANALYTICS_CONFIG.applicationName,

                referrer_present:
                    Boolean(document.referrer)
            }
        );

    if (pageViewRegistered) {

        console.info(
            "[Analytics] Step 9 - page_view registrato."
        );

    } else {

        console.warn(
            "[Analytics] Step 9 - page_view non registrato."
        );
    }

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

        visitor_id:
            visitorId,

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

        debugLog(
            `Invio evento: ${normalizedEventName}`,
            payload.event_data
        );

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

async function handleApplicationReady(
    event
) {

    console.info(
        "[Analytics] Evento WebGIS ricevuto: webgis:application-ready"
    );

    const registered =
        await trackEvent(
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

    if (registered) {

        console.info(
            "[Analytics] atlas_open registrato correttamente."
        );
    }
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

/* ==========================================================
   IDENTIFICATIVO ANONIMO DEL VISITATORE
========================================================== */

function getOrCreateVisitorId() {

    const now =
        Date.now();

    const retentionMilliseconds =
        VISITOR_RETENTION_DAYS *
        24 *
        60 *
        60 *
        1000;

    try {

        const storedValue =
            window.localStorage.getItem(
                VISITOR_STORAGE_KEY
            );

        if (storedValue) {

            const storedVisitor =
                JSON.parse(
                    storedValue
                );

            if (
                isUuid(storedVisitor?.id) &&
                Number.isFinite(storedVisitor?.expiresAt) &&
                storedVisitor.expiresAt > now
            ) {

                return storedVisitor.id;
            }
        }

        const newVisitor = {
            id:
                createUuid(),

            createdAt:
                now,

            expiresAt:
                now + retentionMilliseconds
        };

        window.localStorage.setItem(
            VISITOR_STORAGE_KEY,
            JSON.stringify(
                newVisitor
            )
        );

        return newVisitor.id;

    } catch (error) {

        console.warn(
            "[Analytics] localStorage non disponibile. Il visitatore sarà distinto soltanto nella sessione corrente.",
            error
        );

        return sessionId || createUuid();
    }
}

/* ==========================================================
   GENERAZIONE UUID
========================================================== */

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
