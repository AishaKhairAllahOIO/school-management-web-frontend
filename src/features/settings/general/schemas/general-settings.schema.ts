import { z } from "zod";

export const generalSettingsSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  shortName: z.string().min(1, "Short name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),

  phoneNumber: z.string().min(5, "Phone number is required"),
  emergencyPhoneNumber: z.string().min(5, "Emergency phone is required"),

  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),

  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),

  location: z.object({
    latitude: z.string().optional(),
    longitude: z.string().optional(),
  }),

  defaultLanguage: z.string().min(1, "Default language is required"),
  timezone: z.string().min(1, "Timezone is required"),
  dateFormat: z.string().min(1, "Date format is required"),
  currency: z.string().min(1, "Currency is required"),

  workingDays: z.array(z.string()).min(1, "Select at least one working day"),

  openingTime: z.string().min(1, "Opening time is required"),
  closingTime: z.string().min(1, "Closing time is required"),

});

export type GeneralSettingsFormValues = z.infer<
  typeof generalSettingsSchema
>;