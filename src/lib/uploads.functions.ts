import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;
const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

const Input = z.object({
  x: z.number().int().min(0).max(99),
  y: z.number().int().min(0).max(99),
  contentType: z.enum(ALLOWED),
  // base64-encoded image bytes (no data: prefix)
  dataBase64: z.string().min(1).max(Math.ceil((MAX_BYTES * 4) / 3) + 16),
});

export const uploadPixelImage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const buf = Buffer.from(data.dataBase64, "base64");
    if (buf.length === 0 || buf.length > MAX_BYTES) {
      throw new Error("Image must be between 1 byte and 2 MB");
    }

    // Magic-byte sniff to ensure declared contentType matches actual bytes
    const sig = buf.subarray(0, 12);
    const isPng = sig[0] === 0x89 && sig[1] === 0x50 && sig[2] === 0x4e && sig[3] === 0x47;
    const isJpg = sig[0] === 0xff && sig[1] === 0xd8 && sig[2] === 0xff;
    const isGif = sig[0] === 0x47 && sig[1] === 0x49 && sig[2] === 0x46;
    const isWebp =
      sig[0] === 0x52 && sig[1] === 0x49 && sig[2] === 0x46 && sig[3] === 0x46 &&
      sig[8] === 0x57 && sig[9] === 0x45 && sig[10] === 0x42 && sig[11] === 0x50;
    const okType =
      (data.contentType === "image/png" && isPng) ||
      (data.contentType === "image/jpeg" && isJpg) ||
      (data.contentType === "image/gif" && isGif) ||
      (data.contentType === "image/webp" && isWebp);
    if (!okType) throw new Error("File contents do not match declared image type");

    const ext = EXT_BY_MIME[data.contentType];
    const rand = crypto.randomUUID();
    const path = `${data.x}-${data.y}/${Date.now()}-${rand}.${ext}`;

    const { error } = await supabaseAdmin.storage
      .from("pixel-images")
      .upload(path, buf, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);

    const { data: pub } = supabaseAdmin.storage.from("pixel-images").getPublicUrl(path);
    return { url: pub.publicUrl };
  });
