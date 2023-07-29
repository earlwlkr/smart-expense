export type Group = {
  id: string;
  name: string;
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
  category: { id: string; name: string };
  handledBy: Member;
  participants: Member[];
  date: Date;
};
