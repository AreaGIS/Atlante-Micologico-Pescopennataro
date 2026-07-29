/* ==========================================================
   ATLANTE MICOLOGICO
   CONFIGURAZIONE DEL MODULO ANALYTICS
   VERSIONE : 3.0
   STATO    : IN TEST
========================================================== */

export const ANALYTICS_CONFIG = Object.freeze({

    enabled: true,

    applicationName:
        "Atlante Micologico di Pescopennataro",

    supabaseUrl:
        "https://efhdvicazpqciwvnyjye.supabase.co",

    /*
     * Incollare qui la Publishable key già utilizzata
     * nella versione funzionante locale.
     * Non utilizzare mai la Secret key.
     */
    supabasePublishableKey:
        "sb_publishable_WFZbNkM_kvSgsiF8idCSxw_AiPwDWvg",

    tableName:
        "webgis_events",

    debug:
        true
});
