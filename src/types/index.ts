
export type UserRole = "admin" | "supervisor" | "builder";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  created_at?: string;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  check_in: string; // ISO date string
  check_out?: string; // ISO date string
  shift: "morning" | "afternoon" | "night";
  status: "present" | "absent" | "late" | "overtime";
  validated: boolean;
  validated_by?: string;
  notes?: string;
  created_at?: string;
}

export interface PayrollRecord {
  id: string;
  user_id: string;
  period_start: string; // ISO date string
  period_end: string; // ISO date string
  regular_hours: number;
  overtime_hours: number;
  rate: number;
  total_pay: number;
  status: "pending" | "approved" | "paid";
}

export interface DashboardStats {
  total_workers: number;
  active_workers: number;
  tasks_assigned: number;
  pending_approvals: number;
}

export interface ShiftConfig {
  id: string;
  shift_name: string;
  start_time: string; // "08:00"
  end_time: string; // "16:00"
  rate: number;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at?: string;
  updated_at?: string;
}
