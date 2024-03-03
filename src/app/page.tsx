"use client";

import { SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const { isSignedIn } = useSession();
  const createThumbnail = useMutation(api.thumbnails.createThumbnail);
  const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser);

  return (
    <main className="">
      {isSignedIn ? <SignOutButton /> : <SignInButton />}

      {isSignedIn && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const data = e.target as HTMLFormElement;
            const formData = new FormData(data);
            const title = formData.get("title") as string;

            await createThumbnail({
              title,
            });

            data.reset();
          }}
        >
          <label>Title</label>
          <input name="title" type="text" className="text-black" />
          <button type="submit">Create</button>
        </form>
      )}

      {thumbnails?.map((thumbnail) => (
        <div key={thumbnail._id}>{thumbnail.title}</div>
      ))}
    </main>
  );
}
