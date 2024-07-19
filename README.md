# DT Case

## Project Setup
I created a docker compose to project set up. In the root folder just run

``$ docker compose up --build``

To create admin user for the first time you need to send a post request to backend. I designed the system like this one is dependent to a central system. Post request should be like this. 

Another alternative could be populating the database at the inital phase but I chose this way.

```
POST http://localhost:3001/users

{
  "username": "admin",
  "password": "1234",
  "role": "admin"
}
```

After this request you can create the admin user then you can use the system.

I added the .env files to the repo intentionally for the sake of being easy. I know that .env files are ignored in .gitignore.


There is a video demonstraiton.
https://github.com/user-attachments/assets/e0d2f13f-15df-4049-9376-65a8bcea261a


