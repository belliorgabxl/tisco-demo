import { PointType } from "./constant";

export type MeResponse = {
  name: string;
  pointsByType: Record<PointType, number>;
  tier: string;
  memberNo: string;
  avatarUrl: string;
};

