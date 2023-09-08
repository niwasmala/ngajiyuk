<script>
	export let data

	let ayah = parseInt(data.params.ayah)
	let counter = 0

	const increaseCounter = () => {
		if (counter < data.ayah.words.length) {
			counter++
		}
		console.log('increaseCounter', counter)
	}

	const decreaseCounter = () => {
		if (counter > 0) {
			counter--
		}
		console.log('decreaseCounter', counter)
	}

	const nextAyah = () => {
		if (parseInt(data.params.ayah) < data.surah.numAyahs) {
			window.location.href = `/${data.params.surah}/${parseInt(data.params.ayah)+1}`
		}
	}

	const previousAyah = () => {		
		if (parseInt(data.params.ayah) > 1) {
			window.location.href = `/${data.params.surah}/${parseInt(data.params.ayah)-1}`
		}
	}
</script>

<div class="fixed top-0 left-0 right-0 p-4 flex flex-row justify-between items-center text-neutral-800 bg-white border-b-4 border-green-500">
	<div class="flex flex-row items-center gap-4">
		<a href="/">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
			  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
			</svg>
		</a>

		<div class="text-xl font-bold">
			{data.surah.nameEn}
		</div>
	</div>
	<div class="text-xl">
		<select bind:value={ayah} on:change={() => window.location.href = `/${data.params.surah}/${ayah}`}>
			<option></option>
			{#each [...Array(data.surah.numAyahs).keys()] as num}
				<option value={num+1} >
					Ayat {num+1}
				</option>
			{/each}
		</select>
	</div>
</div>

<div class="py-24 min-h-screen flex flex-col gap-12 p-4">
	<div class="flex flex-row-reverse flex-wrap gap-4">
		{#each data.ayah.words as word, index}
			<div class={`${index < counter ? 'text-neutral-800' : (index === counter ? 'text-neutral-900 font-bold' : 'text-neutral-300')}`}>
				<div class="font-bold text-6xl text-right">
					{word.arabic ?? word}
				</div>
			</div>
		{/each}
	</div>
	<div class="flex flex-row flex-wrap">
		{#each data.ayah.words as word, index}
			<div class={`${index < counter ? 'text-neutral-800' : (index === counter ? 'text-neutral-900 font-bold' : 'text-neutral-300')}`}>
				<div class="font-bold text-5xl text-right">
					{word.transliteration ?? ''}
				</div>
			</div>
		{/each}
	</div>

</div>

<div class="fixed bottom-0 left-0 right-0 h-16 bg-white flex flex-row justify-between items-center gap-2 px-3 border-t-4 border-green-500">
	<div on:click={previousAyah} class={`p-2 ${parseInt(data.params.ayah) > 1 ? 'text-neutral-900' : 'text-neutral-400'}`}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
		</svg>
	</div>
	<div on:click={decreaseCounter} class={`p-2 ${counter > 0 ? 'text-neutral-900' : 'text-neutral-400'}`}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>
	</div>
	<div class="w-20 h-20 relative">
		<div class="absolute bg-green-500 w-full h-full flex items-center justify-center rounded-full -top-8 text-white">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
			  <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
			</svg>
		</div>
	</div>
	<div on:click={increaseCounter} class={`p-2 ${counter < data.ayah.words.length - 1 ? 'text-neutral-900' : 'text-neutral-400'}`}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	</div>
	<div on:click={nextAyah} class={`p-2 ${parseInt(data.params.ayah) < data.surah.numAyahs ? 'text-neutral-900' : 'text-neutral-400'}`}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
		</svg>
	</div>
</div>