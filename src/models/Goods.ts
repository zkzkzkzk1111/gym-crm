export interface Goods {
  idx: number;               // AUTO_INCREMENT PK
  goodsName: string;         // 상품명
  cash: number | null;       // 현금가
  card: number | null;       // 카드가
  description: string | null;// 설명
  duration: number;          // 이용기간
  type: number;              // 타입
  useCount: number;          // 사용횟수 (기본값 0)
  instructor : number | null;
  instructorName : string | null;

}

export interface GoodsRequest{
  goodsName: string;
  cash: number | null;
  card: number | null;
  description: string | null;
  duration: number;
  type: number;
  useCount: number;
  instructor: number | null;

}

export interface GoodsType{
  idx:number;
  typeName:string;
}