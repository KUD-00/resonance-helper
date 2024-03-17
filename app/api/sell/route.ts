import { getSellDataArray } from '@/app/actions';

export async function GET(request: Request) {
  return Response.json(await getSellDataArray())
}