export type Profile = {
  _id: string;
  _creationTime: number;
  firstName: string;
  lastName: string;
};

export type Group = {
  _id: string;
  _creationTime: number;
  name: string;
  description?: string;
};

export type Member = {
  _id: string;
  _creationTime: number;
  name: string;
  groupId: string;
};

export type Category = {
  _id: string;
  _creationTime: number;
  name: string;
  groupId: string;
};

export type Expense = {
  _id: string;
  _creationTime: number;
  name: string;
  amount: number; // Changed to number to match backend
  category?: Category;
  handledBy?: Member;
  participants: Member[];
  date: Date;
};

export type Token = {
  _id: string;
  _creationTime: number;
  name: string;
  value: string;
  groupId: string;
};

export type ShareToken = {
  _id: string;
  _creationTime: number;
  name: string;
  value: string;
  groupId: string;
};
