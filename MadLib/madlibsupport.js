/********************************************************************************/
/*										*/
/*	Initial set of madlibs.  Please add your own.				*/
/*										*/
/********************************************************************************/

var madlibs = [
  {
    title : "More Lights!",
    author : "unknown",
    content : 'Did you ever have one of those [nouns] ? Well today [person] did! Mom ' +
		 'wanted to [verb] [nouns] up for [holiday] . Not just any lights, ' +
		 '[color] lights. [Adjective] [color] lights! [Adjective] bright red ' +
		 'lights. The only problem, they are a [verb/ed] mess! Not to mention ' +
		 'that there are some [vegetable], yellow and green lights [verb/ed] ' +
		 'in. " [person] !" I yell! This can\'t be done! She could [verb] I was ' +
		 'right and went out and [verb] some new shiny [color] lights!'
  },
  {
   title: 'Christmas Tree',
   author: 'unknown',
   content: 'Every [month] we [verb] to a tree [place] far away. not just any ' +
	  '[adjective] farm, a [adjective] tree [place] . My dad and I [verb] ' +
	  'onto the [noun] to [verb] for the perfect [noun]. Some people live ' +
	  '[adjective] and [adjective] and some like them [color] and fat. We ' +
	  'are searching for a tall and [adjective] one! "Over there!" I ' +
	  'exclaim, "Dad it\'s over there!" Off we [verb], saw in hand to [verb] ' +
	  'this year\'s [noun] down. [Exclamation] it\'s [holiday] finally!'
   },
  {
     title: 'Turkey Dinner!',
     author: 'unknown',
     content: 'I spent last summer on my grandfather\'s [adjective] farm. He raises ' +
	    '[noun/s] for local food [noun/s] . He also grows corn on the [noun], ' +
	    '[adjective] lettuce and lima [noun/s] . My favorite place to [verb] ' +
	    'on the farm is the [adjective] house where grandfather keeps his ' +
	    '[noun/s] . But when I visit in November, there are no [noun/s] ! They ' +
	    'are all gone! I ansxiously await at the table that Thanksgiving. I ' +
	    'see corn on the [noun] and eve the lime [noun/s] . I am relieved when ' +
	    'grandma brings out a [noun] for Thanksgiving dinner!'
   },
  {
     title: 'Pizza Pizza',
     author: 'unknown',
     content: 'Pizza was invented by a [adjective] [nationality] chef named [person] . ' +
	    'To make a pizza, you need to take a lump of [noun] , and make a thin, ' +
	    'round [adjective] [noun] . Then you cover it with [adjective] sauce, ' +
	    '[adjective] chees, and fresh chopped [noun/s] . Next you have to bake ' +
	    'it in a very hot [noun] . When it is done, cut it into [number] [shapes] . ' +
	    'Some kids like [food] pizza the best, but my favorite is the [food] pizza. ' +
	    'If I could, I would eat pizza [number] times a day!'
   },
	{
     title: 'Jack and Jill ad-Lib',
     author: 'unknown',
     content: 'Jack and Jill went up the [NOUN], To [VERB] a pail of [LIQUID]; Jack [VERB] down, and broke his [VERB/ed], And Jill came [NOUN] after. Then up Jack got and off did [VERB/ed], As [VERB] as he could caper, To old Dame Dob, who patched his [ADJECTIVE] With [NOUN] and [ADJECTIVE] paper.'
   },
	{
     title: 'Going to the Mall ad-Lib',
     author: 'unknown',
     content: 'Yesterday, me and [NUMBER] of my friends took a trip to the mall. While we were there we saw this really [ADJECTIVE] store called [NAME]`s Pets. We saw [ANIMAL/s] and [NOUN/s] [VERB/ING] in the store display. So we had to go inside. They had miniture [NOUN/s] and [ADJECTIVE] little bunnies. We even got to play with the [ADJECTIVE] [NOUN] in the [LOCATION]. I want a/an [NOUN] so much!'
   },
	{
     title: 'Superman ad-Lib',
     author: 'unknown',
     content: 'A rather [ADJECTIVE] thing has just occurred in the life of nerdy high [NOUN] student Peter Parker; after being bitten by a radioactive [ANIMAL], his body chemistry is [ADVERB] altered in that he can [VERB] walls and ceilings, and he develops a "[ANIMAL]-sense" that warns him of [VERB/ING] danger. Adopting the name "ANIMAL-Man", Peter first uses his newfound [NOUN/s] to make money, but after his uncle is [VERB/ED] at the hands of a [OCCUPATION] Peter failed to [VERB], he swears to use his [NOUN/s] to fight the evil that [VERB/ED] his uncle. At the same time, [OCCUPATION] and [OCCUPATION] Norman Osborn, after exposure to an [ADJECTIVE] nerve [NOUN], develops an alternate personality himself; the super-strong, psychotic Green [CREATURE]! Peter Parker must now juggle three things in his life; his new job at the local newspaper under a perpetually on-edge [NOUN], his battle against the evil Green [CREATURE], and his fight to win the affections of [ADJECTIVE] classmate Mary Jane Watson, against none other than his best [NOUN] Harry Osborn, son of Norman Osborn! Is this challenge too much for even the amazing [ANIMAL]-Man to handle?	'
   },{
	   title:'Baseball?',
	   content:'[NOUN] ball is a very exciting sport. Whether you are [VERB/Ing] the ball with a [NOUN], or you are the [OCCUPATION] and striking out [NUMBER] batters in a row, you`ll be having fun. You can also be the catcher, standing at [LOCATION] plate, ready to [VERB] the next person as he tries to make it [LOCATION]. But the best part of it is when someone hits a [ADJECTIVE] slam when all the [NOUN/S] are loaded during the last [NOUN] to win the game. '
   }
]



/********************************************************************************/
/*										*/
/*	Functions to get items from a madlib and do replace			*/
/*										*/
/********************************************************************************/

function getItems(mad)
{
   var rslt = [ ];
   mad.replace(/\[([^\])]*)\]/g,function (mat,p1,off,str) {
		  rslt.push(p1) } );
   return rslt;
}


function replaceItems(mad,items)
{
   var i = 0;
   var r = mad.replace(/\[([^\])]*)\]/g,function (mat,p1,off,str) {
      return items[i++]; }  );
   return r;
}



/********************************************************************************/
/*										*/
/*	Test code								*/
/*										*/
/********************************************************************************/

var testwords = [ 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 ];
var testitem = madlibs[0].original;
var r1 = getItems(testitem);
var r2 = replaceItems(testitem,testwords);
