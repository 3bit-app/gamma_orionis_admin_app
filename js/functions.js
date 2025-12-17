/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * functions v.2.0.0 (ESM)
 * 3bit.app | 2025
 */

const DEFAULT_COOKIE_PATH = "/gammaOrionis";

/* ------------------ Cookie Functions ------------------ */

export function setCookie(name, value, expiredays) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = `${encodeURIComponent(name)}=${encodeURI(value)}${
    expiredays === null ? "" : "; expires=" + exdate.toGMTString()
  }; path=${DEFAULT_COOKIE_PATH}; SameSite=None; Secure`;
}

export function getCookie(decodeName) {
  let cookie = "";
  const name = encodeURIComponent(decodeName);
  if (document.cookie.length > 0) {
    let index1 = document.cookie.indexOf(name + "="), index2;
    if (index1 !== -1) {
      index1 = index1 + name.length + 1;
      index2 = document.cookie.indexOf(";", index1);
      if (index2 === -1) index2 = document.cookie.length;
      cookie = decodeURI(document.cookie.substring(index1, index2));
    }
  }
  return cookie;
}

/* ------------------ URL Params ------------------ */

export function getParam(name) {
  let param = "";
  let str = window.location.href;
  const sharpIndex = str.indexOf("#");
  if (sharpIndex > -1) str = str.substring(0, sharpIndex);
  if (str.length > 0) {
    let index1 = str.indexOf(name + "="), index2;
    if (index1 !== -1) {
      index1 = index1 + name.length + 1;
      index2 = str.indexOf("&", index1);
      if (index2 === -1) index2 = str.length;
      param = decodeURIComponent(str.substring(index1, index2));
    }
  }
  return param;
}

export function getValueFromOneOfParam(name1, name2) {
  let value = "";
  if (name1) value = getParam("&" + name1);
  if (!value) value = getParam("?" + name1);
  if (value !== "") return value;
  if (name2) value = getParam("&" + name2);
  if (!value) value = getParam("?" + name2);
  return value;
}

/* ------------------ Data Encoding ------------------ */

export function encodeData(encode, data) {
  let encodedData = "";
  if (!encode?.length || !data?.length) return encodedData;
  const encodeSize = encode.length, dataSize = data.length;
  for (let i = 0; i < dataSize; i++) {
    encodedData += String.fromCharCode(
      data.charCodeAt(i) ^ encode.charCodeAt(i % encodeSize)
    );
  }
  return encodedData;
}

/* ------------------ Timezone ------------------ */

export function getTimezoneOffsetString() {
  const timezoneOffset = new Date().getTimezoneOffset();
  const absTimezoneOffset = Math.abs(timezoneOffset);
  let hours = String(parseInt(absTimezoneOffset / 60));
  let minutes = String(absTimezoneOffset % 60);
  const sign = timezoneOffset > 0 ? "-" : "+";
  if (hours.length === 1) hours = "0" + hours;
  if (minutes.length === 1) minutes = "0" + minutes;
  return `${sign}${hours}:${minutes}`;
}

export function getTimezoneName(timezoneOffset, countryCode) {
  if (!timezoneOffset && !countryCode) return "";
  const zones = countryCode ? moment.tz.zonesForCountry(countryCode) : moment.tz.names();
  for (const name of zones) {
    if (!timezoneOffset || timezoneOffset === moment.tz(name).format("Z")) {
      return name;
    }
  }
  return countryCode && zones.length > 0 ? zones[0] : "";
}

/* ------------------ Date Diff ------------------ */

export function getDaysBetweenDate(firstDatetime, secondDatetime, format, useFloat = false) {
  return moment(secondDatetime, format).diff(moment(firstDatetime, format), "days", useFloat);
}

export function getHoursBetweenDate(firstDatetime, secondDatetime, format, useFloat = false) {
  return moment(secondDatetime, format).diff(moment(firstDatetime, format), "hours", useFloat);
}

export function getMinutesBetweenDate(firstDatetime, secondDatetime, format, useFloat = false) {
  return moment(secondDatetime, format).diff(moment(firstDatetime, format), "minutes", useFloat);
}

/* ------------------ Validation ------------------ */

export function isEmailAddress(value) {
  return /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/.test(value);
}

export function isPhone(value) {
  return /^[0-9\-\+\(\)]+$/.test(value);
}

export function isDatetime(value) {
  return /^[0-9]+\.[0-9]+\.[0-9]+\ [0-9]+\:[0-9]+$/.test(value);
}

/* ------------------ Contains ------------------ */

export function isContainsValueOrEmpty(value) {
  if (value === null || value === undefined) return false;
  return typeof value === "number" || typeof value === "string";
}

export function isContainsValue(value) {
  if (value === null || value === undefined) return false;
  return typeof value === "number" || (typeof value === "string" && value.length > 0);
}

/* ------------------ Trimming ------------------ */

export const trimLeft = (str) => str.replace(/^\s+/, "");
export const trimRight = (str) => str.replace(/\s+$/, "");
export const trimAll = (str) => str.replace(/^\s+|\s+$/g, "");

/* ------------------ Strings ------------------ */

export function getStrBefore(str, before) {
  const ind = str.indexOf(before);
  return ind >= 0 ? str.substring(0, ind) : str;
}

export function getStrAfterBefore(str, after, before) {
  let indAfter = str.indexOf(after);
  let strAfter = str;
  if (indAfter >= 0) strAfter = str.substring(indAfter + after.length);
  const indBefore = strAfter.indexOf(before);
  return indBefore >= 0 ? strAfter.substring(0, indBefore) : strAfter;
}

export function toLower(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    result += c >= 65 && c <= 90 ? String.fromCharCode(c + 32) : str[i];
  }
  return result;
}

/* ------------------ MySQL Date Conversions ------------------ */

export function parseMySQLDatetime(datetimeString) {
  const [datePart, timePart] = datetimeString.split(" ");
  const [year, month, day] = datePart.split("-");
  const [hours = 0, minutes = 0, seconds = 0] = timePart ? timePart.split(":") : [];
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

export function toMySQLDatetimeString(datetimeString, dateFormat = "") {
  if (!datetimeString) return datetimeString;
  return dateFormat
    ? moment(datetimeString, dateFormat).format("YYYY-MM-DD HH:mm")
    : toMySQLDatetimeStringDefaultFormat(datetimeString);
}

export function toMySQLDatetimeStringDefaultFormat(datetimeString) {
  if (!datetimeString) return datetimeString;
  const [datePart, timePart] = datetimeString.split(" ");
  const [day, month, year] = datePart.split(".");
  if (!timePart) return `${year}-${month}-${day}`;
  const [hours, minutes] = timePart.split(":");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function toMySQLDateString(datetimeString, dateFormat = "") {
  if (!datetimeString) return datetimeString;
  return dateFormat
    ? moment(datetimeString, dateFormat).format("YYYY-MM-DD")
    : toMySQLDatetimeStringDefaultFormat(datetimeString);
}

export function fromMySQLDatetimeString(datetimeString, dateFormat = "") {
  if (!datetimeString) return datetimeString;
  return dateFormat
    ? moment(datetimeString, "YYYY-MM-DD HH:mm").format(dateFormat)
    : fromMySQLDatetimeStringDefaultFormat(datetimeString);
}

export function fromMySQLDateString(datetimeString, dateFormat = "") {
  if (!datetimeString) return datetimeString;
  return dateFormat
    ? moment(datetimeString, "YYYY-MM-DD").format(dateFormat)
    : fromMySQLDatetimeStringDefaultFormat(datetimeString);
}

export function fromMySQLDatetimeStringDefaultFormat(datetimeString) {
  if (!datetimeString) return datetimeString;
  const [datePart, timePart] = datetimeString.split(" ");
  const [year, month, day] = datePart.split("-");
  if (!timePart) return `${day}.${month}.${year}`;
  const [hours, minutes] = timePart.split(":");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

/* ------------------ Time Conversion ------------------ */

export function toMySQLDatetimeMilisec(datetimeString) {
  const [datePart, timePart] = datetimeString.split(" ");
  const [year, month, day] = datePart.split("-");
  const [hours = 0, minutes = 0, seconds = 0] = timePart ? timePart.split(":") : [];
  return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
}

export function toDatetimeString(datetimeInMilisec, dateFormat = "") {
  const date = new Date(datetimeInMilisec);
  return dateFormat
    ? moment(date).format(dateFormat)
    : toDatetimeStringDefaultFormat(datetimeInMilisec);
}

export function toDatetimeStringDefaultFormat(datetimeInMilisec) {
  const d = new Date(datetimeInMilisec);
  const pad = (n) => (n < 10 ? "0" + n : n);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function getCurrentDatetime(dateFormat = "") {
  const currDate = new Date();
  return dateFormat ? moment(currDate).format(dateFormat) : getCurrentDatetimeDefaultFormat();
}

export function getCurrentDatetimeDefaultFormat() {
  const now = new Date();
  const pad = (n) => (n < 10 ? "0" + n : n);
  return `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function toMySQLCurrentDate() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function toMySQLCurrentDatetime() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
}

/* ------------------ Country Location ------------------ */

export function getCountryLocation(countryCode) {
  const map = {
    AD: [42.546245, 1.601554], //Andorra
    AE: [23.424076, 53.847818], //United Arab Emirates
    AF: [33.93911, 67.709953], //Afghanistan
    AG: [17.060816, -61.796428], //Antigua and Barbuda
    AI: [18.220554, -63.068615], //Anguilla
    AL: [41.153332, 20.168331], //Albania
    AM: [40.069099, 45.038189], //Armenia
    AN: [12.226079, -69.060087], //Netherlands Antilles
    AO: [-11.202692, 17.873887], //Angola
    AQ: [-75.250973, -0.071389], //Antarctica
    AR: [-38.416097, -63.616672], //Argentina
    AS: [-14.270972, -170.132217], //American Samoa
    AT: [47.516231, 14.550072], //Austria
    AU: [-25.274398, 133.775136], //Australia
    AW: [12.52111, -69.968338], //Aruba
    AZ: [40.143105, 47.576927], //Azerbaijan
    BA: [43.915886, 17.679076], //Bosnia and Herzegovina
    BB: [13.193887, -59.543198], //Barbados
    BD: [23.684994, 90.356331], //Bangladesh
    BE: [50.503887, 4.469936], //Belgium
    BF: [12.238333, -1.561593], //Burkina Faso
    BG: [42.733883, 25.48583], //Bulgaria
    BH: [25.930414, 50.637772], //Bahrain
    BI: [-3.373056, 29.918886], //Burundi
    BJ: [9.30769, 2.315834], //Benin
    BM: [32.321384, -64.75737], //Bermuda
    BN: [4.535277, 114.727669], //Brunei
    BO: [-16.290154, -63.588653], //Bolivia
    BR: [-14.235004, -51.92528], //Brazil
    BS: [25.03428, -77.39628], //Bahamas
    BT: [27.514162, 90.433601], //Bhutan
    BV: [-54.423199, 3.413194], //Bouvet Island
    BW: [-22.328474, 24.684866], //Botswana
    BY: [53.709807, 27.953389], //Belarus
    BZ: [17.189877, -88.49765], //Belize
    CA: [56.130366, -106.346771], //Canada
    CC: [-12.164165, 96.870956], //Cocos [Keeling] Islands
    CD: [-4.038333, 21.758664], //Congo [DRC]
    CF: [6.611111, 20.939444], //Central African Republic
    CG: [-0.228021, 15.827659], //Congo [Republic]
    CH: [46.818188, 8.227512], //Switzerland
    CI: [7.539989, -5.54708], //Côte d'Ivoire
    CK: [-21.236736, -159.777671], //Cook Islands
    CL: [-35.675147, -71.542969], //Chile
    CM: [7.369722, 12.354722], //Cameroon
    CN: [35.86166, 104.195397], //China
    CO: [4.570868, -74.297333], //Colombia
    CR: [9.748917, -83.753428], //Costa Rica
    CU: [21.521757, -77.781167], //Cuba
    CV: [16.002082, -24.013197], //Cape Verde
    CX: [-10.447525, 105.690449], //Christmas Island
    CY: [35.126413, 33.429859], //Cyprus
    CZ: [49.817492, 15.472962], //Czech Republic
    DE: [51.165691, 10.451526], //Germany
    DJ: [11.825138, 42.590275], //Djibouti
    DK: [56.26392, 9.501785], //Denmark
    DM: [15.414999, -61.370976], //Dominica
    DO: [18.735693, -70.162651], //Dominican Republic
    DZ: [28.033886, 1.659626], //Algeria
    EC: [-1.831239, -78.183406], //Ecuador
    EE: [58.595272, 25.013607], //Estonia
    EG: [26.820553, 30.802498], //Egypt
    EH: [24.215527, -12.885834], //Western Sahara
    ER: [15.179384, 39.782334], //Eritrea
    ES: [40.463667, -3.74922], //Spain
    ET: [9.145, 40.489673], //Ethiopia
    FI: [61.92411, 25.748151], //Finland
    FJ: [-16.578193, 179.414413], //Fiji
    FK: [-51.796253, -59.523613], //Falkland Islands [Islas Malvinas]
    FM: [7.425554, 150.550812], //Micronesia
    FO: [61.892635, -6.911806], //Faroe Islands
    FR: [46.227638, 2.213749], //France
    GA: [-0.803689, 11.609444], //Gabon
    GB: [55.378051, -3.435973], //United Kingdom
    GD: [12.262776, -61.604171], //Grenada
    GE: [42.315407, 43.356892], //Georgia
    GF: [3.933889, -53.125782], //French Guiana
    GG: [49.465691, -2.585278], //Guernsey
    GH: [7.946527, -1.023194], //Ghana
    GI: [36.137741, -5.345374], //Gibraltar
    GL: [71.706936, -42.604303], //Greenland
    GM: [13.443182, -15.310139], //Gambia
    GN: [9.945587, -9.696645], //Guinea
    GP: [16.995971, -62.067641], //Guadeloupe
    GQ: [1.650801, 10.267895], //Equatorial Guinea
    GR: [39.074208, 21.824312], //Greece
    GS: [-54.429579, -36.587909], //South Georgia and the South Sandwich Islands
    GT: [15.783471, -90.230759], //Guatemala
    GU: [13.444304, 144.793731], //Guam
    GW: [11.803749, -15.180413], //Guinea-Bissau
    GY: [4.860416, -58.93018], //Guyana
    GZ: [31.354676, 34.308825], //Gaza Strip
    HK: [22.396428, 114.109497], //Hong Kong
    HM: [-53.08181, 73.504158], //Heard Island and McDonald Islands
    HN: [15.199999, -86.241905], //Honduras
    HR: [45.1, 15.2], //Croatia
    HT: [18.971187, -72.285215], //Haiti
    HU: [47.162494, 19.503304], //Hungary
    ID: [-0.789275, 113.921327], //Indonesia
    IE: [53.41291, -8.24389], //Ireland
    IL: [31.046051, 34.851612], //Israel
    IM: [54.236107, -4.548056], //Isle of Man
    IN: [20.593684, 78.96288], //India
    IO: [-6.343194, 71.876519], //British Indian Ocean Territory
    IQ: [33.223191, 43.679291], //Iraq
    IR: [32.427908, 53.688046], //Iran
    IS: [64.963051, -19.020835], //Iceland
    IT: [41.87194, 12.56738], //Italy
    JE: [49.214439, -2.13125], //Jersey
    JM: [18.109581, -77.297508], //Jamaica
    JO: [30.585164, 36.238414], //Jordan
    JP: [36.204824, 138.252924], //Japan
    KE: [-0.023559, 37.906193], //Kenya
    KG: [41.20438, 74.766098], //Kyrgyzstan
    KH: [12.565679, 104.990963], //Cambodia
    KI: [-3.370417, -168.734039], //Kiribati
    KM: [-11.875001, 43.872219], //Comoros
    KN: [17.357822, -62.782998], //Saint Kitts and Nevis
    KP: [40.339852, 127.510093], //North Korea
    KR: [35.907757, 127.766922], //South Korea
    KW: [29.31166, 47.481766], //Kuwait
    KY: [19.513469, -80.566956], //Cayman Islands
    KZ: [48.019573, 66.923684], //Kazakhstan
    LA: [19.85627, 102.495496], //Laos
    LB: [33.854721, 35.862285], //Lebanon
    LC: [13.909444, -60.978893], //Saint Lucia
    LI: [47.166, 9.555373], //Liechtenstein
    LK: [7.873054, 80.771797], //Sri Lanka
    LR: [6.428055, -9.429499], //Liberia
    LS: [-29.609988, 28.233608], //Lesotho
    LT: [55.169438, 23.881275], //Lithuania
    LU: [49.815273, 6.129583], //Luxembourg
    LV: [56.879635, 24.603189], //Latvia
    LY: [26.3351, 17.228331], //Libya
    MA: [31.791702, -7.09262], //Morocco
    MC: [43.750298, 7.412841], //Monaco
    MD: [47.411631, 28.369885], //Moldova
    ME: [42.708678, 19.37439], //Montenegro
    MG: [-18.766947, 46.869107], //Madagascar
    MH: [7.131474, 171.184478], //Marshall Islands
    MK: [41.608635, 21.745275], //Macedonia [FYROM]
    ML: [17.570692, -3.996166], //Mali
    MM: [21.913965, 95.956223], //Myanmar [Burma]
    MN: [46.862496, 103.846656], //Mongolia
    MO: [22.198745, 113.543873], //Macau
    MP: [17.33083, 145.38469], //Northern Mariana Islands
    MQ: [14.641528, -61.024174], //Martinique
    MR: [21.00789, -10.940835], //Mauritania
    MS: [16.742498, -62.187366], //Montserrat
    MT: [35.937496, 14.375416], //Malta
    MU: [-20.348404, 57.552152], //Mauritius
    MV: [3.202778, 73.22068], //Maldives
    MW: [-13.254308, 34.301525], //Malawi
    MX: [23.634501, -102.552784], //Mexico
    MY: [4.210484, 101.975766], //Malaysia
    MZ: [-18.665695, 35.529562], //Mozambique
    NA: [-22.95764, 18.49041], //Namibia
    NC: [-20.904305, 165.618042], //New Caledonia
    NE: [17.607789, 8.081666], //Niger
    NF: [-29.040835, 167.954712], //Norfolk Island
    NG: [9.081999, 8.675277], //Nigeria
    NI: [12.865416, -85.207229], //Nicaragua
    NL: [52.132633, 5.291266], //Netherlands
    NO: [60.472024, 8.468946], //Norway
    NP: [28.394857, 84.124008], //Nepal
    NR: [-0.522778, 166.931503], //Nauru
    NU: [-19.054445, -169.867233], //Niue
    NZ: [-40.900557, 174.885971], //New Zealand
    OM: [21.512583, 55.923255], //Oman
    PA: [8.537981, -80.782127], //Panama
    PE: [-9.189967, -75.015152], //Peru
    PF: [-17.679742, -149.406843], //French Polynesia
    PG: [-6.314993, 143.95555], //Papua New Guinea
    PH: [12.879721, 121.774017], //Philippines
    PK: [30.375321, 69.345116], //Pakistan
    PL: [51.919438, 19.145136], //Poland
    PM: [46.941936, -56.27111], //Saint Pierre and Miquelon
    PN: [-24.703615, -127.439308], //Pitcairn Islands
    PR: [18.220833, -66.590149], //Puerto Rico
    PS: [31.952162, 35.233154], //Palestinian Territories
    PT: [39.399872, -8.224454], //Portugal
    PW: [7.51498, 134.58252], //Palau
    PY: [-23.442503, -58.443832], //Paraguay
    QA: [25.354826, 51.183884], //Qatar
    RE: [-21.115141, 55.536384], //Réunion
    RO: [45.943161, 24.96676], //Romania
    RS: [44.016521, 21.005859], //Serbia
    RU: [61.52401, 105.318756], //Russia
    RW: [-1.940278, 29.873888], //Rwanda
    SA: [23.885942, 45.079162], //Saudi Arabia
    SB: [-9.64571, 160.156194], //Solomon Islands
    SC: [-4.679574, 55.491977], //Seychelles
    SD: [12.862807, 30.217636], //Sudan
    SE: [60.128161, 18.643501], //Sweden
    SG: [1.352083, 103.819836], //Singapore
    SH: [-24.143474, -10.030696], //Saint Helena
    SI: [46.151241, 14.995463], //Slovenia
    SJ: [77.553604, 23.670272], //Svalbard and Jan Mayen
    SK: [48.669026, 19.699024], //Slovakia
    SL: [8.460555, -11.779889], //Sierra Leone
    SM: [43.94236, 12.457777], //San Marino
    SN: [14.497401, -14.452362], //Senegal
    SO: [5.152149, 46.199616], //Somalia
    SR: [3.919305, -56.027783], //Suriname
    ST: [0.18636, 6.613081], //São Tomé and Príncipe
    SV: [13.794185, -88.89653], //El Salvador
    SY: [34.802075, 38.996815], //Syria
    SZ: [-26.522503, 31.465866], //Swaziland
    TC: [21.694025, -71.797928], //Turks and Caicos Islands
    TD: [15.454166, 18.732207], //Chad
    TF: [-49.280366, 69.348557], //French Southern Territories
    TG: [8.619543, 0.824782], //Togo
    TH: [15.870032, 100.992541], //Thailand
    TJ: [38.861034, 71.276093], //Tajikistan
    TK: [-8.967363, -171.855881], //Tokelau
    TL: [-8.874217, 125.727539], //Timor-Leste
    TM: [38.969719, 59.556278], //Turkmenistan
    TN: [33.886917, 9.537499], //Tunisia
    TO: [-21.178986, -175.198242], //Tonga
    TR: [38.963745, 35.243322], //Turkey
    TT: [10.691803, -61.222503], //Trinidad and Tobago
    TV: [-7.109535, 177.64933], //Tuvalu
    TW: [23.69781, 120.960515], //Taiwan
    TZ: [-6.369028, 34.888822], //Tanzania
    UA: [48.379433, 31.16558], //Ukraine
    UG: [1.373333, 32.290275], //Uganda
    UM: [0, 0], //U.S. Minor Outlying Islands
    US: [37.09024, -95.712891], //United States
    UY: [-32.522779, -55.765835], //Uruguay
    UZ: [41.377491, 64.585262], //Uzbekistan
    VA: [41.902916, 12.453389], //Vatican City
    VC: [12.984305, -61.287228], //Saint Vincent and the Grenadines
    VE: [6.42375, -66.58973], //Venezuela
    VG: [18.420695, -64.639968], //British Virgin Islands
    VI: [18.335765, -64.896335], //U.S. Virgin Islands
    VN: [14.058324, 108.277199], //Vietnam
    VU: [-15.376706, 166.959158], //Vanuatu
    WF: [-13.768752, -177.156097], //Wallis and Futuna
    WS: [-13.759029, -172.104629], //Samoa
    XK: [42.602636, 20.902977], //Kosovo
    YE: [15.552727, 48.516388], //Yemen
    YT: [-12.8275, 45.166244], //Mayotte
    ZA: [-30.559482, 22.937506], //South Africa
    ZM: [-13.133897, 27.849332], //Zambia
    ZW: [-19.015438, 29.154857], //Zimbabwe
  };
  return map[countryCode] || null;
}

/* ------------------ Distance and Traffic ------------------ */

const LatMeters = [
  110576,110577,110578,110579,110582,110585,110588,110593,110598,110604,
  110610,110617,110624,110633,110641,110652,110661,110671,110682,110694,
  110706,110719,110732,110746,110760,110775,110790,110806,110821,110838,
  110854,110871,110889,110906,110924,110943,110961,110980,110998,111017,
  111037,111056,111075,111095,111114,111134,111153,111173,111192,111212,
  111231,111250,111269,111288,111307,111325,111344,111362,111379,111397,
  111414,111431,111447,111463,111479,111494,111509,111524,111538,111551,
  111564,111576,111588,111599,111610,111620,111630,111639,111647,111655,
  111662,111668,111674,111679,111683,111687,111690,111693,111694,111695,111696
];

const LngMeters = [
  111321,111305,111254,111170,111052,110901,110716,110497,110245,109960,
  109641,109289,108904,108487,108036,107552,107036,106488,105907,105294,
  104649,103972,103264,102524,101754,100952,100119,99257,98364,97441,
  96488,95506,94495,93455,92386,91290,90165,89013,87834,86628,
  85395,84137,82852,81542,80208,78848,77465,76057,74627,73173,
  71697,70199,68679,67138,65577,63995,62394,60773,59134,57476,
  55801,54108,52399,50674,48933,47176,45405,43621,41822,40011,
  38187,36352,34505,32647,30780,28902,27016,25122,23219,21310,
  19394,17472,15544,13612,11675,9735,7791,5846,3898,1949,0
];

export function getMeters(lat1, lng1, lat2, lng2) {
  const lat1Deg = Math.floor(Number(lat1));
  const lng1Deg = Math.floor(Number(lng1));
  const lat2Deg = Math.floor(Number(lat2));
  const lng2Deg = Math.floor(Number(lng2));
  if (
    lat1Deg < 0 || lat1Deg > 90 ||
    lng1Deg < 0 || lng1Deg > 90 ||
    lat2Deg < 0 || lat2Deg > 90 ||
    lng2Deg < 0 || lng2Deg > 90
  ) return 0;

  const latMeters =
    lat1Deg !== lat2Deg
      ? ((LatMeters[lat1Deg] + LatMeters[lat2Deg]) / 2)
      : LatMeters[lat1Deg];
  const lngMeters =
    lng1Deg !== lng2Deg
      ? ((LngMeters[lng1Deg] + LngMeters[lng2Deg]) / 2)
      : LngMeters[lng1Deg];

  const lat = (Number(lat1) - Number(lat2)) * latMeters;
  const lng = (Number(lng1) - Number(lng2)) * lngMeters;
  return Math.sqrt(lat * lat + lng * lng);
}

const rad = (x) => x * Math.PI / 180;

export function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6378137; // Earth's mean radius in meters
  const dLat = rad(Number(lat1) - Number(lat2));
  const dLng = rad(Number(lng1) - Number(lng2));
  const val1 = Math.sin(dLat / 2);
  const val2 = Math.sin(dLng / 2);
  const a = val1 * val1 +
            Math.cos(rad(Number(lat1))) * Math.cos(rad(Number(lat2))) * val2 * val2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ------------------ Polygon and Figure ------------------ */

export function isPointInsidePolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function verifyPointInFigure(x, y, figureX, figureY) {
  let inFigure = 0;
  for (let i = 0, j = figureX.length - 1; i < figureX.length; i++) {
    if (
      (figureY[i] < y && figureY[j] >= y ||
        figureY[j] < y && figureY[i] >= y) &&
      (figureX[i] <= x || figureX[j] <= x)
    ) {
      inFigure ^=
        figureX[i] +
          ((y - figureY[i]) / (figureY[j] - figureY[i])) *
            (figureX[j] - figureX[i]) <
        x;
    }
    j = i;
  }
  return inFigure;
}

/* ------------------ Fuel Consumption ------------------ */

const FuelCoLow = [4, 5, 6, 8, 10];
const FuelCoMid = [5, 6, 8, 10, 12];
const FuelCoHigh = [6, 8, 10, 12, 14];

export function getFuelConsumption(transportType, speed, traffic) {
  let fuelCo;
  let index = 0;
  if (speed <= 30) index = 0;
  else if (speed <= 60) index = 1;
  else if (speed <= 90) index = 2;
  else if (speed <= 100) index = 3;
  else if (speed <= 110) index = 4;
  else index = 5;

  switch (transportType) {
    case 1:
      fuelCo = FuelCoMid[index];
      break;
    case 0:
    case 2:
      fuelCo = FuelCoLow[index];
      break;
    case 3:
      fuelCo = FuelCoHigh[index];
      break;
  }
  return (traffic / 100) * fuelCo;
}

/* ------------------ Time Estimate ------------------ */

export const DRIVING_ESTIMATE_CRITERIA = 200; // meters per minute
export const DELIVERING_ESTIMATE_CRITERIA = 300;
export const WALKING_ESTIMATE_CRITERIA = 100;

export function estimateDrivingTime(lat1, lng1, lat2, lng2, criteria = DRIVING_ESTIMATE_CRITERIA) {
  const meters = getDistance(lat1, lng1, lat2, lng2);
  return meters / criteria; // in minutes
}

export function estimateWalkingTime(distance, criteria = WALKING_ESTIMATE_CRITERIA) {
  return distance / criteria; // in minutes
}

/* ------------------ Color ------------------ */

export function hexToRGBA(hex, alpha = 1) {
  hex = ("" + hex).trim().replace(/#/g, "");
  if (!/^(?:[0-9a-fA-F]{3}){1,2}$/.test(hex)) throw new Error("not a valid hex string");
  if (hex.length === 3)
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  const bInt = parseInt(hex, 16);
  return `rgba(${(bInt >> 16) & 255}, ${(bInt >> 8) & 255}, ${bInt & 255}, ${alpha})`;
}

/* ------------------ Currency ------------------ */

export function numberToCurrency(number, decimalSeparator = ".", thousandsSeparator = "", nDecimalDigits = 2) {
  const fixed = number.toFixed(nDecimalDigits);
  const parts = new RegExp(
    `^(-?\\d{1,3})((?:\\d{3})+)(\\.(\\d{${nDecimalDigits}}))?$`
  ).exec(fixed);
  if (parts) {
    return (
      parts[1] +
      parts[2].replace(/\d{3}/g, thousandsSeparator + "$&") +
      (parts[4] ? decimalSeparator + parts[4] : "")
    );
  } else {
    return fixed.replace(".", decimalSeparator);
  }
}

/* ------------------ Admin Panel Parser ------------------ */

export function adminParsePattern(ptr, pattern, ext) {
  let parsedPattern = "";
  const regex = /\{\{(.*?)\}\}/g;
  const parts = pattern.split(regex);
  if (Array.isArray(ptr)) {
    for (let j = 0; j < ptr.length; j++) {
      if (ext) Object.assign(ptr[j], ext);
      parsedPattern += adminParseParts(ptr[j], parts);
    }
  } else {
    if (ext) Object.assign(ptr, ext);
    parsedPattern += adminParseParts(ptr, parts);
  }
  return parsedPattern === "" ? pattern : adminParsePatternSelect(parsedPattern);
}

function adminParseParts(obj, parts) {
  let parsedParts = "";
  if (obj && parts.length > 0) {
    for (let j = 0; j < parts.length; j++) {
      if (j % 2 === 0) {
        parsedParts += parts[j];
      } else {
        const name = parts[j];
        let value = name.indexOf("obj.") >= 0 ? eval(name) : obj[name];
        if (value == null) value = "";
        else if (typeof value === "string")
          value = value.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        parsedParts += value;
      }
    }
  }
  return parsedParts;
}

export function adminParsePatternSelect(pattern) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = pattern;
  const selects = tempDiv.querySelectorAll("select");
  selects.forEach((select) => {
    const options = eval(select.getAttribute("options"));
    const optionSelected = select.getAttribute("option_selected");
    const optionValue = select.getAttribute("option_value");
    const optionName = select.getAttribute("option_name");
    if (Array.isArray(options)) {
      select.innerHTML = options
        .map((obj) => {
          const value = obj[optionValue];
          const name =
            optionName.indexOf("obj.") >= 0 ? eval(optionName) : obj[optionName];
          return `<option value="${value}" ${
            optionSelected == value ? "selected" : ""
          }>${name}</option>`;
        })
        .join("");
    }
  });
  return tempDiv.innerHTML;
}

/* ------------------ Random ------------------ */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ------------------- UUID ------------------- */
export function generateUUID() {
  let d = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/*
export async function fetchJSON(url, options = {}) {
  const response = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}
 */