export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
};

export type Group = {
  id: string;
  name: string;
  created_at: string;
};

export type Member = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  name: string;
  amount: string;
  category?: Category;
  handledBy?: Member;
  participants: Member[];
  date: Date;
};

export type Token = {
  id: string;
  disabled: boolean;
  groupId: string;
  createdAt: Date;
};

export type ShareToken = {
  id: string;
  disabled: boolean;
  groupId: string;
  createdAt: Date;
  expiresAt: Date | null;
};
