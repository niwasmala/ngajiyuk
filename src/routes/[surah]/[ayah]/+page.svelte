<script>
	export let data

	let ayah = parseInt(data.params.ayah)
	let counter = 1

	let audioName
	let audioElement
	let audioPlaying = false

	$: audioName = ("000" + data.params.surah).slice(-3) + ("000" + data.params.ayah).slice(-3)

	const playAudio = () => {
		if (!audioPlaying) {
			audioElement.play()
		} else {
			audioElement.currentTime = 0
			audioElement.pause()
		}

		audioPlaying = !audioPlaying
	}

	const increaseCounter = () => {
		if (counter < data.ayah.length) {
			counter++
		} else {
			nextAyah()
		}

		const element = document.getElementById(`word-${counter}`)
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			});
		}
	}

	const decreaseCounter = () => {
		if (counter > 1) {
			counter--
		} else {
			previousAyah()
		}

		const element = document.getElementById(`word-${counter}`)
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			});
		}
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

<div class="max-w-lg mx-auto fixed z-30 top-0 left-0 right-0 p-4 flex flex-row justify-between items-center text-neutral-800 bg-white border-b-4 border-green-500">
	<div class="flex flex-row items-center gap-4">
		<a href={`/${data.params.surah}`}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
			  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
			</svg>
		</a>

		<div class="text-xl font-bold">
			{data.surah.nameEn}
		</div>
	</div>
	<div class="text-xl">
		<select bind:value={ayah} on:change={() => window.location.href = `/${data.params.surah}/${ayah}`} class="bg-white">
			<option></option>
			{#each [...Array(data.surah.numAyahs).keys()] as num}
				<option value={num+1} >
					Ayat {num+1}
				</option>
			{/each}
		</select>
	</div>
</div>

<div class="pt-24 pb-28 min-h-screen flex flex-col gap-12 p-4">
	<div class="bg-white flex flex-col gap-12 py-6 px-3">
		<div class="flex flex-row-reverse flex-wrap gap-4">
			{#each data.ayah as word, index}
				<div class={`${index < counter ? 'text-neutral-800' : 'text-neutral-300'}`}>
					<div id={`word-${index+1}`} class="font-bold text-6xl text-right leading-loose">
						{word.arabic}
						<div class="text-lg text-center">
							{word.transliteration}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<div class="max-w-lg mx-auto fixed z-30 bottom-0 left-0 right-0 h-20 bg-white flex flex-row justify-between items-center gap-2 px-3 border-t-4 border-green-500">
	<div on:click={previousAyah} class={`cursor-pointer p-2 ${parseInt(data.params.ayah) > 1 ? 'text-neutral-900' : 'text-neutral-400'}`}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
		</svg>
	</div>
	<div on:click={decreaseCounter} class="cursor-pointer p-2 text-neutral-900">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>
	</div>
	<div class="w-20 h-20 relative">
		<div on:click={playAudio} class={`cursor-pointer absolute w-full h-full flex items-center justify-center rounded-full -top-8 text-white ${audioPlaying ? 'bg-red-500' : 'bg-green-500' }`}>
			{#if audioPlaying}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
				</svg>
			{/if}
		</div>
	</div>
	<div on:click={increaseCounter} class="cursor-pointer p-2 text-neutral-900">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	</div>
	<div on:click={nextAyah} class={`cursor-pointer p-2 ${parseInt(data.params.ayah) < data.surah.numAyahs ? 'text-neutral-900' : 'text-neutral-400'}`}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
		</svg>
	</div>
</div>

<audio bind:this={audioElement}>
  <source src={`/audio/${audioName}.mp3`} type="audio/mpeg">
</audio>