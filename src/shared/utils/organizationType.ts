export type OrganizationType = "llp" | "llc" | "jsc" | "ip" | "pf";

interface OrganizationTypeDetails {
  ru: {
    full_title: string;
    abbreviation: string;
  };
  kk: {
    full_title: string;
    abbreviation: string;
  };
}

/**
 * Get full bilingual details for organization type.
 *
 * @param orgType - Organization type code ('llp', 'llc', 'jsc', 'ip', 'pf')
 * @returns Dictionary with Russian and Kazakh titles
 * @throws {Error} If orgType is not recognized
 *
 * @example
 * ```ts
 * getOrganizationTypeDetails('llp')
 * // Returns:
 * // {
 * //   ru: { full_title: 'Товарищество с ограниченной ответственностью', abbreviation: 'ТОО' },
 * //   kk: { full_title: 'Жауапкершілігі шектеулі серіктестік', abbreviation: 'ЖШС' }
 * // }
 * ```
 */
export function getOrganizationTypeDetails(orgType: OrganizationType): OrganizationTypeDetails {
  const details: Record<OrganizationType, OrganizationTypeDetails> = {
    llp: {
      ru: {
        full_title: "Товарищество с ограниченной ответственностью",
        abbreviation: "ТОО",
      },
      kk: {
        full_title: "Жауапкершілігі шектеулі серіктестік",
        abbreviation: "ЖШС",
      },
    },
    llc: {
      ru: {
        full_title: "Общество с ограниченной ответственностью",
        abbreviation: "ООО",
      },
      kk: {
        full_title: "Жауапкершілігі шектеулі қоғам",
        abbreviation: "ЖШҚ",
      },
    },
    jsc: {
      ru: {
        full_title: "Акционерное общество",
        abbreviation: "АО",
      },
      kk: {
        full_title: "Акционерлік қоғам",
        abbreviation: "АҚ",
      },
    },
    ip: {
      ru: {
        full_title: "Индивидуальный предприниматель",
        abbreviation: "ИП",
      },
      kk: {
        full_title: "Жеке кәсіпкер",
        abbreviation: "ЖК",
      },
    },
    pf: {
      ru: {
        full_title: "Общественный фонд",
        abbreviation: "ОФ",
      },
      kk: {
        full_title: "Қоғамдық қор",
        abbreviation: "ҚҚ",
      },
    },
  };

  if (!(orgType in details)) {
    throw new Error(
      `Unknown organization type: ${orgType}. Valid types: ${Object.keys(details).join(", ")}`
    );
  }

  return details[orgType];
}
