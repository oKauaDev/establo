export interface UserType {
  id: string;
  name: string;
  email: string;
  type: "owner" | "customer";
}
