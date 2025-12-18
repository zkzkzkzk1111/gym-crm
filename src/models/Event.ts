export interface Event {
  idx: number;
  memberIdx: number | null;
  staffIdx: number | null;
  goodsIdx: number | null;
  title: string;
  description: string | null;
  startAt: string | null;
  endEt: string | null;
  allDay: number;
}

export interface EventRequest {
  memberIdx: number | null;
  staffIdx: number | null;
  goodsIdx: number | null;
  title: string;
  description: string | null;
  startAt: string | null;
  endEt: string | null;
  allDay: number;
}