"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Doc } from "../../../convex/_generated/dataModel";
import { useSession } from "@clerk/nextjs";

type ExploreProps = {};

const Explore: React.FC<ExploreProps> = () => {
  const {
    results: thumbnails,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.thumbnails.getThumbnails,
    {},
    { initialNumItems: 5 }
  );
  const { session } = useSession();

  function hasVoted(thumbnail: Doc<"thumbnails">) {
    if (!session?.user.id) return false;
    return thumbnail.voteIds.includes(session.user.id);
  }

  return (
    <div className="flex flex-col items-center justify-center  pb-16">
      <h1 className="text-center text-4xl font-bold mb-8">
        Your Thumbnail Tests
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {thumbnails?.map((thumbnail) => (
          <Card key={thumbnail._id}>
            <CardHeader>
              <Image
                src={getImageUrl(thumbnail.aImage)}
                alt="thumbnail image"
                width={600}
                height={600}
              />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src={thumbnail?.profileImage} />
                </Avatar>

                <p className="text-lg font-bold">{thumbnail?.name}</p>
              </div>
              <p>{thumbnail.title}</p>
              <p className="text-gray-400">{thumbnail.voteIds.length} votes</p>
              <p className="italic text-sm text-gray-400 dark:text-blue-100 dark:opacity-80">
                {formatDistance(new Date(thumbnail._creationTime), new Date(), {
                  addSuffix: true,
                })}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                asChild
                variant={hasVoted(thumbnail) ? "outline" : "default"}
              >
                <Link href={`/thumbnails/${thumbnail?._id}`}>
                  {hasVoted(thumbnail) ? "View Results" : "Vote thumbnails"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Button
        variant="default"
        className="mt-8 bg-blue-500 text-white hover:bg-blue-400 disabled:bg-blue-800"
        onClick={() => loadMore(5)}
        disabled={status !== "CanLoadMore"}
      >
        Load more
      </Button>
    </div>
  );
};
export default Explore;
