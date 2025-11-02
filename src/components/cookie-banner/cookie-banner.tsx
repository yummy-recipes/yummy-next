"use client";
import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";

export const CookieBanner = () => {
  useEffect(() => {
    CookieConsent.run({
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: { enabled: true },
      },
      language: {
        default: "pl",
        translations: {
          pl: {
            consentModal: {
              title: "Używamy ciasteczek",
              description: "Opis modalny ciasteczek",
              acceptAllBtn: "Zaakceptuj wszystkie",
              acceptNecessaryBtn: "Odrzuć wszystkie",
              showPreferencesBtn: "Zarządzaj indywidualnymi preferencjami",
            },
            preferencesModal: {
              title: "Zarządzaj preferencjami ciasteczek",
              acceptAllBtn: "Zaakceptuj wszystkie",
              acceptNecessaryBtn: "Odrzuć wszystkie",
              savePreferencesBtn: "Zaakceptuj bieżący wybór",
              closeIconLabel: "Zamknij modal",
              sections: [
                {
                  title: "Ktoś powiedział... ciasteczka?",
                  description: "Chcę jedno!",
                },
                {
                  title: "Ściśle niezbędne ciasteczka",
                  description:
                    "Te ciasteczka są niezbędne do prawidłowego funkcjonowania witryny i nie można ich wyłączyć.",

                  //this field will generate a toggle linked to the 'necessary' category
                  linkedCategory: "necessary",
                },
                {
                  title: "Analityka",
                  description:
                    "Te ciasteczka zbierają informacje o tym, jak korzystasz z naszej witryny. Wszystkie dane są anonimizowane i nie mogą być użyte do Twojej identyfikacji.",
                  linkedCategory: "analytics",
                },
              ],
            },
          },
        },
      },
    });
  }, []);

  return null;
};
