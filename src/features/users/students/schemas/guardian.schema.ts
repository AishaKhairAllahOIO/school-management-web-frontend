import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const requiredString = (message: string) =>
  z.string().trim().min(1, message);

const optionalPhotoSchema = z
  .custom<File | null | undefined>(
    (value) => {
      if (value === undefined || value === null) {
        return true;
      }

      if (typeof File === "undefined") {
        return false;
      }

      return value instanceof File;
    },
    {
      message: "Invalid image file",
    },
  )
  .refine(
    (file) => {
      if (!file) {
        return true;
      }

      return file.size <= MAX_IMAGE_SIZE;
    },
    {
      message: "Image size must not exceed 5 MB",
    },
  )
  .refine(
    (file) => {
      if (!file) {
        return true;
      }

      return ALLOWED_IMAGE_TYPES.includes(file.type);
    },
    {
      message: "Only JPG, PNG, and WEBP images are allowed",
    },
  );

export const guardianSchema = z.object({
  first_name: requiredString("Guardian first name is required"),

  last_name: requiredString("Guardian last name is required"),

  father_name: requiredString("Guardian father name is required"),

  mother_name: requiredString("Guardian mother name is required"),

  birth_date: requiredString("Guardian birth date is required")
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      "Enter a valid birth date",
    )
    .refine((value) => {
      const selectedDate = new Date(value);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return selectedDate <= today;
    }, "Birth date cannot be in the future"),

  birth_place: requiredString("Guardian birth place is required"),

  address: requiredString("Guardian address is required"),

  phone_number: requiredString(
    "Guardian phone number is required",
  ).regex(
    /^[0-9+\-\s()]{7,20}$/,
    "Enter a valid phone number",
  ),

  gender: z.enum(["male", "female"], {
    message: "Guardian gender is required",
  }),

  nationality: z.enum(
    [
      "syrian",
      "lebanese",
      "palestinian",
      "jordanian",
      "other",
    ],
    {
      message: "Guardian nationality is required",
    },
  ),

  photo_url: optionalPhotoSchema.optional().nullable(),

  token_fcm: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
});

export type GuardianSchemaValues = z.infer<typeof guardianSchema>;