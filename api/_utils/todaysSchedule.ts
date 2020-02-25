import cheerio from "cheerio";
import axios from "axios";
import fs from "fs";
import path from "path";

import stringifyCookie from "./stringifyCookie";
import {
  wodCookie,
  todaysSchedule,
  formData,
  tmpFormValueFilename,
  BOWERY_CROSSFIT_GYM_NAME
} from "./constants";

const getTodaysWod = async () => {
  const result = await axios.get(todaysSchedule, {
    headers: {
      Cookie: stringifyCookie(wodCookie)
    },
    withCredentials: true
  });
  const $ = cheerio.load(result.data);
  const OSVSTATE = $("input#__OSVSTATE").val();
  const VIEWSTATEGENERATOR = $("input#__VIEWSTATEGENERATOR").val();

  // Persist form values for form submission
  fs.writeFileSync(
    tmpFormValueFilename,
    `{__OSVSTATE: ${OSVSTATE}, VIEWSTATEGENERATOR: ${VIEWSTATEGENERATOR}}`,
    "utf8"
  );

  const wodSchedule = $("tr");
  const bowerySchedule = wodSchedule.filter(function() {
    return (
      $(this)
        .find("span.Text_Note")
        .first()
        .text() == BOWERY_CROSSFIT_GYM_NAME
    );
  });

  const schedulesObject = Array.from({ length: bowerySchedule.length }, () => ({
    time: "",
    isOpenGym: false,
    instructor: "",
    numberSignUps: ""
  }));

  bowerySchedule.each(function(i) {
    const scheduleHTML = $(this);
    const spans = scheduleHTML.find("span");
    const numberSignUps = spans.last().text();
    const instructor = scheduleHTML
      .find("span.Text_Note")
      .last()
      .text();
    schedulesObject[i] = {
      time: spans.first().text(),
      isOpenGym: instructor === "",
      instructor,
      numberSignUps
    };
  });

  return schedulesObject;
};

export default getTodaysWod;
