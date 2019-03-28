Go to C:\Program Files\MongoDB\Server\4.0\bin
Run mongo.exe
And run the below command
db.adminCommand( { setParameter: 1, failIndexKeyTooLong: false } )
This needs to be run for handling the below error I was getting while inserting exams details (ExamsDAO.js).
wiredtigerindex::insert: key too large to index
