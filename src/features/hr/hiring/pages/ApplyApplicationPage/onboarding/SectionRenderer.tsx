import { useAppSelector } from "@/shared/hooks";
import type { SectionKey } from "@/features/hr/hiring";
import AddressesForm from "./adresses/AddressesForm";
import BankingForm from "./banking/BankingForm";
import ContactsForm from "./contacts/ContactForm";
import EducationList from "./education/EducationList";
import EmergencyForm from "./emergency/EmergencyForm";
import ExperienceList from "./experience/ExperienceList";
import GeneralForm from "./general/GeneralForm";
import IdDocumentsForm from "./id-documents/IdDocumentsForm";
import SocialCategoriesList from "./social-categories/SocialCategoriesList";

interface Props {
  section: SectionKey;
  token: string;
  onSubmit: () => void;
}

export default function SectionRenderer({ section, token, onSubmit }: Props) {
  const gender = useAppSelector((s) => s.completeness.gender);

  switch (section) {
    case "personal_data":
      return <GeneralForm token={token} openSubmit={onSubmit} />;
    case "contacts":
      return <ContactsForm token={token} openSubmit={onSubmit} />;
    case "addresses":
      return <AddressesForm token={token} openSubmit={onSubmit} />;
    case "emergency_contacts":
      return <EmergencyForm token={token} openSubmit={onSubmit} />;
    case "id_documents":
      return <IdDocumentsForm token={token} gender={gender ?? undefined} openSubmit={onSubmit} />;
    case "banking":
      return <BankingForm token={token} openSubmit={onSubmit} />;
    case "education":
      return <EducationList token={token} onSubmit={onSubmit} />;
    case "experience":
      return <ExperienceList token={token} onSubmit={onSubmit} />;
    case "social_categories":
      return <SocialCategoriesList token={token} onSubmit={onSubmit} />;
    default:
      return null;
  }
}
