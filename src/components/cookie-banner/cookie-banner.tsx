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
              title: "We use cookies",
              description: "Cookie modal description",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              showPreferencesBtn: "Manage Individual preferences",
            },
            preferencesModal: {
              title: "Manage cookie preferences",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              savePreferencesBtn: "Accept current selection",
              closeIconLabel: "Close modal",
              sections: [
                {
                  title: "Somebody said ... cookies?",
                  description: "I want one!",
                },
                {
                  title: "Strictly Necessary cookies",
                  description:
                    "These cookies are essential for the proper functioning of the website and cannot be disabled.",

                  //this field will generate a toggle linked to the 'necessary' category
                  linkedCategory: "necessary",
                },
                {
                  title: "Analytics",
                  description:
                    "These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.",
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
