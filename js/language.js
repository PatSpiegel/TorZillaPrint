/* TABLE:  Language & Locale / Time Zone & Date Format / Geolocation */

'use strict';

// functions
function cleanify(data){
  return data.map(function(entry){return entry.value;}).join("");
};
// date/time variables
var dateUsed = new Date("January 30, 2019 13:00:00");
var dateOld = new Date("July 30, 2018 13:00:00");
var dateFormatted = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" });
var rOptions = dateFormatted.resolvedOptions();
// date/time format options
var dateOpt = { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" };

function outputLanguage() {
  // language
  dom.nLanguages = navigator.languages;
  dom.nLanguage = navigator.language;
  dom.nLanguages0 = navigator.languages[0];
  // locale
  dom.localeIPR = new Intl.PluralRules().resolvedOptions().locale;
  dom.localeRO = rOptions.locale;
  // timezone
  dom.tzOffsets = dateUsed.getTimezoneOffset()+ ' | ' + dateOld.getTimezoneOffset();
  dom.tzRO = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // date/time
  dom.dateSystem = dateUsed;
  dom.dateString = dateUsed.toString();
  // long versions
  dom.lngdateLS = dateUsed.toLocaleString(undefined, dateOpt);
  dom.lngdateLDS = dateUsed.toLocaleDateString(undefined, dateOpt);
  dom.lngdateLTS = dateUsed.toLocaleTimeString(undefined, dateOpt);
  dom.lngdateIDTF = Intl.DateTimeFormat(undefined, dateOpt).format(dateUsed);
  dom.dateFTP = cleanify(dateFormatted.formatToParts(dateUsed));
  // various
  dom.dateGMT = dateUsed.toGMTString();;
  dom.dateUTC = dateUsed.toUTCString();
  dom.dateLS = dateUsed.toLocaleString();
  dom.dateTAtoLS = [dateUsed].toLocaleString();
  dom.dateLDS = dateUsed.toLocaleDateString();
  dom.dateIDTF = Intl.DateTimeFormat().format(dateUsed);
  dom.dateLTS = dateUsed.toLocaleTimeString();
  dom.dateTS = dateUsed.toTimeString();
  dom.numFTP = JSON.stringify(new Intl.NumberFormat().formatToParts(1000)[1]);
  dom.hourRO = new Intl.DateTimeFormat(undefined, {hour: "numeric"}).resolvedOptions().hourCycle;
  try {
    // return "7 days ago, yesterday, tomorrow, next month, in 2 years" in your locale
    const rtf = new Intl.RelativeTimeFormat(undefined, { style: 'long', numeric: `auto` });
    dom.dateIRTF = rtf.format(-7, "day") +", "+ rtf.format(-1, "day") +", "+
      rtf.format(1, "day") +", "+ rtf.format(1, "month") +", "+ rtf.format(2, "year");
    }
  catch(e) {dom.dateIRTF = "error: " + e.name};
  // calendar
  dom.calendarRO = rOptions.calendar;
  // numbering
  dom.numsysRO = rOptions.numberingSystem;
  // geo
  if ("geolocation" in navigator) {dom.nGeolocation="yes"} else (dom.nGeolocation="no");
  navigator.permissions.query({name:"geolocation"}).then(e => dom.pGeolocation=e.state);
};

outputLanguage();
