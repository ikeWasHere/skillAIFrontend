import { useSearchParams } from "react-router";

import { Hero } from "../sections/Hero";
import { TopSkills } from "../sections/TopSkills";
import { TopCertificates } from "../sections/TopCertificates";
import { useCertifications, useFilters, useSkills } from "../hooks/useSkillIq";

export function HomePage() {
  const roles = useFilters();
  const [params, setParams] = useSearchParams();

  /* The chosen role lives in the URL so that coming back from a jobs list lands on
     the same role. Until the role list arrives there is nothing to validate it
     against; after that, an unknown value falls back to the first option. */
  const picked = params.get("role");
  const role =
    roles.data?.find((r) => r.value === picked)?.value ?? roles.data?.[0]?.value ?? null;
  const roleLabel = roles.data?.find((r) => r.value === role)?.label ?? "";

  const pickRole = (value: string) =>
    setParams({ role: value }, { replace: true, preventScrollReset: true });

  /* One request feeds two sections: `metrics` for the hero tiles, `skills` for the
     skill board. Fetching it here keeps that to a single call per role. */
  const skills = useSkills(role);
  const certificates = useCertifications(role);

  return (
    <>
      <Hero roles={roles} role={role} onRoleChange={pickRole} skills={skills} />
      <TopSkills role={role} roleLabel={roleLabel} skills={skills} />
      <TopCertificates role={role} roleLabel={roleLabel} certificates={certificates} />
    </>
  );
}
