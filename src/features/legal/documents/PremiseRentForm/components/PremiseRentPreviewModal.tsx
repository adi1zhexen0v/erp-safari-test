import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1 } from "iconsax-react";
import { Button, ModalForm, Toast } from "@/shared/ui";
import { useAppSelector } from "@/shared/hooks";
import { formatPrice } from "@/shared/utils";
import type { CommercialOrganization } from "../../../types/commercialOrganizations";
import type { PremiseRentPreviewData } from "../types";
import { getOrganizationName, findOrganizationById } from "../utils";
import PremiseRentPreviewModalSkeleton from "./PremiseRentPreviewModalSkeleton";

interface Props {
  formData?: PremiseRentPreviewData;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit?: () => Promise<{ id: number; data: unknown } | null>;
  hasBackground: boolean;
  editId?: number;
  onSuccess?: (isEdit: boolean) => void;
  readOnly?: boolean;
  commercialOrganizations?: CommercialOrganization[];
  commercialOrg?: CommercialOrganization;
}

export default function PremiseRentPreviewModal({
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
}: Props) {
  const { t, i18n } = useTranslation("LegalTemplatesPage");
  const userData = useAppSelector((state) => state.auth.data?.user);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        (isEditMode
          ? t("forms.commercialPremiseRent.errors.updateFailed")
          : t("forms.commercialPremiseRent.errors.createFailed"));
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !formData) {
    return <PremiseRentPreviewModalSkeleton onClose={onClose} hasBackground={hasBackground} />;
  }

  const contractDateFormatted = formData.contract_date || "_____________";
  const rentalStartDateFormatted = formData.rental_start_date || "_____________";
  const rentalEndDateFormatted = formData.rental_end_date || "_____________";
  const firstMonthPaymentDeadlineFormatted = formData.first_month_payment_deadline || "_____________";

  return (
    <ModalForm icon={DocumentText1} onClose={onClose} resize hasBackground={hasBackground}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">{t("forms.commercialPremiseRent.previewTitle")}</h4>
        </div>

        <div className="flex-1 overflow-auto page-scroll pr-5 pt-5">
          <div className="flex flex-col text-body-regular-md content-base-primary">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">ДОГОВОР АРЕНДЫ НЕЖИЛОГО ПОМЕЩЕНИЯ</h1>
              <div className="flex justify-between text-sm mt-4">
                <span>
                  г. <strong>{formData.contract_city || "_____________"}</strong>
                </span>
                <strong>{contractDateFormatted}</strong>
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
                1.1. Арендодатель предоставляет Арендатору в аренду помещение общей арендной площадью{" "}
                <strong>{formData.premise_area || "_____________"}</strong> кв.м., расположенное по адресу:{" "}
                <strong>{formData.premise_address || "_____________"}</strong>, на условиях настоящего договора.
              </p>

              <p className="mb-2">
                1.2. Цель использования: <strong>{formData.premise_usage_purpose || "_____________"}</strong>.
                Арендатору предоставляется право использовать адрес арендуемого помещения в регистрационных документах.
              </p>

              <p className="mb-2">1.3. В арендуемое помещение входят места общего пользования.</p>

              <p className="mb-2">
                1.4. Под «Местами общего пользования» понимаются все помещения, предназначенные для общего пользования
                Арендодателем, включая холлы, коридоры, технические помещения и санитарные узлы, для совместного
                использования Арендодателем, Арендатором и иными уполномоченными лицами, используемые только по их
                прямому назначению.
              </p>

              <p className="mb-2">1.5. Помещение передается по акту приема-передачи.</p>

              <p className="mb-2">
                1.6. «Дата начала аренды» означает <strong>{rentalStartDateFormatted}</strong>, а «Дата окончания
                аренды» означает <strong>{rentalEndDateFormatted}</strong>, при условии досрочного расторжения или
                задержки возврата Помещения Арендатором Арендодателю, дата окончания аренды может быть изменена. «Срок
                аренды» означает период с даты начала аренды до даты окончания аренды включительно.
              </p>

              <p className="mb-2">
                1.7. Арендодатель подтверждает, что имеет право на заключение и исполнение настоящего договора.
              </p>

              <p className="mb-2 font-bold underline">
                1.8. Арендатор не имеет право сдавать/передавать Помещение в субаренду.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">2. ПОРЯДОК ПЕРЕДАЧИ И ВОЗВРАТА ПОМЕЩЕНИЯ</h2>

              <p className="mb-2">
                2.1. Арендодатель предоставляет Помещение Арендатору на дату начала аренды по акту приема-передачи.
              </p>

              <p className="mb-2">
                2.3. Арендатор возвращает Помещение Арендодателю на дату окончания аренды по акту приема-передачи.
              </p>

              <p className="mb-2">
                2.4. Акт приема-передачи отражает фактическое состояние Помещения на момент возврата, и с момента
                подписания данного акта права Арендатора и обязательства по оплате прекращаются.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">
                3. ПЛАТА ПО ДОГОВОРУ, СРОК И ПОРЯДОК ПРИЕМА И ОПЛАТЫ ИСПОЛНЕННЫХ ОБЯЗАТЕЛЬСТВ
              </h2>

              <p className="mb-2">
                3.1. Общая ежемесячная арендная плата составляет{" "}
                <strong>{formData.rental_amount ? formatPrice(formData.rental_amount) : "_____________"}</strong> (
                <strong>{formData.rental_amount_text || "_____________"}</strong>) тенге, включая все коммунальные и
                иные платежи.
              </p>

              <p className="mb-2">
                3.2. Расходы на содержание Помещения, включая коммунальные услуги и платежи за обслуживание, включены в
                арендную плату и оплачиваются Арендатором самостоятельно.
              </p>

              <p className="mb-2">
                3.3. Арендодатель обязуется выдать Арендатору акт выполненных работ (оказанных услуг) в двух подлинных
                экземплярах.
              </p>

              <p className="mb-2">
                3.4. Арендная плата производится Арендатором на основании выставленного Арендодателем счета в течение 5
                (пяти) банковских дней.
              </p>

              <p className="mb-2">
                3.5. Арендатор обязан подписать акт выполненных работ (оказанных услуг) в течение 3 (трех) календарных
                дней с момента его получения, при условии соответствия обязательствам Арендодателя. На основании
                подписанного акта выполненных работ (оказанных услуг) Арендодатель выставляет электронный счет-фактуру в
                соответствии с законодательством Республики Казахстан.
              </p>

              <p className="mb-2">
                3.6. С момента подписания акта выполненных работ (оказанных услуг) обязательства Арендодателя за
                соответствующий отчетный период считаются принятыми.
              </p>

              <p className="mb-2">
                3.7. Срок оплаты арендной платы за первый месяц составляет{" "}
                <strong>{firstMonthPaymentDeadlineFormatted}</strong>.
              </p>

              <p className="mb-2">
                3.8. В случае, если арендная плата рассчитывается за неполный календарный месяц, она рассчитывается
                Арендодателем пропорционально количеству дней.
              </p>

              <p className="mb-2">
                3.9. Оплата по настоящему Договору производится путем безналичного перечисления на расчетный счет
                Арендодателя.
              </p>

              <p className="mb-2">3.10. Размер арендной платы может быть изменен не чаще одного раза в год.</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">4. РАЗРЕШЕНИЕ СПОРОВ</h2>

              <p className="mb-2">
                4.1. Досудебное урегулирование споров путем переговоров и предъявления претензий является обязательным.
              </p>

              <p className="mb-2">4.2. Обязательный досудебный порядок урегулирования споров:</p>

              <p className="mb-2 ml-4">
                4.2.1. Претензии должны быть представлены в письменной форме и подписаны надлежащим образом
                уполномоченным лицом.
              </p>

              <p className="mb-2">4.3. Споры подлежат рассмотрению в суде по месту нахождения Арендодателя.</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">5. КОНФИДЕНЦИАЛЬНОСТЬ</h2>

              <p className="mb-2">
                5.1. Положения настоящего Договора, дополнительных соглашений и связанной с ним документации/информации
                являются конфиденциальными. Доступ к ним ограничен лицами, непосредственно участвующими в выполнении
                обязательств, и иной доступ требует взаимного согласия.
              </p>

              <p className="mb-2">
                5.2. Стороны обязуются не разглашать информацию, полученную от другой Стороны, третьим лицам или
                использовать ее в целях, отличных от выполнения обязательств, без письменного согласия, за исключением
                информации, которая:
              </p>

              <p className="mb-2 ml-4">5.2.1. Была получена получающей Стороной до заключения настоящего Договора.</p>

              <p className="mb-2 ml-4">
                5.2.2. Является общедоступной не по вине получающей Стороны, или была предоставлена третьим лицом, не
                нарушившим обязательства по конфиденциальности.
              </p>

              <p className="mb-2 ml-4">
                5.2.3. Была независимо разработана персоналом получающей Стороны без доступа к такой информации.
              </p>

              <p className="mb-2">
                5.3. Получающая Сторона может раскрыть информацию, если это требуется по закону или для представления в
                судебные или иные компетентные государственные органы, связанные с настоящим Договором. Получающая
                Сторона должна незамедлительно уведомить раскрывающую Сторону и принять разумные меры для защиты
                информации, при этом раскрытие ограничивается авторизованными запросами. Раскрывающая Сторона
                предоставляет получающей Стороне право раскрывать информацию о заключении, исполнении и содержании
                настоящего Договора.
              </p>

              <p className="mb-2">
                5.4. Положения о конфиденциальности действуют в течение всего срока действия настоящего Договора и в
                течение 1 (одного) года после его прекращения.
              </p>

              <p className="mb-2">
                5.5. В случае наличия отдельного Соглашения о конфиденциальности, его положения имеют приоритет над
                положениями настоящего Договора в случае противоречий.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">6. ПОРЯДОК ИЗМЕНЕНИЯ, РАСТОРЖЕНИЯ ДОГОВОРА</h2>

              <p className="mb-2">
                6.1. Предложения об изменении настоящего Договора направляются другой Стороне не менее чем за 7 (семь)
                календарных дней до предполагаемой даты изменения. Изменения вносятся в той же форме, что и настоящий
                Договор, путем заключения двустороннего соглашения или иной письменной формы, определенной
                законодательством.
              </p>

              <p className="mb-2">
                6.2. Настоящий Договор может быть расторгнут по взаимному согласию Сторон, а также путем одностороннего
                отказа от исполнения Договора на основании оснований, предусмотренных настоящим Договором и
                законодательством.
              </p>

              <p className="mb-2">
                6.3. Порядок расторжения по взаимному согласию: предложение о расторжении направляется другой Стороне не
                менее чем за 30 (тридцать) календарных дней до предполагаемой даты расторжения. Расторжение по взаимному
                согласию оформляется в той же форме, что и настоящий Договор, путем составления двустороннего соглашения
                или иной письменной формы, определенной законодательством.
              </p>

              <p className="mb-2">
                6.4. Односторонний отказ от исполнения настоящего Договора осуществляется путем направления письменного
                уведомления другой Стороне не менее чем за 30 (тридцать) календарных дней до даты отказа от исполнения
                настоящего Договора.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">7. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</h2>

              <p className="mb-2">
                7.1. Настоящий Договор вступает в силу с момента его подписания Сторонами и действует до полного
                исполнения обязательств, принятых на себя Сторонами.
              </p>

              <p className="mb-2">
                7.2. Арендатор, надлежащим образом исполнивший свои обязательства, имеет преимущественное право перед
                другими лицами на заключение нового договора аренды Помещения по истечении срока аренды при прочих
                равных условиях. В этом случае Арендатор обязан уведомить Арендодателя в письменной форме о своем
                желании заключить такой договор не менее чем за 30 (тридцать) календарных дней до окончания срока
                аренды.
              </p>

              <p className="mb-2">
                7.3. После подписания настоящего Договора все предварительные переговоры, переписка, предварительные
                соглашения и протоколы о намерениях по вопросам, так или иначе связанным с настоящим Договором,
                утрачивают юридическую силу.
              </p>

              <p className="mb-2">
                7.4. Настоящий Договор, а также все правовые отношения, возникающие в связи с его исполнением,
                регулируются и подлежат толкованию в соответствии с действующим законодательством Республики Казахстан.
              </p>

              <p className="mb-2">
                7.5. Настоящий Договор составлен в двух подлинных экземплярах, тексты которых имеют равную юридическую
                силу, по одному для каждой из Сторон.
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

        <div className="flex justify-end gap-3 mt-6 p-1">
          {error && <Toast color="negative" text={error} />}
          {readOnly ? (
            <Button variant="secondary" size="lg" onClick={onClose}>
              {t("forms.commercialPremiseRent.close")}
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="lg" onClick={onClose}>
                {t("forms.commercialPremiseRent.back")}
              </Button>

              <Button variant="primary" size="lg" disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting
                  ? isEditMode
                    ? t("forms.commercialPremiseRent.updating")
                    : t("forms.commercialPremiseRent.creating")
                  : isEditMode
                    ? t("forms.commercialPremiseRent.updateContract")
                    : t("forms.commercialPremiseRent.createContract")}
              </Button>
            </>
          )}
        </div>
      </div>
    </ModalForm>
  );
}
