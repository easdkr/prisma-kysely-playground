import { nativeJs, LocalDateTime, convert, ZoneId } from "js-joda";

export interface Author {
  id: number;
  name: string;
}

export interface IPost {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  author: Author;
}

export class Post {
  private _id!: number;
  private _title!: string;
  private _createdAt!: LocalDateTime;
  private _updatedAt!: LocalDateTime;
  private _author!: Author;

  public static of(post: IPost): Post {
    const instance = new Post();
    instance._id = post.id;
    instance._title = post.title;
    instance._createdAt = LocalDateTime.from(nativeJs(post.createdAt));
    instance._updatedAt = LocalDateTime.from(nativeJs(post.updatedAt));
    instance._author = post.author;
    return instance;
  }

  public get id(): number {
    return this._id;
  }

  public get title(): string {
    return this._title;
  }

  public get createdAt(): LocalDateTime {
    return this._createdAt;
  }

  public get updatedAt(): LocalDateTime {
    return this._updatedAt;
  }

  public get author(): Author {
    return this._author;
  }

  public toString(): string {
    return `${this.title} by ${this.author.name}`;
  }
}
