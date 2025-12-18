export interface Staff {
  idx: number;                  // AUTO_INCREMENT PK
  name: string;             // 이름
  grade: number | null;        // 등급
  phone: number | null;               // 번호
  gender: string;         // 성별
  gradeName: string;
}

export interface StaffRequest {
  name: string;             // 이름
  grade: number | null;        // 등급
  phone: number | null;               // 번호
  gender: string;         // 성별
}

export interface StaffGrade {

  idx:number;
  name : string;

}