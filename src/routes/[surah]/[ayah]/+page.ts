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

  let mode = url.searchParams.get('mode')
  let wordsDisplayed = ayah[params.ayah].arabic.map((item, index) => mode !== 'test' && index === 0 ? true : false)

  return {
    params: {
      ...params,
      mode,
    },
    surah: surah[params.surah],
    ayah: ayah[params.ayah],
    wordsDisplayed,
  }
}