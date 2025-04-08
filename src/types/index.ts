export type User = {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  posts?: Post[];
  likes?: Like[];
  comments?: Comment[];
};

export type Like = {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
  user?: User;
  post?: Post;
};

export type Comment = {
  id: number;
  content: string;
  userId: number;
  postId: number;
  user?: User;
  post?: Post;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: User;
  likes?: Like[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
};
