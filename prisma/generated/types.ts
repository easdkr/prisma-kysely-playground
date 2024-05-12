import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Comment = {
    id: Generated<number>;
    text: string;
    post_id: number;
    user_id: number;
    created_at: Timestamp;
    updated_at: Timestamp;
};
export type Post = {
    id: Generated<number>;
    title: string;
    created_at: Timestamp;
    updated_at: Timestamp;
    author_id: number;
    likes: Generated<number>;
};
export type PostLikes = {
    id: Generated<number>;
    post_id: number;
    user_id: number;
    created_at: Timestamp;
    updated_at: Timestamp;
};
export type User = {
    id: Generated<number>;
    name: string;
};
export type DB = {
    comments: Comment;
    post_likes: PostLikes;
    posts: Post;
    users: User;
};
