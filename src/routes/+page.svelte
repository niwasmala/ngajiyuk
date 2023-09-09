<script>
  export let data
</script>

<div class="max-w-lg mx-auto fixed z-30 top-0 left-0 right-0 p-4 flex flex-row justify-between items-center text-neutral-800 bg-white border-b-4 border-green-500">
  <div class="text-xl font-bold text-neutral-800">
    Ngaji Yuk!
  </div>
</div>

<div class="py-20 min-h-screen flex flex-col gap-12 p-3">
  <div class="grid grid-cols-5 gap-2">
    {#each Object.entries(data.surah) as [index, surat]}
      <a href={`/${index}`} class="bg-white w-full p-1 flex flex-col items-center">
        <div class="text-2xl font-bold">
          {index}
        </div>
        <div class="text-[0.5rem]">
          {surat.nameEn}
        </div>
      </a>
    {/each}
  </div>
</div>

<!-- <div class="max-w-lg mx-auto fixed z-30 bottom-0 left-0 right-0 h-16 bg-white flex flex-row justify-between items-center gap-2 px-3 border-t-4 border-green-500">
  
</div> -->