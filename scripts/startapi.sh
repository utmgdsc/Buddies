#!/bin/bash
cd /home/ec2-user/dotnetapi
pm2 start "dotnet Buddies.API.dll --urls=http://0.0.0.0:5000" --name "dotnet-api"