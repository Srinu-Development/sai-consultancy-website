/* =====================================================
   SAI CONSULTANCY
   SUPABASE LIVE PROPERTY SYSTEM
   ===================================================== */


/* =====================================================
   SUPABASE CONFIGURATION
   ===================================================== */

const SUPABASE_URL =
    "https://mwjbqedrmwieehlkszmq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_1ysH560VoBoWH5wzlrhtcw_i2Q6VKBS";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =====================================================
   LIVE PROPERTIES
   ===================================================== */

let allProperties = [];


/* =====================================================
   GET PROPERTIES FROM SUPABASE
   ===================================================== */

async function loadPropertiesFromSupabase() {

    const propertyGrid =
        document.getElementById("propertyGrid");

    if (!propertyGrid) {
        return;
    }

    propertyGrid.innerHTML = `
        <div class="no-properties">
            <h3>Loading Properties...</h3>
            <p>Please wait...</p>
        </div>
    `;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("properties")
            .select("*")
            .order("id", {
                ascending: false
            });


        if (error) {

            console.error(
                "Supabase property error:",
                error
            );

            propertyGrid.innerHTML = `
                <div class="no-properties">
                    <h3>Unable to Load Properties</h3>
                    <p>
                        Please try again later.
                    </p>
                </div>
            `;

            return;
        }


        allProperties =
            Array.isArray(data)
                ? data
                : [];


        console.log(
            "Live Supabase Properties:",
            allProperties
        );


        displayProperties(
            allProperties
        );


    } catch (error) {

        console.error(
            "Property loading error:",
            error
        );


        propertyGrid.innerHTML = `
            <div class="no-properties">
                <h3>Something went wrong</h3>
                <p>Please refresh the page.</p>
            </div>
        `;

    }

}


/* =====================================================
   DISPLAY PROPERTIES
   ===================================================== */

function displayProperties(
    properties
) {

    const propertyGrid =
        document.getElementById(
            "propertyGrid"
        );


    if (!propertyGrid) {
        return;
    }


    propertyGrid.innerHTML = "";


    if (
        !properties ||
        properties.length === 0
    ) {

        propertyGrid.innerHTML = `
            <div class="no-properties">

                <h3>
                    No Properties Found
                </h3>

                <p>
                    Currently no properties are available.
                </p>

            </div>
        `;

        return;
    }


    properties.forEach(
        function(property) {


            /* =========================================
               GALLERY
               ========================================= */

            let galleryImages = [];


            if (
                Array.isArray(
                    property.gallery
                )
            ) {

                galleryImages =
                    property.gallery;

            } else {

                try {

                    galleryImages =
                        JSON.parse(
                            property.gallery || "[]"
                        );

                } catch (error) {

                    galleryImages = [];

                }

            }


            if (
                galleryImages.length === 0 &&
                property.image
            ) {

                galleryImages = [
                    property.image
                ];

            }


            /* =========================================
               GALLERY HTML
               ========================================= */

            const galleryHTML =
                galleryImages.map(
                    function(
                        image,
                        index
                    ) {

                        return `

                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(property.name || "Property")}"
                                onclick='openLightbox(${JSON.stringify(galleryImages)}, ${index})'
                                onerror="this.style.display='none'"
                            >

                        `;

                    }
                ).join("");


            /* =========================================
               PROPERTY CARD
               ========================================= */

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "property-card";


            card.setAttribute(
                "data-location",
                String(
                    property.location || ""
                ).toLowerCase()
            );


            card.setAttribute(
                "data-type",
                String(
                    property.type || ""
                ).toLowerCase()
            );


            card.innerHTML = `

                <!-- PROPERTY IMAGE -->

                <div class="property-image">

                    <img
                        src="${escapeHTML(property.image || "")}"
                        alt="${escapeHTML(property.name || "Property")}"
                        onerror="this.style.display='none'"
                    >

                    <span class="property-tag">
                        ${escapeHTML(property.status || "FOR SALE")}
                    </span>

                </div>


                <!-- PROPERTY CONTENT -->

                <div class="property-content">


                    <h3>
                        ${escapeHTML(property.name || "")}
                    </h3>


                    <p class="location">
                        📍 ${escapeHTML(property.location || "")}
                    </p>


                    <div class="property-details">


                        <p>
                            📐
                            <strong>Size:</strong>
                            ${escapeHTML(property.area || "")}
                        </p>


                        <p>
                            💰
                            <strong>Price:</strong>
                            ${escapeHTML(property.price || "")}
                        </p>


                        <p>
                            🏠
                            <strong>Type:</strong>
                            ${escapeHTML(property.type || "")}
                        </p>


                    </div>


                    <p class="description">
                        ${escapeHTML(property.description || "")}
                    </p>


                    <!-- GALLERY -->

                    <div class="property-gallery">

                        ${galleryHTML}

                    </div>


                    <!-- VIEW DETAILS -->

                    <a
                        href="property-details.html?id=${property.id}"
                        class="view-details-button"
                    >
                        🔎 View Details
                    </a>


                    <!-- CONTACT BUTTONS -->

                    <div class="property-buttons">


                        <a
                            href="tel:+919866779493"
                        >
                            📞 Call
                        </a>


                        <a
                            href="https://wa.me/919866779493?text=${encodeURIComponent(
                                "Hello Sai Consultancy, I am interested in " +
                                (property.name || "this property") +
                                " located at " +
                                (property.location || "") +
                                ". Please share more details."
                            )}"
                            target="_blank"
                        >
                            💬 WhatsApp
                        </a>


                    </div>


                    <!-- GOOGLE MAP -->

                    ${
                        property.map
                            ? `
                                <a
                                    class="map-button"
                                    href="${escapeHTML(property.map)}"
                                    target="_blank"
                                >
                                    📍 View Property Location
                                </a>
                              `
                            : ""
                    }


                </div>

            `;


            propertyGrid.appendChild(
                card
            );

        }
    );


    /* =========================================
       PROPERTY COUNT
       ========================================= */

    const message =
        document.getElementById(
            "property-message"
        );


    if (message) {

        message.innerHTML = `
            <p>
                ${properties.length}
                propert${properties.length === 1 ? "y" : "ies"}
                available
            </p>
        `;

    }

}


/* =====================================================
   FILTER PROPERTIES
   ===================================================== */

function filterProperties() {

    const locationElement =
        document.getElementById(
            "locationFilter"
        );


    const typeElement =
        document.getElementById(
            "propertyType"
        );


    if (
        !locationElement ||
        !typeElement
    ) {

        return;

    }


    const selectedLocation =
        locationElement.value
            .toLowerCase();


    const selectedType =
        typeElement.value
            .toLowerCase();


    const filteredProperties =
        allProperties.filter(
            function(property) {


                const propertyLocation =
                    String(
                        property.location || ""
                    ).toLowerCase();


                const propertyType =
                    String(
                        property.type || ""
                    ).toLowerCase();


                const locationMatch =
                    selectedLocation === "all" ||
                    propertyLocation.includes(
                        selectedLocation
                    );


                const typeMatch =
                    selectedType === "all" ||
                    propertyType === selectedType;


                return (
                    locationMatch &&
                    typeMatch
                );

            }
        );


    displayProperties(
        filteredProperties
    );

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* =====================================================
   WHATSAPP PROPERTY ENQUIRY
   ===================================================== */

function sendPropertyWhatsApp(
    propertyName,
    location,
    price
) {

    const phoneNumber =
        "919866779493";


    const message =
        "Hello Sai Consultancy,%0A%0A" +

        "I am interested in this property.%0A%0A" +

        "Property: " +
        propertyName +
        "%0A" +

        "Location: " +
        location +
        "%0A" +

        "Price: " +
        price +
        "%0A%0A" +

        "Please share more details.";


    const whatsappURL =
        "https://wa.me/" +
        phoneNumber +
        "?text=" +
        message;


    window.open(
        whatsappURL,
        "_blank"
    );

}


/* =====================================================
   LIGHTBOX
   ===================================================== */

let currentGallery = [];

let currentImageIndex = 0;


function openLightbox(
    images,
    index
) {

    currentGallery =
        images || [];


    currentImageIndex =
        index || 0;


    const lightbox =
        document.getElementById(
            "imageLightbox"
        );


    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );


    if (
        !lightbox ||
        !lightboxImage ||
        !currentGallery.length
    ) {

        return;

    }


    lightboxImage.src =
        currentGallery[
            currentImageIndex
        ];


    updateLightboxCounter();


    lightbox.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


function closeLightbox() {

    const lightbox =
        document.getElementById(
            "imageLightbox"
        );


    if (!lightbox) {
        return;
    }


    lightbox.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

}


function changeLightboxImage(
    direction
) {

    if (
        currentGallery.length === 0
    ) {

        return;

    }


    currentImageIndex +=
        direction;


    if (
        currentImageIndex >=
        currentGallery.length
    ) {

        currentImageIndex = 0;

    }


    if (
        currentImageIndex < 0
    ) {

        currentImageIndex =
            currentGallery.length - 1;

    }


    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );


    if (lightboxImage) {

        lightboxImage.src =
            currentGallery[
                currentImageIndex
            ];

    }


    updateLightboxCounter();

}


function updateLightboxCounter() {

    const counter =
        document.getElementById(
            "lightboxCounter"
        );


    if (!counter) {
        return;
    }


    counter.textContent =
        (
            currentImageIndex + 1
        ) +
        " / " +
        currentGallery.length;

}


/* =====================================================
   KEYBOARD LIGHTBOX
   ===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        const lightbox =
            document.getElementById(
                "imageLightbox"
            );


        if (
            !lightbox ||
            !lightbox.classList.contains(
                "show"
            )
        ) {

            return;

        }


        if (
            event.key === "Escape"
        ) {

            closeLightbox();

        }


        if (
            event.key === "ArrowRight"
        ) {

            changeLightboxImage(
                1
            );

        }


        if (
            event.key === "ArrowLeft"
        ) {

            changeLightboxImage(
                -1
            );

        }

    }
);


/* =====================================================
   CONTACT FORM VALIDATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const contactForm =
            document.querySelector(
                ".contact-form form"
            );


        if (!contactForm) {
            return;
        }


        contactForm.addEventListener(
            "submit",
            function(event) {

                const name =
                    document.getElementById(
                        "name"
                    );


                const phone =
                    document.getElementById(
                        "phone"
                    );


                if (
                    !name ||
                    !phone
                ) {

                    return;

                }


                if (
                    name.value.trim().length < 2
                ) {

                    event.preventDefault();

                    alert(
                        "Please enter your name."
                    );

                    name.focus();

                    return;

                }


                const phonePattern =
                    /^[0-9]{10}$/;


                if (
                    !phonePattern.test(
                        phone.value.trim()
                    )
                ) {

                    event.preventDefault();

                    alert(
                        "Please enter a valid 10-digit phone number."
                    );

                    phone.focus();

                }

            }
        );

    }
);


/* =====================================================
   PHONE INPUT
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const phoneInputs =
            document.querySelectorAll(
                'input[type="tel"]'
            );


        phoneInputs.forEach(
            function(input) {

                input.addEventListener(
                    "input",
                    function() {

                        this.value =
                            this.value.replace(
                                /[^0-9]/g,
                                ""
                            );


                        if (
                            this.value.length > 10
                        ) {

                            this.value =
                                this.value.substring(
                                    0,
                                    10
                                );

                        }

                    }
                );

            }
        );

    }
);


/* =====================================================
   CURRENT YEAR
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const yearElements =
            document.querySelectorAll(
                ".current-year"
            );


        yearElements.forEach(
            function(element) {

                element.textContent =
                    new Date().getFullYear();

            }
        );

    }
);


/* =====================================================
   LOAD LIVE PROPERTIES
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            document.getElementById(
                "propertyGrid"
            )
        ) {

            loadPropertiesFromSupabase();

        }

    }
);


/* =====================================================
   PAGE LOADED
   ===================================================== */

console.log(
    "Sai Consultancy - Supabase Live Website Loaded."
);