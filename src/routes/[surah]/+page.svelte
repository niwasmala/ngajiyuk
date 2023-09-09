<script>
	export let data

	let counter = 1
	let words = 2

	const increaseWords = () => {
		words++

		const element = document.getElementById(`ayah-${counter}`)
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			});
		}
	}

	const decreaseWords = () => {
		if (words > 2) {
			words--
		}

		const element = document.getElementById(`ayah-${counter}`)
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			});
		}
	}

	const nextAyah = () => {
		if (counter < data.surah.numAyahs) {
			counter++
		} else {
			window.location.href = `/${parseInt(data.params.surah)+1}`
		}

		const element = document.getElementById(`ayah-${counter}`)
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			});
		}
	}

	const previousAyah = () => {		
		if (counter > 1) {
			counter--
		}

		const element = document.getElementById(`ayah-${counter}`)
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			});
		}
	}
</script>

<div class="max-w-lg mx-auto fixed z-30 top-0 left-0 right-0 p-4 flex flex-row justify-between items-center text-neutral-800 bg-white border-b-4 border-green-500">
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
		{data.surah.numAyahs} ayat
	</div>
</div>

<div class="py-24 min-h-screen flex flex-col gap-4 p-4">
	{#each Object.entries(data.ayah) as [index, ayah]}
		<a id={`ayah-${index}`} href={`/${data.params.surah}/${index}`} class="relative bg-white px-4 py-2 rounded-md flex flex-col gap-0">
			<div class="absolute text-xs w-8 h-8 bg-green-500 left-0 top-0 flex items-center justify-center text-white">
				{index}
			</div>
			<div class={`self-end flex flex-wrap flex-row-reverse gap-2 font-bold text-5xl pl-4 py-3 text-right leading-loose ${index <= counter ? 'text-neutral-800' : 'text-neutral-300'}`}>
				{#each ayah as word, idx}
					<div class={`${idx < words ? 'block' : 'hidden'}`}>
						{word.arabic}
					</div>
				{/each}
				<div>
					{ayah.length > words ? '...' : ''}
				</div>
			</div>
			{#if ayah[0].transliteration}
				<div class={`self-start flex flex-wrap flex-row font-bold text-4xl py-3 text-right ${index <= counter ? 'text-neutral-800' : 'text-neutral-300'}`}>
					{#each ayah as word, idx}
						<div class={`${idx < words ? 'block' : 'hidden'}`}>
							{word.transliteration}
						</div>
					{/each}
					<div>
						{ayah.length > words ? '...' : ''}
					</div>
				</div>
			{/if}
		</a>
	{/each}
</div>

<div class="max-w-lg mx-auto fixed z-30 bottom-0 left-0 right-0 h-16 bg-white flex flex-row justify-between items-center gap-2 px-3 border-t-4 border-green-500">
	<div on:click={previousAyah} class={`cursor-pointer p-2 ${counter > 1 ? 'text-neutral-900' : 'text-neutral-400'}`}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
		</svg>
	</div>
	<div on:click={decreaseWords} class={`cursor-pointer p-2 ${words > 2 ? 'text-neutral-900' : 'text-neutral-400'}`}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>
	</div>
	<div class="w-20 h-20 relative">
		<div class="cursor-pointer absolute bg-green-500 w-full h-full flex items-center justify-center rounded-full -top-8 text-white">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
			</svg>
		</div>
	</div>
	<div on:click={increaseWords} class="cursor-pointer p-2 text-neutral-900">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	</div>
	<div on:click={nextAyah} class="cursor-pointer p-2 text-neutral-900">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
		</svg>
	</div>
</div>