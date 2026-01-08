import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1 } from "iconsax-react";
import { Button, ModalForm, Toast } from "@/shared/ui";
import { useAppSelector } from "@/shared/hooks";
import { formatPrice } from "@/shared/utils";
import type { CommercialOrganization } from "../../../types/commercialOrganizations";
import { useUpdateServiceAgreementMSBMutation } from "../api";
import type { ServiceAgreementMSBPreviewData, ServiceAgreementMSBApiPayload } from "../types";

interface Props {
  formData: ServiceAgreementMSBPreviewData;
  onClose: () => void;
  onSubmit?: () => Promise<{ id: number; data: ServiceAgreementMSBApiPayload } | null>;
  hasBackground: boolean;
  editId?: number;
  onSuccess?: (isEdit: boolean) => void;
  readOnly?: boolean;
  commercialOrganizations?: CommercialOrganization[];
  commercialOrg?: CommercialOrganization;
}

export default function ServiceAgreementMSBPreviewModal({
  formData,
  onClose,
  onSubmit,
  hasBackground = false,
  editId,
  onSuccess,
  readOnly = false,
  commercialOrganizations = [],
  commercialOrg,
}: Props) {
  const { t, i18n } = useTranslation("LegalTemplatesPage");
  const userData = useAppSelector((state) => state.auth.data?.user);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateServiceAgreementMSB] = useUpdateServiceAgreementMSBMutation();
  const isEditMode = !!editId;

  const organization = useMemo(() => {
    if (commercialOrg) return commercialOrg;
    if (formData?.commercial_org_id) {
      return commercialOrganizations.find((org) => org.id === formData.commercial_org_id) || null;
    }
    return null;
  }, [commercialOrg, formData?.commercial_org_id, commercialOrganizations]);

  const orgName = useMemo(() => {
    if (!organization) return "_____________";
    const locale = i18n.language === "kk" ? "kk" : "ru";
    return locale === "kk"
      ? organization.name_kk || organization.name_ru
      : organization.name_ru || organization.name_kk;
  }, [organization, i18n.language]);

  async function handleSubmit() {
    if (!onSubmit) return;

    try {
      setError(null);
      setIsSubmitting(true);

      const result = await onSubmit();

      if (isEditMode && result) {
        await updateServiceAgreementMSB({ id: result.id, data: result.data }).unwrap();
      }

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
        (isEditMode
          ? t("forms.serviceAgreementMSB.errors.updateFailed")
          : t("forms.serviceAgreementMSB.errors.createFailed"));
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalForm icon={DocumentText1} onClose={onClose} resize hasBackground={hasBackground}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">{t("forms.serviceAgreementMSB.previewTitle")}</h4>
        </div>

        <div className="flex-1 overflow-auto page-scroll pr-5 pt-5">
          <div className="flex flex-col text-body-regular-md content-base-primary">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">ДОГОВОР НА ОКАЗАНИЕ УСЛУГ</h1>
              <div className="flex justify-between text-sm mt-4">
                <span>
                  г. <strong>{formData.contract_city || "_____________"}</strong>
                </span>
                <strong>{formData.contract_date || "_____________"}</strong>
              </div>
            </div>

            <div className="mb-6 text-justify">
              <p className="mb-2">
                <strong>{orgName}</strong>, именуемое в дальнейшем «Исполнитель», в лице{" "}
                <strong>{organization?.representative || "_____________"}</strong>, действующего на основании{" "}
                <strong>{organization?.basis || "_____________"}</strong> и{" "}
                <strong>{userData?.organization || "_____________"}</strong>, именуемое в дальнейшем «Заказчик»,
                заключили настоящий договор на оказание услуг (далее - Договор) о нижеследующем:
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">1. ПРЕДМЕТ ДОГОВОРА</h2>
              <p className="mb-2">
                1.1. Исполнитель обязуется оказать услуги, указанные в п. 1.2 настоящего Договора, а Заказчик обязуется
                оплатить данные услуги.
              </p>
              <p className="mb-2">
                1.2. Исполнитель обязуется оказать следующие услуги:{" "}
                <strong>{formData.services_description || "_____________"}</strong>, именуемые в дальнейшем «Услуги».
              </p>
              <p className="mb-2">
                1.3. Срок оказания услуг с <strong>{formData.service_start_date || "_____________"}</strong> до{" "}
                <strong>{formData.service_end_date || "_____________"}</strong>. Исполнитель вправе оказать услуги
                досрочно.
              </p>
              <p className="mb-2">
                1.4. Услуги считаются оказанными после подписания Заказчиком или его уполномоченным представителем акта
                об оказанных Услугах.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">2. ПРАВА И ОБЯЗАННОСТИ СТОРОН</h2>
              <p className="mb-2">2.1. Исполнитель обязан:</p>
              <ul className="list-inside ml-6 mb-2">
                <li>2.1.1. Обеспечить полное и надлежащее исполнение обязательств по настоящему Договору.</li>
                <li>
                  2.1.2. Обеспечить соответствие услуг требованиям, указанным в приложениях, являющихся неотъемлемой
                  частью настоящего Договора.
                </li>
                <li>2.1.3. Оказать Услуги в полном объеме в срок, указанный в п. 1.4 настоящего Договора.</li>
                <li>2.1.4. Предоставлять по первому требованию Заказчика информацию о ходе исполнения обязательств.</li>
                <li>
                  2.1.5. Возместить Заказчику полностью ущерб, причиненный ненадлежащим исполнением или незаконными
                  действиями.
                </li>
                <li>
                  2.1.6. Безвозмездно устранить выявленные недостатки, если Исполнитель отступил от условий соглашения,
                  ухудшивших качество, в течение <strong>{formData.correction_days || "_____________"}</strong> дней.
                </li>
              </ul>
              <p className="mb-2">2.2. Заказчик обязан:</p>
              <ul className="list-inside ml-6 mb-2">
                <li>
                  2.2.1. Оплатить выполненные работы по цене, указанной в п. 3 настоящего Договора, в течение{" "}
                  <strong>{formData.payment_days || "_____________"}</strong> дней со дня подписания акта об оказанных
                  Услугах.
                </li>
              </ul>
              <p className="mb-2">2.3. Заказчик имеет право:</p>
              <ul className="list-inside ml-6 mb-2">
                <li>
                  2.3.1. Проверять ход и качество оказываемых услуг в любое время, не вмешиваясь в деятельность другой
                  стороны.
                </li>
                <li>
                  2.3.2. Отказаться от исполнения договора в любое время до подписания акта при условии оплаты
                  Исполнителю части установленной цены, пропорциональной части оказанных услуг до получения Исполнителем
                  уведомления об отказе Заказчика от исполнения Договора.
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">3. ЦЕНА ДОГОВОРА И ПОРЯДОК РАСЧЕТОВ</h2>
              <p className="mb-2">
                3.1. Цена договора составляет{" "}
                <strong>{formData.contract_amount ? formatPrice(formData.contract_amount) : "_____________"}</strong> (
                <strong>{formData.contract_amount_text || "_____________"}</strong>) тенге.
              </p>
              <p className="mb-2">
                3.2. Оплата цены Договора Заказчиком Исполнителю производится путем перечисления денежных средств на
                банковский счет Исполнителя, указанный в настоящем Договоре.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">4. ОТВЕТСТВЕННОСТЬ СТОРОН</h2>
              <p className="mb-2">
                4.1. За нарушение срока оказания услуг, указанного в п. 1.4 настоящего Договора, Исполнитель уплачивает
                Заказчику неустойку в размере <strong>{formData.penalty_percent || "_____________"}</strong>% от суммы
                Договора и пеню, рассчитанную в размере{" "}
                <strong>{formData.daily_penalty_percent || "_____________"}</strong>% от суммы Договора за каждый день
                просрочки.
              </p>
              <p className="mb-2">
                4.2. Меры ответственности сторон, не предусмотренные в настоящем Договоре, применяются в соответствии с
                нормами гражданского законодательства, действующего на территории Республики Казахстан.
              </p>
              <p className="mb-2">
                4.3. Уплата неустойки не освобождает Исполнителя от оказания Услуг или устранения нарушений.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">5. ПОРЯДОК РАЗРЕШЕНИЯ СПОРОВ</h2>
              <p className="mb-2">
                5.1. Споры и разногласия, возникающие при исполнении настоящего Договора, будут по возможности
                разрешаться путем переговоров между Сторонами.
              </p>
              <p className="mb-2">
                5.2. В случае невозможности разрешения споров путем переговоров, после применения предусмотренного
                законодательством порядка досудебного разрешения споров, Стороны передают их на рассмотрение{" "}
                <strong>{formData.dispute_resolution_body || "_____________"}</strong>.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">6. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</h2>
              <p className="mb-2">
                6.1. Изменения и дополнения к настоящему Договору действительны лишь в том случае, если они совершены в
                письменной форме и подписаны уполномоченными представителями Сторон. Приложения к настоящему договору
                составляют его неотъемлемую часть.
              </p>
              <p className="mb-2">
                6.2. Настоящий Договор составлен в двух экземплярах на русском языке. Оба экземпляра идентичны и имеют
                одинаковую силу. У каждой из сторон находится один экземпляр настоящего договора.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">
                7. ЮРИДИЧЕСКИЕ АДРЕСА СТОРОН И БАНКОВСКИЕ РЕКВИЗИТЫ
              </h2>
              <div className="flex justify-between mt-6">
                <div className="flex-1">
                  <p className="font-bold mb-2 text-lg">ИСПОЛНИТЕЛЬ</p>
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
                  <p className="font-bold mb-2 text-lg">ЗАКАЗЧИК</p>
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

        <div className="flex justify-end gap-3 mt-6 p-1">
          {error && <Toast color="negative" text={error} />}
          {readOnly ? (
            <Button variant="secondary" size="lg" onClick={onClose}>
              {t("forms.serviceAgreementMSB.close")}
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="lg" onClick={onClose}>
                {t("forms.serviceAgreementMSB.back")}
              </Button>

              <Button variant="primary" size="lg" disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting
                  ? isEditMode
                    ? t("forms.serviceAgreementMSB.updating")
                    : t("forms.serviceAgreementMSB.creating")
                  : isEditMode
                    ? t("forms.serviceAgreementMSB.updateContract")
                    : t("forms.serviceAgreementMSB.createContract")}
              </Button>
            </>
          )}
        </div>
      </div>
    </ModalForm>
  );
}
