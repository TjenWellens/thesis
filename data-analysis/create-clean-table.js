db.clean.drop();
db.bcp.aggregate([{$match: {"questions.since": {$gte: 0},"questions.experience": {$gte: 0},"questions.education": {$gte: 0},"questions.lastweek": {$gte: 0}}},{$group: {_id: "$user.id",SCORE: { $first: "$scores.exact" },SCORENOWHITE: { $first: "$scores.ignoreWhitespace" },SCORENOORDER: { $first: "$scores.ignoreOrder" },SCORENOORDERWHITE: { $first: "$scores.ignoreOrderWhitespace" },CHARACTERS: { $first: "$nonWhiteCharacters" },SINCE: { $first: "$questions.since" },EXPERIENCE: { $first: "$questions.experience" },EDUCATION: { $first: "$questions.education" },LASTWEEK: { $first: "$questions.lastweek" },name:{$first: "$user.name"}}},{$out:"clean"}]);

print('original participants: ' + db.bcp.count());
print('clean participants: ' + db.clean.count());