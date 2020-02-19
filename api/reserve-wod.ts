import { NowRequest, NowResponse } from "@now/node";

import reserveWod from "./_utils/reserveWod";

export default async (req: NowRequest, res: NowResponse) => {
  // const {
  //   body: { wodDate, wodTime }
  // } = req;
  const success = await reserveWod({ wodTime: "7:45 PM" });
  res.json({ success });
};
