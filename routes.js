const express = require("express")
const validate = require("./validate")
const router = express.Router()
const api = require("./api")


router.get("/:region/:summonerName/rank/:queue", async (req, res) => {
	if (!validate.regions(req.params.region)) {
		res.send("INVALID REGION")
		return
	}

	if (!validate.rankQueues(req.params.queue)) {
		res.send("INVALID RANKED QUEUE")
		return
	}

	const encryptedId = await validate.summoner(req.params.summonerName)
		.catch(e => {
			res.send(e)
		})

	const showSeries = req.query.series == 1 || false
	const showLP = req.query.showlp == 1 || false

	res.send(`NO INVALID STUFF. WILL SHOW SERIES? ${showSeries}. WILL SHOW LP? ${showLP}`)
})

module.exports = router