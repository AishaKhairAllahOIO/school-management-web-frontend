// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/shared/ui/dialog";

// import { ExtraServiceForm } from "./ExtraServiceForm";

// import type { ExtraServiceFormValues } from "../../schemas/extraService.schema";

// type Props = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   feePlans: { id: string; name: string }[];
//   isLoading?: boolean;
//   onSubmit: (values: ExtraServiceFormValues) => void;
// };

// export function CreateExtraServiceDialog({ open, onOpenChange, feePlans, isLoading, onSubmit }: Props) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-xl">
//         <DialogHeader>
//           <DialogTitle>Create extra service</DialogTitle>
//           <DialogDescription>Create a new extra service for a fee plan.</DialogDescription>
//         </DialogHeader>
//         <ExtraServiceForm feePlans={feePlans} isLoading={isLoading} onSubmit={onSubmit} />
//       </DialogContent>
//     </Dialog>
//   );
// }
