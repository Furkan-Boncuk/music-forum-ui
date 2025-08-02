import { IUser } from "./IUser";
import DTO from "./common/DTO.interface";

export default interface IPost extends DTO {
  user: IUser;
  song: {
    title: string;
    artist: string;
    albumArt: string;
    referenceId: string; // Spotify veya Genius ID'si
  };
  title: string;
  content: string;
  likes: string[];
  comments: { user: string; text: string; createdAt: Date }[];
  shareCount: number;
}
