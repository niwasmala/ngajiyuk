<script>
	export let data

	console.log(data.surah)
</script>

<div class="p-4 flex flex-row justify-between items-center">
	<div class="flex flex-row items-center gap-4">
		<a href="/">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
			  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
			</svg>
		</a>

		<div class="text-2xl font-bold text-neutral-900">
			{data.surah.nameEn}
		</div>
	</div>
	<div class="text-2xl text-neutral-900">
		{data.surah.numAyahs} ayat
	</div>
</div>

<div class="flex flex-col gap-4 p-4">
	{#each Object.entries(data.surah.ayahs) as [index, ayah]}
		<a href={`/${data.params.surah}/${index}`} class="bg-white rounded-full px-6 py-3 flex flex-row justify-end gap-4 items-center">
			<div class="font-bold text-2xl text-right">
				{ayah}
			</div>
			<div>
				{index}
			</div>
		</a>
	{/each}
</div>