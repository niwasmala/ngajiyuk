const fix = async (fileName) => {
	let data = JSON.parse(await Deno.readTextFile(`./words/${fileName}.json`))

	Object.keys(data).forEach(index => {
		data[index].marker = [];
	});
	
	/*let latin = JSON.parse(await Deno.readTextFile(`./latin/${fileName}.json`))

	Object.keys(data).forEach(index => {
		data[index].latin = latin[index].transliteration;
		data[index].translation = latin[index].translation;
	});*/

	await Deno.writeTextFile(`./words/${fileName}.json`, JSON.stringify(data));

	console.log(`File ${fileName}.json fixed!`);
}

for (let i = 1; i <= 114; i++) {
	fix(i);
}
// fix(1);