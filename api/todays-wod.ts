import { NowRequest, NowResponse } from "@now/node";

import getTodaysWod from "./_utils/getTodaysWod";
import formatTodaysWodResponse from "./_utils/formatTodaysWodResponse";

export default async (req: NowRequest, res: NowResponse) => {
  const todaysWod = await getTodaysWod();
  const response = formatTodaysWodResponse(todaysWod);
  res.json(response);
};
