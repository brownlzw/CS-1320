Chatroom
======
> Remember the early 2000s when chatting with buddies on AIM was all the rage? Now, communicating with people over any website is almost always a given. This project realizes virtual communication and RESTful web services by building a basic chatroom.

Designs
-----
The Chatroom has two kind of pages, some of the features are shown as follows:
+ Homepage has a table which shows five most chatroom recognized by their name. Besides, I also add the a column to show the **interval** between the rooms' last active time and now. And below the table there's a create new room button which you can click to create a new chatroom
+ Room page has a **navigation bar** fixed on the top. Below the navigation bar the main section has two parts: the left part is a **side bar** to show the member of this room; The right part is chat area, where you can see all the messages sent in this room and send messages yourself.

Features
------
+ Navigation bar
  - The back to home button is the left side
  - Room name is shown in the middle
  - On the right side, a welcome message along with your nickname, which can be changed easily by just clicking the nickname, inputing your new nickname, and **clicking any other place** in the page to commit the change
+ Sidebar
  - A count of total active member in this room
  - A green/red button which can click to actively change your state(online/away)
  - An connected member list, arranged by their most recent **active time** (active time will updated when a user join this room, change his/her nickname and send a message).
  - The **last action and its time** of each active member. A typical action is a either a 'join this room'(or 'change nickname') or the first 24 letters of the most recent message.
  - The idle state of of each connected member.
+ Chat area
  - All the message sent in this room, each with the header, nickname and send time on the top and message body wrapped by the round box below.
  - **Different style** for the message sent by yourself(green, align right) and those send by others(cyan, align right)
  - Grey, italic style '**notice**' message send by the server whenever a user join, leave, change nickname. What's more magic and appealing is the 'typing' notice and 'away/come back' notice
+ Send area
  - You can send message using either the send button or just press enter/return key.

Highlights
-----
+ Using **socket id** instead of nickname to distinguish different user, so that different user with the same name can be correctly recognized in the member list and chat area.
+ **Live type notification**(_"??? is typing..."_). When a user type something, this notification will remain for one more second after the typing stopped and then disappeared. Upon typing again, the notice will appear again. Again, due to the socket id strategy， even if two users with same nickname typing simultaneously， it will correctly show two notices.
+ Implemented a complicated **idle time detect** mechanism. The **active state button** has the **highest priority**: when it's red(means the user clicks the button initiatively and wants to tell others he/she is away), all the other actions won't change the state. Apart from this case, a user will be recognized as away if he/she switch windows/tabs or with no mouse move/key press for 30s(this time can be changed according to the demand), and as back if he/she switch back to this page or move the mouse/press a key. Whenever a user is recognized as away or comeback, the server will **emit a notice** to other users in this room, and the button on the right side of his/her entry in the member list will **change color** accordingly.
+ Always make the chat area **slide to bottom**.

Instructions
----
1. download the zip file
2. cd to the download directory and in the terminal type
`npm start`
3. Go to you browser and open `localhost:8080`

My works
-----
* Built a server and managed routes using Node.js and Express.js, and parsed post requests data from client side using body-parser package
* Used Socket.io to handle different events(join/leave/change nickname/typing/stop typing/away/come back etc.), and to implement the communication between the client side and the server.
* Implemented a templating engine to process some HTMLs written by Mustache, a templating language, and adapt the templating engines so that they work directly with Express via the consolidate library and Hogan, Twitter's node implementation of Mustache
* Created and maintained a database that stores information of messages( room, nickname, message, time etc.) through any-db module with SQLite3, and updated the content of web pages by SQL queries

####Note: All the npm package is saved in the package.json file
