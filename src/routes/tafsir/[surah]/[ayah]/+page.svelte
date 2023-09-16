<script>
	import { onMount } from "svelte"
	import Fuse from "fuse.js"

	export let data

	let tafsir = 'tafsir-ringkas-kemenag'

	let mode = data.params.mode ?? 'learn' // learn || test

	let ayah = parseInt(data.params.ayah)
	let counter = mode === 'test' ? 0 : 1

	let audioName
	let audioElement
	let audioPlaying = false
	let audioRecording = false

	$: audioName = ("000" + data.params.surah).slice(-3) + ("000" + data.params.ayah).slice(-3)

	let interval, timer = 0, timerAdd = 100

	let debugTimer = data.params.debugTimer ?? false
	let stopwatch = [0]
	const addStopwatch = () => {
		stopwatch.push(timer)
		console.log(JSON.stringify(stopwatch))
	}

	const playAudio = () => {
		if (!audioPlaying) {
			setCounter(1)
			audioElement.play()
			audioPlaying = true

			const marker = data.ayah.marker;
			if (marker.length > 0) {
				timer = 0
				interval = window.setInterval(() => {
					let lastMarker
					marker.forEach((m, i) => {
						if (timer >= m) {
							lastMarker = i
						}
					})

					setCounter(lastMarker+1)
					timer += timerAdd

					if (lastMarker >= marker.length) {
						timer = 0
						if (interval) window.clearInterval(interval)
					}
				}, timerAdd)
			}
		} else {
			if (debugTimer) {
				addStopwatch()
			} else {
				audioPlaying = false
				audioElement.currentTime = 0
				audioElement.pause()

				if (interval) window.clearInterval(interval)
			}
		}
	}

	let recognition, 
			speechTimeout = undefined,
			transcripts = [],
			lastTranscript = '', 
			wordsCorrect = data.ayah.arabic.map(i => false)

	const removeDiacritics = (text) => {
	  return text.replace(/[\u064B-\u065F\u0670\u0674\u06D4\u06D5-\u06ED]/g, '');
	}

	onMount(() => {
		if ('webkitSpeechRecognition' in window) {
			recognition = new webkitSpeechRecognition()
			recognition.lang = 'ar-SA'
			recognition.continuous = true
			recognition.interimResults = true
			recognition.maxAlternatives = 1

			recognition.onstart = () => {
				speechTimeout = undefined
				transcripts = []
      };

			recognition.onresult = (event) => {
				const transcript = event.results[event.results.length-1][0].transcript

				if (transcript) {
					lastTranscript = transcript

					if (speechTimeout !== undefined) {
						window.clearTimeout(speechTimeout)
						speechTimeout = undefined
					}

					speechTimeout = window.setTimeout(() => {
						transcripts = lastTranscript.split(' ')

						for (let i = 0; i < transcripts.length; i++) {
							const normalizedWord = removeDiacritics(data.ayah.arabic[counter].trim())
							const normalizedTranscript = removeDiacritics(transcripts[i].trim())

							const fuse = new Fuse([normalizedTranscript], {
						    includeScore: true,
						    ignoreLocation: true,
						  })
						  const result = fuse.search(normalizedWord)

							if (normalizedWord === normalizedTranscript || (result.length > 0 && result[0].score > 0.2)) {
								wordsCorrect[counter] = true
							} else {
								wordsCorrect[counter] = false
							}
							increaseCounter()
						}
					}, 1000)
				}
		  }

		  recognition.onend = () => {
		  	if (audioRecording) {
		  		recognition.start()
		  	}
		  }
		}
	})

	const recordAudio = () => {
		if (!audioRecording) {
			if (recognition) {
				audioRecording = true
				recognition.start()
			} else {
				alert('Speech recognition not supported')
			}
		} else {
			if (recognition) {
				audioRecording = false
				transcripts = []
				lastTranscript = ''
				recognition.stop()
			} else {
				alert('Speech recognition not supported')
			}
		}
	}

	const setCounter = (c) => {
		counter = c

		data.wordsDisplayed = data.wordsDisplayed.map((item, index) => {
			return index < counter ? true : false;
		})

		const element = document.getElementById(`word-${counter}`)
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			});
		}
	}

	const increaseCounter = () => {
		if (counter < data.ayah.arabic.length) {
			setCounter(counter+1)
		} else {
			nextAyah()
		}
	}

	const decreaseCounter = () => {
		if ((mode === 'learn' && counter > 1) || (mode === 'test' && counter > 0)) {
			setCounter(counter-1)
		} else {
			previousAyah()
		}
	}

	const nextAyah = () => {
		if (parseInt(data.params.ayah) < data.surah.numAyahs) {
			window.setTimeout(() => {
				window.location.href = `/tafsir/${data.params.surah}/${parseInt(data.params.ayah)+1}?mode=${mode}`
			}, mode === 'test' ? 1500 : 0)
		}
	}

	const previousAyah = () => {		
		if (parseInt(data.params.ayah) > 1) {
			window.location.href = `/tafsir/${data.params.surah}/${parseInt(data.params.ayah)-1}?mode=${mode}`
		}
	}

	const onAudioEnded = () => { 
		audioPlaying = false
		timer = 0
		if (interval) window.clearInterval(interval)
		if (debugTimer) alert(JSON.stringify(stopwatch))
	}

	const changeMode = () => {
		if (mode === 'learn') {
			mode = 'test'
			setCounter(0)
			wordsCorrect = data.ayah.arabic.map(i => false)
		} else {
			mode = 'learn'
			setCounter(1)
		}
	}
</script>

<div class="max-w-lg mx-auto fixed z-30 top-0 left-0 right-0 p-2 flex flex-row justify-between items-center text-neutral-800 bg-white border-b-4 border-green-500">
	<div class="flex flex-row items-center gap-4">
		<a href={`/tafsir/${data.params.surah}`} class="py-2">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
			  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
			</svg>
		</a>

		<div class="text-xl font-bold">
			{data.params.surah}. {data.surah.nameEn}

			<select bind:value={ayah} on:change={() => window.location.href = `/tafsir/${data.params.surah}/${ayah}`} class="bg-white ml-2 py-2">
				<option></option>
				{#each [...Array(data.surah.numAyahs).keys()] as num}
					<option value={num+1} >
						Ayat {num+1}
					</option>
				{/each}
			</select>
			
			{#if debugTimer}
				<span>
					{timer}
				</span>
			{/if}
		</div>
	</div>
	<div>
		<!-- <div on:click={changeMode} class={`cursor-pointer w-full h-full flex items-center justify-center rounded-full -top-8 text-neutral-800 p-2`}>
			{#if mode === 'test'}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
				  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
				</svg>
			{/if}
		</div> -->
	</div>
</div>

<div class="pt-24 min-h-screen flex flex-col gap-12 p-4 pb-44">
	<div class="bg-white flex flex-col gap-12 py-6 px-3">
		<div class="flex flex-row-reverse flex-wrap gap-4">
			{#each data.ayah.arabic as word, index}
				<div class={`${data.wordsDisplayed[index] ? 'text-neutral-800' : 'text-neutral-300'}`}>
					<div id={`word-${index+1}`} class="font-bold text-6xl text-right leading-loose">
						{#if mode === 'learn' || (mode === 'test' && data.wordsDisplayed[index])}
							<div class={`${mode === 'test' && !wordsCorrect[index] ? 'text-red-500' : ''}`}>
								{data.ayah.arabic[index]}
								<div class="text-lg text-center">
									{data.ayah.translation[index]}
								</div>
							</div>
						{:else}
							<div class={`border-b-2 ${index === counter ? 'border-green-500' : 'border-neutral-800'}`}>
								<div class="text-white">
									{data.ayah.arabic[index]}
									<div class="text-lg text-center">
										{data.ayah.latin[index]}
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="bg-white flex flex-col gap-12 py-6 px-3">
		<div class="flex flex-row justify-between gap-4">
			<div class="text-2xl font-bold">
				Tafsir
			</div>

			<select bind:value={tafsir} class="text-2xl font-bold px-2">
				<option value="tafsir-ringkas-kemenag">
					Ringkas Kemenag
				</option>
				<option value="tafsir-lengkap-kemenag">
					Lengkap Kemenag
				</option>
				<option value="tafsir-ibnu-katsir">
					Ibnu Katsir
				</option>
				<option value="tafsir-ringkas-al-azhar">
					Ringkas Al-Azhar
				</option>
				<option value="tafsir-jalalin">
					Jalalain
				</option>
				<option value="tafsir-al-baghawi">
					Al-Baghawi
				</option>
				<option value="tafsir-al-munir">
					Al-Munir
				</option>
				<option value="tafsir-al-jazairy">
					Al-Jazairy
				</option>
				<option value="tafsir-as-saadi">
					As-Sa`adi
				</option>
				<option value="tafsir-as-syarawi">
					As-Sya`rawi
				</option>
			</select>
		</div>
		<div class="whitespace-pre-line">
			{data.tafsir[tafsir] ?? 'Belum tersedia.'}
		</div>
	</div>
</div>

{#if audioRecording}
	<div class="max-w-lg mx-auto fixed z-20 bottom-10 left-0 right-0 pb-12">
		<div class="mx-10 bg-green-100 text-neutral-800 p-3 text-3xl"> 
			<div class="text-xs">
				You say:
			</div>
			<div class="flex flex-row-reverse flex-wrap text-right leading-loose">
				{#each transcripts as transcript, index}
					<div class={`${wordsCorrect[index] ? 'text-neutral-800' : 'text-red-500'}`}>
						{transcript}
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

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
		{#if mode === 'test'}
			{#if recognition}
				<div on:click={recordAudio} class={`cursor-pointer absolute w-full h-full flex items-center justify-center rounded-full -top-8 text-white ${audioRecording ? 'bg-red-500' : 'bg-green-500' }`}>
					{#if audioRecording}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
						  <path fill-rule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clip-rule="evenodd" />
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
						  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
						  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
						</svg>
					{/if}
				</div>
			{:else}
				<div class="cursor-pointer absolute w-full h-full flex items-center justify-center rounded-full -top-8 text-white bg-neutral-800">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
					  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
					  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
					</svg>
				</div>
			{/if}
		{:else}
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
		{/if}
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

<audio bind:this={audioElement} on:ended={onAudioEnded}>
  <source src={`/audio/${audioName}.mp3`} type="audio/mpeg">
</audio>