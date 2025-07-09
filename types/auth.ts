export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "student" | "supervisor" | "admin";
  matricNumber?: string; // Only for students
  supervisorId?: number; // Only for students
  totalWeeks?: number;
  organisation?: string;
}
export interface StudentRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "student";
  matricNumber?: string;
  supervisorId?: number;
  totalWeeks: number;
  organisation: string;
}
export interface SupervisorRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "supervisor";
}
