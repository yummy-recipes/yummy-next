import { cookies } from "next/headers";
import Statsig, { type InitializationDetails } from "statsig-node";

let statsigInitialization: Promise<InitializationDetails> | undefined =
  undefined;

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const stableID = cookieStore.get("s_stableID")?.value;

  if (!stableID) {
    return new Response(JSON.stringify({ error: "Stable ID not found" }), {
      status: 404,
    });
  }

  if (!statsigInitialization) {
    statsigInitialization = Statsig.initialize(
      process.env.STATSIG_SERVER_KEY!,
      {
        environment: { tier: process.env.NODE_ENV ?? "development" },
      },
    );
  }

  await statsigInitialization;

  const bootstrapValues = Statsig.getClientInitializeResponse(
    {
      customIDs: { stableID },
    },
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
    {
      hash: "djb2",
    },
  );

  return new Response(
    JSON.stringify({
      stableID,
      bootstrapValues: JSON.stringify(bootstrapValues),
    }),
    {
      status: 200,
    },
  );
}
