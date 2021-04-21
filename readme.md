### Working page:  
Front: https://lisnyk-m-btrack.netlify.app/  
Back: https://lisnyk-m-btrack.herokuapp.com/  

### Endpoints:  
POST: /auth/register  body: {name, email, password}   
POST: /auth/login  body: {email, password}
POST: /auth/logout  Authorization: "Bearer token"  
GET /auth/verify/:verificationToken   

GET /entries/:date Authorization: "Bearer token"   
PUT /entries/position/:date  Authorization: "Bearer token"   
POST /entries Authorization: "Bearer token"   
DELETE /entries/:date   Authorization: "Bearer token"   



