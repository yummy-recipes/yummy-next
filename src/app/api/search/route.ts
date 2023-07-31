export async function GET(request: Request) {
  return new Response(JSON.stringify({ data: [{ label: 'Hello, Next.js!' }] }))
}
