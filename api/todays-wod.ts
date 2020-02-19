import { NowRequest, NowResponse } from "@now/node";

import getTodaysWod from "./_utils/getTodaysWod";

export default async (req: NowRequest, res: NowResponse) => {
  const todaysWod = await getTodaysWod();
  res.json(todaysWod);
};
