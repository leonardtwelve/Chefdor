import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { requireAdmin } from "./admin-guard";

const f = createUploadthing();

export const ourFileRouter = {
  recipeImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const adminId = await requireAdmin();
      if (!adminId) throw new UploadThingError("UNAUTHORIZED");
      return { adminId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.adminId,
        url: file.ufsUrl,
        width: 1600,
        height: 1067,
      };
    }),

  stepImage: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async () => {
      const adminId = await requireAdmin();
      if (!adminId) throw new UploadThingError("UNAUTHORIZED");
      return { adminId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.adminId,
        url: file.ufsUrl,
        width: 1200,
        height: 800,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
