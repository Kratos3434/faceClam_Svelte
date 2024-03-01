import { json } from '@sveltejs/kit';

export async function DELETE({ cookies }) {
  cookies.delete("retrieveToken", { path: '/' });

  return json({ status: true });
}