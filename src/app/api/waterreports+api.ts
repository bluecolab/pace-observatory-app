export async function GET() {
    const api_address = 'http://10.86.80.188:8000';
    return Response.json({ api_address });
}
