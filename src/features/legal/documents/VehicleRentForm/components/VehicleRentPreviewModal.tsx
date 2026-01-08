import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1, ArrowRight2 } from "iconsax-react";
import { Button, ModalForm, Toast } from "@/shared/ui";
import { useAppSelector } from "@/shared/hooks";
import { formatPrice } from "@/shared/utils";
import type { CommercialOrganization } from "../../../types/commercialOrganizations";
import { VehicleHandoverPreviewModal, type VehicleHandoverAct } from "../../VehicleHandoverForm";
import type { VehicleRentPreviewData } from "../types";
import { getOrganizationName, findOrganizationById } from "../utils";
import VehicleRentPreviewModalSkeleton from "./VehicleRentPreviewModalSkeleton";

interface Props {
  formData?: VehicleRentPreviewData;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit?: () => Promise<{ id: number; data: unknown } | null>;
  hasBackground: boolean;
  editId?: number;
  onSuccess?: (isEdit: boolean) => void;
  readOnly?: boolean;
  commercialOrganizations?: CommercialOrganization[];
  commercialOrg?: CommercialOrganization;
  handovers?: VehicleHandoverAct[];
  actsCount?: number;
  resize?: boolean;
}

export default function VehicleRentPreviewModal({
  formData,
  isLoading = false,
  onClose,
  onSubmit,
  hasBackground = false,
  editId,
  onSuccess,
  readOnly = false,
  commercialOrganizations = [],
  commercialOrg,
  handovers = [],
  actsCount,
  resize = true,
}: Props) {
  const { t, i18n } = useTranslation("LegalTemplatesPage");
  const { t: tCards } = useTranslation("LegalApplicationsPage");
  const userData = useAppSelector((state) => state.auth.data?.user);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedHandoverId, setSelectedHandoverId] = useState<number | null>(null);
  const isEditMode = !!editId;

  const organization = useMemo(() => {
    if (commercialOrg) return commercialOrg;
    if (formData?.commercial_org_id) {
      return findOrganizationById(commercialOrganizations, formData.commercial_org_id);
    }
    return null;
  }, [commercialOrg, formData?.commercial_org_id, commercialOrganizations]);

  const locale = i18n.language === "kk" ? "kk" : "ru";
  const orgName = getOrganizationName(organization, locale);

  async function handleSubmit() {
    if (!onSubmit || !formData) return;

    try {
      setError(null);
      setIsSubmitting(true);

      await onSubmit();

      onClose();
      if (onSuccess) {
        onSuccess(isEditMode);
      }
    } catch (err: unknown) {
      const apiError = err as { data?: { error?: string; message?: string; detail?: string } };
      const errorMessage =
        apiError?.data?.error ||
        apiError?.data?.message ||
        apiError?.data?.detail ||
        (isEditMode ? t("forms.vehicleRent.errors.updateFailed") : t("forms.vehicleRent.errors.createFailed"));
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !formData) {
    return <VehicleRentPreviewModalSkeleton onClose={onClose} hasBackground={hasBackground} resize={resize} />;
  }

  return (
    <ModalForm icon={DocumentText1} onClose={onClose} resize={resize} hasBackground={hasBackground}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">{t("forms.vehicleRent.previewTitle")}</h4>
        </div>

        <div className="flex-1 overflow-auto page-scroll pr-5 pt-5">
          <div className="flex flex-col text-body-regular-md content-base-primary">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">ДОГОВОР АРЕНДЫ ТРАНСПОРТНОГО СРЕДСТВА</h1>
              <div className="flex justify-between text-sm mt-4">
                <span>
                  г. <strong>{formData.contract_city || "_____________"}</strong>
                </span>
                <strong>{formData.contract_date || "_____________"}</strong>
              </div>
            </div>

            <div className="mb-6 text-justify">
              <p className="mb-2">
                <strong>{orgName}</strong>, в лице <strong>{organization?.representative || "_____________"}</strong>,
                действующего на основании <strong>{organization?.basis || "_____________"}</strong>, именуемый в
                дальнейшем «Арендодатель», с одной стороны, и{" "}
                <strong>{userData?.organization || "_____________"}</strong> в лице директора{" "}
                <strong>{userData?.full_name || "_____________"}</strong>, действующего на основании{" "}
                <strong>{organization?.basis || "_____________"}</strong> именуемый в дальнейшем «Арендатор», с другой
                стороны, заключили настоящий договор о нижеследующем:
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">1. ПРЕДМЕТ ДОГОВОРА</h2>

              <p className="mb-2">
                1.1. Арендодатель обязуется предоставить Арендатору во временное владение и пользование транспортное
                средство со следующими характеристиками:
              </p>
              <ul className="list-inside ml-6 mb-2">
                <li>
                  марки <strong>{formData.car_brand || "_____________"}</strong>, год выпуска:{" "}
                  <strong>{formData.car_year || "_____________"}</strong>
                </li>
                <li>
                  VIN/кузов/шасси <strong>{formData.car_vin || "_____________"}</strong>, регистрационный номер{" "}
                  <strong>{formData.car_plate || "_____________"}</strong>
                </li>
                <li>
                  цвет <strong>{formData.car_color || "_____________"}</strong>
                </li>
              </ul>
              <p className="mb-2">Арендатор обязуется уплачивать арендную плату за указанное Транспортное средство.</p>

              <p className="mb-2">1.2. Транспортное средство сдается в аренду для служебных целей Арендатора.</p>

              <p className="mb-2">
                1.3. Срок аренды Транспортного средства составляет:{" "}
                <strong>
                  {formData.rental_term_text?.endsWith(".")
                    ? formData.rental_term_text.slice(0, -1)
                    : formData.rental_term_text || "_____________"}
                </strong>
                .
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">2. АРЕНДНАЯ ПЛАТА И ПОРЯДОК РАСЧЕТОВ</h2>

              <p className="mb-2">
                2.1. Размер арендной платы составляет{" "}
                <strong>{formData.rental_amount ? formatPrice(formData.rental_amount) : "_____________"}</strong> (
                <strong>{formData.rental_amount_text || "_____________"}</strong>) тенге в месяц.
              </p>

              <p className="mb-2">2.2. Стоимость горюче-смазочных материалов (ГСМ) не входит в арендную плату.</p>

              <p className="mb-2">2.3. Арендная плата производится Арендатором Арендодателю ежемесячно.</p>

              <p className="mb-2">
                2.4. Из суммы, подлежащей выплате Арендодателю (в соответствии с п. 2.1), Арендатор удерживает налог в
                размере, определяемом действующим налоговым законодательством Республики Казахстан.
              </p>

              <p className="mb-2">
                2.5. В случае изменения ставок налогообложения физических лиц в соответствии с законодательством
                Республики Казахстан размер арендной платы подлежит корректировке.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">3. ПРАВА И ОБЯЗАННОСТИ СТОРОН</h2>

              <p className="mb-2">3.1. Арендодатель обязуется:</p>
              <ul className="list-inside ml-6 mb-2">
                <li>
                  3.1.1. Обеспечить сдаваемое в аренду Транспортное средство полным комплектом оборудования и
                  необходимыми документами.
                </li>
                <li>
                  3.1.2. По требованию Арендатора производить капитальный ремонт Транспортного средства за свой счет,
                  при условии, что повреждения не были вызваны виновными действиями Арендатора.
                </li>
                <li>3.1.3. Застраховать гражданскую ответственность как владелец Транспортного средства.</li>
              </ul>

              <p className="mb-2">3.2. Арендодатель вправе:</p>
              <ul className="list-inside ml-6 mb-2">
                <li>
                  3.2.1. Требовать возмещения ущерба или оплаты стоимости Транспортного средства в случае его утраты или
                  уничтожения по вине Арендатора. В случае частичного повреждения Арендодатель производит ремонт за счет
                  Арендатора.
                </li>
                <li>
                  3.2.2. Требовать от Арендатора принятия мер, направленных на надлежащее использование переданного
                  Транспортного средства.
                </li>
              </ul>

              <p className="mb-2">3.3. Арендатор обязуется:</p>
              <ul className="list-inside ml-6 mb-2">
                <li>3.3.1. Своевременно производить арендную плату.</li>
                <li>
                  3.3.2. Производить техническое обслуживание и текущий ремонт (замена масла, фильтров) Транспортного
                  средства за свой счет.
                </li>
                <li>
                  3.3.3. Соблюдать правила эксплуатации Транспортного средства, требования законодательства о дорожном
                  движении и рекомендации производителя.
                </li>
                <li>
                  3.3.4. Использовать Транспортное средство исключительно в служебных целях и не передавать его третьим
                  лицам без письменного согласия Арендодателя.
                </li>
                <li>
                  3.3.5. Обеспечивать сохранность Транспортного средства, принимая все разумные меры для предотвращения
                  его повреждения, утраты или хищения.
                </li>
                <li>
                  3.3.6. Немедленно уведомлять Арендодателя о любых авариях, повреждениях, неисправностях или иных
                  обстоятельствах, связанных с Транспортным средством.
                </li>
                <li>
                  3.3.7. Поддерживать внешнее и техническое состояние Транспортного средства в исправном состоянии,
                  своевременно проходить технические осмотры, диагностику и иные обязательные проверки.
                </li>
                <li>
                  3.3.8. Не вносить каких-либо изменений в конструкцию Транспортного средства без согласия Арендодателя.
                </li>
                <li>
                  3.3.9. В случае привлечения к административной ответственности, связанной с использованием
                  Транспортного средства, своевременно оплачивать штрафы и иные расходы, возникшие по вине Арендатора.
                </li>
                <li>
                  3.3.10. Возвратить Транспортное средство Арендодателю по окончании срока аренды в исправном состоянии,
                  с учетом нормального износа.
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">4. ОТВЕТСТВЕННОСТЬ СТОРОН</h2>

              <p className="mb-2">
                4.1. Арендатор несет ответственность перед Арендодателем за действия и бездействие водителя
                Транспортного средства в период аренды, если водитель является работником Арендатора, как за свои
                собственные.
              </p>

              <p className="mb-2">
                4.2. Арендатор несет ответственность за нарушения правил дорожного движения, правил эксплуатации и
                технических требований к Транспортному средству, совершенные водителем.
              </p>

              <p className="mb-2">
                4.3. В случае повреждения, утраты или уничтожения Транспортного средства по вине водителя Арендатор
                обязуется возместить причиненный ущерб в полном объеме.
              </p>

              <p className="mb-2">
                4.4. Все административные штрафы, пени и иные платежи, наложенные в связи с нарушениями, совершенными
                водителем, подлежат оплате Арендатором.
              </p>

              <p className="mb-2">
                4.5. Арендатор несет ответственность за передачу Транспортного средства третьим лицам водителем без
                согласия Арендодателя.
              </p>

              <p className="mb-2">
                4.6. Арендатор несет ответственность за ущерб, возникший в результате несвоевременного или ненадлежащего
                технического обслуживания, в том числе вызванного ошибками или небрежностью водителя.
              </p>

              <p className="mb-2">
                4.7. За иное неисполнение или ненадлежащее исполнение условий настоящего Договора Стороны несут
                ответственность в соответствии с действующим законодательством Республики Казахстан.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">5. РАССМОТРЕНИЕ СПОРОВ</h2>

              <p className="mb-2">
                5.1. Стороны обязуются разрешать все споры и разногласия, возникающие в связи с применением или
                толкованием настоящего договора, путем переговоров.
              </p>

              <p className="mb-2">
                5.2. В случае, если спор не может быть урегулирован путем переговоров, он подлежит рассмотрению в суде
                по месту нахождения ответчика.
              </p>

              <p className="mb-2">
                5.3. Все вопросы, не урегулированные Сторонами в настоящем договоре, разрешаются в соответствии с
                действующим законодательством Республики Казахстан.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">
                6. СРОК ДЕЙСТВИЯ ДОГОВОРА И ПОРЯДОК ЕГО РАСТОРЖЕНИЯ
              </h2>

              <p className="mb-2">
                6.1. Настоящий договор вступает в силу с момента его подписания, однако его условия распространяются на
                отношения между Сторонами, возникшие с указанной даты фактической передачи транспортного средства.
              </p>

              <p className="mb-2">
                6.2. Если ни одна из Сторон не уведомит другую Сторону о своем намерении расторгнуть договор за 10
                (десять) календарных дней до предполагаемой даты расторжения, договор автоматически пролонгируется на
                неопределенный срок.
              </p>

              <p className="mb-2">
                6.3. В течение срока аренды, начало и окончание которого определены в п. 6.1 настоящего Договора, а
                также в течение всех последующих возможных периодов пролонгации настоящего Договора, Арендодатель не
                имеет права в одностороннем порядке расторгнуть настоящий договор.
              </p>

              <p className="mb-2">
                6.4. Арендатор вправе в одностороннем порядке расторгнуть настоящий договор в любое время, при условии
                уведомления Арендодателя за 5 (пять) календарных дней до предполагаемой даты расторжения.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">
                7. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ И ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
              </h2>

              <p className="mb-2">
                7.1. Арендодатель начинает выполнение обязательств по настоящему договору с момента его подписания
                Сторонами.
              </p>

              <p className="mb-2">
                7.2. Риск случайной гибели или случайного повреждения сданного в аренду Транспортного средства в течение
                срока действия настоящего договора несет Арендодатель.
              </p>

              <p className="mb-2">
                7.3. При возврате Транспортного средства Арендатором Арендодателю последний соглашается с тем, что
                транспортное средство будет возвращено с учетом естественного износа.
              </p>

              <p className="mb-2">
                7.4. Вопросы, не урегулированные настоящим договором, разрешаются в порядке, установленном
                законодательством Республики Казахстан.
              </p>

              <p className="mb-2">
                7.5. Нарушение одной из Сторон условий настоящего договора не дает права другой Стороне предпринимать
                какие-либо ответные действия, также противоречащие условиям договора.
              </p>

              <p className="mb-2">
                7.6. Настоящий договор составлен на русском языке, подписан Сторонами в двух подлинных идентичных
                экземплярах имеющих одинаковую юридическую силу, по одному для каждой из Сторон.
              </p>

              <p className="mb-2">
                7.7. Заголовки статей в настоящем договоре приводятся исключительно для удобства пользования текстом и
                не принимаются во внимание при толковании условии договора.
              </p>

              <p className="mb-2">
                7.8. В случае, если отдельные положения настоящего договора теряют силу, другие положения договора
                остаются действующими и сохраняют силу. Вместо неправильного либо упущенного положения действующим
                признается то имеющееся в договоре положение, которое является наиболее близким по смыслу недействующему
                или пропущенному.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">8. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН</h2>

              <div className="flex justify-between mt-6">
                <div className="flex-1">
                  <p className="font-bold mb-2 text-lg">Арендодатель</p>
                  <p className="mb-1">
                    <strong>{orgName}</strong>
                  </p>
                  <p className="mb-1">
                    БИН: <strong>{organization?.bin || "_____________"}</strong>
                  </p>
                  <p className="mb-1">
                    Адрес: <strong>{organization?.address || "_____________"}</strong>
                  </p>
                  <p className="mb-1">
                    Банк: <strong>{formData.counterparty_bank_name || "_____________"}</strong>
                  </p>
                  <p className="mb-1">
                    IBAN: <strong>{formData.counterparty_iban || "_____________"}</strong>
                  </p>
                  <p className="mb-1">
                    БИК: <strong>{formData.counterparty_bik || "_____________"}</strong>
                  </p>
                  <div className="border-t border-black mt-4 mb-2 w-48"></div>
                  <p className="mb-1">
                    <strong>{organization?.representative || "_____________"}</strong>
                  </p>
                  <p className="text-sm mt-2">М.П.</p>
                </div>

                <div className="flex-1 text-right">
                  <p className="font-bold mb-2 text-lg">Арендатор</p>
                  <p className="mb-1">
                    <strong>{userData?.organization || "_____________"}</strong>
                  </p>
                  <p className="mb-1">
                    БИН: <strong>{userData?.organization_bin || "_____________"}</strong>
                  </p>
                  <p className="mb-1">
                    Адрес: <strong>{userData?.organization_address_ru || "_____________"}</strong>
                  </p>
                  <p className="mb-1">
                    Банк: <strong>{userData?.organization_bank_name || "_____________"}</strong>
                  </p>
                  <p className="mb-1">
                    IBAN: <strong>{userData?.organization_iban || "_____________"}</strong>
                  </p>
                  <p className="mb-1">
                    БИК: <strong>{userData?.organization_bik || "_____________"}</strong>
                  </p>
                  <div className="border-t border-black mt-4 mb-2 ml-auto w-48"></div>
                  <p className="mb-1">
                    <strong>{userData?.full_name || "_____________"}</strong>
                  </p>
                  <p className="text-sm mt-2">М.П.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {actsCount !== undefined && actsCount >= 1 && handovers.length > 0 && (
          <div className="flex flex-col gap-3 border-t surface-base-stroke pt-3 pb-3">
            <span className="text-body-bold-xs content-base-secondary">{tCards("cards.documents")}</span>
            <div className="flex flex-col gap-2">
              {handovers.map((handover) => (
                <div
                  key={handover.id}
                  className="flex items-center gap-1.5 cursor-pointer hover:background-base-subtle transition-colors"
                  onClick={() => setSelectedHandoverId(handover.id)}>
                  <span className="content-action-brand">
                    <DocumentText1 size={16} color="currentColor" />
                  </span>
                  <span className="flex-1 text-body-regular-sm content-base-primary">
                    {tCards("cards.handoverActPrefix")} №{handover.id}
                  </span>
                  <span className="content-action-neutral">
                    <ArrowRight2 size={16} color="currentColor" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6 p-1">
          {error && <Toast color="negative" text={error} />}
          {readOnly ? (
            <Button variant="secondary" size="lg" onClick={onClose}>
              {t("forms.vehicleRent.close")}
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="lg" onClick={onClose}>
                {t("forms.vehicleRent.back")}
              </Button>

              <Button variant="primary" size="lg" disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting
                  ? isEditMode
                    ? t("forms.vehicleRent.updating")
                    : t("forms.vehicleRent.creating")
                  : isEditMode
                    ? t("forms.vehicleRent.updateContract")
                    : t("forms.vehicleRent.createContract")}
              </Button>
            </>
          )}
        </div>
      </div>

      {selectedHandoverId !== null && (
        <VehicleHandoverPreviewModal
          id={selectedHandoverId}
          onClose={() => setSelectedHandoverId(null)}
          hasBackground
        />
      )}
    </ModalForm>
  );
}

