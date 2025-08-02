import IPost from "./IPost.interface";
import DTO from "./common/DTO.interface";

export interface IUser extends DTO {
  _id: string;
  username: string;
  userTag: string;
  email: string;
  password: string;
  avatar: string;
  banner: string;
  posts: IPost[];
  followers: IUser[];
  followings: IUser[];
  blockedUsers: IUser[];
  likes: IUser["_id"][];
//   comments: IComment[];
  repostings: IPost[];
  bookmarks: IPost[];
  sharedPosts: IPost[];
//   conversations: IConversation[];
  recentSongs: string[];
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}
