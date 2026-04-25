export async function POST(request: Request) {
    const { request: url } = await request.json();
    const urlObj = URL.parse(url);

    if (!urlObj || urlObj.hostname !== 'colabprod01.pace.edu') {
        return new Response('Invalid API endpoint', { status: 400 });
    }

    const response = await fetch(url);
    return Response.json(await response.json());
}
