import { z } from "zod";

const coordinateSchema = z
  .string()
  .trim()
  .min(1, "This coordinate is required")
  .refine((value) => Number.isFinite(Number(value)), {
    message: "Enter a valid number",
  });

export const generalSettingsSchema = z.object({
  schoolName: z
    .string()
    .trim()
    .min(2, "School name is required"),

  shortName: z
    .string()
    .trim()
    .min(1, "Short name is required"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  phoneNumber: z
    .string()
    .trim()
    .min(5, "Phone number is required"),

  emergencyPhoneNumber: z
    .string()
    .trim()
    .min(5, "Emergency phone is required"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  website: z
    .string()
    .trim()
    .url("Invalid website URL")
    .optional()
    .or(z.literal("")),

    logo: z
  .string()
  .trim()
  .url("Invalid logo URL")
  .optional()
  .or(z.literal("")),

  address: z
    .string()
    .trim()
    .min(3, "Address is required"),

  city: z
    .string()
    .trim()
    .min(2, "City is required"),

  country: z
    .string()
    .trim()
    .min(2, "Country is required"),

  location: z.object({
    latitude: coordinateSchema.refine(
      (value) => {
        const latitude = Number(value);
        return latitude >= -90 && latitude <= 90;
      },
      {
        message: "Latitude must be between -90 and 90",
      },
    ),

    longitude: coordinateSchema.refine(
      (value) => {
        const longitude = Number(value);
        return longitude >= -180 && longitude <= 180;
      },
      {
        message: "Longitude must be between -180 and 180",
      },
    ),
  }),
});

export type GeneralSettingsFormValues = z.infer<
  typeof generalSettingsSchema
>;