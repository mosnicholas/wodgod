import cheerio from "cheerio";
import axios from "axios";

import { todaysWODUrl } from "./constants";

const getTodaysWod = async () => {
  const result = await axios.get(todaysWODUrl);
  const $ = cheerio.load(result.data);
  const wodData = $(
    "#wt17_wtMainContent_WOD_UI_wt14_block_wtWODComponentsList"
  );
  const titles = wodData.find(".section_title");
  const names = wodData.find(".component_name");
  const workouts = wodData.find(".component_wrapper");

  const wods = Array.from({ length: titles.length }, () => ({
    title: "",
    wodName: "",
    workout: ""
  }));

  titles.each(function(i) {
    const sectionTitle = $(this).text();
    wods[i]["title"] = sectionTitle;
  });

  names.each(function(i) {
    const wodName = $(this).text();
    wods[i]["wodName"] = wodName;
  });

  workouts.each(function(i) {
    const workout = $(this)
      .html()
      .replace(/<br>/g, " ")
      .replace(/  /g, "\n");
    if (workout) {
      wods[i]["workout"] = workout;
    }
  });

  wods.forEach(w => {
    if (w.wodName && !w.workout) {
      w.workout = w.wodName;
      w.wodName = "";
    }
  });

  return wods;
};

export default getTodaysWod;
