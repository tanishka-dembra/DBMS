import { Suspense } from "react";
import { InfBuilder } from "@/features/inf/components/InfBuilder";

export default function NewInfPage() {
  return (
    <Suspense fallback={null}>
      <InfBuilder />
    </Suspense>
  );
}
