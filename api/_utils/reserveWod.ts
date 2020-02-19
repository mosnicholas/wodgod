import cheerio from "cheerio";
import axios from "axios";
import fs from "fs";
import path from "path";

import stringifyCookie from "./stringifyCookie";
import stringifyFormData from "./stringifyFormData";
import {
  wodCookie,
  todaysSchedule,
  formData,
  tmpFormValueFilename,
  BOWERY_CROSSFIT_GYM_NAME
} from "./constants";

const reserveWod = async ({ wodTime }) => {
  const result = await axios.get(todaysSchedule, {
    headers: {
      Cookie: stringifyCookie(wodCookie)
    },
    withCredentials: true
  });
  const $ = cheerio.load(result.data);
  const __OSVSTATE = $("input#__OSVSTATE").val();
  const __VIEWSTATEGENERATOR = $("input#__VIEWSTATEGENERATOR").val();

  const wodSchedule = $("tr");
  const bowerySchedule = wodSchedule.filter(function() {
    return (
      $(this)
        .find("span.Text_Note")
        .first()
        .text() == BOWERY_CROSSFIT_GYM_NAME
    );
  });

  const wodToSchedule = bowerySchedule.filter(function() {
    return (
      $(this)
        .find("span")
        .first()
        .text() === wodTime
    );
  });

  const __EVENTTARGET = wodToSchedule
    .find("input[value='Reserve']")
    .attr("name");
  const reserveResult = await axios.post(
    todaysSchedule,
    stringifyFormData({
      ...formData,
      __OSVSTATE,
      __VIEWSTATEGENERATOR,
      __EVENTTARGET,
      wt51$wtMainContent$wtDate_Input: "02/19/2020",
      wt51$wtMainContent$W_Utils_UI_wt41$block$wtDateInputFrom: "02/19/2020"
    }),
    {
      headers: {
        Cookie: stringifyCookie(wodCookie),
        "content-type": "application/x-www-form-urlencoded",
        accept: "text/plain, */*; q=0.01",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
      }
    }
  );
  console.log(reserveResult);
  const $result = cheerio.load(reserveResult.data);
  const NEW__OSVSTATE = $result("input#__OSVSTATE").val();
  const NEW__VIEWSTATEGENERATOR = $result("input#__VIEWSTATEGENERATOR").val();

  // Persist form values for form submission
  fs.writeFileSync(
    tmpFormValueFilename,
    `{__OSVSTATE: ${NEW__OSVSTATE}, VIEWSTATEGENERATOR: ${NEW__VIEWSTATEGENERATOR}}`,
    "utf8"
  );

  return true;
};

export default reserveWod;
