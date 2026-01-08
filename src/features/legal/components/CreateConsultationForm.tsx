import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Message } from "iconsax-react";
import { ModalForm, Input, Button, DatePicker, RadioGroup, RadioButton, Select } from "@/shared/ui";
import type { Locale } from "@/shared/utils/types";

interface Props {
  onClose: () => void;
}

export default function CreateConsultationForm({ onClose }: Props) {
  const { t, i18n } = useTranslation("LegalConsultationsPage");
  const locale = (i18n.language as Locale) || "ru";
  const [topic, setTopic] = useState<string | null>(null);
  const [format, setFormat] = useState<string>("offline");
  const [dateTime, setDateTime] = useState<Date | null>(null);

  const topicOptions = [
    { label: t("form.topic.options.tax"), value: "tax" },
    { label: t("form.topic.options.legal"), value: "legal" },
    { label: t("form.topic.options.finance"), value: "finance" },
  ];

  return (
    <ModalForm icon={Message} onClose={onClose}>
      <form className="flex flex-col justify-between p-1 h-full">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
            <h4 className="text-display-2xs content-base-primary">{t("form.title")}</h4>
            <p className="text-body-regular-sm content-base-secondary">{t("form.description")}</p>
          </div>

          <div className="flex flex-col gap-4">
            <Select
              label={t("form.topic.label")}
              placeholder={t("form.topic.placeholder")}
              value={topic}
              onChange={setTopic}
              options={topicOptions}
            />

            <div className="flex flex-col gap-2">
              <span className="text-label-sm content-base-primary">{t("form.format.label")}</span>

              <RadioGroup
                name="meeting_format"
                value={format}
                onChange={setFormat}
                wrapperClassName="grid grid-cols-2 gap-2">
                <RadioButton value="offline" label={t("form.format.offline")} />
                <RadioButton value="online" label={t("form.format.online")} />
              </RadioGroup>
            </div>

            {format === "offline" ? (
              <Input label={t("form.location.label")} placeholder={t("form.location.placeholder")} />
            ) : (
              <Input label={t("form.meetingLink.label")} placeholder={t("form.meetingLink.placeholder")} />
            )}

            <DatePicker
              label={t("form.dateTime.label")}
              placeholder={t("form.dateTime.placeholder")}
              mode="single"
              locale={locale}
              value={dateTime}
              onChange={setDateTime}
              hasTime={true}
            />

            <Input label={t("form.details.label")} placeholder={t("form.details.placeholder")} isTextarea />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] gap-3">
          <Button variant="secondary" className="py-3" onClick={onClose}>
            {t("form.cancel")}
          </Button>
          <Button variant="primary" className="py-3">
            {t("form.submit")}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}
