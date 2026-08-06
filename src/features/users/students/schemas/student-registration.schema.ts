import { z } from "zod";

import { enrollmentSchema } from "./enrollment.schema";
import { guardianSchema } from "./guardian.schema";
import { studentPersonalSchema } from "./student-personal.schema";

export const studentRegistrationSchema = z.object({
  student: studentPersonalSchema,

  guardian: guardianSchema,

  enrollment: enrollmentSchema,
});

export type StudentRegistrationSchemaValues = z.infer<
  typeof studentRegistrationSchema
>;

export const studentRegistrationDefaultValues: StudentRegistrationSchemaValues =
  {
    student: {
      first_name: "",
      last_name: "",
      father_name: "",
      mother_name: "",
      birth_date: "",
      birth_place: "",
      address: "",
      phone_number: "",
      gender: "male",
      nationality: "syrian",
      photo_url: null,
    },

    guardian: {
      first_name: "",
      last_name: "",
      father_name: "",
      mother_name: "",
      birth_date: "",
      birth_place: "",
      address: "",
      phone_number: "",
      gender: "male",
      nationality: "syrian",
      photo_url: null,
      token_fcm: undefined,
    },

    enrollment: {
      academic_year_id: "",
      grade_level_id: "",
      class_room_id: "",
    },
  };