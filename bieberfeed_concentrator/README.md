

BieberFeed, a tool for displaying a streaming list of Tweets posted about Justin Bieber. Every second, there are nearly 50 new Tweets published about Justin Bieber. It can be quite harrowing to keep track of all of them on Twitter itself, so my goal is to find a way to separate the proverbial wheat from the chaff. 

My works mainly include three parts:
------
* Configured AJAX to periodically querying an AWS server which fetches the 26 most recent Tweets about Justin Bieber
* Based on Twitter API for Tweets, extracted some other fields of tweets beside the text and filtered out duplicate tweets (according to "id_str" variable of "user" field)
* Built a well-designed web page using Bootstrap and made it refreshed every 5 seconds using Jquery

Other point
------
Bootstrap: Bootstrap is used to achieve the fixed-top navigate bar which contains twitter-style navigate tab, a go-to-top button  and a search box. Besides, it's also used to control the layout of the body, and the style of how the tweets shows.

Console: In each refresh, it print the size of array that keeps ids of old tweets and the size of the tweets displayed in the page.

Reference of Tweets API: click [here](https://dev.twitter.com/overview/api/tweets)
Important Note
------
this project uses Ajax that violates the same-origin policy, and as such, it requires a web browser that supports XMLHttpRequest 2 and CORS. This means you **must** be using a semi-recent web browser: Firefox 4+, Chrome 7+, Safari 5+, or IE 10+.

###Copyright@Zhengwei Liu
