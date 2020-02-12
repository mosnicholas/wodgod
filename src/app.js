import express from "express";
import cheerio from "cheerio";
import axios from "axios";

const siteUrl =
  "https://app.wodify.com/Mobile/?isPhoneGap=True&uuid=1eb96512ff049337863ca8e0a1be9ed3aad85b1590dada74a9c4703059761ad1&device_platform=iOS&cordovaVersion=4.2.1";

const app = express();
const port = 3000;

const getTodaysWod = async () => {
  const result = await axios.get(siteUrl);
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
    const workout = $(this).text();
    wods[i]["workout"] += workout;
  });

  return wods;
};

app.get("/", (req, res) => res.send("Hello world!"));

app.get("/wod", async (req, res) => {
  const todaysWod = await getTodaysWod();
  return res.json(todaysWod);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
