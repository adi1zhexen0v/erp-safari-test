import { Calendar, Profile, Location } from "iconsax-react";
import { Badge, Button } from "@/shared/ui";

export default function ConsultationCardsView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      <div className="flex flex-col gap-5 radius-lg border surface-base-stroke surface-base-fill p-5">
        <div className="flex flex-col gap-2">
          <Badge variant="soft" color="info" text="Запланирована" icon={<Calendar size={12} color="currentColor" />} />
          <p className="text-body-bold-lg content-base-primary">Вопросы налогообложения НПО</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="py-3 border-b border-t surface-base-stroke flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">Юрист</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Profile size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">Иванова А.А.</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">Дата приглашения</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">12.05.2025</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">Дата записи</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">12.05.2025, 14:30</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-3 border-t surface-base-stroke">
            <span className="text-body-bold-xs content-base-secondary">Формат</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Location size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">Онлайн</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">Ссылка</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">https://meet.google.com/vbv-kymo-yfu</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="secondary" size="md">
            Подключиться на созвон
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5 radius-lg border surface-base-stroke surface-base-fill p-5">
        <div className="flex flex-col gap-2">
          <Badge variant="soft" color="info" text="Запланирована" icon={<Calendar size={12} color="currentColor" />} />
          <p className="text-body-bold-lg content-base-primary">Вопросы налогообложения НПО</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="py-3 border-b border-t surface-base-stroke flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">Юрист</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Profile size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">Иванова А.А.</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">Дата приглашения</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">12.05.2025</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">Дата записи</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">12.05.2025, 14:30</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-3 border-t surface-base-stroke">
            <span className="text-body-bold-xs content-base-secondary">Формат</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Location size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">Оффлайн</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">Место проведения</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">улица Самал, дом 11, г. Астана</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="secondary" size="md">
            Построить маршрут
          </Button>
        </div>
      </div>
    </div>
  );
}
