import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolLawsService } from "../services/school-laws.service";
import type { LawPayload } from "../types/school-laws.types";

export function useSchoolLaws() {
  const queryClient = useQueryClient();


  const lawsQuery = useQuery({
    queryKey: ["school-laws"],
    queryFn: schoolLawsService.getAllLaws,
  });


  const createLawMutation = useMutation({
    mutationFn: (payload: LawPayload) => schoolLawsService.createLaw(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-laws"] });
      alert("✅ تمت إضافة القانون بنجاح");
    },
    onError: (err: any) => {
      alert("❌ فشل في الإضافة: " + (err.response?.data?.message || "خطأ غير معروف"));
    }
  });


  const updateLawMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<LawPayload> }) =>
      schoolLawsService.updateLaw(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-laws"] });
      alert("✅ تم تعديل القانون بنجاح");
    },
  });


  const deleteLawMutation = useMutation({
    mutationFn: (id: string | number) => schoolLawsService.deleteLaw(id),
    onSuccess: (_, deletedId) => {

        queryClient.setQueryData(["school-laws"], (oldData: any[] = []) =>
        oldData.filter((law) => law.id !== deletedId)
      );
    },
  });

  return {
    laws: lawsQuery.data ?? [],
    isLoading: lawsQuery.isLoading,
    createLaw: createLawMutation,
    updateLaw: updateLawMutation,
    deleteLaw: deleteLawMutation,
  };
}