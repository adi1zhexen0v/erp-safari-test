import { useTranslation } from "react-i18next";
import { DocumentText1 } from "iconsax-react";
import { Button, ModalForm } from "@/shared/ui";
import { formatDateForContract, numberToText, ruInflect } from "@/shared/utils";
import { useAppSelector } from "@/shared/hooks";
import type { ContractClause, ContractDetailResponse } from "@/features/hr/contracts/types";
import type { WorkerListItem } from "@/features/hr/employees";

interface Props {
  clauses: ContractClause[];
  contractData: ContractDetailResponse;
  employee: WorkerListItem;
  onClauseClick: (clause: ContractClause) => void;
  onBack: () => void;
}

export default function ContractClausesView({ clauses, contractData, employee, onClauseClick, onBack }: Props) {
  const { t } = useTranslation("FillContractPage");
  const userData = useAppSelector((state) => state.auth.data?.user);

  function getWorkCityName(lang: "ru" | "kk"): string {
    if (!contractData.work_city) return "_____________";
    if (typeof contractData.work_city === "string") {
      return contractData.work_city;
    }
    if (typeof contractData.work_city === "object" && contractData.work_city !== null) {
      const cityObj = contractData.work_city as { name_ru?: string; name_kk?: string };
      return lang === "ru" ? cityObj.name_ru || "_____________" : cityObj.name_kk || "_____________";
    }
    return "_____________";
  }

  const workCityKk = getWorkCityName("kk");
  const workCityRu = getWorkCityName("ru");

  const startDateKk = contractData.start_date
    ? formatDateForContract(new Date(contractData.start_date), "kk")
    : "_____________";
  const startDateRu = contractData.start_date
    ? formatDateForContract(new Date(contractData.start_date), "ru")
    : "_____________";

  function calculateEndDate(startDate: string): Date {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 1);
    return end;
  }

  const endDate = contractData.start_date ? calculateEndDate(contractData.start_date) : null;
  const endDateKk = endDate ? formatDateForContract(endDate, "kk") : "_____________";
  const endDateRu = endDate ? formatDateForContract(endDate, "ru") : "_____________";

  function getMonthDeclension(months: number): string {
    if (months === 1) return "месяц";
    if (months >= 2 && months <= 4) return "месяца";
    return "месяцев";
  }

  const employee_full_name = employee.full_name;
  const employee_iin = employee.iin;
  const employee_phone = employee.contacts?.phone || "_____________";
  const employee_id_number = "_____________";
  const employee_id_issued_by = "_____________";
  const employee_id_issue_date = undefined;

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

  function formatTimeWithoutSeconds(timeStr: string | null | undefined): string {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
  }

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
    if (!contractData.work_start_time || !contractData.work_end_time || !contractData.working_days_list) {
      return null;
    }

    if (contractData.working_days_list.length > 6) {
      return null;
    }

    const workMinutes = parseTime(contractData.work_end_time) - parseTime(contractData.work_start_time);
    const breakMinutes =
      contractData.break_start_time && contractData.break_end_time
        ? parseTime(contractData.break_end_time) - parseTime(contractData.break_start_time)
        : 0;

    const dayMinutes = workMinutes - breakMinutes;
    if (dayMinutes <= 0) {
      return null;
    }

    const dayHours = Math.floor(dayMinutes / 60);
    if (dayHours !== 4 && dayHours !== 8) {
      return null;
    }

    const workingDays = contractData.working_days_list.length;
    const totalHours = dayHours * workingDays;
    const daysOffList = WEEK_DAYS.filter((d) => !contractData.working_days_list.includes(d));
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
  }

  function renderWorkScheduleText(lang: "ru" | "kk"): string {
    const context = buildWorkScheduleContext();
    if (!context) {
      return "_____________";
    }

    const hasBreak = contractData.break_start_time !== null && contractData.break_end_time !== null;

    const workStartTime = formatTimeWithoutSeconds(contractData.work_start_time);
    const workEndTime = formatTimeWithoutSeconds(contractData.work_end_time);
    const breakStartTime = formatTimeWithoutSeconds(contractData.break_start_time);
    const breakEndTime = formatTimeWithoutSeconds(contractData.break_end_time);

    if (lang === "ru") {
      if (hasBreak) {
        return `Работнику устанавливается режим рабочего времени: продолжительностью ${context.totalHours} (${context.totalHoursTextRu}) часов в неделю по ${context.dayHours} (${context.dayHoursTextRu}) часов в день с ${workStartTime} до ${workEndTime}, с перерывом на обед с ${breakStartTime} до ${breakEndTime} часов, при ${context.workingDays} (${context.workingDaysTextRu}) рабочей неделе с ${context.daysOffRu}.`;
      } else {
        return `Работнику устанавливается режим рабочего времени: продолжительностью ${context.totalHours} (${context.totalHoursTextRu}) часов в неделю по ${context.dayHours} (${context.dayHoursTextRu}) часа в день с ${workStartTime} до ${workEndTime}, при ${context.workingDays} (${context.workingDaysTextRu}) рабочей неделе с ${context.daysOffRu}.`;
      }
    }

    if (lang === "kk") {
      if (hasBreak) {
        return `Жұмыскерге келесі жұмыс уақыты режимі белгіленеді: ұзақтығы аптасына ${context.totalHours} (${context.totalHoursTextKk}) сағатты және ${workStartTime}–${workEndTime} аралығында күніне ${context.dayHours} (${context.dayHoursTextKk}) сағатты құрайды және ${context.workingDays} (${context.workingDaysTextKk}) күндік жұмыс күні, түскі үзіліс сағ. ${breakStartTime}-ден ${breakEndTime}-ға дейін, ${context.daysOffKk}.`;
      } else {
        return `Жұмыскерге келесі жұмыс уақыты режимі белгіленеді: ұзақтығы аптасына ${context.totalHours} (${context.totalHoursTextKk}) сағатты және ${workStartTime}–${workEndTime} аралығында күніне ${context.dayHours} (${context.dayHoursTextKk}) сағатты құрайды және ${context.workingDays} (${context.workingDaysTextKk}) күндік жұмыс күні, ${context.daysOffKk}`;
      }
    }

    return "_____________";
  }

  const workScheduleTextKk = renderWorkScheduleText("kk");
  const workScheduleTextRu = renderWorkScheduleText("ru");

  const salaryAmount = contractData.salary_amount ? Math.floor(Number(contractData.salary_amount)) : null;
  const salaryAmountTextKk = salaryAmount ? numberToText(salaryAmount, "kk") || "_____________" : "_____________";
  const salaryAmountTextRu = salaryAmount ? numberToText(salaryAmount, "ru") || "_____________" : "_____________";

  function replacePlaceholders(content: string, contractData: ContractDetailResponse, _lang: "ru" | "kk"): string {
    if (!content) return content;

    let result = content;

    const placeholderRegex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

    result = result.replace(/\{\{\s*start_date_kk\s*\}\}/gi, startDateKk);
    result = result.replace(/\{\{\s*start_date_ru\s*\}\}/gi, startDateRu);

    result = result.replace(placeholderRegex, (_match, placeholder) => {
      const cleanPlaceholder = placeholder.trim();

      switch (cleanPlaceholder) {
        case "start_date_ru":
          return startDateRu;

        case "start_date_kk":
          return startDateKk;

        case "job_position_kk":
          return contractData.job_position_kk || "_____________";

        case "job_position_ru":
          return contractData.job_position_ru || "_____________";

        case "job_position_gent_ru":
          return contractData.job_position_ru ? ruInflect(contractData.job_position_ru, 2) : "_____________";

        case "job_description_list_ru":
          if (contractData.job_duties_ru && contractData.job_duties_ru.length > 0) {
            return contractData.job_duties_ru
              .map((duty, idx) => {
                if (idx === 0) return `- ${duty}`;
                if (idx < contractData.job_duties_ru.length - 1) return `\n- ${duty};`;
                return `\n- ${duty}`;
              })
              .join("");
          }
          return "_____________";

        case "job_description_list_kk":
          if (contractData.job_duties_kk && contractData.job_duties_kk.length > 0) {
            return contractData.job_duties_kk
              .map((duty, idx) => {
                if (idx === 0) return `- ${duty}`;
                if (idx < contractData.job_duties_kk.length - 1) return `\n- ${duty};`;
                return `\n- ${duty}`;
              })
              .join("");
          }
          return "_____________";

        case "trial_period_ru":
          if (contractData.trial_period) {
            return contractData.trial_duration_months
              ? `с испытательным сроком ${contractData.trial_duration_months} ${getMonthDeclension(contractData.trial_duration_months)}`
              : "с испытательным сроком";
          }
          return "";

        case "trial_period_kk":
          if (contractData.trial_period) {
            return contractData.trial_duration_months
              ? `${contractData.trial_duration_months} айлық сынақ мерзімімен`
              : "сынақ мерзімімен";
          }
          return "";

        case "work_schedule_ru":
          return workScheduleTextRu;

        case "work_schedule_kk":
          return workScheduleTextKk;

        case "salary_amount_ru":
        case "salary_amount_text_ru":
          return salaryAmountTextRu || "_____________";

        case "salary_amount_kk":
        case "salary_amount_text_kk":
          return salaryAmountTextKk || "_____________";

        case "salary_amount":
          if (contractData.salary_amount) {
            const amount = Math.floor(Number(contractData.salary_amount));
            return amount.toString();
          }
          return "_____________";

        case "work_city":
          return _lang === "ru" ? workCityRu : workCityKk;

        case "end_date_ru":
          return endDateRu;

        case "end_date_kk":
          return endDateKk;

        case "work_place_kk":
        case "work_address_kk":
          return contractData.is_online
            ? contractData.employee_address_kk || "_____________"
            : userData?.organization_address_kk || "_____________";

        case "work_place_ru":
        case "work_address_ru":
          return contractData.is_online
            ? contractData.employee_address_ru || "_____________"
            : userData?.organization_address_ru || "_____________";

        default: {
          const contractDataRecord = contractData as unknown as Record<string, unknown>;
          const value = contractDataRecord[cleanPlaceholder];
          if (value !== undefined && value !== null) {
            return String(value);
          }
          return "_____________";
        }
      }
    });

    return result;
  }

  function compareSectionNumbers(a: string, b: string): number {
    const aParts = a.split(".").map((part) => parseInt(part, 10));
    const bParts = b.split(".").map((part) => parseInt(part, 10));

    const maxLength = Math.max(aParts.length, bParts.length);

    for (let i = 0; i < maxLength; i++) {
      const aPart = aParts[i] ?? 0;
      const bPart = bParts[i] ?? 0;

      if (aPart !== bPart) {
        return aPart - bPart;
      }
    }

    return 0;
  }

  function groupClausesBySection(clauses: ContractClause[]): Record<string, ContractClause[]> {
    const grouped: Record<string, ContractClause[]> = {};
    clauses.forEach((clause) => {
      const sectionNumber = clause.section_number.split(".")[0];
      if (!grouped[sectionNumber]) {
        grouped[sectionNumber] = [];
      }
      grouped[sectionNumber].push(clause);
    });
    Object.keys(grouped).forEach((section) => {
      grouped[section].sort((a, b) => compareSectionNumbers(a.section_number, b.section_number));
    });
    return grouped;
  }

  const groupedClauses = groupClausesBySection(clauses);

  const sectionTitles: Record<string, { kk: string; ru: string }> = {
    "1": { kk: "1. ШАРТТЫҢ МӘНІ", ru: "1. ПРЕДМЕТ ДОГОВОРА" },
    "2": {
      kk: "2. ЖҰМЫС БЕРУШІНІҢ ҚҰҚЫҚТАРЫ МЕН МІНДЕТТЕРІ",
      ru: "2. ПРАВА И ОБЯЗАННОСТИ РАБОТОДАТЕЛЯ",
    },
    "3": {
      kk: "3. ЖҰМЫСКЕРДІҢ ҚҰҚЫҚТАРЫ МЕН МІНДЕТТЕРІ",
      ru: "3. ПРАВА И ОБЯЗАННОСТИ РАБОТНИКА",
    },
    "4": {
      kk: "4. ЖҰМЫС УАҚЫТЫ, ДЕМАЛЫС УАҚЫТЫ ЖӘНЕ ЕҢБЕККЕ АҚЫ ТӨЛЕУ",
      ru: "4. РАБОЧЕЕ ВРЕМЯ, ВРЕМЯ ОТДЫХА И ОПЛАТА ТРУДА",
    },
    "5": {
      kk: "5. ШАРТТЫҢ ҚОЛДАНЫЛУ МЕРЗІМІ, ОНЫ ӨЗГЕРТУ, ТОЛЫҚТЫРУ ЖӘНЕ ТОҚТАТУ ТӘРТІБІ",
      ru: "5. СРОК ДЕЙСТВИЯ ДОГОВОРА, ПОРЯДОК ЕГО ИЗМЕНЕНИЯ, ДОПОЛНЕНИЯ И ПРЕКРАЩЕНИЯ",
    },
    "6": { kk: "6. КЕПІЛДІКТЕР МЕН ӨТЕМАҚЫЛАР", ru: "6. ГАРАНТИИ И КОМПЕНСАЦИИ" },
    "7": {
      kk: "7. ТАРАПТАРДЫҢ ЖАУАПКЕРШІЛІГІ ЖӘНЕ ДАУЛАРДЫ ШЕШУ ТӘРТІБІ",
      ru: "7. ОТВЕТСТВЕННОСТЬ СТОРОН И ПОРЯДОК РАЗРЕШЕНИЯ СПОРОВ",
    },
    "8": {
      kk: "8. СЫБАЙЛАС ЖЕМҚОРЛЫҚҚА ҚАРСЫ ЕРЕЖЕЛЕР",
      ru: "8. АНТИКОРРУПЦИОННЫЕ ПОЛОЖЕНИЯ",
    },
    "9": { kk: "9. ӨЗГЕ ДЕ ТАЛАПТАР", ru: "9. ПРОЧИЕ УСЛОВИЯ" },
  };

  function renderSection(sectionNumber: string) {
    const sectionClauses = groupedClauses[sectionNumber] || [];
    const title = sectionTitles[sectionNumber];

    if (!title) return null;

    return (
      <tr key={sectionNumber}>
        <td className="p-4 border border-gray-300 align-top">
          <h2 className="text-xl font-bold text-center mb-4">{title.kk}</h2>
          <div>
            {sectionClauses.map((clause) => {
              let contentKk: string;
              if (clause.section_number === "4.1") {
                contentKk = workScheduleTextKk;
              } else {
                contentKk = replacePlaceholders(clause.content_kk, contractData, "kk");
              }
              function handleClauseClick() {
                onClauseClick(clause);
              }
              return (
                <p
                  key={clause.section_number}
                  className="mb-2 cursor-pointer hover:underline"
                  onClick={handleClauseClick}
                  dangerouslySetInnerHTML={{
                    __html: `<strong>${clause.section_number}.</strong> ${contentKk.replace(/\n/g, "<br />")}`,
                  }}
                />
              );
            })}
          </div>
        </td>
        <td className="p-4 border border-gray-300 align-top">
          <h2 className="text-xl font-bold text-center mb-4">{title.ru}</h2>
          <div>
            {sectionClauses.map((clause) => {
              let contentRu: string;
              if (clause.section_number === "4.1") {
                contentRu = workScheduleTextRu;
              } else {
                contentRu = replacePlaceholders(clause.content_ru, contractData, "ru");
              }
              function handleClauseClick() {
                onClauseClick(clause);
              }
              return (
                <p
                  key={clause.section_number}
                  className="mb-2 cursor-pointer hover:underline"
                  onClick={handleClauseClick}
                  dangerouslySetInnerHTML={{
                    __html: `<strong>${clause.section_number}.</strong> ${contentRu.replace(/\n/g, "<br />")}`,
                  }}
                />
              );
            })}
          </div>
        </td>
      </tr>
    );
  }

  return (
    <ModalForm icon={DocumentText1} onClose={onBack} hasBackground={false} resize={true}>
      <div className="flex flex-col justify-between p-1 h-full">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">{t("contractChanges.changeOtherConditions.title")}</h4>
          <p className="text-body-regular-sm content-base-secondary">
            {t("contractChanges.changeOtherConditions.subtitle") || "Выберите пункт для редактирования"}
          </p>
        </div>

        <div className="flex-1 overflow-auto page-scroll pr-5 pt-5">
          <div className="flex flex-col text-body-regular-md content-base-primary bg-white">
            <table className="w-full border-collapse mb-6">
              <tbody>
                <tr>
                  <td className="p-4 border border-gray-300 align-top text-center">
                    <h1 className="text-2xl font-bold mb-4">
                      № {contractData.contract_number || "_____________"} ЕҢБЕК ШАРТЫ
                    </h1>
                    <div className="flex justify-between text-sm mb-3">
                      <div className="flex justify-between items-center w-full">
                        <strong>{workCityKk} қ.</strong> <strong>{startDateKk}</strong>
                      </div>
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
                    <h1 className="text-2xl font-bold mb-4">
                      ТРУДОВОЙ ДОГОВОР № {contractData.contract_number || "_____________"}
                    </h1>
                    <div className="flex justify-between text-sm mb-3">
                      <div className="flex justify-between items-center w-full">
                        <strong>г. {workCityRu}</strong> <strong>{startDateRu}</strong>
                      </div>
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

                {renderSection("1")}
                {renderSection("2")}
                {renderSection("3")}
                {renderSection("4")}
                {renderSection("5")}
                {renderSection("6")}
                {renderSection("7")}
                {renderSection("8")}
                {renderSection("9")}

                <tr>
                  <td className="p-4 border border-gray-300 align-top">
                    <h2 className="text-xl font-bold text-center mb-4">ТАРАПТАРДЫҢ ДЕРЕКТЕМЕЛЕРІ МЕН ҚОЛДАРЫ:</h2>
                    <div className="mt-6">
                      <div className="mb-6">
                        <p className="font-bold mb-2">Жұмыс беруші:</p>
                        <p className="mb-1">
                          <strong>
                            {userData?.organization_type_short_title_kk || "_____________"} «
                            {userData?.organization || "_____________"}»
                          </strong>
                        </p>
                        <p className="mb-1">
                          <strong>{userData?.organization_address_kk || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          Заңды тұлғаны мемлекеттік қайта тіркеу туралы{" "}
                          <strong>{userData?.organization_registration_date || "_____________"}</strong> жылғы анықтама.
                        </p>
                        <p className="mb-1">
                          БСН: <strong>{userData?.organization_bin || "_____________"}</strong>
                        </p>
                      </div>
                      <div className="mb-6">
                        <p className="mb-1">
                          <strong>
                            {userData?.employer_position_kk || "_____________"}{" "}
                            {userData?.organization_type_short_title_kk || "_____________"} «
                            {userData?.organization || "_____________"}» {userData?.full_name || "_____________"}
                          </strong>
                        </p>
                        <p className="mb-2 mt-4">(қолы)</p>
                        <div className="border-t border-black mt-2 mb-2 w-48"></div>
                        <p className="text-sm">
                          <strong>{startDateKk}</strong>
                        </p>
                        <p className="text-sm">М.О.</p>
                      </div>
                      <div className="mt-8">
                        <p className="font-bold mb-2">Жұмыскер:</p>
                        <p className="mb-1">
                          <strong>{employee_full_name || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          жеке куәлігі № <strong>{employee_id_number || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          берген: <strong>{employee_id_issued_by || "_____________"}</strong>{" "}
                          <strong>
                            {employee_id_issue_date
                              ? formatDateForContract(new Date(employee_id_issue_date), "kk")
                              : "_____________"}
                          </strong>
                        </p>
                        <p className="mb-1">
                          ЖСН <strong>{employee_iin || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          <strong>{contractData.employee_address_kk || "_____________"}</strong>.
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
                          <strong>
                            {userData?.organization_type_short_title_ru || "_____________"} «
                            {userData?.organization || "_____________"}»
                          </strong>
                        </p>
                        <p className="mb-1">
                          <strong>{userData?.organization_address_ru || "_____________"}</strong>
                        </p>
                        <p className="mb-1">
                          Справка о государственной регистрации юридического лица от{" "}
                          <strong>{userData?.organization_registration_date || "_____________"}</strong>.
                        </p>

                        <p className="mb-1">
                          БИН: <strong>{userData?.organization_bin || "_____________"}</strong>
                        </p>
                      </div>
                      <div className="mb-6">
                        <p className="mb-1">
                          <strong>
                            {userData?.employer_position_ru || "_____________"}{" "}
                            {userData?.organization_type_short_title_ru || "_____________"} «
                            {userData?.organization || "_____________"}» {userData?.full_name || "_____________"}
                          </strong>
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
                          <strong>{contractData.employee_address_ru || "_____________"}</strong>.
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
                      <p>№ {contractData.contract_number || "_____________"} еңбек шартына</p>
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
                        № {contractData.contract_number || "_____________"} от {startDateRu}.
                      </p>
                    </div>
                    <h2 className="text-xl font-bold text-center mb-4">
                      Обязательство о неразглашении персональных данных, коммерческой, служебной и иной охраняемой
                      законодательством тайны
                    </h2>
                    <div className="mt-6">
                      <p className="mb-2">Я, {employee_full_name || "_____________"} </p>
                      <p className="mb-2">Обязуюсь:</p>
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

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onBack} type="button">
            {t("buttons.back")}
          </Button>
        </div>
      </div>
    </ModalForm>
  );
}

