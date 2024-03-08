"use client";

import { UploadFileResponse } from "@xixixao/uploadstuff";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import "@xixixao/uploadstuff/react/styles.css";
import { UploadButton } from "@xixixao/uploadstuff/react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { isEmpty } from "lodash";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/utils";

type CreatePageProps = {};

const defaultErrorState = {
  title: "",
  imageA: "",
  imageB: "",
};

const CreatePage: React.FC<CreatePageProps> = () => {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createThumbnail = useMutation(api.thumbnails.createThumbnail);
  const [imageA, setImageA] = useState("");
  const [imageB, setImageB] = useState("");
  const [errors, setErrors] = useState(defaultErrorState);
  const { toast } = useToast();
  const router = useRouter();

  return (
    <div className="">
      <h1 className="text-4xl font-bold mb-2">Create a Thumbnail Test</h1>
      <p className="text-lg text-gray-500 dark:text-neutral-300 mb-8">
        Create your test so that people can vote on your thumbnails and give
        feedback on them.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const data = e.target as HTMLFormElement;
          const formData = new FormData(data);
          const title = formData.get("title") as string;
          let newErrors = {
            ...defaultErrorState,
          };

          if (!title) {
            newErrors = {
              ...newErrors,
              title: "Please fill in this required field",
            };
          }

          if (!imageA) {
            newErrors = {
              ...newErrors,
              imageA: "Please fill in this required field",
            };
          }

          if (!imageB) {
            newErrors = {
              ...newErrors,
              imageB: "Please fill in this required field",
            };
          }

          setErrors(newErrors);
          const hasErrors = Object.values(newErrors).some(Boolean);
          if (hasErrors) {
            toast({
              title: "Form Error",
              description: "Please fill in all the fields!",
              variant: "destructive",
            });
            return;
          }

          const thumbnailId = await createThumbnail({
            aImage: imageA,
            bImage: imageB,
            title,
          });

          router.push(`/thumbnails/${thumbnailId}`);
        }}
      >
        <div className="flex flex-col gap-4 mb-8">
          <Label htmlFor="title">YouTube Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Put your youtube title here..."
            className={clsx("max-w-lg", {
              border: errors.title,
              "border-red-500": errors.title,
            })}
          />
          {errors.title && <div className="text-red-500">{errors.title}</div>}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div
            className={clsx("flex flex-col gap-4 rounded p-3", {
              border: errors.imageA,
              "border-red-600": errors.imageA,
            })}
          >
            <h2 className="text-2xl font-bold">Test Image A</h2>

            {imageA && (
              <Image
                src={getImageUrl(imageA)}
                alt="test image A"
                width={200}
                height={200}
              />
            )}

            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              multiple
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                setImageA((uploaded[0].response as any).storageId);
              }}
              onUploadError={(error: unknown) => {
                // Do something with the error.
                alert(`ERROR! ${error}`);
              }}
            />

            {errors.imageA && (
              <div className="text-red-500">{errors.imageA}</div>
            )}
          </div>

          <div
            className={clsx("flex flex-col gap-4 rounded p-3", {
              border: errors.imageB,
              "border-red-600": errors.imageB,
            })}
          >
            <h2 className="text-2xl font-bold">Test Image B</h2>

            {imageB && (
              <Image
                src={getImageUrl(imageB)}
                alt="test image B"
                width={200}
                height={200}
              />
            )}

            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              multiple
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                setImageB((uploaded[0].response as any).storageId);
              }}
              onUploadError={(error: unknown) => {
                // Do something with the error.
                alert(`ERROR! ${error}`);
              }}
            />

            {errors.imageB && (
              <div className="text-red-500">{errors.imageB}</div>
            )}
          </div>
        </div>

        <Button className="mt-8">Create thumbnail test</Button>
      </form>
    </div>
  );
};
export default CreatePage;
