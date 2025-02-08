"redis-server" - make sure to start redis server 
"redis-cli" - to check redis address
"ping" - to check if its running, if so, will display "pong"


backend
"go run main.go" - to start backend

frontend
"npm run dev" - to start frontend



git - signing up new user and login into the userprofile; working fine before settingup the editing information.



*****The error on changing email address and and error fetching user data again is that the token is based on the email and if we change the email the old token will not work.

-to fix it

 when user changes email address it will be logged out and login again...

OR

change the token based on the email address to user_id...