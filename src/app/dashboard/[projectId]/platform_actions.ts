
import {
    Cloud,
    Database,
    Server,
    HardDrive,
    Globe,
    Box,
    Activity,
    GitBranch,
    Github,
    Terminal,
    Layers,
    Code,
    Settings,
    Play,
    StopCircle,
    Trash,
    RefreshCw,
    Upload,
    Download,
    PlaneIcon
} from "lucide-react";

export interface PlatformAction {
    id: string;
    name: string;
    description: string;
    platform: string;
    icon: any;
    defaultData: string; // JSON string representation of required fields
}

export const PLATFORM_ACTIONS: PlatformAction[] = [
    // --- AWS ---
    {
        id: 'aws_ec2_run_instances',
        name: 'Run EC2 Instance',
        description: 'Launches the specified number of instances using an AMI.',
        platform: 'AWS',
        icon: Server,
        defaultData: JSON.stringify({
            ImageId: "ami-xxxxxxxx",
            InstanceType: "t2.micro",
            MinCount: 1,
            MaxCount: 1,
            KeyName: "my-key-pair"
        }, null, 2)
    },
    {
        id: 'aws_ec2_stop_instances',
        name: 'Stop EC2 Instance',
        description: 'Stops an Amazon EBS-backed instance.',
        platform: 'AWS',
        icon: StopCircle,
        defaultData: JSON.stringify({
            InstanceIds: ["i-1234567890abcdef0"],
            Force: false
        }, null, 2)
    },
    {
        id: 'aws_ec2_start_instances',
        name: 'Start EC2 Instance',
        description: 'Starts an Amazon EBS-backed instance that you\'ve previously stopped.',
        platform: 'AWS',
        icon: Play,
        defaultData: JSON.stringify({
            InstanceIds: ["i-1234567890abcdef0"]
        }, null, 2)
    },
    {
        id: 'aws_s3_create_bucket',
        name: 'Create S3 Bucket',
        description: 'Creates a new S3 bucket.',
        platform: 'AWS',
        icon: HardDrive,
        defaultData: JSON.stringify({
            Bucket: "my-new-bucket",
            CreateBucketConfiguration: {
                LocationConstraint: "us-west-2"
            }
        }, null, 2)
    },
    {
        id: 'aws_lambda_invoke',
        name: 'Invoke Lambda Function',
        description: 'Invokes a Lambda function.',
        platform: 'AWS',
        icon: Code,
        defaultData: JSON.stringify({
            FunctionName: "my-function",
            Payload: "{ \"key\": \"value\" }"
        }, null, 2)
    },
    {
        id: 'aws_rds_create_db_instance',
        name: 'Create RDS Instance',
        description: 'Creates a new DB instance.',
        platform: 'AWS',
        icon: Database,
        defaultData: JSON.stringify({
            DBInstanceIdentifier: "mydbinstance",
            DBInstanceClass: "db.t2.micro",
            Engine: "mysql",
            MasterUsername: "admin",
            MasterUserPassword: "password",
            AllocatedStorage: 20
        }, null, 2)
    },

    // --- Google Cloud Platform ---
    {
        id: 'gcp_compute_instances_insert',
        name: 'Create Compute Engine VM',
        description: 'Creates an instance resource in the specified project using the data included in the request.',
        platform: 'Google Cloud',
        icon: Server,
        defaultData: JSON.stringify({
            project: "my-project",
            zone: "us-central1-a",
            name: "instance-1",
            machineType: "zones/us-central1-a/machineTypes/n1-standard-1"
        }, null, 2)
    },
    {
        id: 'gcp_compute_instances_stop',
        name: 'Stop VM Instance',
        description: 'Stops a running instance.',
        platform: 'Google Cloud',
        icon: StopCircle,
        defaultData: JSON.stringify({
            project: "my-project",
            zone: "us-central1-a",
            instance: "instance-1"
        }, null, 2)
    },
    {
        id: 'gcp_storage_buckets_insert',
        name: 'Create Cloud Storage Bucket',
        description: 'Creates a new bucket.',
        platform: 'Google Cloud',
        icon: HardDrive,
        defaultData: JSON.stringify({
            project: "my-project",
            name: "my-bucket"
        }, null, 2)
    },
    {
        id: 'gcp_cloud_run_services_create',
        name: 'Deploy Cloud Run Service',
        description: 'Creates a new Service.',
        platform: 'Google Cloud',
        icon: Cloud,
        defaultData: JSON.stringify({
            parent: "projects/my-project/locations/us-central1",
            serviceId: "my-service",
            service: {
                apiVersion: "serving.knative.dev/v1",
                kind: "Service",
                metadata: {
                    name: "my-service"
                },
                spec: {
                    template: {
                        spec: {
                            containers: [{ image: "gcr.io/my-project/my-image" }]
                        }
                    }
                }
            }
        }, null, 2)
    },

    // --- DigitalOcean ---
    {
        id: 'do_droplets_create',
        name: 'Create Droplet',
        description: 'Creates a new Droplet.',
        platform: 'DigitalOcean',
        icon: Server,
        defaultData: JSON.stringify({
            name: "example.com",
            region: "nyc3",
            size: "s-1vcpu-1gb",
            image: "ubuntu-20-04-x64"
        }, null, 2)
    },
    {
        id: 'do_droplets_delete',
        name: 'Delete Droplet',
        description: 'Deletes a Droplet.',
        platform: 'DigitalOcean',
        icon: Trash,
        defaultData: JSON.stringify({
            droplet_id: 12345678
        }, null, 2)
    },
    {
        id: 'do_database_create',
        name: 'Create Database Cluster',
        description: 'Creates a new database cluster.',
        platform: 'DigitalOcean',
        icon: Database,
        defaultData: JSON.stringify({
            name: "db-cluster-01",
            engine: "pg",
            version: "12",
            size: "db-s-1vcpu-1gb",
            region: "nyc1",
            num_nodes: 1
        }, null, 2)
    },

    // --- Supabase ---
    {
        id: 'supabase_db_query',
        name: 'Execute SQL Query',
        description: 'Runs a generic SQL query against your project.',
        platform: 'Supabase',
        icon: Database,
        defaultData: JSON.stringify({
            query: "SELECT * FROM users LIMIT 10;"
        }, null, 2)
    },
    {
        id: 'supabase_edge_functions_deploy',
        name: 'Deploy Edge Function',
        description: 'Deploys a serverless Edge Function.',
        platform: 'Supabase',
        icon: Code,
        defaultData: JSON.stringify({
            slug: "my-function",
            entrypoint: "index.ts",
            verify_jwt: true
        }, null, 2)
    },
    {
        id: 'supabase_storage_create_bucket',
        name: 'Create Storage Bucket',
        description: 'Creates a new storage bucket.',
        platform: 'Supabase',
        icon: HardDrive,
        defaultData: JSON.stringify({
            id: "avatars",
            public: true
        }, null, 2)
    },

    // --- Vercel ---
    {
        id: 'vercel_deployments_create',
        name: 'Create Deployment',
        description: 'Creates a new deployment.',
        platform: 'Vercel',
        icon: Globe,
        defaultData: JSON.stringify({
            name: "my-project",
            files: [],
            projectSettings: {
                framework: "nextjs"
            }
        }, null, 2)
    },
    {
        id: 'vercel_projects_create',
        name: 'Create Project',
        description: 'Creates a new project on Vercel.',
        platform: 'Vercel',
        icon: Layers,
        defaultData: JSON.stringify({
            name: "my-new-project",
            framework: "nextjs"
        }, null, 2)
    },

    // --- Fly.io ---
    {
        id: 'fly_apps_create',
        name: 'Create App',
        description: 'Creates a new application.',
        platform: 'Fly.io',
        icon: PlaneIcon,
        defaultData: JSON.stringify({
            app_name: "my-cool-app",
            org_slug: "personal"
        }, null, 2)
    },
    {
        id: 'fly_machines_create',
        name: 'Create Machine',
        description: 'Creates a machine (VM) for an app.',
        platform: 'Fly.io',
        icon: Server,
        defaultData: JSON.stringify({
            name: "my-machine",
            config: {
                image: "flyio/hellofly:latest",
                guest: {
                    cpu_kind: "shared",
                    cpus: 1,
                    memory_mb: 256
                }
            }
        }, null, 2)
    },

    // --- Railway ---
    {
        id: 'railway_project_create',
        name: 'Create Project',
        description: 'Creates a new Railway project.',
        platform: 'Railway',
        icon: Activity,
        defaultData: JSON.stringify({
            name: "My Project",
            description: "A cool project"
        }, null, 2)
    },
    {
        id: 'railway_service_create',
        name: 'Create Service',
        description: 'Creates a service within a project.',
        platform: 'Railway',
        icon: Layers,
        defaultData: JSON.stringify({
            projectId: "project-id",
            name: "web-server"
        }, null, 2)
    },

    // --- Firebase ---
    {
        id: 'firebase_hosting_deploy',
        name: 'Deploy to Hosting',
        description: 'Deploys content to Firebase Hosting.',
        platform: 'Firebase',
        icon: Globe,
        defaultData: JSON.stringify({
            siteId: "my-site",
            versionId: "new-version-123"
        }, null, 2)
    },
    {
        id: 'firebase_fcm_send',
        name: 'Send Notification (FCM)',
        description: 'Sends a push notification via Cloud Messaging.',
        platform: 'Firebase',
        icon: Activity,
        defaultData: JSON.stringify({
            message: {
                topic: "news",
                notification: {
                    title: "Breaking News",
                    body: "New features available!"
                }
            }
        }, null, 2)
    },

    // --- Azure ---
    {
        id: 'azure_vm_create',
        name: 'Create Virtual Machine',
        description: 'Creates a new Linux or Windows VM.',
        platform: 'Azure',
        icon: Server,
        defaultData: JSON.stringify({
            location: "eastus",
            properties: {
                hardwareProfile: { vmSize: "Standard_D2s_v3" },
                osProfile: { computerName: "myvm", adminUsername: "azureuser" }
            }
        }, null, 2)
    },
    {
        id: 'azure_app_service_create',
        name: 'Create App Service',
        description: 'Creates a web, mobile, or API app.',
        platform: 'Azure',
        icon: Globe,
        defaultData: JSON.stringify({
            location: "West Europe",
            kind: "app",
            properties: {
                serverFarmId: "/subscriptions/subval/resourceGroups/rg1/providers/Microsoft.Web/serverfarms/ServicePlan1"
            }
        }, null, 2)
    },

    // --- GitHub ---
    {
        id: 'github_repo_create',
        name: 'Create Repository',
        description: 'Creates a new repository for the authenticated user.',
        platform: 'GitHub',
        icon: Github,
        defaultData: JSON.stringify({
            name: "Hello-World",
            description: "This is your first repo!",
            private: false
        }, null, 2)
    },
    {
        id: 'github_issue_create',
        name: 'Create Issue',
        description: 'Creates an issue in a repository.',
        platform: 'GitHub',
        icon: Github,
        defaultData: JSON.stringify({
            owner: "octocat",
            repo: "Hello-World",
            title: "Found a bug",
            body: "I'm having a problem with this."
        }, null, 2)
    },
    {
        id: 'github_pr_create',
        name: 'Create Pull Request',
        description: 'Creates a pull request.',
        platform: 'GitHub',
        icon: GitBranch,
        defaultData: JSON.stringify({
            owner: "octocat",
            repo: "Hello-World",
            title: "Amazing new feature",
            body: "Please pull these awesome changes in!",
            head: "octocat:new-feature",
            base: "master"
        }, null, 2)
    },
    {
        id: 'github_action_dispatch',
        name: 'Dispatch Workflow',
        description: 'Manually triggers a GitHub Actions workflow run.',
        platform: 'GitHub',
        icon: Play,
        defaultData: JSON.stringify({
            owner: "octocat",
            repo: "Hello-World",
            workflow_id: "main.yaml",
            ref: "main"
        }, null, 2)
    },

    // --- Docker / Containers ---
    {
        id: 'docker_container_run',
        name: 'Run Container',
        description: 'Creates and starts a container.',
        platform: 'Docker',
        icon: Box,
        defaultData: JSON.stringify({
            Image: "nginx:latest",
            ExposedPorts: { "80/tcp": {} },
            HostConfig: {
                PortBindings: { "80/tcp": [{ "HostPort": "8080" }] }
            }
        }, null, 2)
    },
    {
        id: 'docker_container_stop',
        name: 'Stop Container',
        description: 'Stops a container.',
        platform: 'Docker',
        icon: StopCircle,
        defaultData: JSON.stringify({
            id: "container_id_here"
        }, null, 2)
    },
    {
        id: 'docker_image_pull',
        name: 'Pull Image',
        description: 'Pulls an image from a registry.',
        platform: 'Docker',
        icon: Download,
        defaultData: JSON.stringify({
            fromImage: "alpine",
            tag: "latest"
        }, null, 2)
    }
];