import { LegalDocumentType } from "@/features/legal/types/documentTypes";
import { VehicleRentCard } from "@/features/legal/documents/VehicleRentForm";
import { PremiseRentCard } from "@/features/legal/documents/PremiseRentForm";
import { ServiceContractCard } from "@/features/legal/documents/ServiceContractForm";
import { ServiceAgreementMSBCard } from "@/features/legal/documents/ServiceAgreementMSBForm";
import { GoodsSupplyCard } from "@/features/legal/documents/GoodsSupplyForm";
import type { VehicleRentContract } from "@/features/legal/documents/VehicleRentForm/types";
import type { PremiseRentContract } from "@/features/legal/documents/PremiseRentForm/types";
import type { ServiceContractContract } from "@/features/legal/documents/ServiceContractForm/types/api";
import type { ServiceAgreementMSBContract } from "@/features/legal/documents/ServiceAgreementMSBForm";
import type { GoodsSupplyContract } from "@/features/legal/documents/GoodsSupplyForm/types";
import type { CompletionActListItem } from "@/features/legal/documents/CompletionActForm/types";

type LegalDocument =
  | VehicleRentContract
  | PremiseRentContract
  | ServiceContractContract
  | ServiceAgreementMSBContract
  | GoodsSupplyContract;

interface DocumentItem {
  doc: LegalDocument;
  type: LegalDocumentType;
  actsCount?: number;
  completionActs?: CompletionActListItem[];
}

interface Props {
  documents: DocumentItem[];
}

export default function ApplicationsCardsView({ documents }: Props) {
  const renderCard = (item: DocumentItem) => {
    const { doc, type, actsCount, completionActs } = item;

    switch (type) {
      case LegalDocumentType.VEHICLE_RENTAL:
        return (
          <VehicleRentCard key={`${type}-${doc.id}`} document={doc as VehicleRentContract} actsCount={actsCount} />
        );
      case LegalDocumentType.PREMISES_LEASE:
        return (
          <PremiseRentCard key={`${type}-${doc.id}`} document={doc as PremiseRentContract} actsCount={actsCount} />
        );
      case LegalDocumentType.SERVICE_AGREEMENT_INDIVIDUAL:
        return (
          <ServiceContractCard
            key={`${type}-${doc.id}`}
            document={doc as ServiceContractContract}
            completionActs={completionActs || []}
          />
        );
      case LegalDocumentType.SERVICE_AGREEMENT_MSB:
        return <ServiceAgreementMSBCard key={`${type}-${doc.id}`} document={doc as ServiceAgreementMSBContract} />;
      case LegalDocumentType.GOODS_SUPPLY:
        return <GoodsSupplyCard key={`${type}-${doc.id}`} document={doc as GoodsSupplyContract} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-7 pb-8">
      {documents.map((item) => renderCard(item))}
    </div>
  );
}

