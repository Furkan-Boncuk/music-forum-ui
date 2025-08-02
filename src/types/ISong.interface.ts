export interface ISong {
  _id: string;
  title: string;
  artist: string;
  albumArt: string;
  platform: "spotify" | "youtube" | "apple_music";
  url: string;
  referenceId: string;
  createdAt: Date;
}
