## Deployment

### Creating an AWS Account

  - [Step by step guide](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)

### Create IAM Roles

  - [Follow steps 3-4](https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-provision-user.html)

### Create and Launch an EC2 Instance

  - Choose *Amazon Linux 2 AMI (HVM) - Kernel 5.10, SSD Volume Type* as your machine image
  - Choose *t2.micro* (Free tier eligible) for instance type
  - Under Configure Instance Details, select the previously created IAM Role.
  - Under Configure Security Group, Allow incoming access to:
 
| Type         | Port Range | Description.                                |
| ------------ | :--------: | ------------------------------------------: |
| SSH          | 22         |  Port for SSH into server                   |
| HTTP         | 80         |  Port for HTTP requests to web server       |
| HTTPS        | 443        |  Port for HTTPS requests to web server      |
| Custom TCP   | 5000       |  Port for API                               |

  - Finally, launch the instance and create a new key pair and store it in a secure and accessible location. (This will generate a .pem key which is used for SSH)

### Install Packages in EC2 Instance

  - Locate your EC2 Instance under Instances on the EC2 page.
  - Locate your Public IPv4 DNS, and SSH into it using your .pem key (ssh -i "file.pem" ec2-user@xxxxxxxx.compute-1.amazonaws.com

After ssh, run the following commands:

Update package management tool

```bash
  $ sudo yum update
```

Install CodeDeploy Agent ([locate your region first](https://docs.aws.amazon.com/codedeploy/latest/userguide/resource-kit.html))

```bash
  $ sudo yum install -y ruby
  $ sudo yum install wget
  $ wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
  $ chmod +x ./install
  $ sudo ./install auto
  $ sudo systemctl start codedeploy-agent
```

Install nginx

```bash
  $ sudo yum install nginx
```

Install Nodejs

```bash
  $ sudo yum install nodejs
```

Install dotnet environment

run the following commands to add the Microsoft package signing key to your list of trusted keys and add the Microsoft package repository.

```bash
  $ sudo rpm -Uvh https://packages.microsoft.com/config/centos/7/packages-microsoft-prod.rpm
```

To install the .NET SDK, run the following command:

```bash
  $ sudo yum install dotnet-sdk-6.0
```

Install pm2

```bash
  $ sudo npm install -g pm2
```

Add Nginx conf file

```bash
  $ sudo nano /etc/nginx/conf.d/react.conf
```

Then copy paste nginx/react.conf contents onto the editor. Press Esc and type :wq to save and exit.

### Configure CodeDeploy

  - [Create an application](https://docs.aws.amazon.com/codedeploy/latest/userguide/applications-create-in-place.html)
  - [Create a deployment group](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-groups-create-in-place.html)
  - For the environment configuration, choose *Amazon EC2 instances*, and choose the tag for your EC2 instance.
  - Create and add **appspec.yml** to github repo to manage deployment

### Create an Application Load Balancer

  - [Step by step guide](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-application-load-balancer.html)

### Configure CodePipeline
  
  - Create new pipeline and select new service role
  - Select *Github (Version 2)* for source provider and add the github repository.
  - Choose *Start the pipeline on source code change* for Change detection options.
  - Choose CodePipeline default for Output artifact format.
  - Choose *AWS CodeBuild* for Build provider
      - Create a new build project
      - Choose *Managed image* for Environment image and *Amazon Linux 2* for Operating System.
      - Select *Standard* Runtime and *aws/codebuild/amazonlinux2-x86_64-standard:3.0* for image.
      - Choose *aws/codebuild/amazonlinux2-x86_64-standard:3.0-21.10.15* for image version and *Linux* for Environment type.
      - Select *New service role* for Service role.
      - Create and add **buildspec.yml** to github repo and put its path for the Build specifications name.
      - Continue to CodePipeline
  - For Deploy provider, select *AWS CodeDeploy* and choose the previously created application and deployment group.
