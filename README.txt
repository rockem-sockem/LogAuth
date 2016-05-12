***Sign Up
-No duplicate users allowed
-No empty fields(username or password)
!!!No extra validation for username or password eg, password of lenght 4

***Login
-Logins if username and password are in database and matches
-Creates a session (collection: mySession) with username and role
	Expires in 14 days(default) if not relogged
-Login form disappears when logged and displays username with logout button


***Tabs
-Shows up accordingly to the role
-If no role, just show to home page
-url page restriction
	eg. /content is restricted to users

