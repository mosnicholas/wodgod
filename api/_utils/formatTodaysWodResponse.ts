type WOD = {
  title: string;
  wodName: string;
  workout: string;
};

const ordinalSuffixOf = (i: number) => {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
};

const getCardTitle = (wod: WOD) => {
  if (wod.wodName) {
    return `${wod.title} - ${wod.wodName}`;
  }
  return wod.title;
};

const getWodSubtitle = (wod: WOD) => {
  if (wod.wodName) {
    return `The workout is called ${wod.wodName}.`;
  }
  return "";
};

const formatTodaysWodResponse = (todaysWod: WOD[]) => {
  const numberWods = todaysWod.length;
  const wodCount = `You have ${numberWods} part${
    numberWods > 1 ? "s" : ""
  } to the workout.`;

  const fulfillmentText = todaysWod.reduce((string, wod, i) => {
    const wodDescription = `The ${ordinalSuffixOf(
      i + 1
    )} part of your workout is a ${wod.title}. ${getWodSubtitle(wod)} It is ${
      wod.workout
    }.`;

    return `${string} ${wodDescription}`;
  }, "");

  return {
    fulfillmentText,
    fulfillmentMessages: todaysWod.map(w => ({
      card: {
        title: getCardTitle(w),
        subtitle: w.workout,
        imageUri:
          "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/crossfit-g-1556191957.jpg?crop=0.670xw:1.00xh;0,0&resize=480:*"
      }
    }))
    // followupEventInput: {
    //   name: "Do you want to book a class?",
    //   languageCode: "en-US",
    //   parameters: {}
    // }
  };
};

export default formatTodaysWodResponse;
