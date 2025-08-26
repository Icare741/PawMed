export interface Order {
  id?: number;
  customer_email: string;
  customer_name: string;
  type: string;
  status: string;
  date: string;
  amount: number;
}
