"use client";

import { useEffect, useState } from "react";
import {
  useClientBootstrapInit,
  StatsigProvider as OriginalStatsigProvider,
} from "@statsig/react-bindings";

const StatsigProviderInternal = ({
  initialValues,
  children,
}: {
  initialValues: any;
  children: React.ReactNode;
}) => {
  const stableID =
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("stableID="))
      ?.split("=")[1] || "anonymous";
  const user = {
    customIDs: {
      stableID,
    },
  };
  const client = useClientBootstrapInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
    user,
    initialValues,
  );

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
    bootstrapValues: any;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/init-statsig-values", {
        headers: { "content-type": "application/json" },
      });
      const values = await res.json();

      console.log("Fetched Statsig initial values:", values);
      setInitialValues(values);
      // const inst = new StatsigClient(
      //   process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
      //   user,
      //   { initializeValues },
      // );
      // await inst.initializeAsync();
      // setClient(inst);
    })();
  }, []);

  if (initialValues === null) {
    return children;
  }

  return (
    <StatsigProviderInternal initialValues={initialValues.bootstrapValues}>
      {children}
    </StatsigProviderInternal>
  );
};
