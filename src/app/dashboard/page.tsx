"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { formatDistance } from "date-fns";

type DashboardProps = {};

const Dashboard: React.FC<DashboardProps> = () => {
  const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser);

  const sortedThumbnails = [...(thumbnails ?? [])].reverse();

  return (
    <>
      <h1 className="text-center text-4xl font-bold mb-8">
        Your Thumbnail Tests
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
        {sortedThumbnails?.map((thumbnail) => (
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
              <p>{thumbnail.title}</p>
              <p className="text-gray-400">{thumbnail.voteIds.length} votes</p>
              <p className="italic text-sm text-gray-400 dark:text-blue-100 dark:opacity-80">
                {formatDistance(new Date(thumbnail._creationTime), new Date(), {
                  addSuffix: true,
                })}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`/thumbnails/${thumbnail?._id}`}>View Results</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};
export default Dashboard;
