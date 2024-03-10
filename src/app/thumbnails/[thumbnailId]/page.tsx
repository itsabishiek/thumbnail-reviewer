"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { shuffle } from "lodash";
import { Button } from "@/components/ui/button";
import { useSession } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { useRef } from "react";

type ThumbnailPageProps = {};

const ThumbnailPage: React.FC<ThumbnailPageProps> = () => {
  const { thumbnailId } = useParams<{ thumbnailId: Id<"thumbnails"> }>();
  const thumbnail = useQuery(api.thumbnails.getThumbnail, {
    thumbnailId,
  });
  const voteOnThumbnail = useMutation(api.thumbnails.voteOnThumbnail);
  const { session } = useSession();
  const images = useRef<string[] | undefined>(undefined);

  if (!thumbnail || !session) {
    return <div>Loading...</div>;
  }

  if (!images.current) {
    images.current = shuffle([thumbnail.aImage, thumbnail.bImage]);
  }

  const [firstImageId, secondImageId] = images.current;

  const hasVoted = thumbnail.voteIds.includes(session.user.id);

  function getVotesFor(imageId: string) {
    return thumbnail?.aImage === imageId ? thumbnail.aVotes : thumbnail?.bVotes;
  }

  function getVotePercent(imageId: string) {
    const totVotes = thumbnail?.voteIds.length!;
    if (totVotes === 0) return 0;

    return thumbnail?.aImage === imageId
      ? (thumbnail.aVotes / totVotes) * 100
      : (thumbnail?.bVotes! / totVotes!) * 100;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-center">
            Test Image A
          </h2>

          <Image
            src={getImageUrl(firstImageId)}
            alt="test image A"
            width={200}
            height={200}
            className="w-full"
          />

          {hasVoted ? (
            <>
              <Progress
                value={getVotePercent(firstImageId)}
                className="w-full"
              />
              <div className="text-lg">{getVotesFor(firstImageId)} votes</div>
            </>
          ) : (
            <Button
              className="w-fit"
              size="lg"
              onClick={() =>
                voteOnThumbnail({ imageId: firstImageId, thumbnailId })
              }
            >
              Vote
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-center">
            Test Image B
          </h2>

          <Image
            src={getImageUrl(secondImageId)}
            alt="test image A"
            width={200}
            height={200}
            className="w-full"
          />

          {hasVoted ? (
            <>
              <Progress
                value={getVotePercent(secondImageId)}
                className="w-full"
              />
              <div className="text-lg">{getVotesFor(secondImageId)} votes</div>
            </>
          ) : (
            <Button
              className="w-fit"
              size="lg"
              onClick={() =>
                voteOnThumbnail({ imageId: secondImageId, thumbnailId })
              }
            >
              Vote
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default ThumbnailPage;
