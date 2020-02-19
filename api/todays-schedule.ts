import { NowRequest, NowResponse } from "@now/node";

import todaysSchedule from "./_utils/todaysSchedule";

export default async (req: NowRequest, res: NowResponse) => {
  const schedule = await todaysSchedule();
  res.json(schedule);
};
