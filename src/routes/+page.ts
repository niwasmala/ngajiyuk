import { error } from '@sveltejs/kit';
import surah from '$lib/data/surah.json';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  return {
    surah
  }
}