import type { Database as DB } from "@/lib/types/database.types";

type Post = DB["public"]["Tables"]["posts"]["Row"];
type Profile = DB["public"]["Tables"]["profiles"]["Row"];

declare global {
  type Database = DB;
  type PostwithAuthor = Post & {
    author: Profile;
    likes: number;
    likedByUser: boolean;
  };
}
