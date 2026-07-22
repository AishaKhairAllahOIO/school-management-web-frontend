import { axiosClient } from "@/services/axios/axiosClient";

import { staffEndpoints } from "./staff.endpoints";

import type {
  ApiId,
  RegisterStaffValues,
  StaffPaginator,
  StaffProfile,
  StaffRole,
  UpdateStaffEmploymentValues,
  UpdateStaffPersonalValues,
} from "../types/staff.types";

type ApiResponse<T> = {
  success?: boolean;
  status?: boolean | string | number;
  message?: string;
  data: T;
};

type RawRole = {
  id?: ApiId;
  name?: string;
};

type RawUser = {
  id?: ApiId;

  first_name?: string;
  father_name?: string;
  mother_name?: string;
  last_name?: string;

  phone_number?: string;
  email?: string | null;

  birth_date?: string | null;
  birth_place?: string | null;

  gender?: StaffProfile["gender"];
  nationality?: StaffProfile["nationality"];

  address?: string | null;
  photo_url?: string | null;
  account_status?: string;

  roles?: RawRole[];
};

type RawStaff = {
  id?: ApiId;

  user_id?: ApiId;
  userId?: ApiId;

  first_name?: string;
  firstName?: string;

  father_name?: string;
  fatherName?: string;

  mother_name?: string;
  motherName?: string;

  last_name?: string;
  lastName?: string;

  full_name?: string;
  fullName?: string;

  phone_number?: string;
  phoneNumber?: string;

  email?: string | null;

  birth_date?: string | null;
  birthDate?: string | null;

  birth_place?: string | null;
  birthPlace?: string | null;

  gender?: StaffProfile["gender"];
  nationality?: StaffProfile["nationality"];

  address?: string | null;

  photo_url?: string | null;
  photoUrl?: string | null;

  account_status?: string;
  accountStatus?: string;

  degree?: StaffProfile["degree"];
  specialization?: string | null;
  university?: string | null;

  graduation_year?: number | string | null;
  graduationYear?: number | null;

  hire_date?: string | null;
  hireDate?: string | null;

  experience_years?: number | string | null;
  experienceYears?: number | null;

  service_type?: StaffProfile["serviceType"];
  serviceType?: StaffProfile["serviceType"];

  role?: StaffRole | string | null;

  is_deleted?: boolean;
  isDeleted?: boolean;

  deleted_at?: string | null;
  deletedAt?: string | null;

  created_at?: string | null;
  createdAt?: string | null;

  updated_at?: string | null;
  updatedAt?: string | null;

  user?: RawUser;
};

type RawPaginator = {
  data: RawStaff[];

  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;

  from?: number | null;
  to?: number | null;

  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;

    from?: number | null;
    to?: number | null;
  };
};

function unwrap<T>(value: ApiResponse<T> | T): T {
  if (
    typeof value === "object" &&
    value !== null &&
    "data" in value
  ) {
    return (value as ApiResponse<T>).data;
  }

  return value as T;
}

function nullableNumber(value: unknown): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : null;
}

function normalizeRole(value: unknown): StaffRole | null {
  const supportedRoles: StaffRole[] = [
    "teacher",
    "adviser",
    "secretary",
    "counselor",
    "service_staff",
  ];

  return supportedRoles.includes(value as StaffRole)
    ? (value as StaffRole)
    : null;
}

function normalizeStaff(raw: RawStaff): StaffProfile {
  const user = raw.user;

  const firstName =
    raw.firstName ??
    raw.first_name ??
    user?.first_name ??
    "";

  const fatherName =
    raw.fatherName ??
    raw.father_name ??
    user?.father_name ??
    "";

  const motherName =
    raw.motherName ??
    raw.mother_name ??
    user?.mother_name ??
    "";

  const lastName =
    raw.lastName ??
    raw.last_name ??
    user?.last_name ??
    "";

  const roleFromUser =
    user?.roles
      ?.map((role) => role.name)
      .find(Boolean) ?? null;

  const deletedAt =
    raw.deletedAt ??
    raw.deleted_at ??
    null;

  return {
    id: raw.id ?? "",

    userId:
      raw.userId ??
      raw.user_id ??
      user?.id ??
      null,

    firstName,
    fatherName,
    motherName,
    lastName,

    fullName:
      raw.fullName ??
      raw.full_name ??
      [firstName, fatherName, lastName]
        .filter(Boolean)
        .join(" "),

    phoneNumber:
      raw.phoneNumber ??
      raw.phone_number ??
      user?.phone_number ??
      "",

    email:
      raw.email ??
      user?.email ??
      null,

    birthDate:
      raw.birthDate ??
      raw.birth_date ??
      user?.birth_date ??
      null,

    birthPlace:
      raw.birthPlace ??
      raw.birth_place ??
      user?.birth_place ??
      null,

    gender:
      raw.gender ??
      user?.gender ??
      null,

    nationality:
      raw.nationality ??
      user?.nationality ??
      null,

    address:
      raw.address ??
      user?.address ??
      null,

    photoUrl:
      raw.photoUrl ??
      raw.photo_url ??
      user?.photo_url ??
      null,

    accountStatus:
      raw.accountStatus ??
      raw.account_status ??
      user?.account_status ??
      "disabled",

    degree: raw.degree ?? null,

    specialization:
      raw.specialization ?? null,

    university:
      raw.university ?? null,

    graduationYear:
      raw.graduationYear ??
      nullableNumber(raw.graduation_year),

    hireDate:
      raw.hireDate ??
      raw.hire_date ??
      null,

    experienceYears:
      raw.experienceYears ??
      nullableNumber(raw.experience_years),

    serviceType:
      raw.serviceType ??
      raw.service_type ??
      null,

    role: normalizeRole(
      raw.role ?? roleFromUser,
    ),

    isDeleted:
      raw.isDeleted ??
      raw.is_deleted ??
      Boolean(deletedAt),

    deletedAt,

    createdAt:
      raw.createdAt ??
      raw.created_at ??
      null,

    updatedAt:
      raw.updatedAt ??
      raw.updated_at ??
      null,
  };
}

function normalizePaginator(raw: RawPaginator): StaffPaginator {
  const meta = raw.meta ?? {};

  return {
    data: (raw.data ?? []).map(normalizeStaff),

    currentPage:
      raw.current_page ??
      meta.current_page ??
      1,

    lastPage:
      raw.last_page ??
      meta.last_page ??
      1,

    perPage:
      raw.per_page ??
      meta.per_page ??
      15,

    total:
      raw.total ??
      meta.total ??
      raw.data?.length ??
      0,

    from:
      raw.from ??
      meta.from ??
      null,

    to:
      raw.to ??
      meta.to ??
      null,
  };
}

function appendFormDataValue(
  formData: FormData,
  key: string,
  value: unknown,
): void {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return;
  }

  if (value instanceof File) {
    formData.append(key, value);
    return;
  }

  formData.append(key, String(value));
}

function toFormData(
  values: Record<string, unknown>,
): FormData {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    appendFormDataValue(
      formData,
      key,
      value,
    );
  });

  return formData;
}

export const staffApi = {
  async getByRole(
    role: StaffRole,
    page = 1,
    perPage = 15,
  ): Promise<StaffPaginator> {
    const response = await axiosClient.get<
      ApiResponse<RawPaginator> | RawPaginator
    >(
      staffEndpoints.byRole(role),
      {
        params: {
          page,
          per_page: perPage,
        },
      },
    );

    return normalizePaginator(
      unwrap(response.data),
    );
  },

  async getDetails(
    staffId: ApiId,
  ): Promise<StaffProfile> {
    const response = await axiosClient.get<
      ApiResponse<RawStaff> | RawStaff
    >(
      staffEndpoints.details(staffId),
    );

    return normalizeStaff(
      unwrap(response.data),
    );
  },

  async register(
    role: StaffRole,
    values: RegisterStaffValues,
  ): Promise<StaffProfile> {
    const payload = {
      ...values,
      role,
    };

    const response = await axiosClient.post<
      ApiResponse<RawStaff> | RawStaff
    >(
      staffEndpoints.register,
      toFormData(
        payload as Record<string, unknown>,
      ),
    );

    return normalizeStaff(
      unwrap(response.data),
    );
  },

  async updatePersonal(
    staffId: ApiId,
    values: UpdateStaffPersonalValues,
  ): Promise<StaffProfile> {
    const response = await axiosClient.post<
      ApiResponse<RawStaff> | RawStaff
    >(
      staffEndpoints.personal(staffId),
      toFormData(
        values as Record<string, unknown>,
      ),
    );

    return normalizeStaff(
      unwrap(response.data),
    );
  },

  async updateEmployment(
    staffId: ApiId,
    values: UpdateStaffEmploymentValues,
  ): Promise<StaffProfile> {
    const response = await axiosClient.post<
      ApiResponse<RawStaff> | RawStaff
    >(
      staffEndpoints.employment(staffId),
      values,
    );

    return normalizeStaff(
      unwrap(response.data),
    );
  },

  async toggleStatus(
    staffId: ApiId,
  ): Promise<void> {
    await axiosClient.post(
      staffEndpoints.toggleStatus(staffId),
    );
  },

  async remove(
    staffId: ApiId,
  ): Promise<void> {
    await axiosClient.delete(
      staffEndpoints.remove(staffId),
    );
  },
};