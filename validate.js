const regionsData = require("./json/regions.json")
const rankqueuesData = require("./json/rankqueues.json")

const regions = region => {
	for (let i = 0; i < regionsData.length; i++) {
		if (regionsData[i] === region.toLowerCase()) return true
	}
	return false
}

const rankQueues = queue => {
	for (let i = 0; i < rankqueuesData.length; i++) {
		if (rankqueuesData[i] === queue.toLowerCase()) return true
	}
	return false
}

// Will return encrypted summoner ID on success
const summoner = name => {
	return new Promise((resolve, reject) => {
		// TODO API Stuff
		let encryptedId = "supercoole encrypted id"
		if (true) resolve(encryptedId)
		reject(`NO SUMMONER WITH NAME ${name} FOUND`)
	})
}

module.exports = {
	regions,
	rankQueues,
	summoner
}