mongo experiment < calculate-scores.js
mongo experiment < create-clean-table.js

mongoexport --host=127.0.0.1 --port=27017 -d experiment -c clean --type=csv -o clean.csv -f name,SCORE,SCORENOWHITE,SCORENOORDER,SCORENOORDERWHITE,CHARACTERS,SINCE,EXPERIENCE,EDUCATION,LASTWEEK