# node-firebird-libfbclient 

## crash-on-connection-lost

- 	Setup your environment variables to connect to your database:
	FB_PASSWORD, FB_USER, FB_DB

-   Ensure that your database has a table with a column CLI_ID

-   Run the app `node index.js`

-   Restart firebird 

-   Open http://localhost:8080/

	A fatal error was thrown because the initial connection created when we first started our app was lost and the app
	was not aware of that.

	To handle the fatal errors I imported the uber plugin.
	
	I did set abortOnUncaught to false.

	This will keep the app alive even if it runs into a Fatal crash.
	
	Since running tx.query(….) will generate a `While query - Error reading data from the connection.`.
	
	I intercepted the error In a try catch and I reconnect to the database;

	This is only a sample to show how this can impact into your apps and how you can workaround it by using the 
	`uncaughtException` which is not recommended but at this moment is the only way.
	


