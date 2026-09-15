"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useClientBootstrapInit,
  StatsigProvider as OriginalStatsigProvider,
} from "@statsig/react-bindings";

// A validly-parseable "no updates yet" placeholder for the window before the
// real bootstrap payload has loaded. Statsig's EvaluationResponse parsing
// requires valid JSON with a `has_updates` field - passing "" instead makes
// JSON.parse throw and logs a "Failed to parse EvaluationResponse" error on
// every page load, even though the client handles it gracefully either way.
const EMPTY_BOOTSTRAP_VALUES = '{"has_updates":false}';

const StatsigProviderInternal = ({
  initialValues,
  children,
}: {
  initialValues: string;
  children: React.ReactNode;
}) => {
  const user = useMemo(() => {
    const stableID =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("stableID="))
        ?.split("=")[1] || "anonymous";

    return {
      customIDs: {
        stableID,
      },
    };
  }, []);

  const client = useClientBootstrapInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
    user,
    initialValues,
    {
      environment: { tier: process.env.NODE_ENV ?? "development" },
    },
  );

  // useClientBootstrapInit only ever applies the `initialValues` it received
  // on its first call - the client it returns is memoized once and never
  // recreated. This component now mounts before the real bootstrap payload
  // has loaded (so the tree stays stable and `children` never gets
  // remounted), so the client is created seeded with EMPTY_BOOTSTRAP_VALUES.
  // Once the real values arrive, feed them in manually so gates/experiments
  // reflect the server-computed bootstrap instead of being stuck on empty
  // data for the rest of the session.
  useEffect(() => {
    if (initialValues === EMPTY_BOOTSTRAP_VALUES) {
      return;
    }

    client.dataAdapter.setData(initialValues);
    client.updateUserSync(user);
  }, [client, initialValues, user]);

  return (
    <OriginalStatsigProvider client={client}>
      {children}
    </OriginalStatsigProvider>
  );
};

export const StatsigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [initialValues, setInitialValues] = useState<{
    stableID: string;
    bootstrapValues: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/init-statsig-values", {
        headers: { "content-type": "application/json" },
      });
      const values = await res.json();

      setInitialValues(values);
    })();
  }, []);

  return (
    <StatsigProviderInternal
      initialValues={initialValues?.bootstrapValues ?? EMPTY_BOOTSTRAP_VALUES}
    >
      {children}
    </StatsigProviderInternal>
  );
};
