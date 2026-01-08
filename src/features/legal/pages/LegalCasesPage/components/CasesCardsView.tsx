import { MaskLeft, Calendar } from "iconsax-react";
import { Badge, Button } from "@/shared/ui";

export default function CasesCardsView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      <div className="flex flex-col gap-5 radius-lg border surface-base-stroke surface-base-fill p-5">
        <Badge variant="soft" color="info" text="В процессе" />
        <div className="flex flex-col gap-2">
          <p className="text-body-bold-lg content-base-primary">Проверка налоговой службы</p>
          <p className="text-label-xs content-base-secondary">Подготовка к проверке и сбор документов</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="py-3 border-b border-t surface-base-stroke flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">Приоритет</span>
            <Badge
              variant="filled"
              color="notice"
              text="Средний"
              icon={<MaskLeft variant="Bold" size={12} color="currentColor" />}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">Дата начала</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">12.05.2025</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="primary" size="md">
            Редактировать
          </Button>
          <Button variant="secondary" size="md">
            Подробнее
          </Button>
        </div>
      </div>
    </div>
  );
}
