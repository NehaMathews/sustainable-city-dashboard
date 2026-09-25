/* =========================================================
   SUSTAINABLE CITY DASHBOARD
   Shared Application Data & Utilities
   ========================================================= */


/* =========================================================
   INDICATORS
   ========================================================= */

const IND = {

    air: 'Air Quality',

    transport: 'Transportation',

    waste: 'Waste',

    water: 'Water',

    energy: 'Energy',

    green: 'Green Spaces'

};


const KEYS =
    Object.keys(IND);



/* =========================================================
   ABBREVIATIONS
   ========================================================= */

const ABBR = {

    air: 'AQ',

    transport: 'TR',

    waste: 'WS',

    water: 'WT',

    energy: 'EN',

    green: 'GR'

};



/* =========================================================
   CITY DATA
   ========================================================= */

const CITIES = {


    Kochi: {

        note:
            'Coastal city with strong air quality and green cover in the west and south; waste handling and heat in the east need work.',

        trend:
            [-9, -6, -5, -5, -3, -1, 0],

        zones: [

            [
                'North Zone',
                'Moderate',
                79,
                63,
                68,
                75,
                76,
                83
            ],

            [
                'Central Zone',
                'High',
                77,
                70,
                58,
                72,
                71,
                67
            ],

            [
                'East Zone',
                'Very High',
                73,
                67,
                61,
                65,
                66,
                42
            ],

            [
                'West Zone',
                'Low',
                88,
                80,
                79,
                82,
                85,
                91
            ],

            [
                'South Zone',
                'Moderate',
                84,
                74,
                70,
                81,
                78,
                80
            ]

        ]

    },


    Chennai: {

        note:
            'Hot coastal metro where water supply and urban heat are the main pressures, especially in the central and west zones.',

        trend:
            [-3, -4, -2, -5, -3, -2, 0],

        zones: [

            [
                'North Zone',
                'High',
                66,
                62,
                60,
                58,
                68,
                55
            ],

            [
                'Central Zone',
                'Very High',
                62,
                58,
                56,
                60,
                66,
                40
            ],

            [
                'East Zone',
                'High',
                74,
                68,
                66,
                62,
                70,
                64
            ],

            [
                'West Zone',
                'High',
                70,
                66,
                64,
                56,
                72,
                60
            ],

            [
                'South Zone',
                'Moderate',
                76,
                74,
                68,
                66,
                78,
                72
            ]

        ]

    },


    Bangalore: {

        note:
            'Fast-growing tech city where congestion drives weak transport scores, with air quality and green cover under pressure in the central and east zones.',

        trend:
            [4, 3, 1, 0, -1, -1, 0],

        zones: [

            [
                'North Zone',
                'Moderate',
                68,
                52,
                64,
                66,
                76,
                66
            ],

            [
                'Central Zone',
                'High',
                60,
                46,
                60,
                62,
                72,
                58
            ],

            [
                'East Zone',
                'High',
                62,
                50,
                58,
                60,
                74,
                52
            ],

            [
                'West Zone',
                'Moderate',
                70,
                60,
                68,
                68,
                74,
                70
            ],

            [
                'South Zone',
                'Low',
                76,
                66,
                72,
                70,
                78,
                80
            ]

        ]

    }

};



/* =========================================================
   TREND LABELS
   ========================================================= */

const TREND_DAYS = [

    'Mon',

    'Tue',

    'Wed',

    'Thu',

    'Fri',

    'Sat',

    'Today'

];



/* =========================================================
   RECOMMENDATIONS
   ========================================================= */

const ACTIONS = {


    air: {

        title:
            'Reduce urban emissions',

        text:
            'Support cleaner mobility and green buffers around busy corridors.',

        hint:
            'reduce emissions near busy corridors.'

    },


    transport: {

        title:
            'Promote sustainable mobility',

        text:
            'Encourage public transport, walking and cycling for short trips.',

        hint:
            'encourage sustainable mobility.'

    },


    waste: {

        title:
            'Improve waste segregation',

        text:
            'Increase source-segregation awareness and recycling facilities.',

        hint:
            'improve segregation and recycling.'

    },


    water: {

        title:
            'Reduce water loss',

        text:
            'Promote leak reporting, water-saving practices and reuse.',

        hint:
            'cut leakage and promote reuse.'

    },


    energy: {

        title:
            'Improve energy efficiency',

        text:
            'Reduce unnecessary electricity consumption and promote efficient use.',

        hint:
            'promote efficient electricity use.'

    },


    green: {

        title:
            'Increase green cover',

        text:
            'Prioritize tree planting, pocket parks and accessible green areas.',

        hint:
            'increase accessible vegetation.'

    }

};



/* =========================================================
   GENERAL UTILITIES
   ========================================================= */

const clamp = n =>

    Math.max(
        0,
        Math.min(
            100,
            n
        )
    );



const avg = array =>

    Math.round(

        array.reduce(
            (sum, value) =>
                sum + value,

            0
        )

        /

        array.length

    );



/* =========================================================
   LOCAL STORAGE
   ========================================================= */

const store = {


    get(key, defaultValue) {

        try {

            const value =
                localStorage.getItem(
                    'scd_' + key
                );


            return value === null
                ? defaultValue
                : JSON.parse(value);

        }

        catch (error) {

            return defaultValue;

        }

    },


    set(key, value) {

        try {

            localStorage.setItem(

                'scd_' + key,

                JSON.stringify(value)

            );

        }

        catch (error) {

            /* Ignore storage errors */

        }

    }

};



/* =========================================================
   CURRENT CITY
   ========================================================= */

let city =

    store.get(
        'city',
        Object.keys(CITIES)[0]
    );


if (!(city in CITIES)) {

    city =
        Object.keys(CITIES)[0];

}



/* =========================================================
   ZONE DATA
   ========================================================= */

const zones = () => {


    return CITIES[city].zones.map(

        ([

            name,

            heat,

            ...values

        ]) => {


            const object = {

                name,

                heat

            };


            KEYS.forEach(

                (key, index) => {

                    object[key] =
                        clamp(
                            values[index]
                        );

                }

            );


            object.overall =

                avg(

                    KEYS.map(
                        key =>
                            object[key]
                    )

                );


            return object;

        }

    );

};



/* =========================================================
   CITY SCORES
   ========================================================= */

const cityScores = () => {


    const z =
        zones();


    const scores = {};


    KEYS.forEach(

        key => {

            scores[key] =

                avg(

                    z.map(
                        zone =>
                            zone[key]
                    )

                );

        }

    );


    scores.overall =

        avg(

            KEYS.map(
                key =>
                    scores[key]
            )

        );


    return scores;

};



/* =========================================================
   PERFORMANCE LEVEL
   ========================================================= */

const level = score => {


    if (score < 65) {

        return {

            c: 'low',

            t: 'Priority area'

        };

    }


    if (score < 75) {

        return {

            c: 'mid',

            t: 'Needs improvement'

        };

    }


    return {

        c: 'high',

        t: 'Performing well'

    };

};



/* =========================================================
   FIND WEAKEST INDICATOR
   ========================================================= */

const weakest = zone =>

    KEYS.reduce(

        (lowest, key) =>

            zone[key] < zone[lowest]
                ? key
                : lowest,

        KEYS[0]

    );



/* =========================================================
   HISTORICAL DATA
   ========================================================= */

const historical = () => {


    const score =
        cityScores().overall;


    return CITIES[city].trend.map(

        difference =>

            clamp(
                score + difference
            )

    );

};



/* =========================================================
   SDG GOALS
   ========================================================= */

const goals = [

    [
        'SDG 6',
        'Clean Water & Sanitation',
        'water',
        'Improve water efficiency and reduce losses.'
    ],

    [
        'SDG 7',
        'Affordable & Clean Energy',
        'energy',
        'Promote efficient energy use.'
    ],

    [
        'SDG 11',
        'Sustainable Cities',
        'transport',
        'Build cleaner, safer urban mobility.'
    ],

    [
        'SDG 12',
        'Responsible Consumption',
        'waste',
        'Increase segregation and recycling.'
    ],

    [
        'SDG 13',
        'Climate Action',
        'air',
        'Reduce emissions and strengthen green buffers.'
    ],

    [
        'SDG 15',
        'Life on Land',
        'green',
        'Expand accessible urban green cover.'
    ]

];



/* =========================================================
   SHARED PAGE INITIALIZATION
   ========================================================= */

function initShell() {


    /* Active navigation */

    const active =
        document.querySelector(
            'nav a.active'
        );


    if (active) {

        active.setAttribute(
            'aria-current',
            'page'
        );

    }



    /* Main content ID */

    const main =
        document.querySelector(
            'main'
        );


    if (main) {

        main.setAttribute(
            'id',
            'main'
        );

    }



    /* Skip link */

    if (
        !document.querySelector(
            '.skip'
        )
    ) {

        const skip =
            document.createElement(
                'a'
            );


        skip.className =
            'skip';


        skip.href =
            '#main';


        skip.textContent =
            'Skip to content';


        document.body.prepend(
            skip
        );

    }



    /* City selector */

    let select =
        document.getElementById(
            'city'
        );


    if (!select) {


        select =
            document.createElement(
                'select'
            );


        select.id =
            'city';


        const label =
            document.createElement(
                'label'
            );


        label.className =
            'side-city';


        label.append(
            'City',
            select
        );


        const sidebar =
            document.querySelector(
                'aside'
            );


        const sideNote =
            document.querySelector(
                'aside .side-note'
            );


        if (sidebar) {

            sidebar.insertBefore(
                label,
                sideNote
            );

        }

    }



    select.setAttribute(
        'aria-label',
        'Select city'
    );


    select.innerHTML =

        Object.keys(
            CITIES
        )

        .map(
            name =>
                `<option>${name}</option>`
        )

        .join('');


    select.value =
        city;


    select.addEventListener(
        'change',

        () => {

            city =
                select.value;


            store.set(
                'city',
                city
            );


            location.reload();

        }

    );



    /* Update city labels */

    document
        .querySelectorAll(
            '[data-city]'
        )
        .forEach(

            element => {

                element.textContent =
                    city;

            }

        );



    /* Apply saved theme */

    applyTheme();

}



/* =========================================================
   DARK MODE
   ========================================================= */

function applyTheme() {


    const dark =
        store.get(
            'dark',
            false
        );


    document.body.classList.toggle(
        'dark',
        dark
    );


    document.documentElement.style.colorScheme =

        dark
            ? 'dark'
            : 'light';

}



/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function notify(
    title,
    text,
    type = 'warning'
) {


    if (
        !store.get(
            'notif',
            true
        )
    ) {

        return;

    }


    const notifications =

        store.get(
            'notifications',
            []
        );


    notifications.unshift({

        title,

        text,

        type,

        time:
            new Date()
                .toLocaleString()

    });


    store.set(

        'notifications',

        notifications.slice(
            0,
            20
        )

    );

}



/* =========================================================
   CSV DOWNLOAD
   ========================================================= */

function downloadCSV(
    name,
    rows
) {


    const quote = cell => {


        if (
            /[",\n]/
                .test(cell)
        ) {

            return (

                '"'

                +

                String(cell)
                    .replace(
                        /"/g,
                        '""'
                    )

                +

                '"'

            );

        }


        return cell;

    };


    const content =

        rows
            .map(
                row =>
                    row
                        .map(quote)
                        .join(',')
            )
            .join('\n');


    const url =

        URL.createObjectURL(

            new Blob(

                [
                    '\ufeff'
                    +
                    content
                ],

                {
                    type:
                        'text/csv'
                }

            )

        );


    const link =
        document.createElement(
            'a'
        );


    link.href =
        url;


    link.download =
        name;


    link.click();


    URL.revokeObjectURL(
        url
    );

}



/* =========================================================
   HTML ESCAPING
   ========================================================= */

const esc = value =>

    String(value)

        .replace(
            /[&<>"']/g,

            character => ({

                '&': '&amp;',

                '<': '&lt;',

                '>': '&gt;',

                '"': '&quot;',

                "'": '&#39;'

            })[character]

        );



/* =========================================================
   ALERT GENERATION
   ========================================================= */

const thresholdAlerts = () => {


    const alerts = [];


    zones().forEach(

        zone => {


            KEYS.forEach(

                key => {


                    const value =
                        zone[key];


                    if (
                        value < 70
                    ) {


                        alerts.push({

                            v:
                                value,


                            type:
                                value < 65
                                    ? 'critical'
                                    : 'warning',


                            title:
                                `${zone.name}: ${IND[key]}`,


                            text:
                                `Score is ${value}/100 and ${
                                    value < 65
                                        ? 'has entered the priority range'
                                        : 'should be monitored'
                                }.`,


                            meta:
                                'Current city: '
                                +
                                city

                        });

                    }

                }

            );

        }

    );


    return alerts.sort(

        (first, second) =>
            first.v - second.v

    );

};



/* =========================================================
   ALERT COUNT
   ========================================================= */

const alertCount = () => {


    return (

        thresholdAlerts()
            .filter(
                alert =>
                    alert.type === 'critical'
            )
            .length

        +

        store.get(
            'notifications',
            []
        ).length

    );

};



/* =========================================================
   INITIAL THEME
   ========================================================= */

applyTheme();



/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(

    'DOMContentLoaded',

    initShell

);