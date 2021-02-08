# digital_trons

i have used aws as a framework and Mongodb as a database.

Postman for checking endpoints.

fs and fs-extra for managing folders/files.

1.Install via npm: npm install -g serverless

2.Install aws-serverless framework: sls create -t aws-nodejs

3.In serverless.yml first created necessary lambda functions.

4.In handler.js first created 'create' function, method 'post' for creating new folders/files, while creating new folder/file, n notification will be sented to other users.

5.Delete method for deleting folders/files

6.Get method for finding one folder/file.

7.Put method for moving folders/files from one to another.

8.To test locally added plugins:serverless-offline and httpport:4000 in serverless.yml.

9.Finally to run locally use command 'serverless offline start'.
