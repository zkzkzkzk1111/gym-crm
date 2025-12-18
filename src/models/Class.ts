export interface Class {
  idx: number;               // AUTO_INCREMENT PK
  className: string;         // 상품명
  cash: number | null;       // 현금가
  card: number | null;       // 카드가
  description: string | null;// 설명
  duration: number;          // 이용기간
  type: number;              // 타입
  useCount: number;          // 사용횟수 (기본값 0)
  typeName:string;
  instructor: number | null;      // 강사
  instructorName: string | null;      // 강사
}

export interface ClassRequest {
  className: string;         // 상품명
  cash: number | null;       // 현금가
  card: number | null;       // 카드가
  description: string | null;// 설명
  duration: number;          // 이용기간
  type: number;              // 타입
  useCount: number;          // 사용횟수 (기본값 0)
  instructor: number | null;      // 강사
}

export interface ClassType{
  idx:number;
  typeName:string;
}