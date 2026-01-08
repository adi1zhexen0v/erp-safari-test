import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1 } from "iconsax-react";
import { Button, ModalForm, Toast } from "@/shared/ui";
import { useAppSelector } from "@/shared/hooks";
import { formatPrice } from "@/shared/utils";
import type { CommercialOrganization } from "../../../types/commercialOrganizations";
import type { GoodsSupplyPreviewData } from "../types";
import { getOrganizationName, findOrganizationById } from "../utils";

interface Props {
  formData: GoodsSupplyPreviewData;
  onClose: () => void;
  onSubmit?: () => Promise<{ id: number; data: unknown } | null>;
  hasBackground: boolean;
  editId?: number;
  onSuccess?: (isEdit: boolean) => void;
  readOnly?: boolean;
  commercialOrganizations?: CommercialOrganization[];
  commercialOrg?: CommercialOrganization;
}

export default function GoodsSupplyPreviewModal({
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

  function getMonthDeclension(months: number, locale: "ru" | "kk"): string {
    if (locale === "ru") {
      if (months === 1) return "месяц";
      if (months >= 2 && months <= 4) return "месяца";
      return "месяцев";
    }
    return "ай";
  }

  function formatWarrantyMonths(monthsStr: string | undefined, locale: "ru" | "kk"): string {
    if (!monthsStr) return "_____________";
    const months = Number(monthsStr);
    if (isNaN(months) || months <= 0) return "_____________";
    return `${months} ${getMonthDeclension(months, locale)}`;
  }

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
        (isEditMode ? t("forms.supplyContract.errors.updateFailed") : t("forms.supplyContract.errors.createFailed"));
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalForm icon={DocumentText1} onClose={onClose} resize hasBackground={hasBackground}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">{t("forms.supplyContract.previewTitle")}</h4>
        </div>

        <div className="flex-1 overflow-auto page-scroll pr-5 pt-5">
          <div className="flex flex-col text-body-regular-md content-base-primary">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">ДОГОВОР ПОСТАВКИ ТОВАРА № _____________</h1>
              <div className="flex justify-between text-sm mt-4">
                <span>
                  г. <strong>{formData.contract_city || "_____________"}</strong>
                </span>
                <strong>{formData.contract_date}</strong>
              </div>
            </div>

            <div className="mb-6 text-justify">
              <p className="mb-2">
                <strong>{orgName}</strong>, в лице <strong>{organization?.representative || "_____________"}</strong>,
                действующего на основании <strong>{organization?.basis || "_____________"}</strong>, именуемый в
                дальнейшем «Поставщик», с одной стороны, и <strong>{userData?.organization || "_____________"}</strong>{" "}
                в лице директора <strong>{userData?.full_name || "_____________"}</strong>, действующего на основании{" "}
                <strong>{organization?.basis || "_____________"}</strong> именуемый в дальнейшем «Заказчик», с другой
                стороны, заключили настоящий Договор поставки товара (далее – «Договор») о нижеследующем:
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">1. ПРЕДМЕТ ДОГОВОРА</h2>

              <p className="mb-2">
                1.1. Поставщик обязуется поставить товар Заказчику, а Заказчик обязуется принять товар в собственность и
                оплатить его на условиях, определенных настоящим Договором. Наименование, цена (стоимость), количество,
                качество и ассортимент Товара указаны в Приложении к настоящему Договору.
              </p>

              <p className="mb-2">
                1.2. Поставка товара осуществляется Поставщиком по адресу:{" "}
                <strong>{formData.delivery_address || "_____________"}</strong>.
              </p>

              <p className="mb-2">
                1.3. Право собственности на товар переходит к Заказчику при полной оплате. В любом ином случае до полной
                оплаты товар остается собственностью Поставщика.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">2. УСЛОВИЯ ПОСТАВКИ ТОВАРА</h2>

              <p className="mb-2">
                2.1. Поставка товара должна быть произведена не позднее{" "}
                <strong>{formData.delivery_days || "_____________"}</strong> (
                <strong>{formData.delivery_days_text || "_____________"}</strong>) календарных дней со дня подписания
                настоящего Договора.
              </p>

              <p className="mb-2">
                2.2. Поставка товара сопровождается товарно-транспортной документацией. Оформление товарно-транспортной
                и иной документации осуществляется в соответствии с действующим законодательством Республики Казахстан.
              </p>

              <p className="mb-2">
                2.3. Товар поставляется Покупателю через уполномоченного представителя. Полномочия данного лица
                возникают из доверенности на получение товара. Доверенность на получение товара должна соответствовать
                требованиям законодательства Республики Казахстан.
              </p>

              <p className="mb-2">
                2.4. При обнаружении скрытых недостатков товара, если они обнаружены Покупателем в течение 14
                (четырнадцати) дней с момента поставки, Заказчик обязан немедленно уведомить об этом Поставщика. Стороны
                обязуются совместно составить и подписать акт о несоответствии качества товара требованиям,
                предусмотренным Договором, и отразить в нем все такие случаи.
              </p>

              <p className="mb-2">
                2.5. «Дата поставки Товара» означает дату, отраженную в соответствующей товарно-транспортной накладной.
              </p>

              <p className="mb-2">
                2.6. «Риск случайной гибели или повреждения Товара» переходит к Заказчику с момента поставки в
                соответствии с условиями Договора.
              </p>

              <p className="mb-2">
                2.7. Поставщик упаковывает Товар для транспортировки, обеспечивая его сохранность при надлежащих
                условиях транспортировки, в частности, автомобильным транспортом.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">3. ПРАВА И ОБЯЗАТЕЛЬСТВА СТОРОН</h2>

              <p className="mb-2">3.1. Поставщик обязуется:</p>
              <ul className="list-disc list-inside ml-6 mb-2">
                <li>
                  3.1.1. Поставить Товар в соответствии с условиями настоящего Договора. К каждому Товару прилагается
                  копия сертификата соответствия установленного образца (данное условие применяется, если Товар подлежит
                  обязательной сертификации).
                </li>
                <li>3.1.2. Предоставить Заказчику необходимую информацию о Товаре.</li>
                <li>
                  3.1.3. Своевременно выставить счета на оплату Товара, обеспечивая своевременную оплату поставки Товара
                  Заказчиком.
                </li>
                <li>
                  3.1.4. Одновременно с передачей Товара передать Заказчику принадлежности и относящиеся к нему
                  документы (документы, удостоверяющие комплектность, сохранность, качество товара, порядок эксплуатации
                  и т.д.).
                </li>
                <li>3.1.5. Передать Товар Заказчику свободным от любых прав третьих лиц.</li>
                <li>3.1.6. Передать Заказчику Товар, качество которого соответствует настоящему Договору.</li>
              </ul>

              <p className="mb-2">3.2. Поставщик имеет право:</p>
              <ul className="list-disc list-inside ml-6 mb-2">
                <li>
                  3.2.1. Требовать возврата Товара от Заказчика, когда в течение срока, предусмотренного Договором,
                  Товар, поставленный Заказчику, не оплачен, или возникают иные обстоятельства, при которых право
                  собственности не переходит к Заказчику.
                </li>
                <li>
                  3.2.2. Требовать оплаты переданного Товара или возврата неоплаченного Товара (частей), в случаях,
                  когда Заказчик, получив Товар, не выполняет свои обязательства по оплате в срок, установленный
                  настоящим Договором.
                </li>
                <li>
                  3.2.3. Требовать принятия Товара от Заказчика или отказаться от исполнения Договора, когда Заказчик, в
                  нарушение законодательных актов или Договора, не принимает или отказывается принять Товар.
                </li>
              </ul>

              <p className="mb-2">3.3. Заказчик обязуется:</p>
              <ul className="list-disc list-inside ml-6 mb-2">
                <li>
                  3.3.1. Обеспечить сохранность Товара, предотвращая его ухудшение, в частности, когда право
                  собственности переходит к Заказчику до формального перехода права собственности.
                </li>
                <li>3.3.2. Оплатить поставленный Товар в соответствии с условиями Договора.</li>
                <li>3.3.3. Принять Товар в соответствии с условиями Договора.</li>
              </ul>

              <p className="mb-2">3.4. Заказчик вправе:</p>
              <ul className="list-disc list-inside ml-6 mb-2">
                <li>3.4.1. Уведомить Поставщика и отказаться от принятия Товара, если поставка просрочена.</li>
                <li>
                  3.4.2. Заявить претензии, связанные с недостатками Товара, при условии, что эти недостатки обнаружены
                  в сроки, предусмотренные настоящим Договором.
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">4. СТОИМОСТЬ ТОВАРА И ПОРЯДОК РАСЧЕТОВ</h2>

              <p className="mb-2">
                4.1. Общая сумма Договора составляет{" "}
                <strong>{formData.total_amount ? formatPrice(formData.total_amount) : "_____________"}</strong> (
                <strong>{formData.total_amount_text || "_____________"}</strong>) тенге, включая НДС.
              </p>

              <p className="mb-2">
                4.2. Оплата поставленного товара производится Заказчиком путем перечисления денежных средств на
                расчетный счет Поставщика не позднее <strong>{formData.payment_days || "_____________"}</strong> (
                <strong>{formData.payment_days_text || "_____________"}</strong>) рабочих дней со дня подписания
                товарно-транспортной накладной обеими Сторонами и выдачи электронного счета-фактуры.
              </p>

              <p className="mb-2">
                4.3. Стоимость Товара отражается в национальной валюте Республики Казахстан – тенге.
              </p>

              <p className="mb-2">
                4.4. Датой оплаты Товара считается дата зачисления денежных средств на расчетный счет Поставщика.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">5. ГАРАНТИЙНЫЕ ОБЯЗАТЕЛЬСТВА</h2>

              <p className="mb-2">
                5.1. Поставщик передает Заказчику товар, соответствующий стандартам и требованиям для аналогичных видов
                товаров в стране производства и в Республике Казахстан, а также соответствующий условиям Договора.
              </p>

              <p className="mb-2">5.2. Поставщик гарантирует качество Товара.</p>

              <p className="mb-2">
                5.3. Поставщик предоставляет гарантию на Товар в течение{" "}
                <strong>{formData.product_warranty_term || "_____________"}</strong>.
              </p>

              <p className="mb-2">
                5.4. Поставщик несет ответственность за качество поставленного Товара и устранит все неисправности в
                течение гарантийного срока за свой счет, при следующих условиях:
              </p>
              <ul className="list-disc list-inside ml-6 mb-2">
                <li>
                  5.4.1. Заказчик обязан соблюдать все технические правила эксплуатации Товара, предоставленные
                  Поставщиком.
                </li>
                <li>
                  5.4.2. Заказчик обязан не нарушать гарантийные пломбы (при их наличии) и соблюдать стандарты
                  эксплуатации поставляемого оборудования, указанные в технической документации (например, стабильное
                  электропитание, параметры окружающей среды).
                </li>
                <li>
                  5.4.3. Заказчик обязан обеспечить сохранность Товара, поставленного Поставщиком, и защитить его от
                  внешних воздействий.
                </li>
              </ul>

              <p className="mb-2">
                5.5. При нарушении одного из вышеуказанных гарантийных пунктов для товара, поставленного Поставщиком,
                гарантия считается недействительной, и все восстановительные работы производятся за счет Заказчика.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">6. КАЧЕСТВО ТОВАРА</h2>

              <p className="mb-2">
                6.1. Качество Товара должно соответствовать условиям, согласованным Сторонами, стандартам, действующим в
                Республике Казахстан, техническим условиям и требованиям производителя. Упаковка Товара должна
                обеспечивать его полную сохранность при надлежащих условиях транспортировки.
              </p>

              <p className="mb-2">
                6.2. Проверка ассортимента, количества и качества Товара, поставляемого по настоящему Договору,
                осуществляется Сторонами при получении Заказчиком. Любое несоответствие Товара требованиям настоящего
                Договора фиксируется в акте приема-передачи, подписанном уполномоченными представителями Сторон, если
                при приеме Товара обнаружены повреждения или иные недостатки, заметные при внешнем осмотре (видимые
                недостатки).
              </p>

              <p className="mb-2">
                6.3. Все расходы, связанные с возвратом Товара, качество которого не соответствует требованиям,
                предусмотренным Договором, несет Поставщик. Замена несоответствующего Товара осуществляется Поставщиком
                в разумные сроки, исходя из наличия аналогичного Товара на складе Поставщика.
              </p>

              <p className="mb-2">
                6.4. Заказчик обязан обеспечить хранение Товара, на который заявлена претензия, до полного разрешения
                данной претензии Сторонами по существу.
              </p>

              <p className="mb-2">
                6.5. По истечении срока, указанного в пункте 2.4 Договора, Товар считается принятым, и Заказчик теряет
                право ссылаться на несоответствие качества и/или количества поставленного Товара Договору.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">7. ОТВЕТСТВЕННОСТЬ СТОРОН</h2>

              <p className="mb-2">7.1. Поставщик несет ответственность за поставку несоответствующего Товара.</p>

              <p className="mb-2">
                7.2. Заказчик несет материальную ответственность за сохранность Товара в период, когда право
                собственности остается за Поставщиком, за любое упущение, которое привело к утрате, недостаче или
                повреждению Товара, находящегося у него.
              </p>

              <p className="mb-2">
                7.3. За просрочку оплаты по Договору Заказчик уплачивает Поставщику неустойку в размере 0,1% от
                стоимости Товара, указанной в соответствующем приложении, за каждый день просрочки оплаты, но не более
                10% от суммы Договора.
              </p>

              <p className="mb-2">
                7.4. Заказчик вправе требовать от Поставщика неустойку за просрочку поставки Товара по Договору в
                размере 0,1% от стоимости Товара, указанной в соответствующем приложении, за каждый день несвоевременной
                поставки, но не более 10% от суммы договора.
              </p>

              <p className="mb-2">
                7.5. Уплата неустойки не освобождает Стороны от обязанности надлежащего исполнения условий Договора.
              </p>

              <p className="mb-2">
                7.6. Возврат Товара Заказчиком Поставщику в случаях, когда Товар не соответствует требованиям Договора в
                отношении качества, ассортимента и количества.
              </p>

              <p className="mb-2">
                7.7. За ненадлежащее исполнение обязательств по Договору, в случаях, не предусмотренных настоящим
                разделом, Стороны несут ответственность в соответствии с действующим законодательством Республики
                Казахстан.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">8. ФОРС-МАЖОР</h2>

              <p className="mb-2">
                8.1. Стороны освобождаются от ответственности за полное или частичное неисполнение обязательств по
                настоящему Договору, если это неисполнение явилось следствием обстоятельств непреодолимой силы
                (форс-мажор), возникших после заключения настоящего Договора в результате событий чрезвычайного
                характера, которые Стороны не могли ни предвидеть, ни предотвратить разумными мерами. К таким событиям
                относятся: стихийные бедствия, военные действия, запрет экспорта/импорта, объявление чрезвычайного
                положения в Республике Казахстан, карантин в Астане или иные обстоятельства, находящиеся вне контроля
                Сторон. Срок исполнения обязательств отодвигается соразмерно времени, в течение которого действуют такие
                обстоятельства. Если такие обстоятельства продолжаются более двух месяцев, любая из Сторон вправе
                отказаться от дальнейшего исполнения обязательств, и ни одна из Сторон не будет иметь права на
                возмещение возможных убытков от другой Стороны.
              </p>

              <p className="mb-2">
                8.2. Сторона, подвергшаяся действию обстоятельств непреодолимой силы и вследствие этого не имеющая
                возможности выполнить свои обязательства, обязана немедленно уведомить об этом другую Сторону в
                письменной форме.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">9. ПОРЯДОК РАЗРЕШЕНИЯ СПОРОВ</h2>

              <p className="mb-2">
                9.1. Все споры и разногласия, возникающие из настоящего Договора или в связи с ним, подлежат разрешению
                Сторонами путем переговоров, следуя досудебному претензионному порядку урегулирования споров.
              </p>

              <p className="mb-2">
                9.2. Споры, не урегулированные в досудебном претензионном порядке в течение пятнадцати дней со дня
                подачи претензии инициирующей Стороной, подлежат разрешению в Специализированном межрайонном
                экономическом суде, <strong>{formData.court_location || "_____________"}</strong>, в соответствии с
                действующим законодательством Республики Казахстан.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">10. СРОК ДЕЙСТВИЯ ДОГОВОРА</h2>

              <p className="mb-2">
                10.1. Настоящий Договор вступает в силу с момента его подписания Сторонами и действует до полного
                исполнения всех обязательств, принятых на себя Сторонами по настоящему Договору.
              </p>

              <p className="mb-2">
                10.2. Настоящий Договор может быть расторгнут Сторонами по взаимному согласию, а также в случаях, прямо
                предусмотренных настоящим Договором или в порядке, установленном действующим законодательством
                Республики Казахстан.
              </p>

              <p className="mb-2">
                10.3. Любая из Сторон вправе досрочно расторгнуть Договор, уведомив об этом другую Сторону в письменной
                форме не менее чем за 15 (пятнадцать) рабочих дней до предполагаемой даты расторжения.
              </p>

              <p className="mb-2">
                10.4. При досрочном расторжении Стороны производят расчет за фактически оказанные услуги до даты,
                предшествующей расторжению.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">11. ПРОЧИЕ УСЛОВИЯ</h2>

              <p className="mb-2">
                11.1. Отношения между Сторонами, не урегулированные настоящим Договором, регулируются действующим
                законодательством Республики Казахстан.
              </p>

              <p className="mb-2">
                11.2. Все изменения и дополнения к настоящему Договору действительны лишь в том случае, если они
                совершены в письменной форме и подписаны обеими Сторонами.
              </p>

              <p className="mb-2">
                11.3. Ни одна из Сторон не вправе передавать свои права и обязанности по настоящему Договору третьим
                лицам без письменного согласия другой Стороны.
              </p>

              <p className="mb-2">
                11.4. Ни одна из Сторон не вправе разглашать коммерческую информацию, полученную в ходе совместной
                деятельности, третьим лицам.
              </p>

              <p className="mb-2">
                11.5. Поставщик гарантирует, что Товар является новым и никогда не использовался до текущей поставки.
              </p>

              <p className="mb-2">
                11.6. Поставщик гарантирует, что он является собственником Товара и что это право собственности свободно
                от каких-либо споров или обременений.
              </p>

              <p className="mb-2">
                11.7. Настоящий Договор составлен в двух экземплярах, на русском языке, каждый из которых имеет равную
                юридическую силу, по одному экземпляру для каждой из Сторон.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4">12. АДРЕСА И БАНКОВСКИЕ РЕКВИЗИТЫ СТОРОН</h2>

              <div className="flex justify-between mt-6">
                <div className="flex-1">
                  <p className="font-bold mb-2 text-lg">Поставщик</p>
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
                  <p className="font-bold mb-2 text-lg">Заказчик</p>
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

            <div className="mb-6 mt-8">
              <h2 className="text-xl font-bold text-center mb-4">Приложение №1</h2>
              <h3 className="text-lg font-bold text-center mb-4">Техническая спецификация</h3>

              <div className="mb-4">
                <p className="mb-2">
                  <strong>1. Наименование товара:</strong> <strong>{formData.product_name || "_____________"}</strong>
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-2">
                  <strong>2. Технические характеристики:</strong>
                </p>
                <ul className="list-disc list-inside ml-6 mb-2">
                  <li>
                    <strong>Модель:</strong> <strong>{formData.product_model || "_____________"}</strong>
                  </li>
                  <li>
                    <strong>Производитель:</strong> <strong>{formData.product_manufacturer || "_____________"}</strong>
                  </li>
                  {formData.product_power && (
                    <li>
                      <strong>Мощность / производительность:</strong> <strong>{formData.product_power}</strong>
                    </li>
                  )}
                  {formData.product_voltage && (
                    <li>
                      <strong>Питание / напряжение:</strong> <strong>{formData.product_voltage}</strong>
                    </li>
                  )}
                  {formData.product_material && (
                    <li>
                      <strong>Материал / исполнение:</strong> <strong>{formData.product_material}</strong>
                    </li>
                  )}
                  {formData.product_package && (
                    <li>
                      <strong>Комплектация:</strong> <strong>{formData.product_package}</strong>
                    </li>
                  )}
                  {formData.product_size && (
                    <li>
                      <strong>Габаритные размеры:</strong> <strong>{formData.product_size}</strong>
                    </li>
                  )}
                  {formData.product_weight && (
                    <li>
                      <strong>Вес:</strong> <strong>{formData.product_weight}</strong>
                    </li>
                  )}
                </ul>
              </div>

              <div className="mb-4">
                <p className="mb-2">
                  <strong>3. Количество:</strong> <strong>{formData.product_quantity || "_____________"}</strong> шт.
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-2">
                  <strong>4. Цена за единицу:</strong>{" "}
                  <strong>
                    {formData.product_unit_price ? formatPrice(formData.product_unit_price) : "_____________"}
                  </strong>{" "}
                  тенге
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-2">
                  <strong>5. Общая стоимость:</strong>{" "}
                  <strong>
                    {formData.product_total_price ? formatPrice(formData.product_total_price) : "_____________"}
                  </strong>{" "}
                  тенге
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-2">
                  <strong>6. Качество товара:</strong> Товар новый, не использованный, соответствует требованиям
                  производителя и стандартам РК.
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-2">
                  <strong>7. Гарантия:</strong>{" "}
                  <strong>{formatWarrantyMonths(formData.product_warranty_months, locale)}</strong>.
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-2">
                  <strong>8. Место поставки:</strong>{" "}
                  <strong>{formData.product_delivery_place || "_____________"}</strong>
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-2">
                  <strong>9. Срок гарантии:</strong>{" "}
                  <strong>{formData.product_warranty_term || "_____________"}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 p-1">
          {error && <Toast color="negative" text={error} />}
          {readOnly ? (
            <Button variant="secondary" size="lg" onClick={onClose}>
              {t("forms.supplyContract.close")}
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="lg" onClick={onClose}>
                {t("forms.supplyContract.back")}
              </Button>

              <Button variant="primary" size="lg" disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting
                  ? isEditMode
                    ? t("forms.supplyContract.updating")
                    : t("forms.supplyContract.creating")
                  : isEditMode
                    ? t("forms.supplyContract.updateContract")
                    : t("forms.supplyContract.createContract")}
              </Button>
            </>
          )}
        </div>
      </div>
    </ModalForm>
  );
}
