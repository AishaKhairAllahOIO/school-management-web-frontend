import { academicSettingsMock } from "../mocks/academic-settings.mock";
import type {
  AcademicSettings,
  AcademicSettingsViewData,
  AcademicStage,
  AcademicTerm,
  AcademicYear,
  CreateAcademicStagePayload,
  CreateAcademicTermPayload,
  CreateAcademicYearPayload,
  UpdateAcademicSettingsPayload,
  UpdateAcademicStagePayload,
  UpdateAcademicTermPayload,
  UpdateAcademicYearPayload,
} from "../types/academic-settings.types";
import { createId, getAcademicYearName } from "../utils/academic-settings.utils";

const wait = () => new Promise((resolve) => setTimeout(resolve, 220));
let mockData: AcademicSettingsViewData = structuredClone(academicSettingsMock);
const stamp = () => new Date().toISOString();

export const academicSettingsApi = {
  async getViewData(): Promise<AcademicSettingsViewData> {
    await wait();
    return structuredClone(mockData);
  },

  async updateSettings(payload: UpdateAcademicSettingsPayload): Promise<AcademicSettings> {
    await wait();
    mockData.settings = { ...mockData.settings, ...payload, updatedAt: stamp() };
    return structuredClone(mockData.settings);
  },

  async createAcademicYear(payload: CreateAcademicYearPayload): Promise<AcademicYear> {
    await wait();
    const year: AcademicYear = {
      id: createId("year"),
      name: getAcademicYearName(payload.startDate, payload.endDate),
      ...payload,
      createdAt: stamp(),
      updatedAt: stamp(),
    };

    if (payload.isCurrent) {
      mockData.academicYears = mockData.academicYears.map((item) => ({ ...item, isCurrent: false }));
      mockData.settings.currentAcademicYearId = year.id;
    }

    mockData.academicYears = [year, ...mockData.academicYears];
    return structuredClone(year);
  },

  async updateAcademicYear(id: string, payload: UpdateAcademicYearPayload): Promise<AcademicYear> {
    await wait();

    if (payload.isCurrent) {
      mockData.academicYears = mockData.academicYears.map((item) => ({ ...item, isCurrent: false }));
      mockData.settings.currentAcademicYearId = id;
    }

    mockData.academicYears = mockData.academicYears.map((year) =>
      year.id === id
        ? {
            ...year,
            ...payload,
            name:
              payload.startDate && payload.endDate
                ? getAcademicYearName(payload.startDate, payload.endDate)
                : year.name,
            updatedAt: stamp(),
          }
        : year
    );

    return structuredClone(mockData.academicYears.find((item) => item.id === id)!);
  },

  async deleteAcademicYear(id: string): Promise<void> {
    await wait();
    mockData.academicYears = mockData.academicYears.filter((item) => item.id !== id);
    mockData.academicTerms = mockData.academicTerms.filter((item) => item.academicYearId !== id);
  },

  async createAcademicTerm(payload: CreateAcademicTermPayload): Promise<AcademicTerm> {
    await wait();
    const term: AcademicTerm = {
      id: createId("term"),
      ...payload,
      createdAt: stamp(),
      updatedAt: stamp(),
    };

    if (payload.isCurrent) {
      mockData.academicTerms = mockData.academicTerms.map((item) =>
        item.academicYearId === payload.academicYearId ? { ...item, isCurrent: false } : item
      );
      mockData.settings.currentAcademicTermId = term.id;
    }

    mockData.academicTerms = [term, ...mockData.academicTerms];
    return structuredClone(term);
  },

  async updateAcademicTerm(id: string, payload: UpdateAcademicTermPayload): Promise<AcademicTerm> {
    await wait();
    const currentTerm = mockData.academicTerms.find((item) => item.id === id);

    if (payload.isCurrent && currentTerm) {
      mockData.academicTerms = mockData.academicTerms.map((item) =>
        item.academicYearId === currentTerm.academicYearId ? { ...item, isCurrent: false } : item
      );
      mockData.settings.currentAcademicTermId = id;
    }

    mockData.academicTerms = mockData.academicTerms.map((term) =>
      term.id === id ? { ...term, ...payload, updatedAt: stamp() } : term
    );

    return structuredClone(mockData.academicTerms.find((item) => item.id === id)!);
  },

  async deleteAcademicTerm(id: string): Promise<void> {
    await wait();
    mockData.academicTerms = mockData.academicTerms.filter((item) => item.id !== id);
  },

  async createAcademicStage(payload: CreateAcademicStagePayload): Promise<AcademicStage> {
    await wait();
    const stage: AcademicStage = {
      id: createId("stage"),
      ...payload,
      createdAt: stamp(),
      updatedAt: stamp(),
    };
    mockData.academicStages = [stage, ...mockData.academicStages];
    return structuredClone(stage);
  },

  async updateAcademicStage(id: string, payload: UpdateAcademicStagePayload): Promise<AcademicStage> {
    await wait();
    mockData.academicStages = mockData.academicStages.map((stage) =>
      stage.id === id ? { ...stage, ...payload, updatedAt: stamp() } : stage
    );
    return structuredClone(mockData.academicStages.find((item) => item.id === id)!);
  },

  async deleteAcademicStage(id: string): Promise<void> {
    await wait();
    mockData.academicStages = mockData.academicStages.filter((item) => item.id !== id);
  },
};
