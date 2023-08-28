"use client";

import type { User } from "@supabase/auth-helpers-nextjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePost({ user }: { user: User }) {
  const [content, setContent] = useState<string>("");
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const createPost = async (formData: FormData) => {
    const content = formData.get("content");

    if (content !== null && content.toString().trim().length > 0) {
      await supabase
        .from("posts")
        .insert({ content: content.toString().trim(), user_id: user.id });
      setContent("");
    }

    router.refresh();
  };

  return (
    <form
      action={createPost}
      id="createPostForm"
      className="border border-gray-800 border-t-0"
    >
      <div className="flex py-8 px-4">
        <Image
          src={user.user_metadata.avatar_url}
          alt="user avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
        <input
          name="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          placeholder="What is happening?!"
          className="bg-inherit flex-1 ml-2 text-2xl leading-loose placeholder-gray-500 px-2 outline-none"
        />
      </div>
    </form>
  );
}

// BELOW: How to achieve the same but using experimental server actions

// import type { User } from "@supabase/auth-helpers-nextjs";
// import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";
// import Image from "next/image";

// // Prevent caching the route
// export const dynamic = "force-dynamic";

// export default function CreatePost({ user }: { user: User }) {
//   const createPost = async (formData: FormData) => {
//     "use server";

//     // Check if content is null
//     const content = formData.get("content");
//     if (content === null || content.toString().trim().length === 0) return null;

//     // Insert post to database posts table
//     const supabase = createServerActionClient({ cookies });
//     await supabase
//       .from("posts")
//       .insert({ content: content.toString().trim(), user_id: user.id });

//     // Revalidate the path
//     revalidatePath("/");
//   };

//   return (
//     <form action={createPost} className="border border-gray-800 border-t-0">
//       <div className="flex py-8 px-4">
//         <Image
//           src={user.user_metadata.avatar_url}
//           alt="user avatar"
//           width={48}
//           height={48}
//           className="rounded-full"
//         />
//         <input
//           name="content"
//           placeholder="What is happening?!"
//           className="bg-inherit flex-1 ml-2 text-2xl leading-loose placeholder-gray-500 px-2 outline-none break-normal"
//         />
//       </div>
//     </form>
//   );
// }
