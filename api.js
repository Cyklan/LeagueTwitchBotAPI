const fetch = require("node-fetch")
const rankqueuesData = require("./json/rankqueues.json")
const options = {
	headers: {
		"X-Riot-Token": process.env.APIKEY
	}
}

const getEncryptedId = (region, name) => {
	region = region.toLowerCase()
	return new Promise(async (resolve, reject) => {
		await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`, options)
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					throw Error()
				}
			}).then(res => {
				resolve(res.id)
			}).catch(error => { reject(null) })
	})
}

const getAccountId = (region, name) => {
	region = region.toLowerCase()
	return new Promise(async (resolve, reject) => {
		await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`, options)
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					throw Error()
				}
			}).then(res => {
				resolve(res.accountId)
			}).catch(error => { reject(null) })
	})
}

const getCurrentRank = (region, encryptedSummonerId, queue) => {
	region = region.toLowerCase()
	return new Promise(async (resolve, reject) => {
		const rankings = await fetch(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}`, options)
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					throw Error()
				}
			}).catch(error => { reject("You do not have a rank yet.") })
		if (rankings.length === 0) { reject("You do not have a rank yet.") }

		for (let i = 0; i < rankings.length; i++) {
			if (rankings[i].queueType === rankqueuesData[queue]) {
				let tier = rankings[i].tier
				tier = tier.substr(0, 1) + tier.substr(1).toLowerCase()
				let series = ""
				if (rankings[i].miniSeries) series = getPromoProgress(rankings[i].miniSeries.progress)
				resolve({
					tier,
					rank: rankings[i].rank,
					leaguePoints: rankings[i].leaguePoints,
					series
				})
			}
		}
	})
}

const getPromoProgress = progress => {
	progress = progress.split("")
	let s = ""
	for (let i = 0; i < progress.length; i++) {
		if (progress[i] === "L") {
			s += " X"
			continue
		}
		if (progress[i] === "W") {
			s += " ✓"
			continue
		}
		if (progress[i] === "N") {
			s += " -"
			continue
		}
	}
	return s
}

const getGames = (region, encryptedSummonerId) => {
	region = region.toLowerCase()
	const url = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedSummonerId}`
	return new Promise(async (resolve, reject) => {
		await fetch(url, options)
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					throw Error()
				}
			}).then(res => {
				resolve(res.matches)
			}).catch(error => { reject("No recorded matches") })
	})
}

const getGameResult = (region, gameId, summonerName) => {
	region = region.toLowerCase()
	const url = `https://${region}.api.riotgames.com/lol/match/v4/matches/${gameId}`
	return new Promise(async (resolve, reject) => {
		const gameInfo = await fetch(url, options)
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					throw Error()
				}
			}).catch(error => reject("No recorded matches"))

			const player = gameInfo.participantIdentities.find(
			p => p.player.summonerName.toLowerCase() === summonerName.toLowerCase())
		
		const participantId = player.participantId

		const participant = gameInfo.participants.find(p => p.participantId === participantId)

		const teamId = participant.teamId

		const team = gameInfo.teams.find(t => t.teamId === teamId)

		resolve(team.win.toLowerCase())
	})
}

module.exports = {
	getEncryptedId,
	getCurrentRank,
	getGames,
	getGameResult,
	getAccountId
}