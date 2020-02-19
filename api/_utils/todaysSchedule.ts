import cheerio from "cheerio";
import axios from "axios";

import stringifyCookie from "./stringifyCookie";
import { todaysSchedule, formData } from "./constants";

const getTodaysWod = async () => {
  const result = await axios.post(todaysSchedule, formData, {
    headers: {
      Cookie: stringifyCookie(),
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    withCredentials: true
  });
  console.log("result.request: ", result.request);
  const $ = cheerio.load(result.data);
  console.log($(".TableRecords_OddLine,.TableRecords_EvenLine").text());
  // const wodData = $("#");
  // const titles = wodData.find(".section_title");
  // const names = wodData.find(".component_name");
  // const workouts = wodData.find(".component_wrapper");

  // const wods = Array.from({ length: titles.length }, () => ({
  //   title: "",
  //   wodName: "",
  //   workout: ""
  // }));

  // titles.each(function(i) {
  //   const sectionTitle = $(this).text();
  //   wods[i]["title"] = sectionTitle;
  // });

  // names.each(function(i) {
  //   const wodName = $(this).text();
  //   wods[i]["wodName"] = wodName;
  // });

  // workouts.each(function(i) {
  //   const workout = $(this)
  //     .html()
  //     .replace(/<br>/g, " ")
  //     .replace(/  /g, "\n");
  //   if (workout) {
  //     wods[i]["workout"] = workout;
  //   }
  // });

  // wods.forEach(w => {
  //   if (w.wodName && !w.workout) {
  //     w.workout = w.wodName;
  //     w.wodName = "";
  //   }
  // });

  return true;
};

export default getTodaysWod;
