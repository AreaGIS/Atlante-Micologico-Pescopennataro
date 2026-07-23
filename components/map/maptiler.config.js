/* ==========================================================
   WEBGIS V6
   CONFIGURAZIONE MAPTILER
   VERSIONE   : 1.4
   STATO      : CONFIGURARE LOCALMENTE
========================================================== */

export const MAPTILER_CONFIG = Object.freeze({

    enabled: true,

    apiKey:
        "HpYc1YY3kaN4JEsJF50S",

    tilesId:
        "satellite-v4",

    fallbackErrorThreshold:
        4,

    sdkVersion:
        "4.0.2",

    threeD: Object.freeze({
        enabled: true,
        pitch: 67,
        bearing: -24,
        maxPitch: 85,
        terrainExaggeration: 1.15
    })
});
