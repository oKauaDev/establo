export interface UserType {
  id: string;
  name: string;
  email: string;
  password: string;
  type: "owner" | "customer";
}
