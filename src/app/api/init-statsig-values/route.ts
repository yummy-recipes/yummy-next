export async function GET(request: Request) {
  return new Response(JSON.stringify({ message: "Not implemented" }), {
    status: 501,
  });
  // const stableID = request.cookies.get("s_stableID")?.value;

  // if (!stableID) {
  //   return new Response(JSON.stringify({ error: "Stable ID not found" }), {
  //     status: 404,
  //   });
  // }

  // const bootstrapValues = await statsig.getClientInitializeResponse({
  //   customIDs: { stableID },
  // });

  // return new Response(JSON.stringify({ stableID, bootstrapValues }), {
  //   status: 200,
  // });
}
