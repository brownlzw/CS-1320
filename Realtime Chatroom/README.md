Chatroom
======
> Remember the early 2000s when chatting with buddies on AIM was all the rage? Now, communicating with people over any website is almost always a given. This project realizes virtual communication and RESTful web services by building a basic chatroom.

Designs and features
-----
The Chatroom has two kind of pages, some of the features are shown as follows:
* Homepage has a table which shows five most chatroom recognized by their name. Besides, I also add the a column to show the **interval** between the rooms' last active time and now. And below the table there's a create new room button which you can click to create a new chatroom
* Room page has a **head** for the room name, a **back to homepage** button and a chatroom body.The left side of the body a **sidebar** for new features that maybe added in the future.On the right side consists of four parts, from top to bottom, they are: a **panel** for settings, a **window** that display all the message ,a **text area** to write message and **buttons** to send message or file.
* Besides the required functions, I make the message in a round style and make the position and background color changed according to whether the message was send by myself or other users. And I make the message window always slide to the bottom when there're new message refreshed.

Instructions
----
1. download the zip file
2. cd to the download directory and in the terminal type
`npm start`
3. Go to you browser and open `localhost:8080`

My works
-----
* Built a server and managed routes using Node.js and Express.js, and parsed post requests data from client side  using body-parser package
* Implemented a templating engine to process some HTMLs written by Mustache, a templating language, and adapt the templating engines so that they work directly with Express via the consolidate library and Hogan, Twitter's node implementation of Mustache
* Created and maintained a database that stores information of messages( room, nickname, message, time etc.) through any-db module with SQLite3, and updated the content of web pages by SQL queries

####Note: All the npm package is saved in the package.json file
