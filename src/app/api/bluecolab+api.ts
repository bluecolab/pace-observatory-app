export async function POST(request: Request) {
    const { request: url } = await request.json();
    const response = await fetch(url);
    return Response.json(await response.json());
}
