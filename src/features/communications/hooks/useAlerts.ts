import { useMutation } from "@tanstack/react-query";
import { communicationService } from "../services/communications.service";
import type {
  PaymentAlertPayload,
  AdvisorAlertPayload,
  StaffAlertPayload,
} from "../types/communication.types";

export function useAlerts() {

  const sendPaymentAlertMutation = useMutation({
    mutationFn: (payload: PaymentAlertPayload) => communicationService.sendPaymentAlert(payload),
  });


  const sendAdvisorAlertMutation = useMutation({
    mutationFn: (payload: AdvisorAlertPayload) => communicationService.sendAdvisorAlert(payload),
  });


  const sendStaffAlertMutation = useMutation({
    mutationFn: (payload: StaffAlertPayload) => communicationService.sendStaffAlert(payload),
  });


  const deleteAlertMutation = useMutation({
    mutationFn: (id: string | number) => communicationService.deleteAlert(id),
  });

  return {
    sendPaymentAlert: sendPaymentAlertMutation,
    sendAdvisorAlert: sendAdvisorAlertMutation,
    sendStaffAlert: sendStaffAlertMutation,
    deleteAlert: deleteAlertMutation,

    isSending:
      sendPaymentAlertMutation.isPending ||
      sendAdvisorAlertMutation.isPending ||
      sendStaffAlertMutation.isPending,
  };
}