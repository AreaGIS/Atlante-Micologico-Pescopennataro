/* ==========================================================
   WEBGIS V6
   COMPONENTE : MAP STATE
   VERSIONE   : 1.0
   RELEASE    : 0.1
   STATO      : IN TEST

   INDICE

   MAP-STATE-01  Stato generale
   MAP-STATE-02  Mappe e viste
   MAP-STATE-03  Estensioni territoriali
   MAP-STATE-04  Cartografie di base
   MAP-STATE-05  Sorgenti vettoriali
   MAP-STATE-06  Layer principali
   MAP-STATE-07  Mini mappa
   MAP-STATE-08  Habitat
   MAP-STATE-09  Elementi dell'interfaccia
========================================================== */

/* #######################################################################
   MAP-STATE-01
   STATO GENERALE
######################################################################## */

export const mapState = {

    initialized:
        false,

    application:
        null,

    currentBasemap:
        "satellite",

    /* ###################################################################
       MAP-STATE-02
       MAPPE E VISTE
    ################################################################### */

    primaryMap:
        null,

    overviewMap:
        null,

    primaryView:
        null,

    overviewView:
        null,

    /* ###################################################################
       MAP-STATE-03
       ESTENSIONI TERRITORIALI
    ################################################################### */

    municipalityExtent:
        null,

    /* ###################################################################
       MAP-STATE-04
       CARTOGRAFIE DI BASE
    ################################################################### */

    primarySatelliteLayer:
        null,

    primaryOsmLayer:
        null,

    overviewSatelliteLayer:
        null,

    overviewOsmLayer:
        null,

    /* ###################################################################
       MAP-STATE-05
       SORGENTI VETTORIALI
    ################################################################### */

    boundarySource:
        null,

    surveysSource:
        null,

    overviewExtentSource:
        null,

    /* ###################################################################
       MAP-STATE-06
       LAYER PRINCIPALI
    ################################################################### */

    primaryBoundaryLayer:
        null,

    overviewBoundaryLayer:
        null,

    primarySurveysLayer:
        null,

    overviewSurveysLayer:
        null,

    /* ###################################################################
       MAP-STATE-07
       MINI MAPPA
    ################################################################### */

    overviewExtentFeature:
        null,

    overviewExtentLayer:
        null,

    /* ###################################################################
       MAP-STATE-08
       HABITAT
    ################################################################### */

    habitatLayers:
        new Map(),

    /* ###################################################################
       MAP-STATE-09
       ELEMENTI DELL'INTERFACCIA
    ################################################################### */

    sidebar:
        null,

    sidebarToggle:
        null,

    habitatToggle:
        null,

    habitatList:
        null,

    mapStatus:
        null,

    scaleDisplay:
        null

};

/* ==========================================================
   RIPRISTINO DELLO STATO
========================================================== */

export function resetMapState() {

    mapState.initialized =
        false;

    mapState.application =
        null;

    mapState.currentBasemap =
        "satellite";

    mapState.primaryMap =
        null;

    mapState.overviewMap =
        null;

    mapState.primaryView =
        null;

    mapState.overviewView =
        null;

    mapState.municipalityExtent =
        null;

    mapState.primarySatelliteLayer =
        null;

    mapState.primaryOsmLayer =
        null;

    mapState.overviewSatelliteLayer =
        null;

    mapState.overviewOsmLayer =
        null;

    mapState.boundarySource =
        null;

    mapState.surveysSource =
        null;

    mapState.overviewExtentSource =
        null;

    mapState.primaryBoundaryLayer =
        null;

    mapState.overviewBoundaryLayer =
        null;

    mapState.primarySurveysLayer =
        null;

    mapState.overviewSurveysLayer =
        null;

    mapState.overviewExtentFeature =
        null;

    mapState.overviewExtentLayer =
        null;

    mapState.habitatLayers =
        new Map();

    mapState.sidebar =
        null;

    mapState.sidebarToggle =
        null;

    mapState.habitatToggle =
        null;

    mapState.habitatList =
        null;

    mapState.mapStatus =
        null;

    mapState.scaleDisplay =
        null;
}