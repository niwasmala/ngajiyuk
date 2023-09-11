import { error } from '@sveltejs/kit';
import surah from '$lib/data/surah.json';
import { loadWords } from '$lib/data/words';

/** @type {import('./$types').PageLoad} */
export async function load({ params, url }) {
  if (!surah[params.surah]) {
    throw error(404, 'Not found');
  }

  let ayah
  try {
    ayah = await loadWords(params.surah);
  } catch (e) {
    console.error(e)
    throw error(404, 'Not found');
  }

  return {
    params: {
      ...params,
      mode: url.searchParams.get('mode'),
    },
    surah: surah[params.surah],
    ayah: ayah[params.ayah],
  }
}