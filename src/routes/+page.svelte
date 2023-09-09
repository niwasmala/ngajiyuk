<script>
  export let data
</script>

<div class="p-4 text-4xl font-bold text-neutral-800">
  Ngaji Yuk!
</div>

<div class="p-4 grid grid-cols-2 gap-4">
  {#each Object.entries(data.surah) as [index, surat]}
    <a href={`/${index}`} class="bg-white w-full px-5 py-3 border-neutral-300 border-2 rounded-full">
      {index}. {surat.nameEn}
    </a>
  {/each}
</div>