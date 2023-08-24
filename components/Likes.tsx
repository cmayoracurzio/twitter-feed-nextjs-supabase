"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Likes({
  post,
  addOptimisticPost,
}: {
  post: PostwithAuthor;
  addOptimisticPost: (newPost: PostwithAuthor) => void;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleLikes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user !== null) {
      if (post.likedByUser) {
        addOptimisticPost({
          ...post,
          likes: post.likes - 1,
          likedByUser: !post.likedByUser,
        });
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, post_id: post.id });
      } else {
        addOptimisticPost({
          ...post,
          likes: post.likes + 1,
          likedByUser: !post.likedByUser,
        });
        await supabase
          .from("likes")
          .insert({ post_id: post.id, user_id: user.id });
      }

      router.refresh();
    }
  };

  return (
    <button onClick={handleLikes} className="flex items-center group">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`group-hover:fill-red-600 group-hover:stroke-red-600 ${
          post.likedByUser
            ? "fill-red-600 stroke-red-600"
            : "fill-none stroke-gray-500"
        }`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span
        className={`ml-2 text-sm group-hover:text-red-600 ${
          post.likedByUser ? "text-red-600" : "text-gray-500"
        }`}
      >
        {post.likes}
      </span>
    </button>
  );
}
