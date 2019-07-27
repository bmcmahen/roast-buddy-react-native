import countries from "i18n-iso-countries";

const convert = code => countries.getName(code, "en");

export default convert;
