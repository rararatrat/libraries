import { DecimalPipe } from "@angular/common";
import { PrimeIcons } from "primeng/api";
import { FormatWidth, NumberFormatStyle, TranslationWidth, getLocaleCurrencyCode, getLocaleCurrencyName, getLocaleCurrencySymbol, getLocaleDateFormat, getLocaleDateTimeFormat, getLocaleDayNames, getLocaleDayPeriods, getLocaleDirection, getLocaleEraNames, getLocaleFirstDayOfWeek, getLocaleMonthNames, getLocaleNumberFormat, getLocaleTimeFormat} from '@angular/common';

export class Core{
    static _localize: {[key: string]: (((p?: any) => string) | undefined)} = {};

    static Localize(key: string,
        /** Default {count: 1, item: ''} */
        p: any = {count: 1}) : string{
        const _key = (key || '').toLowerCase();
        const _params = {...p, count: (p.count === undefined ? 1 : p.count), item: (p.item || ''), company: (p.company || '')};
        const _toReturn = (this._localize[_key]?.(_params) || `{translations.${key}}`);
        return _toReturn;
    }

    static Resolution: {
        type: string,
        name: string,
        ratio: string,
        pixel: string,
        height: number,
        width: number,
        font_size: string}[] = [
        {
            type:"SD (Standard Definition)",
            name:"480p",
            ratio:"4:3",
            pixel:"640 x 480",
            height: 480,
            width: 640,
            font_size:"10px"
        },
        {
            type:"HD (High Definition)",
            name:"720p",
            ratio:"16:9",
            pixel:"1280 x 720",
            height: 720,
            width: 1280,
            font_size:"12px"
        },
        {
            type:"Full HD (FHD)",
            name:"1080p",
            ratio:"16:9",
            pixel:"1920 x 1080",
            height:1080,
            width:1920,
            font_size:"13px"
        },
        {
            type:"QHD (Quad HD)",
            name:"1440p",
            ratio:"16:9",
            pixel:"2560 x 1440",
            height:1440,
            width:2560,
            font_size:"20px"
        },
        {
            type:"2K video",
            name:"1080p",
            ratio:"1:1.77",
            pixel:"2048 x 1080",
            height:1080,
            width:2048,
            font_size:"17px"
        },
        {
            type:"4K video or Ultra HD (UHD)",
            name:"4K or 2160p",
            ratio:"1:1.9",
            pixel:"3840 x 2160",
            height:2160,
            width:3840,
            font_size:"19px"
        },
        {
            type:"8K video or Full Ultra HD",
            name:"8K or 4320p",
            ratio:"16∶9",
            pixel:"7680 x 4320",
            height:4320,
            width:7680,
            font_size:"21px"
        }
    ];

    /* private static _TimeZones: {[city: string]: {value: number, tz?: string}}; */

    public static getTimeZones(_d: DecimalPipe, /* byCountry?: string */) {
        const tzStr = (_num: number): string => {
            const whole = _num - (_num % 1);
            const modulo = (((_num %1 ) * 10) * 0.1);
            const by60 = ((((_num %1 ) * 10) * 0.1) * 60) * 0.01;
            const _sum = whole + by60;
            const formatted = _d.transform(_sum * 100, "4.0", "en")?.replace(",", "") || (_num + '');
            return formatted;
        }

        const _timeZones: {[city: string]: {value: number, tz?: string}} = {};

        const _arr = [
            'Europe/Andorra',
            'Asia/Dubai',
            'Asia/Kabul',
            'Europe/Tirane',
            'Asia/Yerevan',
            'Antarctica/Casey',
            'Antarctica/Davis',
            'Antarctica/DumontDUrville', // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
            'Antarctica/Mawson',
            'Antarctica/Palmer',
            'Antarctica/Rothera',
            'Antarctica/Syowa',
            'Antarctica/Troll',
            'Antarctica/Vostok',
            'America/Argentina/Buenos_Aires',
            'America/Argentina/Cordoba',
            'America/Argentina/Salta',
            'America/Argentina/Jujuy',
            'America/Argentina/Tucuman',
            'America/Argentina/Catamarca',
            'America/Argentina/La_Rioja',
            'America/Argentina/San_Juan',
            'America/Argentina/Mendoza',
            'America/Argentina/San_Luis',
            'America/Argentina/Rio_Gallegos',
            'America/Argentina/Ushuaia',
            'Pacific/Pago_Pago',
            'Europe/Vienna',
            'Australia/Lord_Howe',
            'Antarctica/Macquarie',
            'Australia/Hobart',
            'Australia/Currie',
            'Australia/Melbourne',
            'Australia/Sydney',
            'Australia/Broken_Hill',
            'Australia/Brisbane',
            'Australia/Lindeman',
            'Australia/Adelaide',
            'Australia/Darwin',
            'Australia/Perth',
            'Australia/Eucla',
            'Asia/Baku',
            'America/Barbados',
            'Asia/Dhaka',
            'Europe/Brussels',
            'Europe/Sofia',
            'Atlantic/Bermuda',
            'Asia/Brunei',
            'America/La_Paz',
            'America/Noronha',
            'America/Belem',
            'America/Fortaleza',
            'America/Recife',
            'America/Araguaina',
            'America/Maceio',
            'America/Bahia',
            'America/Sao_Paulo',
            'America/Campo_Grande',
            'America/Cuiaba',
            'America/Santarem',
            'America/Porto_Velho',
            'America/Boa_Vista',
            'America/Manaus',
            'America/Eirunepe',
            'America/Rio_Branco',
            'America/Nassau',
            'Asia/Thimphu',
            'Europe/Minsk',
            'America/Belize',
            'America/St_Johns',
            'America/Halifax',
            'America/Glace_Bay',
            'America/Moncton',
            'America/Goose_Bay',
            'America/Blanc-Sablon',
            'America/Toronto',
            'America/Nipigon',
            'America/Thunder_Bay',
            'America/Iqaluit',
            'America/Pangnirtung',
            'America/Atikokan',
            'America/Winnipeg',
            'America/Rainy_River',
            'America/Resolute',
            'America/Rankin_Inlet',
            'America/Regina',
            'America/Swift_Current',
            'America/Edmonton',
            'America/Cambridge_Bay',
            'America/Yellowknife',
            'America/Inuvik',
            'America/Creston',
            'America/Dawson_Creek',
            'America/Fort_Nelson',
            'America/Vancouver',
            'America/Whitehorse',
            'America/Dawson',
            'Indian/Cocos',
            'Europe/Zurich',
            'Africa/Abidjan',
            'Pacific/Rarotonga',
            'America/Santiago',
            'America/Punta_Arenas',
            'Pacific/Easter',
            'Asia/Shanghai',
            'Asia/Urumqi',
            'America/Bogota',
            'America/Costa_Rica',
            'America/Havana',
            'Atlantic/Cape_Verde',
            'America/Curacao',
            'Indian/Christmas',
            'Asia/Nicosia',
            'Asia/Famagusta',
            'Europe/Prague',
            'Europe/Berlin',
            'Europe/Copenhagen',
            'America/Santo_Domingo',
            'Africa/Algiers',
            'America/Guayaquil',
            'Pacific/Galapagos',
            'Europe/Tallinn',
            'Africa/Cairo',
            'Africa/El_Aaiun',
            'Europe/Madrid',
            'Africa/Ceuta',
            'Atlantic/Canary',
            'Europe/Helsinki',
            'Pacific/Fiji',
            'Atlantic/Stanley',
            'Pacific/Chuuk',
            'Pacific/Pohnpei',
            'Pacific/Kosrae',
            'Atlantic/Faroe',
            'Europe/Paris',
            'Europe/London',
            'Asia/Tbilisi',
            'America/Cayenne',
            'Africa/Accra',
            'Europe/Gibraltar',
            'America/Godthab',
            'America/Danmarkshavn',
            'America/Scoresbysund',
            'America/Thule',
            'Europe/Athens',
            'Atlantic/South_Georgia',
            'America/Guatemala',
            'Pacific/Guam',
            'Africa/Bissau',
            'America/Guyana',
            'Asia/Hong_Kong',
            'America/Tegucigalpa',
            'America/Port-au-Prince',
            'Europe/Budapest',
            'Asia/Jakarta',
            'Asia/Pontianak',
            'Asia/Makassar',
            'Asia/Jayapura',
            'Europe/Dublin',
            'Asia/Jerusalem',
            'Asia/Kolkata',
            'Indian/Chagos',
            'Asia/Baghdad',
            'Asia/Tehran',
            'Atlantic/Reykjavik',
            'Europe/Rome',
            'America/Jamaica',
            'Asia/Amman',
            'Asia/Tokyo',
            'Africa/Nairobi',
            'Asia/Bishkek',
            'Pacific/Tarawa',
            'Pacific/Enderbury',
            'Pacific/Kiritimati',
            'Asia/Pyongyang',
            'Asia/Seoul',
            'Asia/Almaty',
            'Asia/Qyzylorda',
            'Asia/Qostanay', // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
            'Asia/Aqtobe',
            'Asia/Aqtau',
            'Asia/Atyrau',
            'Asia/Oral',
            'Asia/Beirut',
            'Asia/Colombo',
            'Africa/Monrovia',
            'Europe/Vilnius',
            'Europe/Luxembourg',
            'Europe/Riga',
            'Africa/Tripoli',
            'Africa/Casablanca',
            'Europe/Monaco',
            'Europe/Chisinau',
            'Pacific/Majuro',
            'Pacific/Kwajalein',
            'Asia/Yangon',
            'Asia/Ulaanbaatar',
            'Asia/Hovd',
            'Asia/Choibalsan',
            'Asia/Macau',
            'America/Martinique',
            'Europe/Malta',
            'Indian/Mauritius',
            'Indian/Maldives',
            'America/Mexico_City',
            'America/Cancun',
            'America/Merida',
            'America/Monterrey',
            'America/Matamoros',
            'America/Mazatlan',
            'America/Chihuahua',
            'America/Ojinaga',
            'America/Hermosillo',
            'America/Tijuana',
            'America/Bahia_Banderas',
            'Asia/Kuala_Lumpur',
            'Asia/Kuching',
            'Africa/Maputo',
            'Africa/Windhoek',
            'Pacific/Noumea',
            'Pacific/Norfolk',
            'Africa/Lagos',
            'America/Managua',
            'Europe/Amsterdam',
            'Europe/Oslo',
            'Asia/Kathmandu',
            'Pacific/Nauru',
            'Pacific/Niue',
            'Pacific/Auckland',
            'Pacific/Chatham',
            'America/Panama',
            'America/Lima',
            'Pacific/Tahiti',
            'Pacific/Marquesas',
            'Pacific/Gambier',
            'Pacific/Port_Moresby',
            'Pacific/Bougainville',
            'Asia/Manila',
            'Asia/Karachi',
            'Europe/Warsaw',
            'America/Miquelon',
            'Pacific/Pitcairn',
            'America/Puerto_Rico',
            'Asia/Gaza',
            'Asia/Hebron',
            'Europe/Lisbon',
            'Atlantic/Madeira',
            'Atlantic/Azores',
            'Pacific/Palau',
            'America/Asuncion',
            'Asia/Qatar',
            'Indian/Reunion',
            'Europe/Bucharest',
            'Europe/Belgrade',
            'Europe/Kaliningrad',
            'Europe/Moscow',
            'Europe/Simferopol',
            'Europe/Kirov',
            'Europe/Astrakhan',
            'Europe/Volgograd',
            'Europe/Saratov',
            'Europe/Ulyanovsk',
            'Europe/Samara',
            'Asia/Yekaterinburg',
            'Asia/Omsk',
            'Asia/Novosibirsk',
            'Asia/Barnaul',
            'Asia/Tomsk',
            'Asia/Novokuznetsk',
            'Asia/Krasnoyarsk',
            'Asia/Irkutsk',
            'Asia/Chita',
            'Asia/Yakutsk',
            'Asia/Khandyga',
            'Asia/Vladivostok',
            'Asia/Ust-Nera',
            'Asia/Magadan',
            'Asia/Sakhalin',
            'Asia/Srednekolymsk',
            'Asia/Kamchatka',
            'Asia/Anadyr',
            'Asia/Riyadh',
            'Pacific/Guadalcanal',
            'Indian/Mahe',
            'Africa/Khartoum',
            'Europe/Stockholm',
            'Asia/Singapore',
            'America/Paramaribo',
            'Africa/Juba',
            'Africa/Sao_Tome',
            'America/El_Salvador',
            'Asia/Damascus',
            'America/Grand_Turk',
            'Africa/Ndjamena',
            'Indian/Kerguelen',
            'Asia/Bangkok',
            'Asia/Dushanbe',
            'Pacific/Fakaofo',
            'Asia/Dili',
            'Asia/Ashgabat',
            'Africa/Tunis',
            'Pacific/Tongatapu',
            'Europe/Istanbul',
            'America/Port_of_Spain',
            'Pacific/Funafuti',
            'Asia/Taipei',
            'Europe/Kiev',
            'Europe/Uzhgorod',
            'Europe/Zaporozhye',
            'Pacific/Wake',
            'America/New_York',
            'America/Detroit',
            'America/Kentucky/Louisville',
            'America/Kentucky/Monticello',
            'America/Indiana/Indianapolis',
            'America/Indiana/Vincennes',
            'America/Indiana/Winamac',
            'America/Indiana/Marengo',
            'America/Indiana/Petersburg',
            'America/Indiana/Vevay',
            'America/Chicago',
            'America/Indiana/Tell_City',
            'America/Indiana/Knox',
            'America/Menominee',
            'America/North_Dakota/Center',
            'America/North_Dakota/New_Salem',
            'America/North_Dakota/Beulah',
            'America/Denver',
            'America/Boise',
            'America/Phoenix',
            'America/Los_Angeles',
            'America/Anchorage',
            'America/Juneau',
            'America/Sitka',
            'America/Metlakatla',
            'America/Yakutat',
            'America/Nome',
            'America/Adak',
            'Pacific/Honolulu',
            'America/Montevideo',
            'Asia/Samarkand',
            'Asia/Tashkent',
            'America/Caracas',
            'Asia/Ho_Chi_Minh',
            'Pacific/Efate',
            'Pacific/Wallis',
            'Pacific/Apia',
            'Africa/Johannesburg'
        ];
          
        let date = new Date;
        let arrMap = _arr.map(timeZone => {
            let utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
            let tzDate = new Date(date.toLocaleString('en-US', { timeZone: timeZone }));
            let offset = utcDate.getTime() - tzDate.getTime();
            let _tz = (offset/3600000)
            _tz = _tz != 0 ? (_tz * -1) : _tz;
            const _toReturn = {city: timeZone, timeZone: _tz};

            return _toReturn;
        })/* .sort((a, b) => { 
            if (a.timeZone < b.timeZone) {
                return -1;
            } else if (a.timeZone > b.timeZone) {
                return 1;
            }
            return 0;
        }) */;

        for (const _tz of arrMap) {
            _timeZones[_tz.city] = {value: _tz.timeZone, tz: (_tz.timeZone >= 0 ? "+" : "") + tzStr(_tz.timeZone)};
        }

        /* if(byCountry && _timeZones[byCountry]){
            return {[byCountry]: _timeZones[byCountry]};
        } else{
            console.warn(byCountry + " timezone not found");
        } */

        return _timeZones;
        //return Core._TimeZones;
    }
    /* public static set _TimeZones(value) {
        Core._TimeZones = value;
    } */

    static FieldMeta: {[key: string]: {
        /** to be displayed as alt text */
        icon?: string, 

        /** useful to represent a data that needs an uploader */
        isFile?: boolean

        /** to display image instead of url (string) */
        isImage?: boolean,

        /** password field? to encrypt the display */
        isPassword?: boolean

        /** email  */
        isEmail?: boolean,

        /** if a field is primary/foreign key  */
        isKeyId?: boolean,

        /** if a field url  */
        isUrl?: boolean,

        /** to convert true/false label to Yes/No  */
        isYesNo?: boolean,

        /** to provide list options */
        isList?: boolean,

        /** to show hierarchy map */
        isHierarchy?: boolean,

        /** to exclude display of fields from hierarchy except editting */
        foreignFrom?: string[],

        /** Replace the field label to be displayed */
        altLabel?: string,
        }} = {
        //"organization": {icon: PrimeIcons.SITEMAP, isList: true, isHierarchy: true, foreignFrom: ["dept", "teams"]},
        "organization": {icon: PrimeIcons.SITEMAP, isHierarchy: true, isList: true},
        "company": {icon: PrimeIcons.SITEMAP, isHierarchy: true, isList: true, foreignFrom: ["teams"]},
        "department": {icon: PrimeIcons.SITEMAP, isHierarchy: true, isList: true},
        "name": {icon: PrimeIcons.USER_EDIT},
        "password": {icon: PrimeIcons.KEY, isPassword: true},
        "is_superuser": {icon: PrimeIcons.USERS, isYesNo: true},
        "username": {icon: PrimeIcons.USER_EDIT},
        "first_name": {icon: PrimeIcons.USER_EDIT},
        "last_name": {icon: PrimeIcons.USER_EDIT},
        "email": {icon: PrimeIcons.AT, isEmail: true},
        "is_staff": {icon: PrimeIcons.USERS, isYesNo: true},
        "is_active": {icon: PrimeIcons.CHECK_CIRCLE, isYesNo: true},
        "date_joined": {icon: PrimeIcons.CALENDAR},
        "id": {icon: PrimeIcons.KEY, isKeyId: true},
        "country": {icon: PrimeIcons.FLAG},
        "app_metadata": {icon: PrimeIcons.SLIDERS_V},
        "blocked": {icon: PrimeIcons.BAN, isYesNo: true},
        "created_at": {icon: PrimeIcons.CALENDAR},
        "is_deactivated": {icon: PrimeIcons.MINUS_CIRCLE, isYesNo: true},
        "email_verified": {icon: 'pi pi-verified', isYesNo: true},
        "user_metadata": {icon: PrimeIcons.SLIDERS_V},
        "identities": {icon: PrimeIcons.USERS},
        "last_ip": {icon: PrimeIcons.WIFI},
        "last_login": {icon: PrimeIcons.CALENDAR},
        "last_password_reset": {icon: PrimeIcons.CALENDAR},
        "logins_count": {icon: 'pi pi-sort-numeric-up-alt'},
        "multifactor": {icon: PrimeIcons.QUESTION},
        "phone_number": {icon: PrimeIcons.PHONE},
        "phone_verified": {icon: 'pi pi-verified', isYesNo: true},
        "picture": {icon: 'fa fa-id-badge', isImage: true, isFile: true},
        "updated_at": {icon: PrimeIcons.CALENDAR},
        "user_id": {icon: PrimeIcons.USER, isKeyId: true},
        "provider": {icon: PrimeIcons.BRIEFCASE},
        "locale": {icon: 'pi pi-language'}, //TODO: upgrade PrimeNg
        "globalMenubarPref": {icon: PrimeIcons.BARS, isYesNo: true},
        "globalGridPref": {icon: PrimeIcons.TABLE, isYesNo: true},
        "globalChartPref": {icon: PrimeIcons.CHART_PIE, isYesNo: true},
        "globalScheme": {icon: PrimeIcons.SUN},
        "provision": {icon: PrimeIcons.CALENDAR},
        "provision_uri": {icon: PrimeIcons.AT, isUrl: true},
        "provision_verified": {icon: 'pi pi-verified', isYesNo: true},
        "addressBy": {icon: PrimeIcons.USER_EDIT},
        "title": {icon: PrimeIcons.TAG},
        "middle_name": {icon: PrimeIcons.USER_EDIT},
        "gender": {icon: 'fa fa-venus-mars'},
        "language": {icon: 'pi pi-language'},
        "date_of_birth": {icon: PrimeIcons.CALENDAR},
        "phone_number_mobile": {icon: PrimeIcons.CAMERA},
        "fax_number": {icon: 'fa fa-fax'},
        "website": {icon: PrimeIcons.CLOUD, isUrl: true},
        "banner": {icon: PrimeIcons.IMAGE, isImage: true},
        "job": {icon: PrimeIcons.BRIEFCASE},
        "user": {icon: PrimeIcons.USER, isHierarchy: true, isList: true},
        "address": {icon: PrimeIcons.BUILDING},
        "parent_id": {icon: PrimeIcons.SITEMAP, isHierarchy: true, isList: true, altLabel: "org_parent"},
        "legal_form": {icon: 'fa fa-file-contract'},
        "legal_name": {icon: 'fa fa-file-contract'},
        "preferred_name": {icon: 'fa fa-font'},
        "registration_no": {icon: 'fa fa-hashtag'},
        "vat_no": {icon: 'fa fa-hashtag'},
        "point_of_contact": {icon: PrimeIcons.USER},
        "abbreviation": {icon: 'fa fa-font'},
        "disclaimer": {icon: PrimeIcons.USER},
        "data_privacy": {icon: 'fa fa-exclamation'},
        "copyright": {icon: 'fa fa-copyright'},
        "terms_conditions": {icon: 'fa fa-file-contract'},
        "app_logo": {icon: 'fa fa-font-awesome', isImage: true},
        "app_background": {icon: PrimeIcons.IMAGE, isImage: true},
        "branding": {icon: 'fa fa-copyright'},
        "units": {icon: PrimeIcons.EURO},
        "is_vat_subject": {icon: PrimeIcons.EURO},
        }
    
    static setTranslations(locale: string) {
        if(locale == "tl"){
            locale = "pt-TL";
        }
        const primeNgTranslations : any = {
            startsWith            : Core.Localize('startsWith'),
            contains              : Core.Localize('contains'),
            notContains           : Core.Localize('notContains'),
            endsWith              : Core.Localize('endsWith'),
            equals                : Core.Localize('equals'),
            notEquals             : Core.Localize('notEquals'),
            noFilter              : Core.Localize('noFilter'),
            lt                    : Core.Localize('lt'),
            lte                   : Core.Localize('lte'),
            gt                    : Core.Localize('gt'),
            gte                   : Core.Localize('gte'),
            is                    : Core.Localize('is'),
            isNot                 : Core.Localize('isNot'),
            before                : Core.Localize('before'),
            after                 : Core.Localize('after'),
            dateIs                : Core.Localize('dateIs'),
            dateIsNot             : Core.Localize('dateIsNot'),
            dateBefore            : Core.Localize('dateBefore'),
            dateAfter             : Core.Localize('dateAfter'),
            clear                 : Core.Localize('clear'),
            apply                 : Core.Localize('apply'),
            matchAll              : Core.Localize('matchAll'),
            matchAny              : Core.Localize('matchAny'),
            addRule               : Core.Localize('addRule'),
            removeRule            : Core.Localize('removeRule'),
            accept                : Core.Localize('accept'),
            reject                : Core.Localize('reject'),
            choose                : Core.Localize('choose'),
            upload                : Core.Localize('upload'),
            cancel                : Core.Localize('cancel'),
            dayNames              : getLocaleDayNames(locale, 0, TranslationWidth.Wide),
            dayNamesShort         : getLocaleDayNames(locale, 0, TranslationWidth.Short),
            dayNamesMin           : getLocaleDayNames(locale, 0, TranslationWidth.Narrow),
            monthNames            : getLocaleMonthNames(locale, 0, TranslationWidth.Wide),
            monthNamesShort       : getLocaleMonthNames(locale, 0, TranslationWidth.Short),
            dateFormat            : getLocaleDateFormat(locale, FormatWidth.Full),
            timeFormat            : getLocaleTimeFormat(locale, FormatWidth.Full),
            dateTimeFormat        : getLocaleDateTimeFormat(locale, FormatWidth.Full),
            eraNames              : getLocaleEraNames(locale, TranslationWidth.Short),
            period                : getLocaleDayPeriods(locale, 0, TranslationWidth.Short),
            localeDirection       : getLocaleDirection(locale),
            currencyFormat        : getLocaleNumberFormat(locale, NumberFormatStyle.Currency),
            decimalFormat         : getLocaleNumberFormat(locale, NumberFormatStyle.Decimal),
            scientificFormat      : getLocaleNumberFormat(locale, NumberFormatStyle.Scientific),
            percentFormat         : getLocaleNumberFormat(locale, NumberFormatStyle.Percent),
            currency              : getLocaleCurrencyName(locale),
            currencyCode          : getLocaleCurrencyCode(locale),
            currencySymbol        : getLocaleCurrencySymbol(locale),
            firstDayOfWeek        : 0,
            today                 : Core.Localize("today"),
            weekHeader            : Core.Localize("weekHeader"),
            weak                  : Core.Localize("weak"),
            medium                : Core.Localize("medium"),
            strong                : Core.Localize("strong"),
            passwordPrompt        : Core.Localize("passwordPrompt"),
            emptyMessage          : Core.Localize("emptyMessage"),
            emptyFilterMessage    : Core.Localize("emptyFilterMessage"),
        }
        return primeNgTranslations;
    }
}