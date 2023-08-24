"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignIn() {
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <button onClick={handleSignIn} className="text-gray-400 text-xs">
      Sign In with GitHub
    </button>
  );
}
