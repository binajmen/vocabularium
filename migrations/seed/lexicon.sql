insert into lexicon ("id", "type", "userId")
select id, 'noun' as "type", 'benjamin' as "userId"
from nouns;

insert into lexicon ("id", "type", "userId")
select id, 'verb' as "type", 'benjamin' as "userId"
from verbs;

insert into lexicon ("id", "type", "userId")
select id, 'other' as "type", 'benjamin' as "userId"
from others;
