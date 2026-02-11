import { PointType } from "./constant";

export type MeResponse = {
  name: string;
  tier: string;
  memberNo: string;
  avatarUrl: string;
  pointsByType: Record<"TISCO" | "TINSURE" | "TWEALTH" , number>;
};

export type ActivePointCardProps = {
  meEndpoint?: string;
  storageKey?: string;
  onChangeType?: (next: PointType) => void;
};

export type Balances = Record<PointType, number>;

export const DEFAULT_BALANCES: Balances = {
  TISCO: 0,
  TINSURE: 0,
  TWEALTH: 0
};

export type CreditSummary = {
  tiscoPoint: number;
  twealthPoint: number;
  tinsurePoint: number;
  totalPoints: number;
};
