const express = require("express")
const validate = require("./validate")
const router = express.Router()
const api = require("./api")


router.get("/:region/:summonerName/rank/:queue", async (req, res) => {
	const { region, queue, summonerName } = req.params

	if (!validate.regions(region)) {
		res.send("INVALID REGION")
		return
	}

	if (!validate.rankQueues(queue)) {
		res.send("INVALID RANKED QUEUE")
		return
	}

	const encryptedId = await validate.summoner(region, summonerName).catch(error => { return error })

	if (!encryptedId) {
		res.send(`SUMMONER ${summonerName} NOT FOUND ON ${region}`)
		return
	}

	const showSeries = req.query.series == 1 || false
	const showLP = req.query.showlp == 1 || false

	const rankInfo = await api.getCurrentRank(region, encryptedId, queue)
		.catch(error => { return error })

	if (typeof rankInfo === "string") {
		res.send(rankInfo)
		return
	}

	let response = `${rankInfo.tier} `
	response += `${rankInfo.rank}`
	if (showLP) {
		response += ` (${rankInfo.leaguePoints}LP)`
	}
	if (showSeries && rankInfo.series !== "") {
		response += ` | Series: ${rankInfo.series}`
	}

	res.send(response)
})

router.get("/:region/:summonerName/streak", async (req, res) => {
	const { region, summonerName } = req.params

	if (!validate.regions(region)) {
		res.send("INVALID REGION")
		return
	}

	const encryptedId = await validate.account(region, summonerName).catch(error => { return error })

	if (!encryptedId) {
		res.send(`SUMMONER ${summonerName} NOT FOUND ON ${region}`)
		return
	}

	const includeLosses = req.query.losses == 1 || false
	let streakType = includeLosses ? "" : "win"
	let lastMatchOutcome = ""
	let streakCount = -1

	const games = await api.getGames(region, encryptedId).catch(error => res.json(error))

	// res.send("test")

	do {
		console.log(streakCount + 1)
		lastMatchOutcome = await api.getGameResult(region, games[streakCount + 1].gameId, summonerName).catch(error => res.json(error))
		if (includeLosses && streakCount < 0) streakType = lastMatchOutcome
		streakCount++

		console.log(streakType, lastMatchOutcome)
	} while (streakType === lastMatchOutcome)

	const isWinStreak = streakType === "win"

	let suffix = isWinStreak ? "win" : "loss"
	if (streakCount !== 1) {
		if (isWinStreak) suffix += "s"
		else suffix += "es"
	}

	res.send(`${streakCount} ${suffix}`)

})

module.exports = router