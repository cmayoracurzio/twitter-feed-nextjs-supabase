/* eslint-disable @typescript-eslint/indent */
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Likes from "./Likes";

export default function Posts({ posts }: { posts: PostwithAuthor[] }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Real-time listening of any changes to posts and/or likes
  useEffect(() => {
    const channel = supabase
      .channel("realtime posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  // Optimistic updates of posts
  const [optimisticPosts, addOptimisticPost] = useOptimistic<
    PostwithAuthor[],
    PostwithAuthor
  >(posts, (currentOptimisticPosts, newPost) => {
    const newOptimisticPosts = [...currentOptimisticPosts];
    const index = newOptimisticPosts.findIndex(
      (post) => post.id === newPost.id
    );
    newOptimisticPosts[index] = newPost;
    return newOptimisticPosts;
  });

  return optimisticPosts.map((post) => (
    <div
      key={post.id}
      className="border border-gray-800 border-t-0 px-4 py-8 flex"
    >
      <div className="w-12 h-12">
        <Image
          src={post.author.avatar_url}
          alt="Author avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="ml-4">
        <p>
          <span className="font-bold">{post?.author?.name}</span>{" "}
          <span className="text-sm ml-2 text-gray-400">
            @{post?.author?.username}
          </span>
        </p>
        <p className="mb-4">{post.content}</p>
        <Likes post={post} addOptimisticPost={addOptimisticPost} />
      </div>
    </div>
  ));
}
