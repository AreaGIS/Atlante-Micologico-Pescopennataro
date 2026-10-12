/* ==========================================================
   WEBGIS V6
   COMPONENTE : INTRO
   VERSIONE   : 1.4
   RELEASE    : 0.4
   STATO      : IN TEST
========================================================== */

const INTRO_COMPONENT_PATH = "./components/intro/intro.html";

const PARTNER_CONTENT = {
    pescolab: {
        title: "PescoLab",
        subtitle: "Associazione culturale per la valorizzazione del territorio",
        logo: "loghi/PescoLab.png",
        logoAlt: "PescoLab",
        text: "PescoLab promuove iniziative culturali, ambientali e sociali dedicate alla conoscenza e alla valorizzazione del territorio, favorendo la partecipazione della comunità locale.",
        status: "La sezione completa sarà disponibile prossimamente."
    },
    amb: {
        title: "A.M.B.",
        subtitle: "Gruppo Molisano «C. Linneo»",
        logo: "immagini/AMB.png",
        logoAlt: "Logo dell’Associazione Micologica Bresadola - Gruppo Molisano C. Linneo",
        text: "Il Gruppo Molisano «C. Linneo» dell’Associazione Micologica Bresadola è un’Associazione di Promozione Sociale ed Ente del Terzo Settore (APS – ETS). Promuove la conoscenza dei funghi e la tutela degli ecosistemi naturali attraverso attività scientifiche, educative e divulgative, senza finalità di lucro.",
        activities: [
            "Promuovere una cultura ecologica e comportamenti orientati alla tutela e al miglioramento degli ecosistemi naturali.",
            "Promuovere lo studio dei funghi e delle problematiche micologiche mediante corsi, mostre, escursioni e altre iniziative.",
            "Promuovere il miglioramento della normativa sulla raccolta e sullo studio dei funghi, con attenzione alla tutela ambientale e alla ricerca scientifica.",
            "Raccogliere e diffondere materiale didattico, bibliografico e scientifico sulla micologia e sulle discipline affini, anche tramite pubblicazioni.",
            "Collaborare con enti, istituzioni e associazioni che perseguono finalità analoghe.",
            "Promuovere l’educazione sanitaria in ambito micologico.",
            "Diffondere la consapevolezza ecologica e micologica tra i giovani e nelle scuole."
        ],
        coordinators: "Franco Cariglia (Registro nazionale micologi n. 1162), Giuseppe Giannotti (n. 1175) e Luca Trentanove (n. 1538).",
        offices: [
            "Via XX Settembre, 110 – 86041 Bonefro (CB)",
            "c/o Dipartimento A.A.A., Facoltà di Agraria, Via De Sanctis – Campobasso"
        ],
        status: ""
    }
};

let introOverlay = null;
let consultButton = null;
let partnerModal = null;
let partnerModalWindow = null;
let partnerModalLogo = null;
let partnerModalTitle = null;
let partnerModalSubtitle = null;
let partnerModalText = null;
let partnerModalStatusText = null;
let partnerButtons = [];
let modalCloseButtons = [];
let lastFocusedElement = null;
let introInitialized = false;
let introTransitionTimer = null;

export async function initIntro() {
    if (introInitialized && introOverlay) {
        return;
    }

    try {
        let existingOverlay = document.getElementById("intro-overlay");

        if (!existingOverlay) {
            const response = await fetch(INTRO_COMPONENT_PATH);

            if (!response.ok) {
                throw new Error(
                    `Impossibile caricare il componente Intro: ${response.status}`
                );
            }

            const introHTML = await response.text();
            existingOverlay = document.createElement("section");
            existingOverlay.id = "intro-overlay";
            existingOverlay.className = "intro-overlay";
            existingOverlay.setAttribute(
                "aria-label",
                "Introduzione all'Atlante Micologico di Pescopennataro"
            );
            existingOverlay.innerHTML = introHTML;
            document.body.appendChild(existingOverlay);
        }

        introOverlay = existingOverlay;
        consultButton = introOverlay.querySelector("#consulta-atlante");
        partnerModal = introOverlay.querySelector("#partner-modal");
        partnerModalWindow = introOverlay.querySelector(".partner-modal-finestra");
        partnerModalLogo = introOverlay.querySelector("#partner-modal-logo");
        partnerModalTitle = introOverlay.querySelector("#partner-modal-titolo");
        partnerModalSubtitle = introOverlay.querySelector("#partner-modal-sottotitolo");
        partnerModalText = introOverlay.querySelector("#partner-modal-testo");
        partnerModalStatusText = introOverlay.querySelector("#partner-modal-stato-testo");
        partnerButtons = Array.from(
            introOverlay.querySelectorAll("[data-partner]")
        );
        modalCloseButtons = Array.from(
            introOverlay.querySelectorAll("[data-modal-close]")
        );

        if (!consultButton) {
            throw new Error(
                "Il pulsante #consulta-atlante non è presente in intro.html."
            );
        }

        if (
            !partnerModal ||
            !partnerModalWindow ||
            !partnerModalLogo ||
            !partnerModalTitle ||
            !partnerModalSubtitle ||
            !partnerModalText ||
            !partnerModalStatusText
        ) {
            throw new Error(
                "La struttura della modale partner non è completa in intro.html."
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

function configureIntro() {
    consultButton.removeEventListener("click", handleConsultButtonClick);
    consultButton.addEventListener("click", handleConsultButtonClick);

    partnerButtons.forEach((button) => {
        button.removeEventListener("click", handlePartnerButtonClick);
        button.addEventListener("click", handlePartnerButtonClick);
    });

    modalCloseButtons.forEach((button) => {
        button.removeEventListener("click", closePartnerModal);
        button.addEventListener("click", closePartnerModal);
    });

    introOverlay.removeEventListener("keydown", handleIntroKeyboard);
    introOverlay.addEventListener("keydown", handleIntroKeyboard);
}

export function showIntro() {
    if (!introOverlay) {
        console.warn("Il componente Intro non è ancora stato inizializzato.");
        return;
    }

    if (introTransitionTimer) {
        window.clearTimeout(introTransitionTimer);
        introTransitionTimer = null;
    }

    closePartnerModal(false);
    consultButton.disabled = false;
    introOverlay.classList.remove("intro-nascosta");
    introOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
        consultButton.focus({ preventScroll: true });
    }, 50);
}

function handleConsultButtonClick() {
    hideIntro();
}

function handlePartnerButtonClick(event) {
    const partnerKey = event.currentTarget.dataset.partner;
    openPartnerModal(partnerKey, event.currentTarget);
}

function openPartnerModal(partnerKey, triggerElement) {
    const content = PARTNER_CONTENT[partnerKey];

    if (!content) {
        console.warn(`Contenuto partner non disponibile: ${partnerKey}`);
        return;
    }

    lastFocusedElement = triggerElement || document.activeElement;
    partnerModalLogo.src = content.logo;
    partnerModalLogo.alt = content.logoAlt;
    partnerModalLogo.dataset.partnerLogo = partnerKey;
    partnerModalTitle.textContent = content.title;
    partnerModalSubtitle.textContent = content.subtitle;
    partnerModalText.replaceChildren();
    partnerModalText.classList.toggle("partner-modal-testo-amb", partnerKey === "amb");

    if (partnerKey === "amb") {
        buildAmbContent(partnerModalText, content);
    } else {
        partnerModalText.textContent = content.text;
    }

    partnerModalStatusText.textContent = content.status || "";
    partnerModalStatusText.hidden = !content.status;
    partnerModalWindow.scrollTop = 0;
    partnerModal.classList.add("partner-modal-aperta");
    partnerModal.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
        partnerModalWindow.focus({ preventScroll: true });
    }, 30);
}

function buildAmbContent(container, content) {
    const introduction = document.createElement("p");
    introduction.className = "partner-amb-introduzione";
    introduction.textContent = content.text;
    container.appendChild(introduction);

    const appendSection = (heading, values, ordered = false) => {
        const section = document.createElement("section");
        section.className = "partner-amb-sezione";
        const title = document.createElement("h3");
        title.textContent = heading;
        section.appendChild(title);
        const list = document.createElement(ordered ? "ol" : "ul");
        values.forEach(value => {
            const item = document.createElement("li");
            item.textContent = value;
            list.appendChild(item);
        });
        section.appendChild(list);
        container.appendChild(section);
    };

    appendSection("Attività e finalità", content.activities);
    appendSection("Coordinamento scientifico", [content.coordinators]);
    appendSection("Sedi", content.offices);
}

function closePartnerModal(restoreFocus = true) {
    if (!partnerModal) {
        return;
    }

    partnerModal.classList.remove("partner-modal-aperta");
    partnerModal.setAttribute("aria-hidden", "true");

    if (
        restoreFocus &&
        lastFocusedElement &&
        typeof lastFocusedElement.focus === "function"
    ) {
        lastFocusedElement.focus({ preventScroll: true });
    }
}

export function hideIntro() {
    if (!introOverlay) {
        return;
    }

    closePartnerModal(false);
    consultButton.disabled = true;
    introOverlay.classList.add("intro-nascosta");
    introOverlay.setAttribute("aria-hidden", "true");
    introTransitionTimer = window.setTimeout(completeIntro, 350);
}

function completeIntro() {
    introTransitionTimer = null;
    document.body.style.overflow = "";

    document.dispatchEvent(
        new CustomEvent("webgis:intro-complete", {
            detail: { completed: true }
        })
    );
}

function handleIntroKeyboard(event) {
    const modalIsOpen = partnerModal.classList.contains("partner-modal-aperta");

    if (event.key === "Escape" && modalIsOpen) {
        event.preventDefault();
        closePartnerModal();
        return;
    }

    if (event.key === "Tab") {
        keepFocusInsideContainer(
            event,
            modalIsOpen ? partnerModalWindow : introOverlay
        );
    }
}

function keepFocusInsideContainer(event, container) {
    const focusableElements = Array.from(
        container.querySelectorAll(
            [
                "a[href]",
                "button:not([disabled])",
                'input:not([disabled])',
                'select:not([disabled])',
                'textarea:not([disabled])',
                '[tabindex]:not([tabindex="-1"])'
            ].join(",")
        )
    ).filter((element) => element.offsetParent !== null);

    if (!focusableElements.length) {
        return;
    }

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
        return;
    }

    if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
    }
}
