<script>
  export let data
</script>

<div class="max-w-lg mx-auto fixed z-30 top-0 left-0 right-0 p-4 flex flex-row justify-between items-center text-neutral-800 bg-white border-b-4 border-green-500">
  <div class="flex flex-row items-center gap-4">
    <div class="text-xl font-bold">
      Ngaji Yuk!
    </div>
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

<div class="max-w-lg mx-auto fixed z-30 bottom-0 left-0 right-0 h-16 bg-white flex flex-row justify-center items-center gap-2 px-3 border-t-4 border-green-500">
  <a href="/about" class="flex flex-row justify-center items-center gap-1 text-sm">
    <div>
      Made with 
    </div>
    <div class="text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    </div>
    <div>
      by
    </div>
    <div class="font-bold">
      Nicky Irawan
    </div>
    <div>
      &copy; 2023
    </div>
  </a>
</div>