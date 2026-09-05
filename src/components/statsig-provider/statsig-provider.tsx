"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useClientBootstrapInit,
  StatsigProvider as OriginalStatsigProvider,
} from "@statsig/react-bindings";

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
  // remounted), so the client is created seeded with the "" placeholder.
  // Once the real values arrive, feed them in manually so gates/experiments
  // reflect the server-computed bootstrap instead of being stuck on empty
  // data for the rest of the session.
  useEffect(() => {
    if (!initialValues) {
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
    <StatsigProviderInternal initialValues={initialValues?.bootstrapValues ?? ""}>
      {children}
    </StatsigProviderInternal>
  );
};
