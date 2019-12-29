# LeagueTwitchBotAPI

Easily add League of Legends related commands to streaming bots.

This API will return cleartext so that you can simply implement it into any bot that can fetch from URLs.

`http://api.foo.bar/euw1/cyklan/rank/soloq?withSeries=1` would return "Platinum 1 | Series: ✔ ❌ -".

## API Documentation

### General

All calls to the API use the GET method. Using anything else won't work.
All API URLs have the same pattern.

`URL/REGION/SUMMONERNAME/COMMAND?SETTING=SETTINGVALUE&SETTING2=SETTING2VALUE`

Replace SUMMONERNAME with your summoner name.

Replace REGION with one of these regions:

- RU
- KR
- BR1
- OC1
- JP1
- NA1
- EUN1
- EUW1
- TR1
- LA1
- LA2

Settings may be omitted. For default values see the exact command. Some commands have sub-areas, e.g. the rank command.

`URL/REGION/SUMMONERNAME/rank/QUEUE`. Queue will return the rank for one of the three available queue types.

### Commands

#### rank

`URL/REGION/SUMMONERNAME/rank/QUEUE?SETTING=SETTINGVALUE`

Replace QUEUE with one of these queues:

- solo
- flexsr
- flextt

##### Settings

###### series

Will display your series games if available. Possible values are **1** and **0**. **1** will enable this option. **0** Will disable this option. If omitted, the setting will default to 0.

###### showlp

Will display your League Points. Possible values are **1** and **0**. **1** will enable this option. **0** Will disable this option. If omitted, the setting will default to 0.

##### Example

`http://api.foo.bar/euw1/cyklan/rank/solo?series=1&showlp=1`

This will return "Platinum 1 (69 LP) | Series: ✔ ❌ -".

#### streak

`URL/REGION/SUMMONERNAME/streak?SETTING=SETTINGVALUE`

##### Settings

###### losses

Will include loss streaks in streak calculation. Possible values are **1** and **0**. **1** will enable this option. **0** will disable this option. If omitted, the setting will default to 0.

###### Example

`http://api.foo.bar/euw1/cyklan/streak?losses=1`

This will return "7 losses".
