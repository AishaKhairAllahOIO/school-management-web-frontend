import {
  useMutation,
} from "@tanstack/react-query";
import {
  toast,
} from "sonner";

import {
  getAxiosErrorMessage,
} from "@/services/axios/axiosError";

import {
  communicationService,
} from "../services/communications.service";
import type {
  AdvisorAlertPayload,
  PaymentAlertPayload,
  StaffAlertPayload,
} from "../types/communication.types";

export function useAlerts() {
  const commonOptions = {
    onSuccess: () => {
      toast.success("Alert sent successfully.");
    },
    onError: (error: unknown) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  };

  const sendPaymentAlert = useMutation({
    mutationFn: (payload: PaymentAlertPayload) =>
      communicationService.sendPaymentAlert(payload),
    ...commonOptions,
  });

  const sendAdvisorAlert = useMutation({
    mutationFn: (payload: AdvisorAlertPayload) =>
      communicationService.sendAdvisorAlert(payload),
    ...commonOptions,
  });

  const sendStaffAlert = useMutation({
    mutationFn: (payload: StaffAlertPayload) =>
      communicationService.sendStaffAlert(payload),
    ...commonOptions,
  });

  const deleteAlert = useMutation({
    mutationFn: (id: string | number) =>
      communicationService.deleteAlert(id),
    onSuccess: () => {
      toast.success("Alert deleted successfully.");
    },
    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error),
      );
    },
  });

  return {
    sendPaymentAlert,
    sendAdvisorAlert,
    sendStaffAlert,
    deleteAlert,
    isSending:
      sendPaymentAlert.isPending ||
      sendAdvisorAlert.isPending ||
      sendStaffAlert.isPending,
  };
}
