import type { SectionId } from "@/features/hr/contracts/types";
import { BasicInfoForm, PositionDutiesForm, WorkScheduleForm } from "../sections";

interface Props {
  id: SectionId;
}

const SECTION_COMPONENTS: Record<SectionId, React.FC> = {
  basic_info: BasicInfoForm,
  position_duties: PositionDutiesForm,
  work_schedule: WorkScheduleForm,
};

export default function SectionRenderer({ id }: Props) {
  const Component = SECTION_COMPONENTS[id];
  return <Component />;
}
