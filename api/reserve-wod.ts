import { NowRequest, NowResponse } from "@now/node";

import reserveWod from "./_utils/reserveWod";

export default async (req: NowRequest, res: NowResponse) => {
  const {
    body: { wodDate }
  } = req;
  const success = await reserveWod(wodDate);
  res.json({ success });
};
