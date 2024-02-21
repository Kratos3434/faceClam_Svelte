import { json } from '@sveltejs/kit';

export async function GET({ cookies }) {
  cookies.delete('token', { path: '/' });

  return json({status: true});
}