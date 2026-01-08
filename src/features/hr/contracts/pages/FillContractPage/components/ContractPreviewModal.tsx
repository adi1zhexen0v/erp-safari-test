import { useMemo } from "react";
import { DocumentText1 } from "iconsax-react";
import { useTranslation } from "react-i18next";
import type { CreateContractDto } from "@/features/hr/contracts/types";
import { useGetCitiesQuery } from "@/shared/api/common";
import { Button, ModalForm } from "@/shared/ui";
import { formatDateForContract, formatPrice, numberToText, kkInflect, ruInflect } from "@/shared/utils";
import { useAppSelector } from "@/shared/hooks";

interface Props {
  data: CreateContractDto;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  employee_full_name?: string;
  employee_iin?: string;
  employee_id_number?: string;
  employee_id_issued_by?: string;
  employee_id_issue_date?: string;
  employee_phone?: string;
  employee_address_registration?: string;
}

export default function ContractPreviewModal({
  data,
  onClose,
  onConfirm,
  isLoading = false,
  employee_full_name,
  employee_iin,
  employee_id_number,
  employee_id_issued_by,
  employee_id_issue_date,
  employee_phone,
  employee_address_registration,
}: Props) {
  const { t } = useTranslation("FillContractPage");
  const userData = useAppSelector((state) => state.auth.data?.user);
  const { data: cities = [] } = useGetCitiesQuery();

  const city = useMemo(() => {
    if (!data.work_city_id || cities.length === 0) return null;
    return cities.find((c) => c.id === data.work_city_id) || null;
  }, [data.work_city_id, cities]);

  const startDateKk = data.start_date ? formatDateForContract(new Date(data.start_date), "kk") : "_____________";
  const startDateRu = data.start_date ? formatDateForContract(new Date(data.start_date), "ru") : "_____________";

  const endDate = data.start_date
    ? (() => {
        const start = new Date(data.start_date);
        const end = new Date(start);
        end.setFullYear(end.getFullYear() + 1);
        return end;
      })()
    : null;
  const endDateKk = endDate ? formatDateForContract(endDate, "kk") : "_____________";
  const endDateRu = endDate ? formatDateForContract(endDate, "ru") : "_____________";

  const getMonthDeclension = (months: number): string => {
    if (months === 1) return "месяц";
    if (months >= 2 && months <= 4) return "месяца";
    return "месяцев";
  };

  const trialPeriodKk = data.trial_period
    ? data.trial_duration_months
      ? `${data.trial_duration_months} айлық сынақ мерзімімен`
      : "сынақ мерзімімен"
    : "";
  const trialPeriodRu = data.trial_period
    ? data.trial_duration_months
      ? `с испытательным сроком ${data.trial_duration_months} ${getMonthDeclension(data.trial_duration_months)}`
      : "с испытательным сроком"
    : "";

  const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

  const WEEK_DAYS_RU: Record<string, string> = {
    Mon: "понедельник",
    Tue: "вторник",
    Wed: "среда",
    Thu: "четверг",
    Fri: "пятница",
    Sat: "суббота",
    Sun: "воскресенье",
  };

  const WEEK_DAYS_KK: Record<string, string> = {
    Mon: "дүйсенбі",
    Tue: "сейсенбі",
    Wed: "сәрсенбі",
    Thu: "бейсенбі",
    Fri: "жұма",
    Sat: "сенбі",
    Sun: "жексенбі",
  };

  function parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function joinDays(days: string[], lang: "ru" | "kk"): string {
    if (lang === "ru") {
      const names = days.map((d) => WEEK_DAYS_RU[d] || d);
      return names.length > 1 ? names.slice(0, -1).join(", ") + " и " + names[names.length - 1] : names[0];
    }
    if (lang === "kk") {
      const names = days.map((d) => WEEK_DAYS_KK[d] || d);
      return names.length > 1 ? names.slice(0, -1).join(", ") + " және " + names[names.length - 1] : names[0];
    }
    return "";
  }

  function buildWorkScheduleContext() {
    if (!data.work_start_time || !data.work_end_time || !data.working_days_list) {
      return null;
    }

    if (data.working_days_list.length > 6) {
      return null;
    }

    const workMinutes = parseTime(data.work_end_time) - parseTime(data.work_start_time);
    const breakMinutes =
      data.break_start_time && data.break_end_time
        ? parseTime(data.break_end_time) - parseTime(data.break_start_time)
        : 0;

    const dayMinutes = workMinutes - breakMinutes;
    if (dayMinutes <= 0) {
      return null;
    }

    const dayHours = Math.floor(dayMinutes / 60);
    if (dayHours !== 4 && dayHours !== 8) {
      return null;
    }

    const workingDays = data.working_days_list.length;
    const totalHours = dayHours * workingDays;
    const daysOffList = WEEK_DAYS.filter((d) => !data.working_days_list.includes(d));
    const daysOffCount = daysOffList.length;

    return {
      workingDays,
      workingDaysTextRu: numberToText(workingDays, "ru"),
      workingDaysTextKk: numberToText(workingDays, "kk"),
      dayHours,
      dayHoursTextRu: numberToText(dayHours, "ru"),
      dayHoursTextKk: numberToText(dayHours, "kk"),
      totalHours,
      totalHoursTextRu: numberToText(totalHours, "ru"),
      totalHoursTextKk: numberToText(totalHours, "kk"),
      daysOffList,
      daysOffCount,
      daysOffRu: `${daysOffCount} (${numberToText(daysOffCount, "ru")}) выходными днями – ${joinDays(daysOffList, "ru")}`,
      daysOffKk: `${daysOffCount} (${numberToText(daysOffCount, "kk")}) демалыс күні – ${joinDays(daysOffList, "kk")}`,
    };
  };

  function renderWorkScheduleText(lang: "ru" | "kk"): string {
    const context = buildWorkScheduleContext();
    if (!context) {
      return "_____________";
    }

    const hasBreak = data.break_start_time !== null && data.break_end_time !== null;

    if (lang === "ru") {
      if (hasBreak) {
        return `Работнику устанавливается режим рабочего времени: продолжительностью ${context.totalHours} (${context.totalHoursTextRu}) часов в неделю по ${context.dayHours} (${context.dayHoursTextRu}) часов в день с ${data.work_start_time} до ${data.work_end_time}, с перерывом на обед с ${data.break_start_time} до ${data.break_end_time} часов, при ${context.workingDays} (${context.workingDaysTextRu}) рабочей неделе с ${context.daysOffRu}.`;
      } else {
        return `Работнику устанавливается режим рабочего времени: продолжительностью ${context.totalHours} (${context.totalHoursTextRu}) часов в неделю по ${context.dayHours} (${context.dayHoursTextRu}) часа в день с ${data.work_start_time} до ${data.work_end_time}, при ${context.workingDays} (${context.workingDaysTextRu}) рабочей неделе с ${context.daysOffRu}.`;
      }
    }

    if (lang === "kk") {
      if (hasBreak) {
        return `Жұмыскерге келесі жұмыс уақыты режимі белгіленеді: ұзақтығы аптасына ${context.totalHours} (${context.totalHoursTextKk}) сағатты және ${data.work_start_time}–${data.work_end_time} аралығында күніне ${context.dayHours} (${context.dayHoursTextKk}) сағатты құрайды және ${context.workingDays} (${context.workingDaysTextKk}) күндік жұмыс күні, түскі үзіліс сағ. ${data.break_start_time}-ден ${data.break_end_time}-ға дейін, ${context.daysOffKk}.`;
      } else {
        return `Жұмыскерге келесі жұмыс уақыты режимі белгіленеді: ұзақтығы аптасына ${context.totalHours} (${context.totalHoursTextKk}) сағатты және ${data.work_start_time}–${data.work_end_time} аралығында күніне ${context.dayHours} (${context.dayHoursTextKk}) сағатты құрайды және ${context.workingDays} (${context.workingDaysTextKk}) күндік жұмыс күні, ${context.daysOffKk}`;
      }
    }

    return "_____________";
  }

  const workScheduleTextKk = renderWorkScheduleText("kk");
  const workScheduleTextRu = renderWorkScheduleText("ru");

  const salaryAmountTextKk = data.salary_amount ? numberToText(data.salary_amount, "kk") : "_____________";
  const salaryAmountTextRu = data.salary_amount ? numberToText(data.salary_amount, "ru") : "_____________";

  return (
    <ModalForm icon={DocumentText1} onClose={onClose} resize>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">{t("preview.title")}</h4>
        </div>

        <div className="flex-1 overflow-auto page-scroll pr-5 pt-5">
          <div className="flex flex-col text-body-regular-md content-base-primary bg-white">
            <table className="w-full border-collapse mb-6">
              <tbody>
                <tr>
                  <td className="p-4 border border-gray-300 align-top text-center">
                    <h1 className="text-2xl font-bold mb-4">№ _________ ЕҢБЕК ШАРТЫ</h1>
                    <div className="flex justify-between text-sm mb-3">
                      <span>
                        <strong>{city ? city.name_kk : "_____________"}</strong> қ.{" "}
                      </span>
                      <span>
                        <strong>{startDateKk}</strong>
                      </span>
                    </div>
                    <div>
                      <p className="mt-3 text-left">
                        Бұдан әрі «Қоғам/Жұмыс беруші» деп аталатын{" "}
                        <strong>{userData?.organization || "_____________"}</strong>{" "}
                        {userData?.organization_type_full_title_kk || "_____________"} атынан{" "}
                        {userData?.employer_position_kk || "_____________"} негізінде әрекет ететін{" "}
                        <strong>{userData?.full_name || "_____________"}</strong>, бір тараптан, және Қазақстан
                        Республикасының азаматшасы <strong>{employee_full_name || "_____________"}</strong>, бұдан әрі
                        «Жұмыскер» деп аталып, екінші тараптан, бұдан әрі бірлесіп «Тараптар» деп аталып, төмендегі
                        еңбек шартын (бұдан әрі – Шарт) жасасты:
                      </p>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top text-center">
                    <h1 className="text-2xl font-bold mb-4">ТРУДОВОЙ ДОГОВОР № _________</h1>
                    <div className="flex justify-between text-sm mb-3">
                      <span>
                        г. <strong>{city ? city.name_ru : "_____________"}</strong>{" "}
                      </span>
                      <span>
                        <strong>{startDateRu}</strong>
                      </span>
                    </div>
                    <div>
                      <p className="mt-3 text-left">
                        {userData?.organization_type_full_title_ru || "_____________"}{" "}
                        <strong>{userData?.organization || "_____________"}</strong>, именуемое в дальнейшем
                        «Работодатель», в лице действующего на основании{" "}
                        {userData?.employer_position_ru
                          ? ruInflect(userData?.employer_position_ru, 1)
                          : "_____________"}{" "}
                        <strong>{userData?.full_name || "_____________"}</strong>, с одной стороны, и гражданка
                        Республики Казахстан <strong>{employee_full_name || "_____________"}</strong>, именуемая в
                        дальнейшем «Работник», далее совместно именуемые «Стороны», заключили трудовой договор (далее –
                        Договор) о нижеследующем:
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">1. ШАРТТЫҢ МӘНІ</h2>
                    <div>
                      <p className="mb-2">
                        1.1. Жұмыс беруші Жұмыскерді {trialPeriodKk && `${trialPeriodKk}, `}
                        <strong>{startDateKk}</strong> бастап{" "}
                        <strong>{data.job_position_kk.toLowerCase() || "_____________"}</strong> лауазымына қабылдайды.
                        Жұмыскер келесі жұмысты атқаруға міндеттеледі:
                        <br />
                        {data.job_duties_kk && data.job_duties_kk.length > 0 ? (
                          <strong>
                            {data.job_duties_kk.map((duty, idx) => (
                              <span key={idx}>
                                {idx > 0 && <br />}- {duty}
                                {idx < data.job_duties_kk.length - 1 && ";"}
                              </span>
                            ))}
                          </strong>
                        ) : (
                          <strong>_____________</strong>
                        )}
                      </p>

                      <p className="mb-2">
                        1.2. Бұл Шарт Жұмыс беруші мен Жұмыскер арасындағы еңбек қатынастарын реттейді.
                      </p>

                      <p className="mb-2">
                        1.3. Жұмысты орындау орны:{" "}
                        <strong>
                          {data.is_online
                            ? data.employee_address_kk
                            : userData?.organization_address_kk || "_____________"}
                        </strong>
                        .
                      </p>

                      <p className="mb-2">
                        1.4. Жұмыстың басталатын күні <strong>{startDateKk}</strong>.
                      </p>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">1. ПРЕДМЕТ ДОГОВОРА</h2>
                    <div>
                      <p className="mb-2">
                        1.1. Работодатель принимает Работника на должность{" "}
                        <strong>{data.job_position_ru.toLowerCase() || "_____________"}</strong>{" "}
                        {trialPeriodRu && `${trialPeriodRu} `}с <strong>{startDateRu}</strong>. Работник обязуется
                        выполнять следующую работу:
                        <br />
                        {data.job_duties_ru && data.job_duties_ru.length > 0 ? (
                          <strong>
                            {data.job_duties_ru.map((duty, idx) => (
                              <span key={idx}>
                                {idx > 0 && <br />}- {duty}
                                {idx < data.job_duties_ru.length - 1 && ";"}
                              </span>
                            ))}
                          </strong>
                        ) : (
                          <strong>_____________</strong>
                        )}
                      </p>

                      <p className="mb-2">
                        1.2. Настоящий Договор регулирует трудовые отношения между Работодателем и Работником.
                      </p>

                      <p className="mb-2">
                        1.3. Место выполнения работы:{" "}
                        <strong>
                          {data.is_online
                            ? data.employee_address_ru
                            : userData?.organization_address_ru || "_____________"}
                        </strong>
                        .
                      </p>

                      <p className="mb-2">
                        1.4. Дата начала работы <strong>{startDateRu}</strong>.
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">2. ЖҰМЫС БЕРУШІНІҢ ҚҰҚЫҚТАРЫ МЕН МІНДЕТТЕРІ</h2>
                    <div>
                      <p className="mb-2 font-bold">2.1. Жұмыс беруші:</p>
                      <div className="ml-6 mb-2">
                        <p className="mb-1">
                          2.1.1. Қазақстан Республикасының еңбек заңнамасына, келісімдерге, сондай-ақ Жұмыс берушінің
                          ішкі актілеріне сәйкес келуге міндетті;
                        </p>
                        <p className="mb-1">2.1.2. Шартта көрсетілген жұмысты Жұмыскерге қамтамасыз етуге міндетті;</p>
                        <p className="mb-1">
                          2.1.3. Еңбекақыны және басқа да төлемдерді уақытылы және толық мөлшерде төлеуге міндетті;
                        </p>
                        <p className="mb-1">
                          2.1.4. Заңнама мен Шартта көзделген еңбек жағдайларын қамтамасыз етуге міндетті;
                        </p>
                        <p className="mb-1">
                          2.1.5. егер жұмысты жалғастыру Жұмыскердің немесе өзге тұлғалардың өміріне, денсаулығына зиян
                          келтіруе алса, онда жұмысты тоқтатуға;
                        </p>
                        <p className="mb-1">2.1.6. Жұмыскерді міндетті әлеуметтік сақтандыруды жүргізуге;</p>
                        <p className="mb-1">
                          2.1.7. Жұмыскерді еңбек (қызметтік) міндеттерін орындаған кезде жазатайым жағдайлардан
                          сақтандыруға;
                        </p>
                        <p className="mb-1">2.1.8. Жұмыскерге жыл сайынғы ақы төленетін еңбек демалысын беруге;</p>
                        <p className="mb-1">
                          2.1.9. Жұмыскерге зиян және (немесе) қауіпті еңбек жағдайлары және ықтимал кәсіби аурулар
                          туралы ескертуге;
                        </p>
                        <p className="mb-1">
                          2.1.10. жұмыс орындарында және технологиялық процестерде тәуекелдердің туындауын болдырмау
                          жөніндегі шараларды қабылдауға, өндірістік және ғылыми-техникалық ілгерілеуді ескере отырып,
                          профилактикалық жұмыстарды жүргізуге;
                        </p>
                        <p className="mb-1">
                          2.1.11. Жұмыскер орындайтын жұмыстардың жұмыс уақытының есебін жүргізуге;
                        </p>
                        <p className="mb-1">
                          2.1.12. еңбек (қызметтік) міндеттерін орындау кезінде Жұмыскердің өмірі мен денсаулығына
                          келтірілген залалды өтеуге;
                        </p>
                        <p className="mb-1">
                          2.1.13. Қазақстан Республикасының дербес деректер жән оларды қорғау туралы заңнамасына сәйкес
                          Жұмыскердің жеке деректерін жинауды, өңдеуді және қорғауды жүзеге асыруға;
                        </p>
                        <p className="mb-1">
                          2.1.14. Шарт тоқтатылған (бұзылған) жағдайда, Қазақстан Республикасының заңнамасына және
                          Шартқа сәйкес Жұмыскермен толық есеп айырысуға; Жұмыскердің еңбек қызметін растайтын құжатты
                          беруге;
                        </p>
                        <p className="mb-1">
                          2.1.15. Қазақстан Республикасының денсаулық сақтау саласындағы заңнамасында айқындалған
                          тәртіппен және көлемде жұмыс орнын (лауазымын) және орташа жалақысын сақтай отырып,
                          қызметкерге скринингтік зерттеулерден өту үшін демалыс беруге;
                        </p>
                        <p className="mb-1">
                          2.1.16. тәртіптік жазаны қолданғанға дейін Жұмыскерден жазбаша түрде жазбаша түсініктемені
                          талап етуге;
                        </p>
                        <p className="mb-1">
                          2.1.17. Қазақстан Республикасының заңдарында көзделген жағдайларда тиісті уәкілетті
                          мемлекеттік органдардың актілері негізінде жұмыстан шеттету үшін негіз болған себептер
                          анықталғанға және (немесе) жойылғанға дейін Жұмыскерді жұмыстан шеттетуге;
                        </p>
                        <p className="mb-1">
                          2.1.18. Қазақстан Республикасының Еңбек кодексінде көзделген жағдайларда Жұмыс берушінің
                          актісі негізінде Жұмыскерді жұмыстан шеттеу үшін негіздеме болған себептер анықталғанға және
                          (немесе) жойылғанға дейін жұмыстан шеттетуге міндетті. Жұмыстан шеттетілген кезеңде
                          Жұмыскердің еңбекақысы сақталмайды және Жұмыс берушінің қаражаты есебінен уақытша еңбекке
                          жарамсыздығы үшін жәрдемақы төленбейді;
                        </p>
                        <p className="mb-1">
                          2.1.19. Шартты жасасу (Тараптардың деректемелері, Жұмыскердің еңбек функциясы, жұмысты орындау
                          орны, Шарттың мерзімі, жұмыстың басталу күні, Шартты жасасу күні мен оның нөмірі), оған
                          енгізілетін өзгерістер және (немесе) толықтырулар мен оны тоқтату туралы ақпаратты еңбек
                          шарттарын бірыңғай есепке алу жүйесіне еңбек жөніндегі уәкілетті мемлекеттік орган айқындаған
                          тәртіппен енгізуге міндетті.
                        </p>
                      </div>

                      <p className="mb-2 font-bold">2.2. Жұмыс беруші:</p>
                      <div className="ml-6 mb-2">
                        <p className="mb-1">2.2.1. Жұмыс берушінің өкілеттілігі шегінде актілер шығаруға құқылы;</p>
                        <p className="mb-1">
                          2.2.2. Жұмыскерден Шарттың талаптарына, келісімге, сондай-ақ Жұмыс берушінің басқа да
                          актілеріне сәйкес келуді талап етуге құқылы;
                        </p>
                        <p className="mb-1">
                          2.2.3. Жұмыскерді ынталандыруға, тәртіптік жазаны қолдануға, сондай-ақ Қазақстан
                          Республикасының Еңбек кодексінде көзделген жағдайлар мен тәртіптерде Жұмыскерді материалдық
                          жауапкершілікке тартуға құқылы;
                        </p>
                        <p className="mb-1">
                          2.2.4. Еңбек міндеттерін орындау кезінде Жұмыскердің келтірген залалын өтеуді талап етуге
                          құқылы;
                        </p>
                        <p className="mb-1">
                          2.2.5. Жұмыскерлерді кәсіби дайындауға, қайта дайындауға, біліктілікті арттыруға және
                          Қазақстан Республикасының Еңбек кодексі мен «Кәсіби біліктілік туралы» Қазақстан
                          Республикасының Заңына сәйкес кәсіби біліктілікті тануға құқылы;
                        </p>
                        <p className="mb-1">
                          2.2.6. Қазақстан Республикасының Еңбек кодексі мен Жұмыскермен жасалған Оқыту шартына сәйкес
                          Жұмыскерді оқытуға байланысты шығындарды өтеуді талап етуге құқылы;
                        </p>
                        <p className="mb-1">
                          2.2.7. Жеке еңбек дауларын Қазақстан Республикасының Еңбек кодексі мен Қазақстан
                          Республикасының Азаматтық процестік кодексінде белгіленген тәртіппен келісім комиссиясына,
                          содан кейін сотқа шағымдануға құқылы;
                        </p>
                        <p className="mb-1">
                          2.2.8. Жұмыскерді демалыс күндері мен мейрам күндеріне, сондай-ақ артық жұмыс уақытына жұмысқа
                          тартуға, Қазақстан Республикасының еңбек заңнамасында белгіленген шарттарды сақтай отырып,
                          құқылы;
                        </p>
                        <p className="mb-1">
                          2.2.9. Қазақстан Республикасының Еңбек кодексінде белгіленген тәртіппен Шартқа өзгерістер мен
                          толықтырулар енгізуге, сондай-ақ Шартты тоқтатуға құқылы;
                        </p>
                        <p className="mb-1">
                          2.2.10. өндірістік қажеттілік жағдайында, соның ішінде жұмысқа шықпаған Жұмыскердің орнын
                          ауыстыру қажет болғанда, Жұмыскерді оның келісімінсіз күнтізбелік жыл ішінде үш айға дейінгі
                          мерзімге бұрын атқарған жұмысы бойынша орташа еңбекақысынан төмен болмайтын еңбекақы
                          төленетін, Шартта белгіленбеген және оның денсаулығына зиян келтірмейтін басқа жұмысқа
                          ауыстыруға;
                        </p>
                        <p className="mb-1">
                          2.2.11. Жұмыскерді басқа жұмыс орнына немесе сол жергілікті жердегі басқа құрылымдық бөлімшеге
                          ауыстыруға, немесе жұмысты Шартта белгіленген лауазымы, мамандығы, кәсібі, біліктілігі шегінде
                          басқа механизмде немесе агрегатта орындауды тапсыруға; Жұмыскердің келісімінсіз, оның еңбек
                          жағдайының өзгеруіне әкелмейтін Жұмыскердің лауазымының (жұмысының) атауын өзгертуге;
                        </p>
                        <p className="mb-1">
                          2.2.12. жұмысты жалғастыруға кедергі келтіретін экономикалық, технологиялық, ұйымдастырушылық,
                          басқа да өндірістік немесе табиғи сипаттағы себептер туындаған жағдайда, Жұмыс беруші жұмысты
                          уақытша тоқтатып, бос тұрып қалуды жариялауға құқығы бар. Бос тұрып қалу Жұмыс берушінің
                          актісімен жарияланады. Бос тұрып қалу жағдайында Жұмыс беруші бос тұрып қалудың бүкіл кезеңіне
                          Жұмыскерді оның келісімінсіз денсаулық жағдайына қарсы көрсетілімі жоқ басқа жұмысқа
                          ауыстыруға құқылы;
                        </p>
                        <p className="mb-1">
                          2.2.13. соттың шешімімен, сондай-ақ Қазақстан Республикасының Еңбек кодексінде және Қазақстан
                          Республикасының заңдарында көзделген жағдайларда Жұмыскерге жазбаша түрде хабарлай отырып, ал
                          кейбір жағдайларда Жұмыскердің жазбаша келісімімен Жұмыс берушінің актісі негізінде
                          Жұмыскердің Жұмыс берушінің алдындағы берешегін өтеу үшін Жұмыскердің еңбекақысынан соманы
                          ұстап қалуға құқылы. Бос тұрған жағдайда Жұмыс беруші Жұмыскерді оның келісімінсіз бүкіл бос
                          тұрып қалған кезеңге денсаулық жағдайы бойынша қарсы көрсетілмеген басқа жұмысқа ауыстыруға
                          құқылы;
                        </p>
                        <p className="mb-1">
                          2.2.14. еңбек шарттарын бірыңғай есепке алу жүйесінен Жұмыскердің еңбек қызметі туралы
                          мәліметтер алуға құқылы.
                        </p>
                      </div>

                      <p className="mb-2 font-bold">
                        2.3. Жұмыс беруші еңбек қатынастарын және олармен тікелей байланысты өзге де қатынастарды
                        реттейтін Қазақстан Республикасының заңнамасында көзделген өзге де құқықтарға ие және өзге
                        міндеттерді атқарады.
                      </p>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">2. ПРАВА И ОБЯЗАННОСТИ РАБОТОДАТЕЛЯ</h2>
                    <div>
                      <p className="mb-2 font-bold">2.1. Работодатель обязуется:</p>
                      <div className="ml-6 mb-2">
                        <p className="mb-1">
                          2.1.1. соблюдать трудовое законодательство Республики Казахстан, соглашения, а также
                          внутренние акты Работодателя;
                        </p>
                        <p className="mb-1">2.1.2. предоставить Работнику работу, указанную в Договоре;</p>
                        <p className="mb-1">
                          2.1.3. своевременно и в полном размере выплачивать заработную плату и иные выплаты;
                        </p>
                        <p className="mb-1">
                          2.1.4. обеспечивать условия труда, предусмотренные законодательством и Договором;
                        </p>
                        <p className="mb-1">
                          2.1.5. если продолжение работы может причинить вред жизни или здоровью Работника или других
                          лиц, то приостановить работу;
                        </p>
                        <p className="mb-1">2.1.6. осуществлять обязательное социальное страхование Работника;</p>
                        <p className="mb-1">
                          2.1.7. страховать Работника от несчастных случаев при исполнении им трудовых (служебных)
                          обязанностей;
                        </p>
                        <p className="mb-1">2.1.8. предоставлять Работнику ежегодный оплачиваемый трудовой отпуск;</p>
                        <p className="mb-1">
                          2.1.9. предупреждать Работника о вредных и (или) опасных условиях труда и возможности
                          профессионального заболевания;
                        </p>
                        <p className="mb-1">
                          2.1.10. принимать меры по предотвращению рисков на рабочих местах и в технологических
                          процессах, проводить профилактические работы с учетом производственного и научно-технического
                          прогресса;
                        </p>
                        <p className="mb-1">2.1.11. вести учет рабочего времени работ, выполняемых Работником;</p>
                        <p className="mb-1">
                          2.1.12. возмещать вред, причиненный жизни и здоровью Работника, при исполнении им трудовых
                          (служебных) обязанностей;
                        </p>
                        <p className="mb-1">
                          2.1.13. осуществлять сбор, обработку и защиту персональных данных Работника в соответствии с
                          законодательством Республики Казахстан о персональных данных и их защите;
                        </p>
                        <p className="mb-1">
                          2.1.14. при прекращении (расторжении) Договора произвести Работнику полный расчет в
                          соответствии с законодательством Республики Казахстан и Договором; выдать документ,
                          подтверждающий трудовую деятельность Работника;
                        </p>
                        <p className="mb-1">
                          2.1.15. предоставлять Работнику отпуск для прохождения скрининговых исследований с сохранением
                          места работы (должности) и средней заработной платы в порядке и объеме, определенном
                          законодательством Республики Казахстан в области здравоохранения;
                        </p>
                        <p className="mb-1">
                          2.1.16. до применения дисциплинарного взыскания письменно затребовать от Работника письменное
                          объяснение;
                        </p>
                        <p className="mb-1">
                          2.1.17. в случаях, предусмотренных законами Республики Казахстан, отстранить Работника от
                          работы на основании актов соответствующих уполномоченных государственных органов на срок до
                          выяснения и (или) устранения причин, послуживших основанием для отстранения;
                        </p>
                        <p className="mb-1">
                          2.1.18. в случаях, предусмотренных Трудовым кодексом Республики Казахстан, отстранить
                          Работника от работы на основании акта Работодателя на срок до выяснения и (или) устранения
                          причин, послуживших основанием для отстранения. На период отстранения от работы Работнику не
                          сохраняется заработная плата и не выплачивается за счет средств Работодателя пособие по
                          временной нетрудоспособности;
                        </p>
                        <p className="mb-1">
                          2.1.19. вносить информацию о заключении Договора (реквизиты Сторон, трудовая функция
                          Работника, место выполнения работы, срок Договора, дата начала работы, дата заключения и
                          порядковый номер Договора), вносимых в него изменениях и (или) дополнениях и прекращении
                          Договора в единую систему учета трудовых договоров, в порядке, определенном уполномоченным
                          государственным органом по труду.
                        </p>
                      </div>

                      <p className="mb-2 font-bold">2.2. Работодатель имеет право:</p>
                      <div className="ml-6 mb-2">
                        <p className="mb-1">2.2.1. издавать акты в пределах полномочий Работодателя;</p>
                        <p className="mb-1">
                          2.2.2. требовать от Работника соблюдения условий Договора, соглашения, а также иных актов
                          Работодателя;
                        </p>
                        <p className="mb-1">
                          2.2.3. поощрять Работника, применять дисциплинарные взыскания, а также привлекать Работника к
                          материальной ответственности в случаях и порядке, предусмотренных Трудовым кодексом Республики
                          Казахстан;
                        </p>
                        <p className="mb-1">
                          2.2.4. требовать возмещения вреда, причиненного Работником при исполнении трудовых
                          обязанностей;
                        </p>
                        <p className="mb-1">
                          2.2.5. предоставлять работникам профессиональное обучение, переподготовку, повышение
                          квалификации и признание профессиональной квалификации в соответствии с Трудовым кодексом
                          Республики Казахстан и Законом Республики Казахстан «О профессиональной квалификации»;
                        </p>
                        <p className="mb-1">
                          2.2.6. требовать возмещения расходов, связанных с обучением Работника, в соответствии с
                          Трудовым кодексом Республики Казахстан и Договором об обучении с Работником;
                        </p>
                        <p className="mb-1">
                          2.2.7. обращаться с индивидуальными трудовыми спорами последовательно в комиссию по
                          примирению, а затем в суд, в порядке, установленном Трудовым кодексом Республики Казахстан и
                          Гражданским процессуальным кодексом Республики Казахстан;
                        </p>
                        <p className="mb-1">
                          2.2.8. привлекать Работника к работе в выходные и праздничные дни, а также к сверхурочной
                          работе, соблюдая условия, установленные трудовым законодательством Республики Казахстан;
                        </p>
                        <p className="mb-1">
                          2.2.9. вносить изменения и дополнения в Договор, а также прекращать Договор в порядке,
                          установленном Трудовым кодексом Республики Казахстан;
                        </p>
                        <p className="mb-1">
                          2.2.10. В случае производственной необходимости, в том числе временного замещения
                          отсутствующего работника, переводить Работника без его согласия на срок до трех месяцев в
                          течение календарного года на другую не обусловленную Договором и не противопоказанную ему по
                          состоянию здоровья работу, с оплатой труда по выполняемой работе, но не ниже средней
                          заработной платы по прежней работе;
                        </p>
                        <p className="mb-1">
                          2.2.11. перемещать Работника на другое рабочее место либо в другое структурное подразделение в
                          той же местности, либо поручать работы на другом механизме или агрегате в пределах должности,
                          специальности, профессии, квалификации, обусловленных Договором; изменять наименование
                          должности (работы) Работника, не влекущее для Работника изменения условий труда, без согласия
                          Работника;
                        </p>
                        <p className="mb-1">
                          2.2.12. В случае возникновения причин экономического, технологического, организационного,
                          иного производственного или природного характера, препятствующих продолжению работы,
                          Работодатель вправе временно приостановить работу и объявить простой. Простой объявляется
                          актом Работодателя. Работодатель в случае простоя имеет право переводить Работника без его
                          согласия на весь период простоя на другую, не противопоказанную по состоянию здоровья работу;
                        </p>
                        <p className="mb-1">
                          2.2.13. по решению суда, а также в случаях, предусмотренных Трудовым кодексом Республики
                          Казахстан и законами Республики Казахстан, производить удержания из заработной платы Работника
                          для погашения его задолженности перед Работодателем, на основании акта Работодателя с
                          письменным уведомлением Работника, а в иных случаях при наличии письменного согласия
                          работника;
                        </p>
                        <p className="mb-1">
                          2.2.14. на получение из единой системы учета трудовых договоров сведений о трудовой
                          деятельности Работника.
                        </p>
                      </div>

                      <p className="mb-2 font-bold">
                        2.3. Работодатель имеет иные права и исполняет иные обязанности, предусмотренные
                        законодательством Республики Казахстан, регулирующим трудовые и непосредственно связанные с ними
                        отношения.
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">3. ЖҰМЫСКЕРДІҢ ҚҰҚЫҚТАРЫ МЕН МІНДЕТТЕРІ</h2>
                    <div>
                      <p className="mb-2 font-bold">3.1. Жұмыскер:</p>
                      <div className="ml-6 mb-2">
                        <p className="mb-1">
                          3.1.1. Қазақстан Республикасының заңнамасына сәйкес еңбек міндеттерін адал орындауға;
                        </p>
                        <p className="mb-1">3.1.2. еңбек тәртібін сақтауға;</p>
                        <p className="mb-1">
                          3.1.3. жұмыстарды орындайтын жердегі мүлікті ұқыпты пайдалануға, жұмыс барысында мүліктік
                          залал келтіруіне жол бермеуге;
                        </p>
                        <p className="mb-1">
                          3.1.4. Жұмыс берушіге келтірілген залалды Қазақстан Республикасының заңнамасында белгіленген
                          шектерде өтеп беруге;
                        </p>
                        <p className="mb-1">
                          3.1.5. жұмыс орнында еңбек қауіпсіздігі мен еңбекті қорғау, өрт қауіпсіздігі мен өндірістік
                          санитария жөніндегі талаптарды сақтауға;
                        </p>
                        <p className="mb-1">
                          3.1.6. Жұмыс беруші ұсынған құқықтар шегінде және лауазымдық нұсқаулыққа сәйкес өкілеттіктерді
                          жүзеге асыруға;
                        </p>
                        <p className="mb-1">3.1.7. іскерлік этика нормаларын сақтауға;</p>
                        <p className="mb-1">3.1.8. өз біліктілігін жүйелі түрде арттырып отыруға;</p>
                        <p className="mb-1">
                          3.1.9. Жұмыс берушіде өз еңбек қызметін жүзеге асыру уақытында, сондай-ақ еңбек қызметін
                          тоқтатқаннан кейін 5 (бес) жыл бойы Жұмыс берушінің актілеріне сәйкес коммерциялық немесе
                          заңмен қорғалатын өзге құпияны құрайтын мәліметтерді, сондай-ақ жариялауға жатпайтын ақпаратты
                          таратпауға, сондай-ақ осы Шартқа қосымшаға сәйкес дербес деректерді, коммерциялық, қызметтік
                          және заңнамамен қорғалатын өзге де құпияны жария етпеу туралы міндеттемеге қол қоюға;
                        </p>
                        <p className="mb-1">
                          3.1.10. өзіне де (немесе өзара байланысты), өзгеге де қатысты мүдделер қақтығысы туындауы
                          ықтимал жағдайларға жол бермеуге, осы Шарттың 8-тарауының ережелеріне сәйкес Жұмыс берушінің
                          сыбайлас жемқорлыққа қарсы саясатын сақтауға;
                        </p>
                        <p className="mb-1">
                          3.1.11. еңбек шарты тоқтатылған (бұзылған) жағдайда өзінің берешегін ақшалай немесе өзге түрде
                          толық өтеуге және Жұмыс берушінің тиісті құрылымдық бөлімшелерінде кету парағын ресімдеу
                          рәсімін сақтауға;
                        </p>
                        <p className="mb-1">
                          3.1.12. Шарт өз бастамасы бойынша немесе Жұмыскердің кінәсі салдарынан Жұмыс берушінің
                          бастамасы бойынша бұзылған жағдайда Жұмыс берушіге оны оқытуға байланысты шығындарды жұмыспен
                          өтеу аяқталмаған мерзімге (болған кезде) барабар түрде толық өтеуге;
                        </p>
                        <p className="mb-1">
                          3.1.13. адамдардың өмірі мен денсаулығына, Жұмыс беруші мен өзге жұмыскерлердің мүлкінің
                          сақталуына қауіп төндіретін жағдай туралы, сондай-ақ бос тұрып қалу туындағаны туралы Жұмыс
                          берушіге тез арада хабарлауға;
                        </p>
                        <p className="mb-1">
                          3.1.14. Жұмыс берушінің талаптарына қарай жұмыс барысында өзінің іс-әрекеттеріне қатысты
                          түсіндірмелер беруге;
                        </p>
                        <p className="mb-1">
                          3.1.15. Шарт қолданылатын бүкіл кезеңде Жұмыс берушімен келіспей, өзге жұмыс берушілермен
                          жұмысқа жалдану бойынша тікелей немесе жанама қатынастарға түспеуге;
                        </p>
                        <p className="mb-1">
                          3.1.16. мүгедектік белгіленген немесе денсаулығы жағдайы нашарлаған сәттен бастап бір жұмыс
                          күні ішінде Жұмыс берушіге мүгедектіктің белгіленгені немесе еңбек міндеттерін жалғастыруға
                          кедергі келтіретін денсаулығының нашарлауы туралы хабарлауға;
                        </p>
                        <p className="mb-1">
                          3.1.17. өндірістік жарақат алған, кәсіби ауруға ұшыраған немесе денсаулығына еңбек міндеттерін
                          орындауға байланысты басқадай зиян келтірілген жағдайда немесе денсаулығына өндіріспен
                          байланысты емес себеппен залал келтірілген жағдайда, дереу медициналық тексерістен өтуге және
                          медициналық қорытындыны алған күннен бастап бір жұмыс күні ішінде оны Жұмыс берушіге ұсынуға;
                        </p>
                        <p className="mb-1">
                          3.1.18. еңбекке жарамсыздығы белгіленген жағдайда (соның ішінде науқас балаға күтім жасау
                          бойынша), еңбекке жарамсыздығы белгіленген сәттен бастап бір тәулік ішінде бұл туралы тікелей
                          басшыға және Жұмыс берушіге хабарлауға және еңбекке уақытша жарамсыздық парағында көрсетілген
                          жұмысқа шығатын күні немесе еңбекке жарамсыздық мерзімі аяқталғанға дейін еңбекке уақытша
                          жарамсыздығы туралы парақты басшыға қол қою үшін ұсынуға;
                        </p>
                        <p className="mb-1">
                          3.1.19. Жұмыс берушінің актісінде көзделген жағдайларда, сондай-ақ басқа жұмысқа ауысқан кезде
                          Жұмыс берушінің талабы бойынша профилактикалық медициналық тексерістерден өтуге;
                        </p>
                        <p className="mb-1">
                          3.1.20. денсаулық сақтау саласындағы уәкілетті орган белгілеген тәртіпте міндетті алдын ала
                          және жүйелі медициналық тексерістерден, сондай-ақ ауысым алдындағы, ауысымнан кейінгі (егер
                          қажет болса) және өзге медициналық куәландырудан өтуге;
                        </p>
                        <p className="mb-1">
                          3.1.21. мемлекеттік еңбек инспекторының, еңбекті қорғау жөніндегі техникалық инспектордың,
                          ішкі бақылау мамандарының талаптарын және медициналық мекемелер тағайындаған емдеу және
                          сауықтыру іс-шараларын орындауға;
                        </p>
                        <p className="mb-1">
                          3.1.22. еңбекті қорғау бойынша оқудан өтуге, нұсқау алуға және білімін тексеруден өтуге;
                        </p>
                        <p className="mb-1">
                          3.1.23. еңбек қауіпсіздігі және еңбекті қорғау нормаларын, қағидалары мен нұсқаулықтардың
                          талаптарын сақтауға;
                        </p>
                        <p className="mb-1">
                          3.1.24. Жұмыс берушіге жұмыс орнында болмауының себептері, соның ішінде еңбекке уақытша
                          жарамсыздығы туралы дереу хабарлауға;
                        </p>
                        <p className="mb-1">
                          3.1.25. еңбекке уақытша жарамсыз болған жағдайда, жұмысқа шыққан күні Жұмыс берушіге еңбекке
                          уақытша жарамсыздық парағын ұсынуға;
                        </p>
                        <p className="mb-1">
                          3.1.26. тұрғылықты мекенжайының және тұрғылықты орны бойынша тіркеу орнының, өзге де дербес
                          деректерінің өзгергені туралы Жұмыс берушіге бір жұмыс күні ішінде жазбаша түрде хабарлауға;
                        </p>
                        <p className="mb-1">
                          3.1.27. Жұмыс берушінің жазбаша талабымен екі жұмыс күні ішінде оған тәртіптік теріс қылығы
                          туралы жазбаша түсініктеме беруге міндетті. Егер екі жұмыс күні өткеннен кейін Жұмыскер
                          жазбаша түсініктемені ұсынбаса, онда ол туралы акт жасалады. Жұмыскердің түсініктеме ұсынбауы
                          тәртіптік жазаны қолдану үшін кедергі болып табылмайды;
                        </p>
                        <p className="mb-1">
                          3.1.28. ерекше құқықтық режім енгізілген жағдайда, мемлекетік органдар мен лауазымдық тұлғалар
                          берген карантиндік және басқа да шектеу іс-шараларын мүлтіксіз орындауға; денсаулық сақтау
                          ұйымдарында әрекет ететін режимді сақтауға;
                        </p>
                        <p className="mb-1">
                          3.1.29. өз денсаулығының сақталуына қамқор болуға, жеке және қоғамдық денсаулықты сақтау мен
                          нығайту үшін ортақ жауапкершілікте болуға; медицина жұмыскерлерінің, денсаулық сақтау
                          органдары мен ұйымдарының жеке және қоғамдық денсаулыққа қатысты нұсқамаларын орындауға; өз
                          денсаулығын және айналасындағылардың денсаулығын сақтау жөніндегі сақтық шараларын орындауға,
                          медициналық ұйымдардың талап етуі бойынша зерттеп-қараудан өтуге және емделуге, инфекциялық
                          аурулар мен айналасындағыларға қауіп төндіретін аурулар кезінде өзінің ауруы туралы
                          медициналық персоналға хабарлауға міндетті.
                        </p>
                        <p className="mb-1">
                          3.1.30. Жұмыс берушіге Еңбек шарты тоқтатылғанға дейін өзінің лауазымдық міндеттерін орындау
                          тәртібімен әзірленген бастапқы кодты және өзге де материалдарды беруге.
                        </p>
                        <p className="mb-1">
                          3.1.31. Еңбек шарты тоқтатылған кезде өзінің лауазымдық міндеттерін орындау шеңберінде алынған
                          мүліктік құқықтардан бас тартуға, сондай-ақ мүліктік құқықтарды Жұмыс берушінің пайдасына
                          иеліктен шығаруға.
                        </p>
                        <p className="mb-1">
                          3.1.32. Қызметкер өзінің лауазымдық міндеттерін орындау барысында әзірленген бағдарламалық
                          өнімді іске асыру шеңберінде Жұмыс берушінің қаржылық мүмкіндіктеріне талаптанбауға
                          міндеттенеді.
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">3. ПРАВА И ОБЯЗАННОСТИ РАБОТНИКА</h2>
                    <div>
                      <p className="mb-2 font-bold">3.1. Работник обязан:</p>
                      <div className="ml-6 mb-2">
                        <p className="mb-1">
                          3.1.1. добросовестно выполнять трудовые обязанности в соответствии с Договором, другими актами
                          Работодателя, должностной инструкцией, а также законодательством Республики Казахстан;
                        </p>
                        <p className="mb-1">3.1.2. соблюдать трудовую дисциплину;</p>
                        <p className="mb-1">
                          3.1.3. бережно относиться к имуществу по месту выполнения работы, не допускать в процессе
                          работы нанесения имущественного вреда;
                        </p>
                        <p className="mb-1">
                          3.1.4. возмещать Работодателю причиненный ущерб в пределах, установленных законодательством
                          Республики Казахстан;
                        </p>
                        <p className="mb-1">
                          3.1.5. соблюдать требования по безопасности и охране труда, пожарной безопасности и
                          производственной санитарии на рабочем месте;
                        </p>
                        <p className="mb-1">
                          3.1.6. осуществлять полномочия в пределах, предоставленных ему Работодателем прав и в
                          соответствии с должностной инструкцией;
                        </p>
                        <p className="mb-1">3.1.7. соблюдать нормы деловой этики;</p>
                        <p className="mb-1">3.1.8. регулярно повышать свою квалификацию;</p>
                        <p className="mb-1">
                          3.1.9. не разглашать сведения, составляющие коммерческую либо иную охраняемую законом тайну, а
                          также информацию, не подлежащую разглашению, на время осуществления им трудовой деятельности,
                          а также после прекращения им трудовой деятельности у Работодателя в течение 5 (пяти) лет в
                          соответствии с актами Работодателя, а также подписать обязательство о неразглашении
                          персональных данных, коммерческой, служебной и иной охраняемой законодательством тайны
                          согласно приложению к настоящему Договору;
                        </p>
                        <p className="mb-1">
                          3.1.10. не допускать ситуации, в которой возможно возникновение конфликта интересов, ни в
                          отношении себя (или связанных с собой лиц), ни в отношении других, соблюдать антикоррупционную
                          политику Работодателя в соответствии с положениями главы 8 настоящего Договора;
                        </p>
                        <p className="mb-1">
                          3.1.11. в случае прекращения (расторжения) трудового договора полностью погасить все имеющиеся
                          задолженности в денежном или ином выражении и соблюдать процедуру оформления обходного листа в
                          соответствующих структурных подразделениях Работодателя;
                        </p>
                        <p className="mb-1">
                          3.1.12. возместить Работодателю полностью затраты, связанные с его обучением, пропорционально
                          недоработанному сроку отработки (при его наличии) в случае расторжения Договора по своей
                          инициативе или по инициативе Работодателя вследствие вины Работника;
                        </p>
                        <p className="mb-1">
                          3.1.13. незамедлительно сообщать Работодателю о возникшей ситуации, представляющей угрозу
                          жизни и здоровью людей, сохранности имущества Работодателя и иных работников, а также о
                          возникновении простоя;
                        </p>
                        <p className="mb-1">
                          3.1.14. предоставлять разъяснения относительно своих действий в процессе работы по мере
                          требования Работодателя;
                        </p>
                        <p className="mb-1">
                          3.1.15. на весь период действия Договора не вступать в прямые или косвенные отношения
                          трудового найма с иными работодателями без согласования с Работодателем;
                        </p>
                        <p className="mb-1">
                          3.1.16. сообщать Работодателю об установлении инвалидности или ином ухудшении состояния
                          здоровья, препятствующем продолжению трудовых обязанностей, в течение одного рабочего дня с
                          момента установления инвалидности или ухудшения состояния здоровья;
                        </p>
                        <p className="mb-1">
                          3.1.17. в случае производственной травмы, профессионального заболевания или иного повреждения
                          здоровья, полученного в связи с исполнением трудовых обязанностей, или иного повреждения
                          здоровья, не связанного с производством, незамедлительно пройти медицинский осмотр и
                          представить Работодателю медицинское заключение, в течение одного рабочего дня со дня
                          получения медицинского заключения;
                        </p>
                        <p className="mb-1">
                          3.1.18. в случае установления нетрудоспособности (в том числе по уходу за больным ребенком),
                          уведомить об этом непосредственного руководителя и Работодателя в течение суток с момента
                          установления нетрудоспособности и предоставить лист о временной нетрудоспособности в день
                          выхода на работу, указанный в листе о временной нетрудоспособности либо до ее окончания, на
                          подпись руководителю;
                        </p>
                        <p className="mb-1">
                          3.1.19. по требованию Работодателя проходить профилактические медицинские осмотры в случаях,
                          предусмотренных актом Работодателя, а также при переводе на другую работу;
                        </p>
                        <p className="mb-1">
                          3.1.20. проходить обязательные предварительные и периодические медицинские осмотры, а также
                          предсменное, послесменное (если необходимо) и иное медицинское освидетельствование в порядке,
                          установленном уполномоченным органом в области здравоохранения;
                        </p>
                        <p className="mb-1">
                          3.1.21. выполнять требования государственного инспектора труда, технического инспектора по
                          охране труда, специалистов внутреннего контроля и предписанные медицинскими учреждениями
                          лечебные и оздоровительные мероприятия;
                        </p>
                        <p className="mb-1">
                          3.1.22. проходить обучение, инструктирование и проверку знаний по безопасности и охране труда
                          в порядке, определенном Работодателем и предусмотренном законодательством Республики
                          Казахстан;
                        </p>
                        <p className="mb-1">
                          3.1.23. соблюдать требования норм, правил и инструкций по безопасности и охране труда;
                        </p>
                        <p className="mb-1">
                          3.1.24. незамедлительно сообщать Работодателю о причинах отсутствия на рабочем месте, в том
                          числе в случае временной нетрудоспособности;
                        </p>
                        <p className="mb-1">
                          3.1.25. в случае временной нетрудоспособности, в день выхода на работу предоставить
                          Работодателю листок временной нетрудоспособности;
                        </p>
                        <p className="mb-1">
                          3.1.26. в течение одного рабочего дня письменно уведомить Работодателя об изменении адреса
                          постоянного места жительства и адреса регистрации по месту жительства, иных персональных
                          данных;
                        </p>
                        <p className="mb-1">
                          3.1.27. по письменному требованию Работодателя в течение двух рабочих дней давать письменное
                          объяснение о дисциплинарном проступке. Если по истечении двух рабочих дней письменное
                          объяснение Работником не представлено, то об этом составляется акт. Не предоставление
                          Работником объяснения не является препятствием для применения дисциплинарного взыскания;
                        </p>
                        <p className="mb-1">
                          3.1.28. неукоснительно выполнять предписанные уполномоченными государственными органами и
                          должностными лицами карантинные и иные ограничительные мероприятия в случае введения особого
                          правового режима; соблюдать режим, действующий в организациях здравоохранения;
                        </p>
                        <p className="mb-1">
                          3.1.29. заботиться о сохранении своего здоровья, нести солидарную ответственность за
                          сохранение и укрепление индивидуального и общественного здоровья; выполнять относящиеся к
                          индивидуальному и общественному здоровью предписания медицинских работников, органов и
                          организаций здравоохранения; соблюдать меры предосторожности по охране собственного здоровья и
                          здоровья окружающих, проходить обследование и лечение по требованию медицинских организаций,
                          информировать медицинский персонал о своем заболевании при инфекционных заболеваниях и
                          заболеваниях, представляющих опасность для окружающих.
                        </p>
                        <p className="mb-1">
                          3.1.30. Передать Работодателю исходный код и иные материалы разработанные в порядке выполнения
                          им своих должностных обязанностей до прекращения Трудового договора.
                        </p>
                        <p className="mb-1">
                          3.1.31. При прекращении Трудового договора отказаться от имущественных прав полученных в
                          рамках выполнения своих должностных обязанностей, а также произвести отчуждение имущественных
                          прав Работодателю.
                        </p>
                        <p className="mb-1">
                          3.1.32. Не претендовать на финансовые возможности Работодателя в рамках реализации
                          программного продукта, разработанного в ходе выполнения Работником своих должностных
                          обязанностей.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <div>
                      <p className="mb-2 font-bold">3.2. Жұмыскер:</p>
                      <div className="ml-6 mb-2">
                        <p className="mb-1">3.2.1. Жұмыс берушіден Шарттың талаптарын орындауды талап етуге;</p>
                        <p className="mb-1">3.2.2. еңбек қауіпсіздігі мен еңбекті қорғауға;</p>
                        <p className="mb-1">
                          3.2.3. еңбек жағдайы және еңбекті қорғау туралы, жұмыс орнының сипаттамасы және ұйымның аумағы
                          туралы, денсаулыққа зақым келтіру тәуекелі, сондай-ақ зиянды және (немесе) қауіпті өндірістік
                          факторлардың әсерінен қорғау шаралары туралы толық әрі нақты ақпарат алуға;
                        </p>
                        <p className="mb-1">
                          3.2.4. Шарттың талаптарына сәйкес еңбекақының уақытылы және толық көлемде төленуіне;
                        </p>
                        <p className="mb-1">
                          3.2.5. демалуға, соның ішінде жыл сайынғы ақы төленетін еңбек демалысына;
                        </p>
                        <p className="mb-1">
                          3.2.6. еңбек міндеттерін атқаруға байланысты денсаулыққа келтірілген залалдың орнының
                          толтырылуына;
                        </p>
                        <p className="mb-1">3.2.7. міндетті әлеуметтік сақтандырылуға;</p>
                        <p className="mb-1">
                          3.2.8. еңбек (қызметтік) міндеттерін орындаған кездегі жазатайым оқиғалардан сақтандырылуға;
                        </p>
                        <p className="mb-1">
                          3.2.9. Шартта және Қазақстан Республикасының Еңбек кодексінде көзделген кепілдіктерге және
                          өтемақы төлемдеріне;
                        </p>
                        <p className="mb-1">
                          3.2.10. Жұмыс беруші Жұмыскерді жеке және (немесе) ұжымдық қорғау құралдарымен қамтамасыз
                          етпеген жағдайда және оның денсаулығы немесе өміріне қауіп төндіретін жағдай туындаған
                          жағдайда, бұл туралы тікелей басшыға немесе Жұмыс берушінің өкіліне хабарлай отырып, жұмысты
                          орындаудан бас тартуға;
                        </p>
                        <p className="mb-1">
                          3.2.11. Еңбек кодексінде, Қазақстан Республикасының өзге заңдарында белгіленген тәртіпте
                          ереуілдерге қатысу құқығын қосқанда, жеке және ұжымдық еңбек дауларының шешілуіне құқылы.
                          Жұмыскер Жұмыс берушінің өкілдерінің және жұмыскерлердің өкілдері қатарынан Жұмыс берушіде
                          құрылған Келісу комиссиясының жеке еңбек дауын қарастыратынымен келіседі;
                        </p>
                        <p className="mb-1">
                          3.2.12. Жұмыс берушіде сақталатын дербес деректердің қорғалуының қамтамасыз етілуіне;
                        </p>
                        <p className="mb-1">
                          3.2.13. еңбекақысы сақталмайтын демалыс алуға, Қазақстан Республикасының Еңбек кодексінде
                          көзделген жағдайлар мен тәртіптерде;
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top">
                    <div>
                      <p className="mb-2 font-bold">3.2. Работник имеет право:</p>
                      <div className="ml-6 mb-2">
                        <p className="mb-1">3.2.1. требовать от Работодателя выполнения условий Договора;</p>
                        <p className="mb-1">3.2.2. на безопасность и охрану труда;</p>
                        <p className="mb-1">
                          3.2.3. на получение полной и достоверной информации о состоянии условий труда и охраны труда,
                          о характеристике рабочего места и территории организации, о существующем риске повреждения
                          здоровья, а также о мерах по его защите от воздействия вредных и (или) опасных
                          производственных факторов;
                        </p>
                        <p className="mb-1">
                          3.2.4. на своевременную и в полном объеме выплату заработной платы в соответствии с условиями
                          Договора;
                        </p>
                        <p className="mb-1">3.2.5. на отдых, в том числе оплачиваемый ежегодный трудовой отпуск;</p>
                        <p className="mb-1">
                          3.2.6. на возмещение вреда, причиненного здоровью в связи с исполнением трудовых обязанностей;
                        </p>
                        <p className="mb-1">3.2.7. на обязательное социальное страхование;</p>
                        <p className="mb-1">
                          3.2.8. на страхование от несчастных случаев при исполнении трудовых (служебных) обязанностей;
                        </p>
                        <p className="mb-1">
                          3.2.9. на гарантии и компенсационные выплаты, предусмотренные Договором и Трудовым кодексом
                          Республики Казахстан;
                        </p>
                        <p className="mb-1">
                          3.2.10. на отказ от выполнения работы в случае необеспечения Работодателем Работника
                          средствами индивидуальной и (или) коллективной защиты и при возникновении ситуации, создающей
                          угрозу его здоровью или жизни, с извещением об этом непосредственного руководителя или
                          представителя Работодателя;
                        </p>
                        <p className="mb-1">
                          3.2.11. на разрешение индивидуальных и коллективных трудовых споров, включая право на
                          забастовку, в порядке, установленном Трудовым Кодексом, иными законами Республики Казахстан.
                          Работник соглашается на рассмотрение индивидуального трудового спора Согласительной комиссией,
                          созданной у Работодателя из числа представителей Работодателя и представителей работников;
                        </p>
                        <p className="mb-1">
                          3.2.12. на обеспечение защиты персональных данных, хранящихся у Работодателя;
                        </p>
                        <p className="mb-1">
                          3.2.13. на получение отпуска без сохранения заработной платы в случаях и в порядке,
                          предусмотренных Трудовым кодексом Республики Казахстан;
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">
                      4. ЖҰМЫС УАҚЫТЫ, ДЕМАЛЫС УАҚЫТЫ ЖӘНЕ ЕҢБЕККЕ АҚЫ ТӨЛЕУ
                    </h2>
                    <div>
                      <p className="mb-2">4.1. {workScheduleTextKk}</p>

                      <p className="mb-2">
                        4.2. Жұмыскерге 30 (отыз) күнтізбелік күнге тең жыл сайынғы ақы төленетін еңбек демалысы
                        беріледі.
                      </p>

                      <p className="mb-2">
                        4.3. Жыл сайынғы ақы төленетін еңбек демалысы Шарттың мерзімі аяқталуына байланысты оны тоқтату
                        кезінде беріледі. Егер жыл сайынғы ақы төленетін еңбек демалысы Шарттың мерзімінен толық немесе
                        ішінара шығып кетсе, онда ол берілуі мүмкін, ал демалыстың соңғы күні Шарттың тоқтатылу күні
                        болып саналады.
                      </p>

                      <p className="mb-2">
                        4.4. Жұмыскердің демалыс кезеңіндегі еңбекке уақытша жарамсыздығы жағдайында, Жұмыскердің талабы
                        мен Жұмыс берушіге хабарлауы бойынша жыл сайынғы ақы төленетін еңбек демалысы толық немесе
                        ішінара ауыстырылады.
                      </p>

                      <p className="mb-2">
                        4.5. Жыл сайынғы ақы төленетін еңбек демалысы бөліктерге бөлінуі мүмкін, оның бір бөлігі он төрт
                        күнтізбелік күннен кем болмауы керек.
                      </p>

                      <p className="mb-2">
                        4.6. Жұмыскер Жұмыс берушіге демалыстың күтілетін басталу күнінен кемінде 10 (он) күнтізбелік
                        күн бұрын жазбаша түрде хабарлауға міндетті. Жұмыс беруші Жұмыскердің қызметін және басқа
                        жұмыскерлердің демалыс кестесін ескере отырып, Жұмыскердің демалысын бекітуге міндетті.
                      </p>

                      <p className="mb-2">
                        4.7. Еңбек шарты тоқтатылған (бұзылған) жағдайда, Жұмыс беруші пайдаланылмаған немесе ішінара
                        пайдаланылған жыл сайынғы ақы төленетін еңбек демалысы үшін ақшалай өтемақы төлейді.
                      </p>

                      <p className="mb-2">
                        4.8. Егер Жұмыскер Еңбек шарты тоқтатылған (бұзылған) кезде, негіздеріне қарамастан, жыл сайынғы
                        ақы төленетін еңбек демалысын алдын ала толық пайдаланған болса, онда Жұмыс беруші жыл сайынғы
                        ақы төленетін еңбек демалысы үшін төлеген ақша қаражатын соның есебінен жыл сайынғы ақы
                        төленетін еңбек демалысы берілген жұмыс істемеген кезеңге пропорционалды түрде өтеп беруге
                        міндеттенеді.
                      </p>

                      <p className="mb-2">
                        4.9. Жұмыскер жыл сайынғы ақы төленетін еңбек демалысынан кері шақыртып алған жағдайда, кері
                        шақыртып алуға байланысты жыл сайынғы ақы төленетін еңбек демалысының пайдаланылмаған бөлігі
                        Еңбек шарты Тараптарының келісімі бойынша ағымдағы жұмыс жылы ішінде немесе келесі жұмыс жылында
                        кез келген уақытта беріледі не келесі жұмыс жылының жыл сайынғы ақы төленетін еңбек демалысына
                        қосылады.
                      </p>

                      <p className="mb-2">
                        4.10. Жұмыс берушімен келісім бойынша Жұмыскерге әлеуметтік демалыстар (жалақысы сақталмайтын
                        демалыс; оқу демалысы; жүктілікке және бала (балаларды) тууға, жаңа туған баланы (балаларды)
                        асырап алуға байланысты демалыс; бала үш жасқа толғанға дейін оның күтіміне байланысты жалақы
                        сақталмайтын демалыс) беріле алады.
                      </p>

                      <p className="mb-2">4.11. Жұмыскерге мерзімді-сыйақылық еңбекақы төлеу жүйесі белгіленеді.</p>

                      <p className="mb-2">
                        4.12. Жұмыскерге еңбекақы Жұмыс берушінің белгіленген тәртіппен бекітілген ішкі актілеріне
                        сәйкес төленеді. Жұмыс беруші Жұмыскерге{" "}
                        <strong>{data.salary_amount ? formatPrice(data.salary_amount) : "_____________"}</strong> (
                        <strong>{salaryAmountTextKk}</strong>)
                        теңге (жеке табыс салығы мен міндетті зейнетақы аударымдары ұсталғанға дейін) мөлшерінде
                        лауазымдық жалақы төлейді.
                      </p>

                      <p className="mb-2">4.13. Жалақы ай сайын келесі айдың 10 (оныншы) күніне дейін төленеді.</p>

                      <p className="mb-2">
                        4.14. Жалақы Жұмыскердің банктік төлем карточкасына (карточкаларына) ақша аудару арқылы
                        төленеді.
                      </p>

                      <p className="mb-2">
                        4.15. Еңбекке жарамсыздық парақтарымен белгіленген тәртіппен расталған Жұмыскердің еңбекке
                        уақытша жарамсыздық кезеңдеріне Жұмыс беруші Қазақстан Республикасының заңнамасына, Жұмыс
                        берушінің актілеріне сәйкес төлем жүргізеді.
                      </p>

                      <p className="mb-2">
                        4.16. Бос тұрып қалу (экономикалық, технологиялық, ұйымдастырушылық, өзге де өндірістік немесе
                        табиғи сипаттағы себептер бойынша жұмысты уақытша тоқтата тұру) уақытына келесі тәртіппен ақы
                        төленеді: 1) басқа жұмысқа уақытша ауыстырылған кезде – орындайтын жұмысы бойынша;
                      </p>

                      <p className="mb-2">
                        2) егер Жұмыскер донор болып табылса, медициналық тексеру және қан мен оның компоненттерін беру
                        күндерінде Жұмыс берушімен келісім бойынша жұмысқа келген жағдайда, Жұмыскер таңдауы бойынша
                        орташа жалақысы сақталған басқа демалыс күні беріледі (оның күні Жұмыс берушімен келісім бойынша
                        анықталады) немесе бұл күн жыл сайынғы еңбек демалысына қосылады. Донор болып табылатын
                        Жұмыскерді қан мен оның компоненттерін беру күндерінде түнгі жұмысқа және артық жұмыс уақытына
                        тартуға жол берілмейді;
                      </p>

                      <p className="mb-2">
                        3) ерікті түрде донор функциясын орындаған Жұмыскер ағымдағы күнтізбелік жылында орташа жалақысы
                        сақталған қосымша демалыс күнін алады. Қосымша демалыс күні Жұмыс берушімен келісіледі;
                      </p>

                      <p className="mb-2">
                        4) осы тармақтың 2) және 3) тармақтарында көзделген демалыс күндері Жұмыскерге ағымдағы жұмыс
                        жылында беріледі.
                      </p>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">
                      4. РАБОЧЕЕ ВРЕМЯ, ВРЕМЯ ОТДЫХА И ОПЛАТА ТРУДА
                    </h2>
                    <div>
                      <p className="mb-2">4.1. {workScheduleTextRu}</p>

                      <p className="mb-2">
                        4.2. Работнику предоставляется ежегодный оплачиваемый трудовой отпуск продолжительностью 30
                        (тридцать) календарных дней.
                      </p>

                      <p className="mb-2">
                        4.3. Ежегодный оплачиваемый трудовой отпуск предоставляется с последующим прекращением Договора
                        в связи с истечением его срока. Если ежегодный оплачиваемый трудовой отпуск полностью или
                        частично выходит за пределы срока Договора, то он может быть предоставлен, при этом последний
                        день отпуска считается днем прекращения Договора.
                      </p>

                      <p className="mb-2">
                        4.4. В случае временной нетрудоспособности Работника в период отпуска, ежегодный оплачиваемый
                        трудовой отпуск по заявлению Работника и уведомлению Работодателя переносится полностью или
                        частично.
                      </p>

                      <p className="mb-2">
                        4.5. Ежегодный оплачиваемый трудовой отпуск может быть разделен на части, при этом одна из
                        частей должна быть не менее четырнадцати календарных дней.
                      </p>

                      <p className="mb-2">
                        4.6. Работник обязан уведомить Работодателя в письменной форме не менее чем за 10 (десять)
                        календарных дней до предполагаемой даты начала отпуска. Работодатель обязан утвердить отпуск
                        Работника с учетом деятельности Работника и графика отпусков других работников.
                      </p>

                      <p className="mb-2">
                        4.7. При прекращении (расторжении) трудового договора Работодатель выплачивает денежную
                        компенсацию за неиспользованный или частично использованный ежегодный оплачиваемый трудовой
                        отпуск.
                      </p>

                      <p className="mb-2">
                        4.8. Если Работник на момент прекращения (расторжения) трудового договора полностью использовал
                        свое право на ежегодный оплачиваемый трудовой отпуск авансом, независимо от оснований, то он
                        обязан до расторжения возместить денежные средства, выплаченные Работодателем за оплачиваемый
                        ежегодный трудовой отпуск пропорционально неотработанному периоду, в счет которого был
                        предоставлен оплачиваемый ежегодный трудовой отпуск.
                      </p>

                      <p className="mb-2">
                        4.9. В случае отзыва Работника из оплачиваемого ежегодного трудового отпуска неиспользованная в
                        связи с отзывом часть оплачиваемого ежегодного трудового отпуска по соглашению Сторон Трудового
                        договора предоставляется в течение текущего рабочего года или в следующем рабочем году в любое
                        время либо присоединяется к оплачиваемому ежегодному трудовому отпуску за следующий рабочий год.
                      </p>

                      <p className="mb-2">
                        4.10. Работнику по соглашению с Работодателем может предоставляться социальные отпуска (отпуск
                        без сохранения заработной платы; учебный отпуск; отпуск в связи с беременностью и рождением
                        ребенка (детей), усыновлением (удочерением) новорожденного ребенка (детей); отпуск без
                        сохранения заработной платы по уходу за ребенком до достижения им возраста трех лет).
                      </p>

                      <p className="mb-2">4.11. Работнику устанавливается повременная система оплаты труда.</p>

                      <p className="mb-2">
                        4.12. Оплата труда Работнику осуществляется в соответствии с внутренними актами Работодателя,
                        утвержденными в установленном порядке. Работодатель выплачивает Работнику должностной оклад в
                        размере <strong>{data.salary_amount ? formatPrice(data.salary_amount) : "_____________"}</strong> (
                        <strong>{salaryAmountTextRu}</strong>) тенге (до удержания индивидуального подоходного налога и
                        обязательных пенсионных отчислений).
                      </p>

                      <p className="mb-2">
                        4.13. Заработная плата выплачивается ежемесячно не позднее 10 (десятого) числа следующего
                        месяца.
                      </p>

                      <p className="mb-2">
                        4.14. Выплата заработной платы производится путем перечисления денег на банковскую платежную
                        карточку (карточки) Работника.
                      </p>

                      <p className="mb-2">
                        4.15. Периоды временной нетрудоспособности Работника, подтвержденные в установленном порядке
                        листами нетрудоспособности, оплачиваются Работодателем в соответствии с законодательством
                        Республики Казахстан, актами Работодателя.
                      </p>

                      <p className="mb-2">
                        4.16. Оплата времени простоя (временная приостановка работы по причинам экономического,
                        технологического, организационного, иного производственного или природного характера)
                        производится в следующем порядке: 1) при временном переводе на другую работу – по выполняемой
                        работе;
                      </p>

                      <p className="mb-2">
                        2) если Работник является донором, по соглашению с Работодателем может прийти на работу в дни
                        медицинского осмотра и сдачи крови и ее компонентов. В этом случае Работнику предоставляется, по
                        его выбору: другой день отдыха с сохранением средней заработной платы, дата которого
                        определяется по соглашению с работодателем, либо этот день может быть присоединен к ежегодному
                        трудовому отпуску. Не допускается привлечение Работника, являющегося донором, к работе в ночное
                        время, или сверхурочной работе в дни сдачи крови и ее компонентов;
                      </p>

                      <p className="mb-2">
                        3) Работник, выполнивший донорскую функцию безвозмездно, получает дополнительный день отдыха с
                        сохранением средней заработной платы в текущем календарном году. Дата дополнительного дня отдыха
                        согласовывается с Работодателем;
                      </p>

                      <p className="mb-2">
                        4) дни отдыха, предусмотренные подпунктами 2) и 3) настоящего пункта Договора, предоставляются
                        Работнику в текущем рабочем году.
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">
                      5. ШАРТТЫҢ ҚОЛДАНЫЛУ МЕРЗІМІ, ОНЫ ӨЗГЕРТУ, ТОЛЫҚТЫРУ ЖӘНЕ ТОҚТАТУ ТӘРТІБІ
                    </h2>
                    <div>
                      <p className="mb-2">
                        5.1. Шарт <strong>{kkInflect(startDateKk, 5)}</strong> бастап{" "}
                        <strong>{kkInflect(endDateKk, 2)}</strong> дейін.
                      </p>

                      <p className="mb-2">5.2. Шартқа өзгерістер мен толықтырулар енгізілуі мүмкін.</p>

                      <p className="mb-2">
                        5.3. Шартқа өзгерістер мен толықтырулар, соның ішінде басқа жұмысқа ауыстыру, жазбаша түрде
                        Тараптардың қол қойған қосымша келісім ретінде, кемінде екі данада, оның бірі Жұмыскерге, бірі
                        Жұмыс берушіге беріледі.
                      </p>

                      <p className="mb-2">
                        5.4. Шарт талаптарына өзгерістер енгізу туралы хабарлама бір Тарап тарапынан беріліп, екінші
                        Тарап тарапынан оның берілген күнінен бастап бес жұмыс күні ішінде қарастырылады. Өзгерістер
                        енгізу туралы хабарламаны, соның ішінде басқа жұмысқа ауыстыру туралы хабарламаны алған Тарап
                        осы тармақта көрсетілген мерзім ішінде қабылданған шешім туралы екінші Тарапты хабардар етуге
                        міндетті.
                      </p>

                      <p className="mb-2">5.5. Шарт мына жағдайларда тоқтатылуы мүмкін:</p>
                      <div className="ml-6 mb-2">
                        <p className="mb-1">5.5.1. Тараптардың келісімі бойынша;</p>
                        <p className="mb-1">
                          5.5.2. Жұмыс берушінің бастамасы бойынша Қазақстан Республикасының Еңбек кодексіне сәйкес;
                        </p>
                        <p className="mb-1">
                          5.5.3. Жұмыскердің бастамасы бойынша, Қазақстан Республикасының Еңбек кодексіне сәйкес;
                        </p>
                        <p className="mb-1">5.5.4. Тараптардың еркіне байланысты емес жағдайлар бойынша;</p>
                        <p className="mb-1">5.5.5. Шарттың мерзімі аяқталғанмен байланысты.</p>
                      </div>

                      <p className="mb-2">
                        Шарт Қазақстан Республикасының Еңбек кодексінде көзделген басқа да негіздер бойынша тоқтатылуы
                        мүмкін.
                      </p>

                      <p className="mb-2">
                        5.6. Шарттың мерзімі аяқталғанда Тараптар өзара келісімімен оны келесі мезімге: - белгісіз
                        мерзімге немесе - бір жылдан кем емес белгілі мерзімге дейін ұзартуға құқылы. Егер ешбір Тарап
                        соңғы жұмыс күнінде тоқтату туралы хабарлама бермесе, Шарт алдыңғы мерзімге ұзартылған деп
                        саналады. Шарттың мерзімін ұзарту саны екі реттен аспауы керек, одан кейін егер еңбек
                        қатынастары жалғасса, Шарт белгісіз мерзімге жасалған деп саналады. Зейнетақы жасына жеткен және
                        жоғары кәсіби біліктілігі бар жұмыскер үшін еңбек шарты жыл сайын шектеусіз ұзартылуы мүмкін.
                        Жұмыс беруші Еңбек кодексіне сәйкес бала күтімі бойынша демалыс аяқталғанға дейін Шарттың
                        мерзімін ұзартуға міндетті.
                      </p>

                      <p className="mb-2">
                        5.7. Залал (зиян) келтірілгеннен кейін Шартты тоқтату еңбек шартының Тарапын екінші Тарапқа
                        келтірілген залалды (зиянды) өтеу бойынша материалдық жауапкершіліктен босатуға әкеп соқпайды.
                      </p>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">
                      5. СРОК ДЕЙСТВИЯ ДОГОВОРА, ПОРЯДОК ЕГО ИЗМЕНЕНИЯ, ДОПОЛНЕНИЯ И ПРЕКРАЩЕНИЯ
                    </h2>
                    <div>
                      <p className="mb-2">
                        5.1. Договор вступает в силу с <strong>{startDateRu}</strong> и действует до{" "}
                        <strong>{endDateRu}</strong>.
                      </p>

                      <p className="mb-2">5.2. В Договор могут быть внесены изменения и дополнения.</p>

                      <p className="mb-2">
                        5.3. Изменения и дополнения в Договор, включая перевод на другую работу, вносятся в письменной
                        форме в виде дополнительного соглашения, подписанного Сторонами, в количестве не менее двух
                        экземпляров, один из которых для Работника, один для Работодателя.
                      </p>

                      <p className="mb-2">
                        5.4. Уведомление об изменении условий Договора подается одной Стороной и рассматривается другой
                        Стороной в течение пяти рабочих дней со дня его подачи. Сторона, получившая уведомление об
                        изменении условий Договора, включая перевод на другую работу, обязана в срок, указанный в
                        настоящем пункте, уведомить другую Сторону о принятом решении.
                      </p>

                      <p className="mb-2">5.5. Договор может быть прекращен:</p>
                      <div className="ml-6 mb-2">
                        <p className="mb-1">5.5.1. по соглашению Сторон;</p>
                        <p className="mb-1">
                          5.5.2. по инициативе Работодателя в соответствии с Трудовым кодексом Республики Казахстан;
                        </p>
                        <p className="mb-1">
                          5.5.3. по инициативе Работника, в соответствии с Трудовым кодексом Республики Казахстан;
                        </p>
                        <p className="mb-1">5.5.4. по обстоятельствам, не зависящим от воли Сторон;</p>
                        <p className="mb-1">5.5.5. в связи с истечением срока действия Договора.</p>
                      </div>

                      <p className="mb-2">
                        Договор может быть прекращен по иным основаниям, предусмотренным Трудовым кодексом Республики
                        Казахстан.
                      </p>

                      <p className="mb-2">
                        5.6. При истечении срока Договора Стороны по взаимному согласию вправе продлить его на: -
                        неопределенный срок или - определенный срок не менее одного года. Если ни одна из Сторон не
                        направит уведомление о прекращении в последний рабочий день, Договор считается продленным на
                        прежний срок. Количество продлений срока Договора не может превышать двух, после чего, если
                        трудовые отношения продолжаются, Договор считается заключенным на неопределенный срок. Для
                        работника, достигшего пенсионного возраста и имеющего высокую профессиональную квалификацию,
                        трудовой договор может продлеваться ежегодно без ограничения. В случаях соблюдения Трудового
                        кодекса Работодатель обязан продлить срок Договора до окончания отпуска по уходу за ребенком.
                      </p>

                      <p className="mb-2">
                        5.7. Прекращение Договора после причинения ущерба (вреда) не влечет за собой освобождения
                        Стороны трудового договора от материальной ответственности по возмещению причиненного ущерба
                        (вреда) другой Стороне.
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">6. КЕПІЛДІКТЕР МЕН ӨТЕМАҚЫЛАР</h2>
                    <div>
                      <p className="mb-2">
                        6.1. Жұмыскерге Қазақстан Республикасының заңнамасында және Жұмыс берушінің актілерінде, ұжымдық
                        шартта, осы Шартта көзделген кепілдіктер мен өтемақы төлемдері қолданылады.
                      </p>

                      <p className="mb-2">
                        6.2. Төлемдер Қазақстан Республикасының заңнамасында және Жұмыс берушінің актілерінде
                        белгіленген тәртіппен жүргізіледі.
                      </p>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">6. ГАРАНТИИ И КОМПЕНСАЦИИ</h2>
                    <div>
                      <p className="mb-2">
                        6.1. На Работника распространяются гарантии и компенсационные выплаты, предусмотренные
                        законодательством Республики Казахстан и актами Работодателя, коллективным договором, настоящим
                        Договором.
                      </p>

                      <p className="mb-2">
                        6.2. Выплаты производятся в порядке, установленном законодательством Республики Казахстан и
                        актами Работодателя.
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">
                      7. ТАРАПТАРДЫҢ ЖАУАПКЕРШІЛІГІ ЖӘНЕ ДАУЛАРДЫ ШЕШУ ТӘРТІБІ
                    </h2>
                    <div>
                      <p className="mb-2">
                        7.1. Шарт бойынша өз міндеттемелерін орындамағаны немесе тиісті түрде орындамағаны үшін Тараптар
                        Қазақстан Республикасының заңнамасына сәйкес жауаптылықта болады.
                      </p>

                      <p className="mb-2">
                        7.2. Шарттың талаптарын орындау барысында Тараптар арасында туындайтын даулар Тараптардың өзара
                        келісімі бойынша шешіледі.
                      </p>

                      <p className="mb-2">
                        7.3. Тараптар өзара келісімге келмеген жағдайда, даулар бірізді тәртіпте, алдымен келісу
                        комиссиясында, содан кейін Қазақстан Республикасының заңнамасында белгіленген тәртіппен соттарда
                        шешіледі.
                      </p>

                      <p className="mb-2">
                        7.4. Тараптар Қазақстан Республикасының Еңбек кодексінде көзделген мөлшерде және жағдайларда
                        материалдық жауаптылықта болады.
                      </p>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">
                      7. ОТВЕТСТВЕННОСТЬ СТОРОН И ПОРЯДОК РАЗРЕШЕНИЯ СПОРОВ
                    </h2>
                    <div>
                      <p className="mb-2">
                        7.1. За неисполнение или ненадлежащее исполнение обязательств, предусмотренных Договором,
                        Стороны несут ответственность в соответствии с законодательством Республики Казахстан.
                      </p>

                      <p className="mb-2">
                        7.2. Споры, возникающие между Сторонами в ходе исполнения условий Договора, разрешаются по
                        взаимному согласию Сторон.
                      </p>

                      <p className="mb-2">
                        7.3. При недостижении Сторонами взаимного согласия, споры разрешаются в последовательном
                        порядке, сначала в согласительной комиссии, затем в судах в порядке, установленном
                        законодательством Республики Казахстан.
                      </p>

                      <p className="mb-2">
                        7.4. Стороны несут материальную ответственность в размере и в случаях, предусмотренных Трудовым
                        кодексом Республики Казахстан.
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">8. СЫБАЙЛАС ЖЕМҚОРЛЫҚҚА ҚАРСЫ ЕРЕЖЕЛЕР</h2>
                    <div>
                      <p className="mb-2">
                        8.1. Жұмыскер Шарт бойынша еңбек міндеттерін орындаған кезде Жұмыс берушінің сыбайлас
                        жемқорлыққа қарсы саясатының талаптарын қатаң сақтауға міндеттенеді. Осы Шарттың мақсатында
                        «сыбайлас жемқорлыққа қарсы саясат» анықтамасы Жұмыс берушіде осы Шарт жасалғанға дейін,
                        сондай-ақ Шарт Тараптарының еңбек қатынастары барысында қабылданған, сыбайлас жемқорлыққа қарсы
                        іс-қимыл, алаяқтық, мүдделер қақтығысы, іскерлік этика, сыйлықтар беру және алу,
                        мәдени-ойын-сауық және өзге де іс-шараларды өткізу және оларға қатысу мәселелерін реттейтін кез
                        келген және барлық құжаттарға (Жұмыс берушінің актілерін, кодекстерді, саясаттар мен
                        стандарттарды қоса алғанда) қолданылады.
                      </p>

                      <p className="mb-2">
                        8.2. Жұмыс берушінің сыбайлас жемқорлыққа қарсы саясатында көзделген нормалардан басқа, Жұмыскер
                        сыбайлас жемқорлық құқық бұзушылықтар, алаяқтық әрекеттер жасамауға, өкілеттіктерін теріс
                        пайдаланбауға, коммерциялық пара беруге немесе өтеусіз немесе басымдықты пайдалана отырып, ақша,
                        бағалы қағаздар, өзге де мүлік, оның ішінде мүліктік құқықтар, мүліктік сипаттағы жұмыстар
                        немесе қызметтер түрінде пайданы өз пайдасына немесе басқа адамдардың пайдасына алу мақсатында
                        немесе негізсіз артықшылықтар алу, өзге де құқыққа қайшы мақсаттарға қол жеткізу үшін қандай да
                        бір адамдардың (оның ішінде лауазымды адамдардың) және/немесе органдардың әрекеттеріне немесе
                        шешімдеріне ықпал ету үшін, өзінің лауазымдық жағдайын Жұмыс берушінің заңды мүдделеріне қайшы
                        келетін өзге де құқыққа қайшы пайдалануға қатыспауға міндетті.
                      </p>

                      <p className="mb-2">
                        8.3. Жұмыскер қандай да бір адамдар оған сыбайлас жемқорлыққа қарсы саясаттың ережелеріне және
                        Жұмыс берушінің заңды мүдделеріне қайшы келетін кез келген әрекеттерді немесе әрекетсіздікті
                        жасауға бағытталған кезде Жұмыс берушіге хабарлауға міндетті.
                      </p>

                      <p className="mb-2">
                        8.4. Жұмыскер сыбайлас жемқорлыққа қарсы саясат пен Қазақстан Республикасының заңнамасының
                        түсінігінде мүдделер қақтығысының кез келген мүмкіндігін болдырмау шараларын қабылдауға,
                        сондай-ақ туындаған мүдделер қақтығысы немесе оның мүмкіндігі туралы дереу Жұмыс берушіге
                        хабарлауға міндетті, мұндай мүдделер қақтығысы немесе оның мүмкіндігі туралы оған белгілі болған
                        сәттен бастап.
                      </p>

                      <p className="mb-2">
                        8.5. Жұмыскер сыбайлас жемқорлыққа қарсы құқық бұзушылық немесе алаяқтық әрекеттер туралы
                        күдікті хабарлаған жағдайда, Жұмыс беруші Жұмыскерге кез келген санкцияларды (соның ішінде
                        тәртіптік) қолданбайтынын біледі.
                      </p>

                      <p className="mb-2">
                        8.6. Жұмыскер Жұмыс берушінің сыбайлас жемқорлыққа қарсы құқық бұзушылықтар немесе алаяқтық
                        әрекеттер туралы расталған ақпарат бергені үшін жұмыскерлерді ынталандыратынын біледі.
                      </p>

                      <p className="mb-2">
                        8.7. Жұмыскер сыбайлас жемқорлыққа қарсы талаптарды бұзғаны үшін, Қазақстан Республикасының
                        заңнамасы мен Жұмыс берушінің сыбайлас жемқорлыққа қарсы саясатында көзделген тәртіптік,
                        әкімшілік, азаматтық және/немесе қылмыстық жауапкершілікке тартылуы мүмкін екенін ескертеді.
                      </p>

                      <p className="mb-2">
                        8.8. Жұмыскер сыбайлас жемқорлыққа қарсы күресуге көмектесу туралы ақпаратты жария етпеу туралы
                        келісімді Қазақстан Республикасының сыбайлас жемқорлыққа қарсы күресу туралы заңнамасында
                        белгіленген тәртіппен жасасуға құқылы.
                      </p>

                      <p className="mb-2">
                        8.9. Жұмыскердің сыбайлас жемқорлыққа қарсы құқық бұзушылық фактісін хабарлау немесе сыбайлас
                        жемқорлыққа қарсы күресуге басқа көмек көрсету мақсатында өтініш берген жағдайда, егер оның
                        мұндай ниеті болса, Жұмыс беруші Жұмыскермен сыбайлас жемқорлыққа қарсы күресуге көмектесу
                        туралы ақпаратты жария етпеу туралы келісімді Қазақстан Республикасының сыбайлас жемқорлыққа
                        қарсы күресу туралы заңнамасында белгіленген тәртіппен жасасуға міндетті.
                      </p>

                      <p className="mb-2">
                        8.10. Жұмыскер жоғарыда келтірілген сыбайлас жемқорлыққа қарсы ережелердің мағынасы мен маңызы
                        оған түсінікті және анық екенін растайды.
                      </p>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">8. АНТИКОРРУПЦИОННЫЕ ПОЛОЖЕНИЯ</h2>
                    <div>
                      <p className="mb-2">
                        8.1. Работник при исполнении трудовых обязанностей по Договору обязуется строго соблюдать
                        требования антикоррупционной политики Работодателя. В целях настоящего Договора, определение
                        «антикоррупционная политика» применимо к любому и всем документам (включая акты Работодателя,
                        кодексы, политики и стандарты), регулирующие вопросы противодействия коррупции, мошенничества,
                        конфликта интересов, деловой этики, предоставление и получение подарков, проведения и участия в
                        культурно-развлекательных и иных мероприятиях как принятых у Работодателя до заключения
                        настоящего Договора, так и в процессе трудовых отношений Сторон Договора.
                      </p>

                      <p className="mb-2">
                        8.2. Кроме норм, предусмотренных антикоррупционной политикой Работодателя, Работник обязан не
                        совершать коррупционных правонарушений, мошеннических действий, не злоупотреблять полномочиями,
                        не участвовать в коммерческом подкупе либо ином противоправном использовании своего должностного
                        положения вопреки законным интересам Работодателя в целях безвозмездного или с использованием
                        преимуществ получения выгоды в виде денег, ценных бумаг, иного имущества, в том числе
                        имущественных прав, работ или услуг имущественного характера, в свою пользу или в пользу других
                        лиц либо для оказания влияния на действия или решения каких-либо лиц (в т.ч. должностных) и/или
                        органов для получения неосновательных преимуществ, достижения иных противоправных целей.
                      </p>

                      <p className="mb-2">
                        8.3. Работник обязан уведомить Работодателя в случае обращения к нему каких-либо лиц в целях
                        склонения его к совершению любых действий или бездействию, противоречащих положениям
                        антикоррупционной политики и законным интересам Работодателя.
                      </p>

                      <p className="mb-2">
                        8.4. Работник обязан принимать меры по предотвращению любой возможности конфликта интересов в
                        понимании антикоррупционной политики и законодательства Республики Казахстан, а также немедленно
                        уведомлять Работодателя о возникшем конфликте интересов или его возможности, с момента, когда
                        ему стало известно о таком конфликте интересов или его возможности.
                      </p>

                      <p className="mb-2">
                        8.5. Работник осведомлен о том, что Работодатель не будет применять к нему какие-либо санкции
                        (включая дисциплинарные), если Работник сообщит о подозрении в коррупционном правонарушении или
                        мошеннических действиях.
                      </p>

                      <p className="mb-2">
                        8.6. Работник осведомлен о том, что Работодатель стимулирует работников за предоставление
                        подтвержденной информации о коррупционных правонарушениях или мошеннических действиях.
                      </p>

                      <p className="mb-2">
                        8.7. Работник предупрежден о возможности привлечения к дисциплинарной, административной,
                        гражданской и/или уголовной ответственности за нарушение антикоррупционных требований,
                        предусмотренных законодательством Республики Казахстан и антикоррупционной политикой
                        Работодателя.
                      </p>

                      <p className="mb-2">
                        8.8. Работник имеет право заключить соглашение о неразглашении информации об оказании содействия
                        в противодействии коррупции, в порядке, определенном законодательством Республики Казахстан о
                        противодействии коррупции.
                      </p>

                      <p className="mb-2">
                        8.9. При обращении Работника с целью сообщения о факте коррупционного правонарушения или
                        оказания иного содействия в противодействии коррупции, если у него имеется такое намерение,
                        Работодатель обязан заключить с Работником соглашение о неразглашении информации об оказании
                        содействия в противодействии коррупции, в порядке, определенном законодательством Республики
                        Казахстан о противодействии коррупции.
                      </p>

                      <p className="mb-2">
                        8.10. Работник подтверждает, что смысл и значение вышеизложенных антикоррупционных положений ему
                        понятны и ясны.
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">9. ӨЗГЕ ДЕ ТАЛАПТАР</h2>
                    <div>
                      <p className="mb-2">
                        9.1. Тараптар келісіп, растайды, электрондық құжат айналымы жүйесі, курьерлік пошта, пошта
                        байланысы, факсимильдік байланыс, электрондық пошта, SMS-хабарламалар (мәтіндік хабарламаларды
                        лезде алмасу жүйесі арқылы) немесе ЭЦҚ арқылы куәландырылған электрондық құжат түрінде және
                        басқа ақпараттық-коммуникациялық технологиялар арқылы жіберілген кез келген хабарламалар жазбаша
                        түрде ресімделген және екінші Тарап тарапынан алынған деп саналады.
                      </p>

                      <p className="mb-2">
                        9.2. Жұмыскер өзінің нақты тұрған жері туралы ақпараттың дұрыстығын кепілдейді және мекенжайды
                        өзгерткен жағдайда Жұмыс берушіге дереу хабарлауға міндетті. Жұмыс берушіге көрсетілген
                        мекенжайда тұрмайтын жұмыскер Шартта көрсетілген мекенжайға жіберілген хабарламаларды, Жұмыс
                        берушінің актілерінің көшірмелерін алмағандығына сілтеме жасау құқығынан айырылады.
                      </p>

                      <p className="mb-2">
                        9.3. Жұмыскердің жұмыс барысында және/немесе Шарт бойынша Жұмыскердің функцияларына қатысты
                        жасалған интеллектуалдық шығармашылық қызметтің кез келген нәтижелері Жұмыс берушінің меншігі
                        болып табылады.
                      </p>

                      <p className="mb-2">
                        9.4. Шарт қазақ және орыс тілдерінде екі данада жасалған, бірі Жұмыскерге, бірі Жұмыс берушіге
                        беріледі, екеуі де бірдей заңды күшке ие. Қазақ және орыс тілдеріндегі мәтіндерде сәйкессіздік
                        болған жағдайда, Шарт мәтінінің орыс нұсқасы басым болады.
                      </p>

                      <p className="mb-2">9.5. Шарттың мазмұны үшінші тұлғаларға жарияланбайды.</p>

                      <p className="mb-2">
                        9.6. Жұмыскердің лауазымдық міндеттерін орындау тәртібінде әзірленген қызметтік шығарманы немесе
                        бағдарламаларды (соның ішінде, бірақ оған шектелмей, бастапқы кодтар, объектілік кодтар,
                        құжаттама, алгоритмдер, графикалық интерфейс элементтері, құрылым, ұйымдастыру және/немесе басқа
                        материалдар) пайдалануға автордың барлық мүліктік құқықтары Жұмыс берушіге тиесілі және оның
                        келісімінсіз таратуға немесе басқа пайдалануға жатпайды.
                      </p>

                      <p className="mb-2">
                        9.7. Тараптар авторлық құқық алынған күннен бастап 5 жұмыс күнінен кешіктірмей Жұмыс берушінің
                        еркі бойынша ақысыз негізде және басқа шарттар бойынша авторлық келісім жасасады.
                      </p>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">9. ПРОЧИЕ УСЛОВИЯ</h2>
                    <div>
                      <p className="mb-2">
                        9.1. Стороны соглашаются и подтверждают, что любые уведомления, направленные посредством
                        курьерской почты, почтовой связи, факсимильной связи, электронной почты, в виде SMS-сообщений
                        (посредством системы мгновенного обмена текстовыми сообщениями), или в форме электронного
                        документа, удостоверенного посредством ЭЦП и иных информационно-коммуникационных технологий
                        считаются оформленными в письменном виде и полученными второй стороной.
                      </p>

                      <p className="mb-2">
                        9.2. Работник гарантирует достоверность сведений о месте своего фактического проживания и обязан
                        незамедлительно уведомить Работодателя при смене адреса. Работник, не проживающий по адресу,
                        сведения о котором предоставил Работодателю, лишается права ссылаться на неполучение
                        уведомлений, копий актов Работодателя, направленных по указанному в Договоре адресу.
                      </p>

                      <p className="mb-2">
                        9.3. Любые результаты интеллектуальной творческой деятельности, созданные Работником в процессе
                        работы и/ или относящиеся к функциям Работника по Договору, являются собственностью
                        Работодателя.
                      </p>

                      <p className="mb-2">
                        9.4. Договор составлен в двух экземплярах на казахском и русском языках по одному для Работника
                        и Работодателя, имеющих одинаковую юридическую силу. В случае расхождения в текстах на казахском
                        и русском языках, преимущественную силу будет иметь русский вариант текста Договора.
                      </p>

                      <p className="mb-2">9.5. Содержание Договора не подлежит разглашению третьим лицам.</p>

                      <p className="mb-2">
                        9.6. Все имущественные права автора на использование служебного произведения или программ
                        (включая но не ограничиваясь, исходные коды, объектные коды, документация, алгоритмы, элементы
                        графического интерфейса, структура, организация и/или другие материалы), разработанные
                        Работником в порядке выполнения им своих должностных обязанностей, принадлежат Работодателю и
                        распространению или иному использованию без его согласия не подлежат.
                      </p>

                      <p className="mb-2">
                        9.7. Стороны заключают авторский договор на безвозмездной основе и иных условиях по усмотрению
                        Работодателя в срок не позднее 5 рабочих дней со дня получения авторского права.
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">ТАРАПТАРДЫҢ ДЕРЕКТЕМЕЛЕРІ МЕН ҚОЛДАРЫ:</h2>
                    <div className="mt-6">
                      <div className="mb-6">
                        <p className="font-bold mb-2">Жұмыс беруші / Работодатель:</p>
                        <p className="mb-1">
                          «<strong>{userData?.organization || "_____________"}</strong>»
                        </p>
                        <p className="mb-1">
                          <strong>{userData?.organization_type_short_title_kk || "_____________"}</strong>,
                        </p>
                        <p className="mb-1">
                          <strong>{userData?.organization_address_kk || "_____________"}</strong>
                        </p>
                        <p className="mb-1">Заңды тұлғаны мемлекеттік қайта тіркеу туралы</p>
                        <p className="mb-1">
                          <strong>{userData?.organization_registration_date || "_____________"}</strong> жылғы анықтама.
                        </p>
                        <p className="mb-1">
                          БСН: <strong>{userData?.organization_bin || "_____________"}</strong>
                        </p>
                      </div>
                      <div className="mb-6">
                        <p className="mb-1">
                          «<strong>{userData?.organization || "_____________"}</strong>»
                        </p>
                        <p className="mb-1">
                          <strong>{userData?.organization_type_short_title_kk || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          <strong>{userData?.employer_position_kk || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          <strong>{userData?.full_name || "_____________"}</strong>
                        </p>
                        <p className="mb-2 mt-4">(қолы)</p>
                        <div className="border-t border-black mt-2 mb-2 w-48"></div>
                        <p className="text-sm">
                          <strong>{startDateKk}</strong>
                        </p>
                        <p className="text-sm">М.О.</p>
                      </div>
                      <div className="mt-8">
                        <p className="font-bold mb-2">Жұмыскер / Работник:</p>
                        <p className="mb-1">
                          <strong>{employee_full_name || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          жеке куәлігі №<strong>{employee_id_number || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          <strong>{employee_id_issued_by || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          <strong>
                            {employee_id_issue_date
                              ? formatDateForContract(new Date(employee_id_issue_date), "kk")
                              : "_____________"}
                          </strong>{" "}
                          берген
                        </p>
                        <p className="mb-1">
                          ЖСН <strong>{employee_iin || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          <strong>{employee_address_registration || "_____________"}</strong>.
                        </p>
                        <p className="mb-1">
                          тел. <strong>{employee_phone || "_____________"}</strong>.
                        </p>
                        <p className="mb-2 mt-4">(қолы)</p>
                        <div className="border-t border-black mt-2 mb-2 w-48"></div>
                        <p className="text-sm">
                          <strong>{startDateKk}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 text-center">
                      <p className="mb-2">Еңбек шартының бір данасы алынды/Один экземпляр трудового договора получен</p>
                      <p className="mb-2">Жұмыскердің қолы / подпись Работника</p>
                      <div className="border-t border-black mt-2 mb-2 mx-auto w-48"></div>
                      <p className="text-sm">
                        <strong>{startDateKk}</strong>
                      </p>
                      <p className="text-sm">
                        <strong>_____________</strong>
                      </p>
                      <p className="text-sm">(Т.А.Ә. / Ф.И.О.)</p>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">РЕКВИЗИТЫ И ПОДПИСИ СТОРОН:</h2>
                    <div className="mt-6">
                      <div className="mb-6">
                        <p className="font-bold mb-2">Работодатель:</p>
                        <p className="mb-1">
                          <strong>{userData?.organization_type_short_title_ru || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          «<strong>{userData?.organization || "_____________"}</strong>»
                        </p>
                        <p className="mb-1">
                          <strong>{userData?.organization_address_ru || "_____________"}</strong>
                        </p>
                        <p className="mb-1">Справка о государственной регистрации юридического лица от</p>
                        <p className="mb-1">
                          <strong>{userData?.organization_registration_date || "_____________"}</strong>.
                        </p>
                        <p className="mb-1">
                          БИН: <strong>{userData?.organization_bin || "_____________"}</strong>
                        </p>
                      </div>
                      <div className="mb-6">
                        <p className="mb-1">
                          <strong>{userData?.employer_position_ru || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          <strong>{userData?.organization_type_short_title_ru || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          «<strong>{userData?.organization || "_____________"}</strong>»
                        </p>
                        <p className="mb-1">
                          <strong>{userData?.full_name || "_____________"}</strong>
                        </p>
                        <p className="mb-2 mt-4">(подпись)</p>
                        <div className="border-t border-black mt-2 mb-2 w-48"></div>
                        <p className="text-sm">
                          <strong>{startDateRu}</strong>.
                        </p>
                        <p className="text-sm">М.П.</p>
                      </div>
                      <div className="mt-8">
                        <p className="font-bold mb-2">Работник:</p>
                        <p className="mb-1">
                          <strong>{employee_full_name || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          удостоверение личности № <strong>{employee_id_number || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          выдано: <strong>{employee_id_issued_by || "_____________"}</strong> от
                        </p>
                        <p className="mb-1">
                          <strong>
                            {employee_id_issue_date
                              ? formatDateForContract(new Date(employee_id_issue_date), "ru")
                              : "_____________"}
                          </strong>
                          .
                        </p>
                        <p className="mb-1">
                          ИИН: <strong>{employee_iin || "_____________"}</strong>.
                        </p>
                        <p className="mb-1">
                          <strong>{employee_address_registration || "_____________"}</strong>.
                        </p>
                        <p className="mb-1">
                          тел. <strong>{employee_phone || "_____________"}</strong>.
                        </p>
                        <p className="mb-2 mt-4">(подпись)</p>
                        <div className="border-t border-black mt-2 mb-2 w-48"></div>
                        <p className="text-sm">
                          <strong>{startDateRu}</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 text-center">
                      <p className="mb-2">Еңбек шартының бір данасы алынды/Один экземпляр трудового договора получен</p>
                      <p className="mb-2">Жұмыскердің қолы / подпись Работника</p>
                      <div className="border-t border-black mt-2 mb-2 mx-auto w-48"></div>
                      <p className="text-sm">
                        <strong>{startDateRu}</strong>.
                      </p>
                      <p className="text-sm">
                        <strong>_____________</strong>
                      </p>
                      <p className="text-sm">(Т.А.Ә. / Ф.И.О.)</p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top" colSpan={2}>
                    <div className="text-right mb-4">
                      <p>{startDateKk}</p>
                      <p>№ {data.application_id || "_____________"} еңбек шартына</p>
                      <p>қосымша</p>
                    </div>
                    <h2 className="text-xl font-bold text-center mb-4">
                      Дербес деректерді, коммерциялық, қызметтік және заңнамамен қорғалатын өзге де құпияны жария етпеу
                      туралы міндеттеме
                    </h2>
                    <div className="mt-6">
                      <p className="mb-4">Мен, {employee_full_name || "_____________"}:</p>
                      <div className="ml-6 mb-4">
                        <p className="mb-2">
                          1. Қатаң сақтауға және жария етпеуге міндеттенемін {userData?.organization || "_____________"}{" "}
                          {userData?.organization_type_short_title_kk || "_____________"} (бұдан әрі – Жұмыс беруші)
                          дербес деректерді және коммерциялық, қызметтік құпияны.
                        </p>
                        <p className="mb-2">
                          2. Жұмыс барысында маған белгілі болған немесе сенімге тапсырылған мұндай ақпаратты үшінші
                          тұлғаларға бермеуге немесе жария етпеуге міндеттенемін.
                        </p>
                        <p className="mb-2">
                          3. Жұмыс берушінің келісімінсіз дербес деректерді, коммерциялық, қызметтік құпияны үшінші
                          тұлғаларға бермеуге немесе жария етпеуге міндеттенемін.
                        </p>
                        <p className="mb-2">
                          4. Жұмыс берушімен іскерлік қатынастары бар ұйымдардың дербес деректерін және коммерциялық,
                          қызметтік құпиясын сақтауға міндеттенемін.
                        </p>
                        <p className="mb-2">
                          5. Мұндай ақпаратты сақтауға қатысты ішкі ережелер мен нұсқауларды сақтауға міндеттенемін.
                        </p>
                        <p className="mb-2">
                          6. Мұндай ақпаратты Жұмыс берушіге қарсы бәсекелестік әрекеттер ретінде басқа қызметтерде
                          пайдаланбауға міндеттенемін.
                        </p>
                        <p className="mb-2">
                          7. Жұмыскердің лауазымдық міндеттерін орындау барысында жасалған қызметтік шығармаларға Жұмыс
                          берушінің меншік (эксклюзивтік) құқықтары мен интеллектуалдық меншік құқықтары тиесілі екенін
                          мойындаймын және интеллектуалдық қызметтің нәтижелеріне құқық талап етпеймін.
                        </p>
                        <p className="mb-2">
                          8. Ноу-хау, инновациялар, өнертабыстар, өнеркәсіптік үлгілер немесе басқа интеллектуалдық
                          меншік (бастапқы кодтар, формалар, схемалар қоса алғанда) туралы құпия ақпараттың сақталуын
                          қамтамасыз етуге міндеттенемін.
                        </p>
                        <p className="mb-2">
                          9. Интеллектуалдық меншікті заңды қорғау талаптарын сақтауға міндеттенемін.
                        </p>
                        <p className="mb-2">
                          10. Рұқсатсыз тұлғалардың дербес деректерді, коммерциялық, қызметтік құпияны алуға тырысуы
                          туралы дереу тиісті лауазымды тұлғаға хабарлауға міндеттенемін.
                        </p>
                        <p className="mb-2">
                          11. Дербес деректерді, коммерциялық, қызметтік құпияны тасымалдайтын ақпарат
                          тасымалдағыштарының (құжаттар, сызбалар, қолжазбалар, магниттік таспалар, перфокарталар,
                          перфоленталар, дисктер, дискеттер, басып шығарулар, кино және фото материалдары, өнімдер және
                          т.б.) жоғалуы немесе жетіспеушілігі туралы дереу Жұмыс берушінің лауазымды тұлғасына
                          хабарлауға міндеттенемін.
                        </p>
                        <p className="mb-2">
                          12. Жұмыстан босату кезінде дербес деректерді, коммерциялық, қызметтік құпияны қамтитын барлық
                          ақпарат тасымалдағыштарын (құжаттар, сызбалар, қолжазбалар, магниттік таспалар, перфокарталар,
                          перфоленталар, дисктер, дискеттер, басып шығарулар, кино және фото материалдары, өнімдер және
                          т.б.) Жұмыс берушіге тапсыруға міндеттенемін.
                        </p>
                        <p className="mb-2">
                          13. Жұмыстан босатудан кейін 5 (бес) жыл бойы Жұмыс берушінің дербес деректерін, коммерциялық,
                          қызметтік құпиясын жария етпеуге және жеке немесе басқа мақсаттарға пайдаланбауға
                          міндеттенемін.
                        </p>
                      </div>
                      <p className="mb-4 font-bold">Маған осы міндеттемені бұзсам:</p>
                      <div className="ml-6 mb-4">
                        <p className="mb-2">1. Тәртіптік жазаға, соның ішінде жұмыстан босатуға тартылуы мүмкін.</p>
                        <p className="mb-2">
                          2. Жұмыс барысында және жұмыстан босатудан кейін 3 (үш) жыл бойы дербес деректерді,
                          коммерциялық, қызметтік құпияны жария ету немесе жеке пайдалану салдарынан Жұмыс берушіге
                          келтірілген залалды өтеуге міндеттенемін.
                        </p>
                      </div>
                      <div className="mt-8">
                        <p className="mb-1">Қолы</p>
                        <div className="border-t border-black mt-1 mb-1 w-48"></div>
                        <p className="text-sm mb-1">{startDateKk}</p>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top" colSpan={2}>
                    <div className="text-right mb-4">
                      <p>Приложение к Трудовому договору</p>
                      <p>
                        № {data.application_id || "_____________"} от {startDateRu}.
                      </p>
                    </div>
                    <h2 className="text-xl font-bold text-center mb-4">
                      Обязательство о неразглашении персональных данных, коммерческой, служебной и иной охраняемой
                      законодательством тайны
                    </h2>
                    <div className="mt-6">
                      <p className="mb-4">Я, {employee_full_name || "_____________"} Обязуюсь:</p>
                      <div className="ml-6 mb-4">
                        <p className="mb-2">
                          1. Строго хранить и не разглашать персональные данные ограниченного доступа и коммерческую,
                          служебную тайну {userData?.organization_type_full_title_ru || "_____________"} «
                          {userData?.organization || "_____________"}» (далее – Работодатель).
                        </p>
                        <p className="mb-2">
                          2. Не передавать третьим лицам или публично разглашать ставшие мне известными или доверенные в
                          процессе работы персональные данные ограниченного доступа и коммерческую, служебную тайну.
                        </p>
                        <p className="mb-2">
                          3. Не передавать третьим лицам или публично разглашать персональные данные ограниченного
                          доступа и коммерческую, служебную тайну без согласия субъекта/законного представителя или
                          руководства Работодателя.
                        </p>
                        <p className="mb-2">
                          4. Сохранять персональные данные ограниченного доступа и коммерческую, служебную тайну
                          организаций, с которыми Работодатель имеет деловые отношения.
                        </p>
                        <p className="mb-2">
                          5. Соблюдать приказы, распоряжения и положения по обеспечению сохранности такой информации.
                        </p>
                        <p className="mb-2">
                          6. Не использовать такую информацию для иной деятельности, которая может нанести вред
                          Работодателю как конкурентное действие.
                        </p>
                        <p className="mb-2">
                          7. Признаю, что имущественные (исключительные) права и права интеллектуальной собственности на
                          созданные служебные произведения принадлежат Работодателю и не претендую на результаты
                          интеллектуальной деятельности.
                        </p>
                        <p className="mb-2">
                          8. Обеспечивать сохранность конфиденциальной информации, касающейся ноу-хау, инноваций,
                          изобретений, промышленных образцов или иной интеллектуальной собственности (включая исходные
                          коды, формы, схемы).
                        </p>
                        <p className="mb-2">9. Соблюдать требования правовой охраны интеллектуальной собственности.</p>
                        <p className="mb-2">
                          10. Немедленно уведомлять соответствующее должностное лицо о попытках неуполномоченных лиц
                          получить персональные данные ограниченного доступа и коммерческую, служебную тайну.
                        </p>
                        <p className="mb-2">
                          11. Немедленно сообщать должностному лицу Работодателя о потере или недостаче носителей
                          персональных данных ограниченного доступа, коммерческой, служебной тайны, удостоверений,
                          пропусков, ключей от помещений ограниченного доступа, хранилищ, сейфов, личных печатей и иных
                          фактов, которые могут привести к разглашению.
                        </p>
                        <p className="mb-2">
                          12. При увольнении передать Работодателю все носители коммерческой, служебной тайны
                          (документы, чертежи, рукописи, магнитные ленты, перфокарты, перфоленты, диски, дискеты,
                          распечатки, кинопленки и фотоматериалы, изделия и т.д.) и персональных данных ограниченного
                          доступа, находившиеся в распоряжении Работника.
                        </p>
                        <p className="mb-2">
                          13. В течение 5 (пяти) лет после увольнения не разглашать и не использовать в личных или иных
                          целях персональные данные ограниченного доступа и коммерческую, служебную тайну Работодателя.
                        </p>
                      </div>
                      <p className="mb-4 font-bold">
                        Я уведомлен(а) о том, что в случае нарушения мной данного обязательства:
                      </p>
                      <div className="ml-6 mb-4">
                        <p className="mb-2">
                          1. Могу быть привлечен(а) к дисциплинарной ответственности, вплоть до увольнения.
                        </p>
                        <p className="mb-2">
                          2. Обязуюсь возместить Работодателю убытки, понесенные в связи с разглашением или личным
                          использованием персональных данных ограниченного доступа и коммерческой, служебной тайны как в
                          период работы, так и в течение 3 (трех) лет после увольнения.
                        </p>
                      </div>
                      <div className="mt-8">
                        <p className="mb-1">Подпись</p>
                        <div className="border-t border-black mt-1 mb-1 w-48"></div>
                        <p className="text-sm mb-1">{startDateRu}.</p>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <div className="text-center">
                      <p className="mb-1">Мен Шарттың барлық талаптарын оқып, түсіндім</p>
                      <p className="mb-1">Все условия Договора мною прочитаны и мне понятны/</p>
                      <p className="mb-1">Жұмыскердің қолы / подпись Работника</p>
                      <div className="border-t border-black mt-1 mb-1 mx-auto w-48"></div>
                      <p className="text-sm">(Т.А.Ә. / Ф.И.О.)</p>
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300 align-top">
                    <div className="text-center">
                      <p className="mb-1">Мен Шарттың барлық талаптарын оқып, түсіндім</p>
                      <p className="mb-1">Все условия Договора мною прочитаны и мне понятны/</p>
                      <p className="mb-1">Жұмыскердің қолы / подпись Работника</p>
                      <div className="border-t border-black mt-1 mb-1 mx-auto w-48"></div>
                      <p className="text-sm">(Т.А.Ә. / Ф.И.О.)</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pb-1">
          <Button variant="secondary" size="lg" onClick={onClose} disabled={isLoading}>
            {t("buttons.cancel")}
          </Button>
          <Button variant="primary" size="lg" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("preview.submitting") || "Отправка..."}
              </span>
            ) : (
              t("buttons.create_contract")
            )}
          </Button>
        </div>
      </div>
    </ModalForm>
  );
}
