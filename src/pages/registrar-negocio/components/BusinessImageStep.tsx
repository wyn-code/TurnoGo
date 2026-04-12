import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";
import { Input } from "@/components/ui/input";

type Props = {
  form: UseFormReturn<FormData>;
};

export default function BusinessImageStep({ form }: Props) {
  const { register } = form;

  return (
    <div>
      <Input {...register("image")} placeholder="URL de imagen" />
    </div>
  );
}