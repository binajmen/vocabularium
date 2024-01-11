insert into lexicon ("id", "type")
select id, 'noun' as "type"
from nouns;

insert into lexicon ("id", "type")
select id, 'verb' as "type"
from verbs;

insert into lexicon ("id", "type")
select id, 'other' as "type"
from others;
