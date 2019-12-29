const regionsData = require("./json/regions.json")
const rankqueuesData = require("./json/rankqueues.json")
const api = require("./api")

const regions = region => {
	for (let i = 0; i < regionsData.length; i++) {
		if (regionsData[i] === region.toLowerCase()) return true
	}
	return false
}

const rankQueues = queue => {
	if (typeof rankqueuesData[queue] === "string") return true
	return false
}

// Will return encrypted summoner ID on success
const summoner = (region, name) => {
	return new Promise(async (resolve, reject) => {
		// TODO API Stuff
		let encryptedId = await api.getEncryptedId(region, name).catch(error => {
			reject(error)
		})
		resolve(encryptedId)
	})
}

const account = (region, name) => {
	return new Promise(async (resolve, reject) => {
		let accountId = await api.getAccountId(region, name).catch(error => {
			reject(error)
		})
		resolve(accountId)
	})
}

module.exports = {
	regions,
	rankQueues,
	summoner,
	account
}