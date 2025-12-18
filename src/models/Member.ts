export interface Member {
  idx: number;                  // AUTO_INCREMENT PK
  userName: string;             // 이름
  status: number | null;        // 상태
  gender: string;               // 성별
  birth: number | null;         // 생년월일 (정수)
  age: number | null;           // 나이
  phone: string;                // 연락처
  getUtilization: number | null;
  getRenting: number | null;
  locker: number | null;
  sort: number;                 // 구분
  regDt: string | null;         // 최초등록일 (date)
  endDt: string | null;         // 최종만료일 (date)
  dayNum: number | null;        // 남은 일수
  regentRegDt: string | null;   // 최근 등록일 (date)
  regentAtDt: string | null;    // 최근 출석일 (date)
  AtNum: number | null;         // 출석 번호
  etcComment: string | null;    // 특이사항
  purpose: number | null;       // 운동 목적
  visitPath: number | null;     // 방문 경로
  consultant: number | null;
  address: string | null;       // 주소
  lockerName: string | null;
  getRentingName: string | null;
  getUtilizationName: string | null;
  purposeName: string | null;
  visitPathName: string | null;
  consultantName: string | null;  // 상담자 이름
}

export interface MemberRequest{
  userName: string;             // 이름
  gender: string;               // 성별
  birth: number | null;         // 생년월일 (정수)
  age: number | null;           // 나이
  phone: string;                // 연락처
  getUtilization: number | null;
  getRenting: number | null;
  purpose: number | null;       // 운동 목적
  visitPath: number | null;     // 방문 경로
  consultant: number | null;
  address: string | null;       // 주소
}