import { error } from '@sveltejs/kit';
import surah from '$lib/data/surah-info.json';
import ayah from '$lib/data/word-by-word/78.json';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  if (!surah[params.surah]) {
    throw error(404, 'Not found');
  }
  
  if (!ayah[params.ayah]) {
    throw error(404, 'Not found');
  }

  return {
    params,
    surah: surah[params.surah],
    ayah: ayah[params.ayah],
  }
}