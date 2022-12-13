require("dotenv").config();
const moment = require("moment");
const dateFormatString1 = "YYYY-MM-DD";
const dateFormatString2 = "DD-MMM-YYYY";
const dateTimeFormatString = "DD-MMM-YYYY hh:mm A";

exports.SKey = "SBSFinosys2020";
exports.JWT_KEY = "Finosys@GLSYS123!";
exports.webport = process.env.PORT;
exports.JWT_KEY = process.env.JWT_KEY;
exports.SecretKey = process.env.SecretKey;

exports.username = '';
exports.password = '';
exports.database = '';
exports.host = '';
exports.port = '';

exports.MomentformatDate = (dateObject) => {
  let d = new Date(dateObject);
  let date = moment(d.toISOString()).format(dateFormatString2);
  return date;
};

exports.MomentformatDateTime = (dateObject) => {
  let d = new Date(dateObject);
  return moment(d.toISOString()).format(dateTimeFormatString);
};

exports.FormatDateTime = (req) => {
  try {
    if (req === null || req === "" || req === undefined) {
      return "";
    } else {
      let ADate = req.split("T");
      let ADate1 = ADate[1].split(".");
      let time = ADate1[0]
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [ADate1[0]];
      if (time.length > 1) {
        time = time.slice(1);
        time[5] = +time[0] < 12 ? " AM" : " PM";
        time[0] = +time[0] % 12 || 12;
      }
      let Time = time.join("");

      let d = req.slice(0, 10).split("-");
      return d[1] + "/" + d[2] + "/" + d[0] + " " + Time;
    }
  } catch (ex) {
    console.log(ex);
  }
};

exports.NumberFormat = (req, resp) => {
  let fieldvalue = 0.0;

  if (typeof req === "string" || req instanceof String) {
    fieldvalue = req.replace(/,/g, "");
  } else {
    fieldvalue = req;
  }

  return parseFloat(fieldvalue);
};

exports.currencyFormat = (req, resp) => {
  let fieldvalue;
  if (req === null || req === undefined || req === "NaN" || req === "") {
    fieldvalue = 0.0;
  } else {
    fieldvalue = req.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  return fieldvalue;
};

exports.validateBoolfield = (req, resp) => {
  let fieldvalue;

  if (req === null || req === undefined || req === "") {
    fieldvalue = false;
  } else {
    fieldvalue = req;
  }
  return fieldvalue;
};

exports.validatefield = (req, resp) => {
  let fieldvalue;
  if (req === null || req === undefined) {
    fieldvalue = "";
  } else {
    fieldvalue = req;
  }
  return fieldvalue;
};

exports.validateintfield = (req, resp) => {
  let fieldvalue;
  if (req === null || req === undefined || req === "") {
    fieldvalue = 0;
  } else {
    fieldvalue = parseInt(req);
  }
  return fieldvalue;
};

exports.validatedecfield = (req, resp) => {
  let fieldvalue;
  if (req === null || req === undefined) {
    fieldvalue = 0;
  } else {
    fieldvalue = Number(req);
  }
  return fieldvalue;
};

exports.validateDateTimefield = (req) => {
  let fieldvalue = "";
  let options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  if (req === null || req === undefined || req === "") {
    fieldvalue = new Date(1900, "01", "01");
  } else {
    fieldvalue = new Date(req).toLocaleDateString("en-US", options);
  }
  return fieldvalue;
};

exports.validateDatefield = (req) => {
  let fieldvalue = "";
  let options = { year: "numeric", month: "numeric", day: "numeric" };
  if (req === null || req === undefined || req === "") {
    fieldvalue = null;
  } else {
    fieldvalue = new Date(req).toLocaleDateString("en-US", options);
  }
  return fieldvalue;
};

exports.validateTimefield = (date) => {
  let ADate = date.split("T");
  let ADate1 = ADate[1].split(".");
  let time = ADate1[0]
    .toString()
    .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [ADate1[0]];
  if (time.length > 1) {
    time = time.slice(1);
    time[5] = +time[0] < 12 ? " AM" : " PM";
    time[0] = +time[0] % 12 || 12;
  }
  return time.join("");
};

exports.validatedecimalfield = (req, resp) => {
  let fieldvalue;
  if (
    req === null ||
    req === undefined ||
    req === "NaN" ||
    req === "" ||
    req === "0.00" ||
    req === "NaN" ||
    req === 0
  ) {
    fieldvalue = 0.0;
  } else {
    fieldvalue = parseFloat(req.toString().replace(/,/g, "")).toFixed(2);
  }
  return fieldvalue;
};

exports.FormatDate = (req, resp) => {
  let FDate = new Date(req);
  return (
    ("0" + (FDate.getDate() + 1)).slice(-2) +
    "/" +
    ("0" + FDate.getMonth()).slice(-2) +
    "/" +
    FDate.getFullYear()
  );
};

exports.StringFormatDate = (req) => {
  let fieldvalue = 0;

  if (req === null || req === undefined) {
    fieldvalue = "";
  } else {
    let FDate = new Date(req);

    let dd = FDate.getDate();

    let mm = FDate.getMonth() + 1;
    let mmm = FDate.toLocaleString("en-us", { month: "short" });
    let yyyy = FDate.getFullYear().toString();
    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    fieldvalue = dd + "-" + mmm + "-" + yyyy;
  }
  return fieldvalue;
};

exports.calculateAge = (dateString) => {
  let now = new Date();
  let yearNow = now.getYear();
  let monthNow = now.getMonth();
  let dateNow = now.getDate();
  let dob = new Date(dateString);
  let yearDob = dob.getYear();
  let monthDob = dob.getMonth();
  let dateDob = dob.getDate();
  let age = {};
  let ageString = "";
  let yearString = "";
  let monthString = "";
  let dayString = "";
  let dateAge;
  let yearAge = yearNow - yearDob;
  let monthAge;

  if (monthNow >= monthDob) {
    monthAge = monthNow - monthDob;
  } else {
    yearAge--;
    monthAge = 12 + monthNow - monthDob;
  }

  if (dateNow >= dateDob) dateAge = dateNow - dateDob;
  else {
    monthAge--;
    dateAge = 31 + dateNow - dateDob;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }

  age = {
    years: yearAge,
    months: monthAge,
    days: dateAge,
  };

  if (age.years > 1) yearString = " years";
  else yearString = " year";
  if (age.months > 1) monthString = " months";
  else monthString = " month";
  if (age.days > 1) dayString = " days";
  else dayString = " day";

  if (age.years > 0 && age.months > 0 && age.days > 0)
    ageString =
      age.years +
      yearString +
      ", " +
      age.months +
      monthString +
      ", and " +
      age.days +
      dayString +
      " old.";
  else if (age.years == 0 && age.months == 0 && age.days > 0)
    ageString = "Only " + age.days + dayString + " old!";
  else if (age.years > 0 && age.months == 0 && age.days == 0)
    ageString = age.years + yearString + " old.";
  else if (age.years > 0 && age.months > 0 && age.days == 0)
    ageString =
      age.years + yearString + " and " + age.months + monthString + " old.";
  else if (age.years == 0 && age.months > 0 && age.days > 0)
    ageString =
      age.months + monthString + " and " + age.days + dayString + " old.";
  else if (age.years > 0 && age.months == 0 && age.days > 0)
    ageString =
      age.years + yearString + " and " + age.days + dayString + " old.";
  else if (age.years == 0 && age.months > 0 && age.days == 0)
    ageString = age.months + monthString + " old.";
  else ageString = "Oops! Could not calculate age!";

  return ageString;
};

exports.groupbykeys = (arr, groupKeys, sumKeys) => {
  let hash = Object.create(null),
    grouped = [];
  arr.forEach(function (o) {
    let key = groupKeys
      .map(function (k) {
        return o[k];
      })
      .join("|");
    if (!hash[key]) {
      hash[key] = Object.keys(o).reduce((result, key) => {
        result[key] = o[key];
        if (sumKeys.includes(key)) result[key] = 0;
        return result;
      }, {}); //map_(o) //{ shape: o.shape, color: o.color, used: 0, instances: 0 };
      grouped.push(hash[key]);
    }
    sumKeys.forEach(function (k) {
      hash[key][k] += o[k];
    });
  });
  return grouped;
};
