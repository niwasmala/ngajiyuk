<script>
	export let data

	const minWords = 1

	let counter = 1
	let words = minWords

	let audioName
	let audioElement
	let audioPlaying = false

	$: audioName = ("000" + data.params.surah).slice(-3) + ("000" + counter).slice(-3)

	let interval, timer = 0, timerAdd = 100

	const playAudio = () => {
		if (!audioPlaying) {
			audioPlaying = true
			audioElement.play()

			const marker = data.ayah[counter].marker ?? [];
			if (interval) window.clearInterval(interval)

			timer = 0
			interval = window.setInterval(() => {
				let lastMarker
				marker.forEach((m, i) => {
					if (timer >= m) {
						lastMarker = i
					}
				})

				setWord(lastMarker+1)
				timer += timerAdd

				if (lastMarker >= marker.length) {
					timer = 0
					if (interval) window.clearInterval(interval)
				}
			}, timerAdd)
		} else {
			audioPlaying = false
			audioElement.currentTime = 0
			audioElement.pause()

			if (interval) window.clearInterval(interval)
		}
	}

	const setWord = (w) => {
		words = w

		window.setTimeout(() => {
			const element = document.getElementById(`ayah-${counter}-${words-1}`)
			if (element) {
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'center',
				});
			}
		}, 100)
	}

	const increaseWords = () => {
		if (words < data.ayah[counter].arabic.length) {
			words++
		} else {
			nextAyah()
		}

		window.setTimeout(() => {
			const element = document.getElementById(`ayah-${counter}-${words-1}`)
			if (element) {
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'center',
				});
			}
		}, 100)
	}

	const decreaseWords = () => {
		if (words > minWords) {
			words--
		}

		window.setTimeout(() => {
			const element = document.getElementById(`ayah-${counter}-${words}`)
			if (element) {
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'center',
				});
			}
		}, 100)
	}

	const nextAyah = () => {
		words = minWords

		if (counter < data.surah.numAyahs) {
			counter++

			audioElement.load()
			if (audioPlaying) {
				audioPlaying = false
				playAudio()
			}
		} else {
			window.location.href = `/${parseInt(data.params.surah)+1}`
		}

		window.setTimeout(() => {
			const element = document.getElementById(`ayah-${counter}`)
			if (element) {
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'center',
				})
			}
		}, 100)
	}

	const previousAyah = () => {
		words = minWords

		if (counter > 1) {
			counter--

			audioElement.load()
			if (audioPlaying) {
				audioElement.play()
			}
		}

		window.setTimeout(() => {
			const element = document.getElementById(`ayah-${counter}`)
			if (element) {
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'center',
				})
			}
		}, 100)
	}
</script>

<div class="max-w-lg mx-auto fixed z-30 top-0 left-0 right-0 p-4 flex flex-row justify-between items-center text-neutral-800 bg-white border-b-4 border-green-500">
	<div class="flex flex-row items-center gap-4">
		<a href="/">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
			</svg>
		</a>

		<div class="text-xl font-bold">
			{data.params.surah}. {data.surah.nameEn} ({data.surah.numAyahs} ayat)
		</div>
	</div>
	<div class="text-xl">
		
	</div>
</div>

<div class="pt-24 pb-28 min-h-screen flex flex-col gap-4 p-4">
	{#each Object.entries(data.ayah) as [index, ayah]}
		<a id={`ayah-${index}`} href={`/${data.params.surah}/${index}`} class="relative bg-white px-4 py-2 flex flex-col gap-0">
			<div class="absolute text-xs w-8 h-8 bg-green-500 left-0 top-0 flex items-center justify-center text-white">
				{index}
			</div>
			<div class={`self-end flex flex-wrap flex-row-reverse gap-2 font-bold text-5xl pl-4 py-3 text-right leading-loose ${parseInt(index) === counter ? 'text-neutral-800' : 'text-neutral-300'}`}>
				{#each ayah.arabic as word, idx}
					<div id={`ayah-${index}-${idx}`} class={`${(parseInt(index) === counter && idx < words) || (parseInt(index) !== counter && idx < minWords) ? 'flex flex-col items-center' : 'hidden'}`}>
						{ayah.arabic[idx]}
						<div class="text-sm">
							{ayah.latin[idx]}
						</div>
					</div>
				{/each}
				<div>
					{(parseInt(index) === counter && ayah.arabic.length > words) || (parseInt(index) !== counter && ayah.arabic.length > minWords) ? '...' : ''}
				</div>
			</div>
		</a>
	{/each}
</div>

<div class="max-w-lg mx-auto fixed z-30 bottom-0 left-0 right-0 h-20 bg-white flex flex-row justify-between items-center gap-2 px-3 border-t-4 border-green-500">
	<div on:click={previousAyah} class={`cursor-pointer p-2 ${counter > 1 ? 'text-neutral-900' : 'text-neutral-400'}`}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
			<path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
		</svg>
	</div>
	<div on:click={decreaseWords} class={`cursor-pointer p-2 ${words > minWords ? 'text-neutral-900' : 'text-neutral-400'}`}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>
	</div>
	<div class="w-20 h-20 relative">
		<div on:click={playAudio} class={`cursor-pointer absolute w-full h-full flex items-center justify-center rounded-full -top-8 text-white ${audioPlaying ? 'bg-red-500' : 'bg-green-500' }`}>
			{#if audioPlaying}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
				  <path fill-rule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clip-rule="evenodd" />
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
				</svg>
			{/if}
		</div>
	</div>
	<div on:click={increaseWords} class="cursor-pointer p-2 text-neutral-900">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	</div>
	<div on:click={nextAyah} class="cursor-pointer p-2 text-neutral-900">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
			<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
		</svg>
	</div>
</div>

<audio bind:this={audioElement} on:loadeddata={() => timer = 0} on:ended={nextAyah}>
  <source src={`/audio/${audioName}.mp3`} type="audio/mpeg">
</audio>