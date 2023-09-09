const fixFile = async (fileName) => {
	let data = JSON.parse(await Deno.readTextFile(`./${fileName}.json`))

	Object.keys(data).forEach(index => {
		/*if (data[index].total_words) {
			delete data[index].total_words;
			data[index].words.splice(data[index].words.length-1);
		}*/

		/*data[index].words.forEach((word, id) => {
			if (word === "") {
				data[index].words.splice(id, 1);
			}
		});*/

		/*data[index].words.forEach((word, id) => {
			if (!word.arabic) {
				data[index].words[id] = {
					arabic: word,
					transliteration: '',
					translation: '',
				};
			}
		})*/

		data[index] = data[index].words;
	});

	await Deno.writeTextFile(`./${fileName}.json`, JSON.stringify(data));

	console.log(`File ${fileName}.json fixed!`);
}

for (let i = 1; i <= 114; i++) {
	fixFile(i);
}