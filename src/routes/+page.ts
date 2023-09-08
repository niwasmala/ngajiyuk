import { error } from '@sveltejs/kit';
import surah from '$lib/data/surah-info.json';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  return {
    surah
  }
}