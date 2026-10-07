export type Priority = "low" | "normal" | "high" | "urgent";
export type Status = "open" | "pending" | "solved";
export type Category = "billing" | "shipping" | "product" | "account" | "other";

export interface Ticket {
  id: string;
  subject: string;
  body: string;
  customerEmail: string;
  status: Status;
  priority: Priority;
  category: Category;
  createdAt: string;
  updatedAt: string;
  summary?: string;
}

export interface NewTicket {
  subject: string;
  body: string;
  customerEmail: string;
}
