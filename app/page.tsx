import CreatePost from "@/components/CreatePost";
import Posts from "@/components/Posts";
import SignOut from "@/components/SignOut";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Prevent caching the route
export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("posts")
    .select("*, author: profiles(*), likes(user_id)")
    .order("created_at", { ascending: false });

  const posts =
    data?.map((post) => ({
      ...post,
      author: Array.isArray(post.author) ? post.author[0] : post.author,
      likedByUser: post.likes.some((like) => like.user_id === user.id),
      likes: post.likes.length,
    })) ?? [];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between px-4 py-6 border border-gray-800 border-t-0">
        <h1 className="text-xl font-bold ">Home</h1>
        <SignOut />
      </div>
      <CreatePost user={user} />
      <Posts posts={posts} />
    </div>
  );
}
