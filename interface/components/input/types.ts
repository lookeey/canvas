import { UseFormReturn } from "react-hook-form";

export interface QuickSelectProps {
  setValue: UseFormReturn<any>["setValue"];
  showSlider?: boolean;
  showMax?: boolean;
  showQuickSelect?: boolean;
}
