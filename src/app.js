import express from "express";
import cheerio from "cheerio";
import axios from "axios";

const todaysWODUrl =
  "https://app.wodify.com/Mobile/?isPhoneGap=True&uuid=1eb96512ff049337863ca8e0a1be9ed3aad85b1590dada74a9c4703059761ad1&device_platform=iOS&cordovaVersion=4.2.1";
const todaysSchedule =
  "https://app.wodify.com/Mobile/Class_Schedule.aspx?Date=01%2f01%2f1900";
const signIn =
  "https://app.wodify.com/Mobile/Class_Schedule.aspx?_ts=1582058673007";
const todaysScheduleCookies = {
  DeviceUUID:
    "1eb96512ff049337863ca8e0a1be9ed3aad85b1590dada74a9c4703059761ad1",
  IsPhoneGapClient: true
};

// GET For schedule
// POST for reserve & sign in

const app = express();
const port = 3000;

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

app.get("/", async (req, res) => {
  const todaysWod = await getTodaysWod();
  return res.json(todaysWod);
});

app.listen(port, () => console.log(`WodGod is listening on port ${port}!`));
