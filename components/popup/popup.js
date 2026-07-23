/* ==========================================================
   WEBGIS V6
   COMPONENTE : SURVEY CARD
   VERSIONE   : 6.2
   STATO      : IN TEST
========================================================== */

const POPUP_COMPONENT_PATH = "./components/popup/popup.html";
const POPUP_STYLE_PATH = "./components/popup/popup.css";
const POPUP_STYLE_ID = "webgis-popup-style";
const ICON_BASE = "./assets/icons/";

let popupInitialized = false;
let popupElement = null;
let popupContent = null;
let popupTitle = null;
let popupSubtitle = null;
let popupCloseButton = null;
let currentFeature = null;

export async function initPopup() {
    if (popupInitialized && popupElement) {
        return;
    }

    await loadStyle();
    await loadMarkup();

    popupElement = document.getElementById("survey-popup");
    popupContent = document.getElementById("survey-popup-content");
    popupTitle = document.getElementById("survey-popup-title");
    popupSubtitle = document.getElementById("survey-popup-subtitle");
    popupCloseButton = document.getElementById("survey-popup-close");

    if (!popupElement || !popupContent || !popupTitle || !popupCloseButton) {
        throw new Error("Componenti SurveyCard mancanti.");
    }

    popupCloseButton.addEventListener("click", hidePopup);
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            hidePopup();
        }
    });

    popupInitialized = true;
}

function loadStyle() {
    return new Promise((resolve, reject) => {
        const existing = document.getElementById(POPUP_STYLE_ID);

        if (existing) {
            existing.remove();
        }

        const link = document.createElement("link");
        link.id = POPUP_STYLE_ID;
        link.rel = "stylesheet";
        link.href = `${POPUP_STYLE_PATH}?v=6.2`;
        link.addEventListener("load", resolve, { once: true });
        link.addEventListener("error", reject, { once: true });
        document.head.appendChild(link);
    });
}

async function loadMarkup() {
    const existing = document.getElementById("survey-popup");
    if (existing) {
        existing.remove();
    }

    const response = await fetch(`${POPUP_COMPONENT_PATH}?v=6.2`, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`Popup HTML non disponibile: ${response.status}`);
    }

    const host = document.getElementById("map-main-area");
    if (!host) {
        throw new Error("#map-main-area non disponibile.");
    }

    host.insertAdjacentHTML("beforeend", await response.text());
}

export function showPopup(feature) {
    if (!popupInitialized || !feature || typeof feature.getProperties !== "function") {
        return;
    }

    currentFeature = feature;

    const properties = {
        ...feature.getProperties()
    };

    const species = text(properties.Specie) || "Rilievo micologico";

    popupTitle.textContent = species;
    popupSubtitle.textContent = getSubtitle(properties);
    popupContent.replaceChildren();

    const photoItems = getPhotoItems(properties);
    if (photoItems.length) {
        popupContent.appendChild(buildGallery(photoItems, species));
    }

    const publicFields = [];
    pushField(publicFields, "Commestibilità", properties.Commestibilita, "edible.svg", "badge");
    pushField(publicFields, "Habitat", properties.Habitat, "habitat.svg");
    pushField(publicFields, "Altitudine", formatAltitude(properties.Altitudine), "altitude.svg");

    const coordinates = formatCoordinates(properties);
    if (coordinates) {
        publicFields.push({
            label: "Coordinate",
            value: coordinates,
            icon: "location.svg",
            type: "coordinates"
        });
    }

    if (publicFields.length) {
        popupContent.appendChild(buildSection("Informazioni", publicFields, "info.svg"));
    }

    const note = document.createElement("p");
    note.className = "survey-popup-note";
    note.textContent = "Le indicazioni di commestibilità non sostituiscono il controllo di un micologo qualificato.";
    popupContent.appendChild(note);

    popupElement.hidden = false;
    popupElement.setAttribute("aria-hidden", "false");
    popupContent.scrollTop = 0;

    document.dispatchEvent(new CustomEvent("webgis:survey-opened", {
        detail: {
            feature,
            properties
        }
    }));
}

/* ==========================================================
   GALLERIA FOTOGRAFICA

   Ogni fotografia è identificata dal nome file e conserva
   più sorgenti possibili: percorso locale e URL remoto.
   Se la sorgente locale non è disponibile, viene provato
   automaticamente l'URL remoto della stessa fotografia.
========================================================== */

function getPhotoItems(properties) {
    const localSources = parsePhotoValue(properties.Foto);
    const remoteSources = parsePhotoValue(properties.URLFoto);
    const itemsByKey = new Map();

    [...localSources, ...remoteSources].forEach(rawSource => {
        const source = normalizePhoto(rawSource);
        if (!source) {
            return;
        }

        const key = photoKey(source);
        if (!key) {
            return;
        }

        if (!itemsByKey.has(key)) {
            itemsByKey.set(key, {
                key,
                sources: []
            });
        }

        const item = itemsByKey.get(key);
        createSourceCandidates(source).forEach(candidate => {
            if (!item.sources.includes(candidate)) {
                item.sources.push(candidate);
            }
        });
    });

    return Array.from(itemsByKey.values()).filter(item => item.sources.length);
}

function parsePhotoValue(value) {
    if (Array.isArray(value)) {
        return value.flatMap(parsePhotoValue);
    }

    const normalized = text(value);
    if (!normalized) {
        return [];
    }

    if (normalized.startsWith("[") && normalized.endsWith("]")) {
        try {
            return parsePhotoValue(JSON.parse(normalized));
        } catch (error) {
            console.warn("Elenco fotografico JSON non valido.", error);
        }
    }

    return normalized
        .split(/[|;\n\r]+/)
        .map(text)
        .filter(Boolean);
}

function normalizePhoto(value) {
    return text(value)
        .replace(/\\/g, "/")
        .replace(/^\.\//, "");
}

function createSourceCandidates(source) {
    const candidates = [];
    const add = candidate => {
        const normalized = text(candidate);
        if (normalized && !candidates.includes(normalized)) {
            candidates.push(normalized);
        }
    };

    add(source);

    if (!isAbsoluteUrl(source)) {
        const cleanSource = source.replace(/^\/+/, "");
        add(`./${cleanSource}`);
        add(`/${cleanSource}`);
        add(encodeURI(cleanSource));
        add(`./${encodeURI(cleanSource)}`);
    }

    return candidates;
}

function isAbsoluteUrl(value) {
    return /^(?:https?:)?\/\//i.test(value) || /^data:/i.test(value) || /^blob:/i.test(value);
}

function photoKey(url) {
    try {
        const clean = url.split(/[?#]/)[0];
        const filename = clean.substring(clean.lastIndexOf("/") + 1);
        return decodeURIComponent(filename).toLocaleLowerCase("it-IT");
    } catch {
        return url.toLocaleLowerCase("it-IT");
    }
}

function buildGallery(photoItems, title) {
    const section = document.createElement("section");
    section.className = "survey-section";
    section.appendChild(sectionTitle(`Fotografie (${photoItems.length})`, "photo.svg"));

    const grid = document.createElement("div");
    grid.className = "survey-gallery";
    grid.dataset.count = String(photoItems.length);

    photoItems.forEach((photoItem, index) => {
        grid.appendChild(buildPhotoCard(photoItem, title, index));
    });

    section.appendChild(grid);
    return section;
}

function buildPhotoCard(photoItem, title, index) {
    const link = document.createElement("a");
    link.className = "survey-photo-link";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = `Apri fotografia ${index + 1}`;

    const image = document.createElement("img");
    image.className = "survey-photo";
    image.alt = `${title} - fotografia ${index + 1}`;
    image.loading = index === 0 ? "eager" : "lazy";

    const number = document.createElement("span");
    number.className = "survey-photo-number";
    number.textContent = String(index + 1);
    number.setAttribute("aria-hidden", "true");

    let sourceIndex = 0;

    const loadSource = () => {
        const source = photoItem.sources[sourceIndex];
        image.src = source;
        link.href = source;
    };

    image.addEventListener("error", () => {
        sourceIndex += 1;

        if (sourceIndex < photoItem.sources.length) {
            loadSource();
            return;
        }

        const unavailable = document.createElement("div");
        unavailable.className = "survey-photo-unavailable";
        unavailable.textContent = `Fotografia ${index + 1} non disponibile nel percorso pubblicato.`;
        link.replaceWith(unavailable);
    });

    link.append(image, number);
    loadSource();

    return link;
}

/* ==========================================================
   SEZIONI E CAMPI
========================================================== */

function buildSection(title, fields, icon) {
    const section = document.createElement("section");
    section.className = "survey-section";
    section.appendChild(sectionTitle(title, icon));

    const container = document.createElement("div");
    container.className = "survey-fields";
    fields.forEach(field => container.appendChild(buildField(field)));
    section.appendChild(container);

    return section;
}

function buildScientific(fields) {
    const details = document.createElement("details");
    details.className = "survey-scientific";

    const summary = document.createElement("summary");
    summary.appendChild(iconNode("confidence.svg", "survey-section-icon"));
    summary.append("Approfondimento scientifico");

    const content = document.createElement("div");
    content.className = "survey-scientific-content survey-fields";
    fields.forEach(field => content.appendChild(buildField(field)));

    details.append(summary, content);
    return details;
}

function buildField(field) {
    const row = document.createElement("div");
    row.className = "survey-field";
    row.appendChild(iconNode(field.icon, "survey-field-icon"));

    const body = document.createElement("div");
    body.className = "survey-field-body";

    const label = document.createElement("div");
    label.className = "survey-label";
    label.textContent = field.label;

    const value = document.createElement("div");
    value.className = "survey-value";

    if (field.type === "badge") {
        value.appendChild(buildBadge(field.value, field.label));
    } else if (field.type === "coordinates") {
        value.appendChild(buildCoordinateLines(field.value));
    } else {
        value.textContent = field.value;
    }

    body.append(label, value);
    row.appendChild(body);
    return row;
}

function buildCoordinateLines(coordinates) {
    const container = document.createElement("div");
    container.className = "survey-coordinate-lines";

    const latitude = document.createElement("span");
    latitude.textContent = `${coordinates.latitude} N`;

    const longitude = document.createElement("span");
    longitude.textContent = `${coordinates.longitude} E`;

    container.append(latitude, longitude);
    return container;
}

function buildBadge(value, label) {
    const badge = document.createElement("span");
    const kind = badgeKind(value);
    badge.className = `survey-badge survey-badge-${kind}`;

    if (label === "Commestibilità" && kind === "negative") {
        const image = document.createElement("img");
        image.src = `${ICON_BASE}skull-danger.png`;
        image.alt = "Pericolo";
        image.className = "survey-danger-icon";
        badge.appendChild(image);
    } else {
        const dot = document.createElement("span");
        dot.className = "survey-badge-dot";
        dot.setAttribute("aria-hidden", "true");
        badge.appendChild(dot);
    }

    badge.append(document.createTextNode(value));
    return badge;
}

function sectionTitle(label, icon) {
    const heading = document.createElement("h3");
    heading.className = "survey-section-title";
    heading.appendChild(iconNode(icon, "survey-section-icon"));
    heading.append(label);
    return heading;
}

function iconNode(name, className) {
    const wrapper = document.createElement("span");
    wrapper.className = className;

    const image = document.createElement("img");
    image.src = `${ICON_BASE}${name}`;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");

    wrapper.appendChild(image);
    return wrapper;
}

function pushField(list, label, value, icon, type = "text") {
    const normalized = text(value);
    if (normalized) {
        list.push({
            label,
            value: normalized,
            icon,
            type
        });
    }
}

/* ==========================================================
   FORMATTAZIONE
========================================================== */

function getSubtitle(properties) {
    const id = text(properties.ID || properties.fid);
    return id ? `Rilievo n. ${id}` : "";
}

function formatAltitude(value) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue)
        ? `${new Intl.NumberFormat("it-IT", { maximumFractionDigits: 1 }).format(numericValue)} m`
        : "";
}

function formatCoordinates(properties) {
    const longitude = Number(properties.Longitudine);
    const latitude = Number(properties.Latitudine);

    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
        return null;
    }

    return {
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6)
    };
}

function formatDate(value) {
    const normalized = text(value);
    if (!normalized) {
        return "";
    }

    const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : normalized;
}

function badgeKind(value) {
    const normalized = lower(value);

    if (/non commestibile|tossic|velenos|mortale/.test(normalized)) {
        return "negative";
    }

    if (/cautela|controvers|proposta|media/.test(normalized)) {
        return "warning";
    }

    if (/commestibile|alta|validata/.test(normalized) && !normalized.includes("non commestibile")) {
        return "positive";
    }

    return "neutral";
}

function text(value) {
    return value == null ? "" : String(value).trim();
}

function lower(value) {
    return text(value).toLocaleLowerCase("it-IT");
}

/* ==========================================================
   CHIUSURA E API PUBBLICA
========================================================== */

export function hidePopup() {
    if (!popupElement) {
        return;
    }

    popupElement.hidden = true;
    popupElement.setAttribute("aria-hidden", "true");

    const previousFeature = currentFeature;
    currentFeature = null;

    document.dispatchEvent(new CustomEvent("webgis:survey-closed", {
        detail: {
            feature: previousFeature
        }
    }));
}

export function getCurrentPopupFeature() {
    return currentFeature;
}

export function isPopupOpen() {
    return Boolean(popupElement && !popupElement.hidden);
}

export function getPopupFields() {
    return [];
}

export function getPopupConfiguration() {
    return {
        version: "6.0"
    };
}
