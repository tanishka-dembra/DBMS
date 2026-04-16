import { Suspense } from "react";
import { JnfBuilder } from "@/features/jnf/components/JnfBuilder";

export default function NewJnfPage() {
  return (
    <Suspense fallback={null}>
      <JnfBuilder />
    </Suspense>
  );
}
