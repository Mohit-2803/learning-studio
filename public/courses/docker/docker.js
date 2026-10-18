const lessons = [
  {
    kicker: "CHAPTER 01 · THE SYSTEM",
    title: "See Docker as a system",
    summary:
      "A Docker command is a request to the engine. The engine creates and changes durable objects: images, containers, networks, and volumes.",
    tags: ["CLI → Engine", "Images", "Containers"],
    modelTitle: "The terminal is a control surface",
    model:
      "The CLI does not run your application itself. It asks the Docker Engine to pull or build an image, create an isolated container, attach storage and networking, and start the configured process.",
    concepts: [
      ["Image", "A read-only package used as a container template."],
      [
        "Container",
        "A process plus an isolated filesystem and runtime settings.",
      ],
      ["Engine", "The service that owns and coordinates Docker objects."],
    ],
    mission: {
      title: "Start and check the Docker Engine",
      prompt:
        "Start the modeled Docker Engine, verify the CLI can reach it, then pull nginx:alpine.",
      steps: [
        "Start Docker Engine",
        "Run docker info to confirm it is ready",
        "Pull nginx:alpine and inspect the image",
      ],
      hint: "Start the engine with the button in the runtime. Then run docker info and docker pull nginx:alpine.",
      start: "docker info",
      check: (s) =>
        s.engine.running &&
        s.flags.engineChecked &&
        s.images.has("nginx:alpine"),
    },
  },
  {
    kicker: "CHAPTER 02 · BUILDING IMAGES",
    title: "Turn a Dockerfile into layers",
    summary:
      "A Dockerfile is executable build instructions. Each meaningful instruction becomes a layer that Docker can reuse on later builds.",
    tags: ["Dockerfile", "Build context", "Layers"],
    modelTitle: "A build is an ordered transformation",
    model:
      "Docker reads the Dockerfile from top to bottom. A changed instruction invalidates its cached layer and every dependent layer below it. The build context defines which local files COPY can access.",
    concepts: [
      ["FROM", "Select the base filesystem and runtime."],
      ["COPY / RUN", "Add files and execute build-time commands."],
      ["CMD", "Set the default container process."],
    ],
    mission: {
      title: "Build notes-api",
      prompt: "Inspect the Dockerfile, then build an image tagged notes-api.",
      steps: ["Open Project files", "Read the Dockerfile", "Build the image"],
      hint: "docker build -t notes-api .",
      start: "docker build -t notes-api .",
      check: (s) => s.images.has("notes-api"),
    },
  },
  {
    kicker: "CHAPTER 03 · RUNNING CONTAINERS",
    title: "Create a running container",
    summary:
      "docker run combines create and start. Runtime flags belong to the new container, while the image stays unchanged.",
    tags: ["docker run", "--name", "Detached mode"],
    modelTitle: "One image can create many containers",
    model:
      "Each container gets its own name, writable layer, process state, environment, mounts, network membership, and port mappings. Reusing an image does not share container state.",
    concepts: [
      ["--name", "Give the instance a stable human-readable identity."],
      ["-d", "Run the main process in the background."],
      ["Image last", "The final positional value selects the template."],
    ],
    mission: {
      title: "Run the Notes API",
      prompt: "Start notes-api in the background with the name notes-web.",
      steps: [
        "Build notes-api if needed",
        "Create notes-web",
        "Confirm its state is running",
      ],
      hint: "docker run -d --name notes-web notes-api",
      start: "docker run -d --name notes-web notes-api",
      check: (s) => s.containers.get("notes-web")?.status === "running",
    },
  },
  {
    kicker: "CHAPTER 04 · LIFECYCLE",
    title: "Manage container lifecycle",
    summary:
      "Stopping, starting, and removing are different operations. Learn which state survives each action.",
    tags: ["stop", "start", "rm"],
    modelTitle: "Stopped is not deleted",
    model:
      "docker stop ends the container process but keeps its configuration and writable layer. docker start runs that same instance again. docker rm deletes the instance; its image and named volumes remain separate objects.",
    concepts: [
      ["stop", "Send a graceful stop signal, then wait before killing."],
      ["start", "Run the existing container configuration again."],
      ["rm", "Delete a stopped container object."],
    ],
    mission: {
      title: "Stop and recover",
      prompt:
        "Stop notes-web, confirm it appears in docker ps -a, then start it again.",
      steps: [
        "Stop the container",
        "List all containers",
        "Start the same instance",
      ],
      hint: "docker stop notes-web, then docker ps -a, then docker start notes-web.",
      start: "docker stop notes-web",
      check: (s) => s.flags.lifecycleRecovered,
    },
  },
  {
    kicker: "CHAPTER 05 · PUBLISHED PORTS",
    title: "Connect the host to a container",
    summary:
      "A process can run correctly inside a container and still be unreachable from your browser until a host port is published.",
    tags: ["-p host:container", "0.0.0.0", "curl"],
    modelTitle: "A port mapping creates a traffic path",
    model:
      "The left side is the host port you visit. The right side is the port the application listens on inside the container. Docker forwards traffic; it does not change the application’s internal listen port.",
    concepts: [
      ["8080:3000", "localhost:8080 forwards to container port 3000."],
      ["EXPOSE", "Documentation in the image, not a published port."],
      ["curl", "Tests the same host path a browser would use."],
    ],
    mission: {
      title: "Publish and request the API",
      prompt:
        "Run notes-api as notes-public with 8080 mapped to 3000, then request it.",
      steps: [
        "Publish 8080:3000",
        "See the path in Network",
        "curl localhost:8080",
      ],
      hint: "docker run -d --name notes-public -p 8080:3000 notes-api",
      start: "docker run -d --name notes-public -p 8080:3000 notes-api",
      check: (s) => s.flags.curlSuccess,
    },
  },
  {
    kicker: "CHAPTER 06 · RUNTIME CONFIG",
    title: "Configure one image many ways",
    summary:
      "Environment variables change runtime behavior without rebuilding the image. They belong to a container configuration.",
    tags: ["-e", "--env-file", "inspect"],
    modelTitle: "Build once, configure when you run",
    model:
      "Values such as NODE_ENV, LOG_LEVEL, or a service hostname vary between environments. Pass them at container creation and inspect the exact configuration the engine stored.",
    concepts: [
      ["-e KEY=value", "Set one value on the new container."],
      ["--env-file", "Load several non-secret development values."],
      ["inspect", "See the runtime configuration Docker recorded."],
    ],
    mission: {
      title: "Run with production config",
      prompt: "Create notes-prod with NODE_ENV=production, then inspect it.",
      steps: [
        "Pass an environment value",
        "Create notes-prod",
        "Inspect its Config.Env",
      ],
      hint: "docker run -d --name notes-prod -e NODE_ENV=production notes-api",
      start: "docker run -d --name notes-prod -e NODE_ENV=production notes-api",
      check: (s) => s.flags.inspectedEnv,
    },
  },
  {
    kicker: "CHAPTER 07 · PERSISTENT DATA",
    title: "Give data its own lifecycle",
    summary:
      "A container writable layer disappears with the container. Named volumes remain and can be mounted into replacement containers.",
    tags: ["volume create", "-v", "Persistence"],
    modelTitle: "Stateful data should outlive the process",
    model:
      "Docker mounts a volume at a container path. Writes at that path go to the volume. Replacing the container can preserve the database files by mounting the same named volume again.",
    concepts: [
      ["Named volume", "Docker-managed storage with a separate lifecycle."],
      [
        "Mount target",
        "The path where the application writes inside the container.",
      ],
      [
        "Bind mount",
        "A host directory mapped directly, useful for source code.",
      ],
    ],
    mission: {
      title: "Persist PostgreSQL data",
      prompt:
        "Create db-data and mount it into a postgres container at /var/lib/postgresql/data.",
      steps: ["Create db-data", "Run postgres:16", "Verify the mount"],
      hint: "docker volume create db-data, then docker run -d --name notes-db -v db-data:/var/lib/postgresql/data postgres:16",
      start: "docker volume create db-data",
      check: (s) =>
        s.containers
          .get("notes-db")
          ?.mounts?.some((m) => m.source === "db-data"),
    },
  },
  {
    kicker: "CHAPTER 08 · NETWORKING",
    title: "Connect services by name",
    summary:
      "Containers on a user-defined network discover one another through Docker DNS. localhost always means the current container.",
    tags: ["network create", "Service DNS", "Private traffic"],
    modelTitle: "A network creates a private address space",
    model:
      "Attach related services to the same network, then use container or Compose service names as hostnames. Publish only the ports the host actually needs.",
    concepts: [
      ["app-net", "A user-defined bridge network."],
      ["notes-db:5432", "A service-to-service address inside the network."],
      ["localhost", "The current container, never a sibling container."],
    ],
    mission: {
      title: "Create a service network",
      prompt: "Create app-net and connect notes-web and notes-db to it.",
      steps: ["Create app-net", "Connect the API", "Connect the database"],
      hint: "docker network create app-net, then docker network connect app-net notes-web.",
      start: "docker network create app-net",
      check: (s) =>
        ["notes-web", "notes-db"].every((n) =>
          s.networks.get("app-net")?.containers.has(n),
        ),
    },
  },
  {
    kicker: "CHAPTER 09 · COMPOSE",
    title: "Describe a multi-container app",
    summary:
      "Compose turns a YAML file into a coordinated project: services, networks, volumes, environment, and port mappings.",
    tags: ["compose.yaml", "Services", "One lifecycle"],
    modelTitle: "Configuration becomes a reproducible system",
    model:
      "docker compose up reads the project file, builds or pulls images, creates shared resources, and starts each service. The file becomes the reviewable source of truth for local infrastructure.",
    concepts: [
      ["services", "Named container definitions."],
      ["depends_on", "Startup ordering, not application readiness."],
      ["volumes / networks", "Reusable project resources."],
    ],
    mission: {
      title: "Start the Compose stack",
      prompt: "Open compose.yaml, then start the app and database together.",
      steps: [
        "Inspect the YAML",
        "Run compose up -d",
        "See app and db on one network",
      ],
      hint: "docker compose up -d",
      start: "docker compose up -d",
      check: (s) => s.compose.running,
    },
  },
  {
    kicker: "CHAPTER 10 · BUILD CACHE",
    title: "Make repeat builds fast",
    summary:
      "Docker reuses unchanged layers. Dockerfile order decides how much work a small source edit invalidates.",
    tags: ["Cache", ".dockerignore", "Rebuild"],
    modelTitle: "Cache is a dependency chain",
    model:
      "COPY package files before source code so an application edit does not force npm install to run again. Exclude node_modules and local secrets from the build context.",
    concepts: [
      [
        "Stable first",
        "Base image and dependency manifests change less often.",
      ],
      [
        "Source later",
        "Frequently edited code should invalidate fewer layers.",
      ],
      [".dockerignore", "Reduces context size and accidental inclusion."],
    ],
    mission: {
      title: "Observe cache reuse",
      prompt:
        "Build notes-api twice, edit server.js in Project files, save it, and build again.",
      steps: [
        "Build once",
        "Build again for cached layers",
        "Edit server.js and rebuild",
      ],
      hint: "Use the Build layers tab after each docker build -t notes-api .",
      start: "docker build -t notes-api .",
      check: (s) => s.flags.sawCacheInvalidation,
    },
  },
  {
    kicker: "CHAPTER 11 · DEBUGGING",
    title: "Diagnose from evidence",
    summary:
      "A calm debugging loop checks state, logs, configuration, processes, and the real network path before changing anything.",
    tags: ["ps -a", "logs", "inspect", "stats"],
    modelTitle: "Every failure leaves evidence",
    model:
      "If a container exited, inspect its state and logs. If it runs but is unreachable, verify the process listen port and host mapping. If services cannot connect, inspect their shared network and hostnames.",
    concepts: [
      ["ps -a", "Start with the full lifecycle state."],
      ["logs / top", "Read process output and see what is running."],
      ["inspect", "Verify the configuration Docker applied."],
    ],
    mission: {
      title: "Diagnose a bad port",
      prompt:
        "Run notes-api as broken-api with 9090:9999, try curl, then inspect the mapping and read the suggested fix.",
      steps: [
        "Create the incorrect mapping",
        "Observe connection failure",
        "Inspect the container",
      ],
      hint: "docker run -d --name broken-api -p 9090:9999 notes-api",
      start: "docker run -d --name broken-api -p 9090:9999 notes-api",
      check: (s) => s.flags.debuggedBadPort,
    },
  },
  {
    kicker: "CHAPTER 20 · FINAL LAB",
    title: "Ship a complete local stack",
    summary:
      "Bring images, containers, configuration, storage, networking, Compose, and diagnostics together without a prescribed command order.",
    tags: ["Capstone", "State checks", "Your workflow"],
    modelTitle: "The goal is a working system, not memorized commands",
    model:
      "Use the visual runtime as feedback. You can work through the terminal, edit the files, inspect objects, recover from errors, and reset when you want another attempt.",
    concepts: [
      ["Build", "Create a repeatable application image."],
      ["Run", "Connect process, config, storage, and network."],
      ["Verify", "Use state, logs, inspect, and a real request."],
    ],
    mission: {
      title: "Complete the capstone",
      prompt:
        "Finish every final lab check below. Each one reads the live Docker sandbox.",
      steps: ["Prepare the image", "Run the stack", "Verify and inspect it"],
      hint: "Start with the Dockerfile or use docker compose up -d.",
      start: "docker compose up -d",
      check: (s) => capstoneTasks.every((t) => t.check(s)),
    },
  },
];

const lessonGuides = [
  {
    why: "Docker is a client-server system. The CLI is the tool you type into; the Engine daemon owns images, containers, networks, and volumes. On a fresh machine the CLI can exist while the daemon is stopped, so the first useful habit is checking both sides before assuming Docker is ready.",
    realUse:
      "On a laptop, Docker Desktop starts a local Linux Engine. On a Linux server, a system service usually runs dockerd. The selected context tells the CLI which Engine endpoint receives a command.",
    commonTrap:
      "`docker --version` only proves the client can print its own version. `docker info` is a better daemon connectivity check. A green-looking browser UI must never imply the real local Engine was started.",
    checkpoint:
      "Start the lab Engine, run `docker info`, and compare the client and server sections in the result.",
  },
  {
    why: "A build turns a directory of source files and a Dockerfile into an image. The build context is the set of files sent to the builder. Each Dockerfile instruction contributes to an ordered image history, which makes the build reproducible and inspectable.",
    realUse:
      "A team can review the Dockerfile in version control and build the same application image on a developer laptop or in CI. The tag, such as notes-api, gives that image a convenient name.",
    commonTrap:
      "The final `.` means the current directory is the build context. It is not a filename. Files outside the context cannot be copied, and an overly broad context can make builds slow or include local files by mistake.",
    checkpoint:
      "Read the Dockerfile, build `notes-api`, then open Build layers and identify which instruction creates each layer.",
  },
  {
    why: "An image is a template; a container is one instance created from it. `docker run` creates a container and starts its configured main process. Each run can supply its own name, ports, environment, mounts, and network while leaving the original image reusable.",
    realUse:
      "A developer can run several isolated copies of the same service for testing, each with a different port or configuration. Detached mode leaves the terminal available while the service runs in the background.",
    commonTrap:
      "A container only stays running while its main process stays alive. Running a container is not the same as starting a full virtual machine with an always-on operating system.",
    checkpoint:
      "Run one named Notes API container, inspect its image and state, and then create a second instance with a different name.",
  },
  {
    why: "Container lifecycle commands change the instance, not its image. Stop asks the main process to exit. Start reuses the same container configuration. Remove deletes that container and its writable layer, while separately managed images and named volumes have their own lifecycles.",
    realUse:
      "This distinction helps when recovering a failed service: inspect and start the same container if its configuration is still useful, or remove and recreate it from a corrected image/configuration.",
    commonTrap:
      "`docker rm` is not the normal way to pause a service. A removed container cannot be started again. Also, deleting a container does not automatically mean its named volume was deleted.",
    checkpoint:
      "Stop a container, compare `docker ps` with `docker ps -a`, start that same instance, then remove only a stopped test container.",
  },
  {
    why: "A process inside a container has its own network namespace. It can listen on a container port without making that port reachable from your laptop. Port publishing creates a host-to-container forwarding rule; the host and container port numbers can differ.",
    realUse:
      "A local web app might listen on port 3000 in the container while a developer visits `localhost:8080` on the host. The mapping `-p 8080:3000` connects those two endpoints.",
    commonTrap:
      "`EXPOSE 3000` records image metadata; it does not publish a port. The application must also listen on an interface reachable from outside its own process namespace, commonly `0.0.0.0` inside the container.",
    checkpoint:
      "Run the API with `-p 8080:3000`, inspect the mapping, and send a request to `localhost:8080`.",
  },
  {
    why: "Images are reusable artifacts, while environment values are supplied when a container is created. This lets one build run in local development and staging with different non-secret configuration, without rebuilding the image for each environment.",
    realUse:
      "A service can read `NODE_ENV` or a database hostname from its process environment. Compose files commonly make these settings reviewable and repeatable for a project.",
    commonTrap:
      "Changing an environment variable on an existing container does not rewrite that container's configuration. Recreate it with the desired value. Do not bake credentials into Dockerfile instructions or the image itself.",
    checkpoint:
      "Run two containers from one image with different environment values, then use `docker inspect` or the container shell to compare them.",
  },
  {
    why: "A container's writable layer is temporary state attached to that container. A volume is Docker-managed storage mounted at a path inside the container. When a replacement container mounts the same named volume at the same path, the data can outlive the old container.",
    realUse:
      "Databases need durable files even when a container is upgraded or recreated. Source code in development often uses a bind mount so edits on the host appear inside the container; database data typically uses a named volume.",
    commonTrap:
      "A mount hides whatever was already at the destination path while mounted. A volume is also separate from the container, so removing one does not necessarily remove the other.",
    checkpoint:
      "Create `db-data`, mount it at PostgreSQL's data directory, remove and recreate the database container with the same volume, then inspect the mount.",
  },
  {
    why: "Containers on a user-defined bridge network can find each other by name. Docker DNS maps a service or container name to its current network address, so application configuration does not need a hard-coded IP address.",
    realUse:
      "An API connects to a database at `db:5432` on the private project network. Only the API might publish a host port; the database can remain reachable only to peers on that network.",
    commonTrap:
      "Inside a container, `localhost` means that same container. It does not mean the Docker host or a sibling service. Use a service name for peer-to-peer traffic.",
    checkpoint:
      "Connect the API and database to `app-net`, inspect the membership, and explain which ports need to be published to the host.",
  },
  {
    why: "Compose stores a local multi-container application in a YAML file: services describe containers, while top-level networks and volumes define shared resources. The file makes the system easier to recreate than a long list of commands typed by hand.",
    realUse:
      "A project can bring up an API and its database with `docker compose up -d`, then view service state and logs with Compose commands. Compose assigns service names that work as DNS names on its project network.",
    commonTrap:
      "`depends_on` establishes startup order, but a started database may not yet be ready to accept connections. The application may need retries or a health-aware readiness strategy.",
    checkpoint:
      "Run `docker compose config` before `up`, then inspect the generated services, project network, and named volume.",
  },
  {
    why: "Build cache is an ordered dependency chain. If an early instruction changes, later layers may need rebuilding too. Put stable inputs earlier and frequently changing source later so small code edits can reuse expensive dependency layers.",
    realUse:
      "Copying package manifests before application source lets a build reuse dependency installation until the manifest changes. `.dockerignore` keeps irrelevant and sensitive local files out of the context.",
    commonTrap:
      "Cache is not a promise that every command will be skipped. Changes to an instruction or its input invalidate that layer and dependent layers after it; use the layer view to see what actually changed.",
    checkpoint:
      "Build twice, edit only `server.js`, rebuild, then compare the reused and invalidated layers.",
  },
  {
    why: "Useful Docker debugging starts by locating the failing boundary: daemon connection, image/build, process startup, container lifecycle, or network path. Commands such as `ps -a`, `logs`, `inspect`, `port`, and `curl` provide different evidence about those boundaries.",
    realUse:
      "If a request fails, first check whether the container is running, then read its logs, inspect the configured port, and finally test the published host route. Change one thing at a time so the cause stays clear.",
    commonTrap:
      "A running container does not prove the application is healthy or reachable. A published port does not help if the app listens on a different container port or only on loopback.",
    checkpoint:
      "Create the intentionally wrong port mapping, read the error and inspect output, fix the mapping, and verify a 200 response.",
  },
  {
    why: "The final task combines the lifecycle rather than testing one command in isolation: prepare a build, create services, attach storage and networking, publish the user-facing port, then verify behavior and gather evidence.",
    realUse:
      "This is the routine behind a local development stack: define what should exist, bring it up, observe it, debug a failure, and make sure state survives the replacement of disposable containers.",
    commonTrap:
      "Do not rely on a command returning successfully as the only proof. Confirm the resulting object state, logs, port mapping, network membership, and actual HTTP response.",
    checkpoint:
      "Complete the capstone in dependency order, then use the interview questions to explain why each resource belongs in the stack.",
  },
];

const finalDockerLesson = lessons.pop();
const finalDockerGuide = lessonGuides.pop();
lessons.push(...window.dockerAdvancedCurriculum.lessons, finalDockerLesson);
lessonGuides.push(...window.dockerAdvancedCurriculum.guides, finalDockerGuide);
finalDockerLesson.kicker = `CHAPTER ${String(lessons.length).padStart(2, "0")} · FINAL LAB`;

const capstoneTasks = [
  {
    title: "Application image",
    prompt: "Build an image named notes-api.",
    command: "docker build -t notes-api .",
    level: "FOUNDATION",
    verify: "The images list contains a notes-api tag.",
    hint: "Read the Dockerfile first. The final dot means the current project folder is the build context.",
    check: (s) => s.images.has("notes-api"),
  },
  {
    title: "Persistent database",
    prompt: "Create db-data and mount it into notes-db.",
    command:
      "docker run -d --name notes-db -v db-data:/var/lib/postgresql/data postgres:16",
    level: "FOUNDATION",
    verify:
      "Inspect notes-db and confirm its data directory uses the db-data volume.",
    hint: "A named volume can be created automatically on first use. Try `docker volume ls` and `docker inspect notes-db` after starting it.",
    check: (s) =>
      s.containers.get("notes-db")?.mounts?.some((m) => m.source === "db-data"),
  },
  {
    title: "Private network",
    prompt: "Create app-net and attach the database container.",
    command:
      "docker network create app-net; docker network connect app-net notes-db",
    level: "APPLIED",
    verify: "app-net exists and notes-db is listed as a member.",
    hint: "Complete the database goal first. Then create `app-net` and attach `notes-db`; the API will join this network in the next goal.",
    check: (s) => s.networks.get("app-net")?.containers.has("notes-db"),
  },
  {
    title: "Published API",
    prompt: "Run the API on host port 8081 and attach it to app-net.",
    command:
      "docker run -d --name final-api --network app-net -p 8081:3000 notes-api",
    level: "APPLIED",
    verify: "The container is running and localhost:8081 returns HTTP 200.",
    hint: "The host port comes first. Check the container's actual app port in the Dockerfile before choosing the mapping. Port 8081 avoids the 8080 mapping used in earlier lessons.",
    check: (s) =>
      [...s.containers.values()].some(
        (c) =>
          c.status === "running" &&
          s.networks.get("app-net")?.containers.has(c.name) &&
          c.ports.some((p) => p.host === "8081" && p.container === "3000"),
      ),
  },
  {
    title: "Successful request",
    prompt: "Receive a 200 response from localhost:8081.",
    command: "curl http://localhost:8081",
    level: "APPLIED",
    verify: "The response body identifies the Notes API service.",
    hint: "If the request fails, check `docker ps`, `docker logs final-api`, and `docker port final-api` before changing configuration.",
    check: (s) => s.flags.curlSuccess,
  },
  {
    title: "Evidence gathered",
    prompt: "Inspect a running application container.",
    command: "docker inspect final-api",
    level: "INTERVIEW",
    verify:
      "Use the output to identify state, image, ports, network, and mounts.",
    hint: "Inspection is evidence. Read the relevant section instead of treating the full JSON as a single answer.",
    check: (s) => s.flags.inspectedRunning,
  },
  {
    title: "Debug a broken route",
    prompt:
      "Create an intentionally incorrect mapping, explain the failure, and identify the correction.",
    command: "docker run -d --name broken-api -p 9090:9999 notes-api",
    level: "INTERVIEW",
    verify:
      "A request to the published port fails, and inspection shows the mismatch with the app's listening port.",
    hint: "Compare the right side of `-p HOST:CONTAINER` with the app's actual listen port. Fix by recreating the container with the correct mapping.",
    check: (s) => s.flags.debuggedBadPort,
  },
  {
    title: "Confirm service health",
    prompt:
      "Inspect a running container after adding and building a HEALTHCHECK.",
    command: "docker ps -a",
    level: "APPLIED",
    verify:
      "A running container has a health check and its health state was inspected.",
    hint: "Complete the health chapter, then inspect the container created from the updated notes-api image.",
    check: (s) => s.flags.healthChecked,
  },
  {
    title: "Review least-privilege settings",
    prompt:
      "Inspect a runtime configured with a non-root user, read-only filesystem, and dropped capabilities.",
    command: "docker inspect hardened-api",
    level: "INTERVIEW",
    verify: "Inspect shows User, ReadonlyRootfs, and CapDrop settings.",
    hint: "Run the hardened-api mission, then use inspect as evidence. These settings are recorded by the browser model only.",
    check: (s) => s.flags.inspectedHardened,
  },
  {
    title: "Inspect a multi-stage release image",
    prompt:
      "Build an image with separate build and runtime stages and a non-root process user.",
    command: "docker history notes-api",
    level: "INTERVIEW",
    verify: "The built image records multiple FROM stages and a non-root user.",
    hint: "Edit Dockerfile in Project files, save, build, then inspect the image and its layers.",
    check: (s) =>
      [...s.images.values()].some(
        (image) =>
          image.name === "notes-api" && image.stages >= 2 && image.nonRoot,
      ),
  },
  {
    title: "Check secret hygiene",
    prompt:
      "Keep local secrets out of the build context and Dockerfile before rebuilding.",
    command: "cat .dockerignore",
    level: "INTERVIEW",
    verify:
      ".env and key files are ignored; no credential is baked into Dockerfile instructions.",
    hint: "Add .env patterns and *.pem to .dockerignore. Never enter a real credential in this browser lab.",
    check: (s) => {
      const ignore = s.files[".dockerignore"] || "";
      const dockerfile = s.files.Dockerfile || "";
      return (
        /(^|\n)\.env(\.|\s|$)/m.test(ignore) &&
        /\*\.pem/.test(ignore) &&
        !/^(ARG|ENV)\s+.*(TOKEN|PASSWORD|SECRET|KEY)=?/im.test(dockerfile)
      );
    },
  },
  {
    title: "Publish a versioned artifact",
    prompt: "Tag and push the Notes API image to the modeled registry.",
    command: "docker tag notes-api learner/notes-api:1.0.0",
    level: "INTERVIEW",
    verify:
      "A versioned registry tag was pushed and its digest is visible in the terminal.",
    hint: "Tag first, then push the exact same reference. The simulator does not contact a real registry.",
    check: (s) => s.flags.imagePushed,
  },
  {
    title: "Validate the deployable Compose model",
    prompt:
      "Review Compose configuration and bring the app-and-database project up.",
    command: "docker compose config",
    level: "APPLIED",
    verify: "The configuration was reviewed and both services are running.",
    hint: "Run config, correct the file if needed, then use `docker compose up -d` and `docker compose ps`.",
    check: (s) => s.flags.composeConfigValidated && s.compose.running,
  },
  {
    title: "Explain restart and resource guardrails",
    prompt:
      "Create and inspect a service with a restart policy, CPU limit, and memory limit.",
    command: "docker inspect guarded-api",
    level: "INTERVIEW",
    verify:
      "The saved restart policy and resource limits match the intended runtime configuration.",
    hint: "Use the chapter mission command, then inspect guarded-api and explain how a restart loop would be diagnosed.",
    check: (s) => s.flags.inspectedGuarded,
  },
];

const dockerInterviewQuestions = [
  {
    prompt:
      "The Docker CLI is installed, but `docker info` says it cannot connect. What should you check first?",
    options: [
      "Reinstall the CLI",
      "Start the Docker Engine and confirm the selected context",
      "Rebuild every image",
    ],
    answer: 1,
    explanation:
      "The CLI is a client. It sends requests to an Engine daemon; installing the client alone does not mean a daemon is running or reachable.",
  },
  {
    prompt:
      "What is the practical difference between an image and a container?",
    options: [
      "An image is a reusable template; a container is a created instance with runtime state",
      "They are two names for the same object",
      "An image is a running process and a container is a registry",
    ],
    answer: 0,
    explanation:
      "An image provides the read-only layers and defaults. A container adds its own writable layer, process, configuration, and network/storage attachments.",
  },
  {
    prompt:
      "A service listens on port 3000 inside its container. Which mapping makes it reachable at localhost:8080?",
    options: ["-p 3000:8080", "EXPOSE 8080", "-p 8080:3000"],
    answer: 2,
    explanation:
      "The mapping order is host port first, container port second. EXPOSE documents a port in image metadata but does not publish it by itself.",
  },
  {
    prompt:
      "A database container is removed and recreated. Which choice is designed to keep its data?",
    options: [
      "Write into the container writable layer",
      "Mount a Docker-managed named volume",
      "Add the data directory to EXPOSE",
    ],
    answer: 1,
    explanation:
      "The container writable layer follows the container lifecycle. A named volume has a separate lifecycle and can be mounted by a replacement container.",
  },
  {
    prompt:
      "Why copy package manifests before copying the whole application into an image?",
    options: [
      "It lets Docker reuse the dependency-install layer when only source code changes",
      "It makes the source files available before the build context exists",
      "It makes the container start as root",
    ],
    answer: 0,
    explanation:
      "Build layers are cached in order. Keeping dependency manifests in an earlier COPY means unrelated source edits can reuse the dependency-install layer.",
  },
  {
    prompt:
      "Two services are on the same Compose network. How should the API find a service named `db`?",
    options: [
      "Use the host machine's IP",
      "Connect to `localhost` inside the API container",
      "Use the service name `db` as the hostname",
    ],
    answer: 2,
    explanation:
      "Compose provides service-name discovery on its project network. `localhost` inside a container refers to that same container.",
  },
  {
    prompt: "What does `docker compose depends_on` guarantee by itself?",
    options: [
      "The dependency is healthy and ready to serve requests",
      "The dependency is started before the dependent service",
      "The dependency can never restart",
    ],
    answer: 1,
    explanation:
      "Basic depends_on controls startup order. Applications may still need retries or a health-based readiness condition before a dependency can serve traffic.",
  },
  {
    prompt:
      "Where should a local `.env` file with credentials usually be kept out of the build context?",
    options: [
      "In `.dockerignore`, and avoid baking secrets into image layers",
      "In the Dockerfile with an ENV instruction",
      "In the image tag",
    ],
    answer: 0,
    explanation:
      "Exclude local secret files from the build context and pass runtime configuration through an appropriate secret or environment mechanism. ENV in a Dockerfile can leave values in image metadata or layers.",
  },
  {
    prompt: "What does a health check tell you that a running status may not?",
    options: [
      "Whether the configured application check currently succeeds",
      "Whether the image was pushed to a registry",
      "Whether the host port is always reachable from the internet",
    ],
    answer: 0,
    explanation:
      "Running describes container process state. Health is a separate signal and only means something when the check tests useful application behavior.",
  },
  {
    prompt: "Why use a multi-stage Dockerfile?",
    options: [
      "To keep build tools out of the final runtime image",
      "To make one container run several independent daemons",
      "To publish every build layer publicly",
    ],
    answer: 0,
    explanation:
      "A builder stage can contain compilers or development dependencies while the final stage copies only the required runtime artifacts.",
  },
  {
    prompt: "Why is `docker push` not the same as deploying an application?",
    options: [
      "Push stores image layers in a registry; deployment still creates and operates runtime services",
      "Push starts a container on every machine automatically",
      "Push permanently pins the latest tag to one digest",
    ],
    answer: 0,
    explanation:
      "A registry distributes image artifacts. A runtime platform still needs a deployment configuration, secrets, networking, health management, and an update strategy.",
  },
  {
    prompt:
      "What is a good first response to a container that repeatedly exits?",
    options: [
      "Delete all images and volumes immediately",
      "Check `docker ps -a`, inspect its exit state, and read its logs",
      "Publish more ports until it stays running",
    ],
    answer: 1,
    explanation:
      "Use state and logs to locate the failure before changing the image or removing data. A restart policy can repeat a crash without fixing its cause.",
  },
];
const dockerInterviewAnswers = new Map();
const dockerInterviewReviewed = new Set(
  JSON.parse(localStorage.getItem("docker-interview-reviewed") || "[]"),
);

const initialFiles = {
  Dockerfile: `FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]`,
  "compose.yaml": `services:\n  app:\n    build: .\n    ports:\n      - "8080:3000"\n    environment:\n      DATABASE_HOST: db\n    depends_on:\n      - db\n  db:\n    image: postgres:16\n    volumes:\n      - db-data:/var/lib/postgresql/data\nvolumes:\n  db-data:`,
  ".dockerignore": `node_modules\n.git\n.env\nnpm-debug.log`,
  "server.js": `const http = require("node:http");\nconst port = 3000;\nhttp.createServer((req, res) => {\n  res.end(JSON.stringify({ ok: true, service: "notes-api" }));\n}).listen(port, "0.0.0.0");`,
  "package.json": `{"name":"notes-api","version":"1.0.0","scripts":{"start":"node server.js"},"dependencies":{}}`,
  "package-lock.json": `{"name":"notes-api","version":"1.0.0","lockfileVersion":3,"requires":true,"packages":{"":{"name":"notes-api","version":"1.0.0","dependencies":{}}}}`,
};

function newState() {
  return {
    engine: { running: false, context: "desktop-linux" },
    shell: { container: null, cwd: "/app" },
    images: new Map(),
    containers: new Map(),
    volumes: new Map(),
    networks: new Map([
      ["bridge", { name: "bridge", driver: "bridge", containers: new Set() }],
    ]),
    files: { ...initialFiles },
    events: [],
    layers: [],
    buildSignatures: new Map(),
    buildNumber: 0,
    compose: { running: false },
    flags: {
      engineChecked: false,
      lifecycleStopped: false,
      lifecycleRecovered: false,
      curlSuccess: false,
      inspectedEnv: false,
      inspectedRunning: false,
      debuggedBadPort: false,
      sawCacheInvalidation: false,
      imagePushed: false,
      composeConfigValidated: false,
      readLogs: false,
      reviewedDisk: false,
      healthChecked: false,
      inspectedGuarded: false,
      inspectedHardened: false,
    },
    lastCommand: "",
  };
}
let state = newState(),
  activeChapter = 0,
  activeFile = "Dockerfile",
  fileDirty = false,
  history = [],
  historyIndex = 0;

function saveDockerLabState() {
  const snapshot = {
    files: state.files,
    images: [...state.images.entries()],
    containers: [...state.containers.entries()].map(([name, container]) => [name, {
      ...container,
      networks: [...(container.networks || [])],
    }]),
    volumes: [...state.volumes.entries()],
    networks: [...state.networks.entries()].map(([name, network]) => [name, {
      ...network,
      containers: [...(network.containers || [])],
    }]),
    layers: state.layers,
    buildSignatures: [...state.buildSignatures.entries()],
    buildNumber: state.buildNumber,
    compose: state.compose,
    flags: state.flags,
    context: state.engine.context,
  };
  try { localStorage.setItem("docker-lab-state", JSON.stringify(snapshot)); }
  catch (error) { console.warn("Could not save Docker lab progress", error); }
}

function restoreDockerLabState(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return;
  const restored = newState();
  restored.files = { ...initialFiles, ...(snapshot.files || {}) };
  restored.images = new Map(Array.isArray(snapshot.images) ? snapshot.images : []);
  restored.containers = new Map((Array.isArray(snapshot.containers) ? snapshot.containers : [])
    .map(([name, container]) => [name, { ...container, networks: new Set(container.networks || []) }]));
  restored.volumes = new Map(Array.isArray(snapshot.volumes) ? snapshot.volumes : []);
  restored.networks = new Map((snapshot.networks || [["bridge", { name: "bridge", driver: "bridge", containers: [] }]])
    .map(([name, network]) => [name, { ...network, containers: new Set(network.containers || []) }]));
  if (!restored.networks.has("bridge")) restored.networks.set("bridge", { name: "bridge", driver: "bridge", containers: new Set() });
  restored.layers = Array.isArray(snapshot.layers) ? snapshot.layers : [];
  restored.buildSignatures = new Map(Array.isArray(snapshot.buildSignatures) ? snapshot.buildSignatures : []);
  restored.buildNumber = Number(snapshot.buildNumber) || 0;
  restored.compose = { ...restored.compose, ...(snapshot.compose || {}), running: false };
  restored.flags = { ...restored.flags, ...(snapshot.flags || {}) };
  restored.engine = { running: false, context: snapshot.context || "desktop-linux" };
  restored.shell = { container: null, cwd: "/app" };
  state = restored;
  renderAll();
}

window.addEventListener("learning:progress-restored", (event) => {
  const { key, value } = event.detail || {};
  if (key === "docker-lab-state") restoreDockerLabState(value);
  if (key === "docker-course-state" && Number.isInteger(Number(value?.active))) {
    renderChapter(Math.max(0, Math.min(lessons.length - 1, Number(value.active))));
  }
  if (key === "docker-interview-reviewed" && Array.isArray(value)) {
    dockerInterviewReviewed.clear();
    value.forEach((index) => dockerInterviewReviewed.add(Number(index)));
    renderDockerInterviewQuestions();
  }
});
const $ = (selector) => document.querySelector(selector),
  $$ = (selector) => [...document.querySelectorAll(selector)];
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const uid = (prefix) => `${prefix}${Math.random().toString(16).slice(2, 10)}`;
const hash = (value) => {
  let h = 0;
  for (const c of value) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h.toString(16).padStart(8, "0");
};
const now = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
const pause = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
let engineBusy = false,
  commandBusy = false;

function addEvent(action, target, type = "success") {
  state.events.unshift({ time: now(), action, target, type });
  renderEvents();
}
function result(ok, text, title, explanation, next = "", view = "objects") {
  return { ok, text, title, explanation, next, view };
}
function tokenize(input) {
  const tokens = [];
  let current = "",
    quote = "";
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quote) {
      if (c === quote) quote = "";
      else current += c;
    } else if (c === '"' || c === "'") quote = c;
    else if (/\s/.test(c)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else current += c;
  }
  if (quote) throw new Error(`Unclosed ${quote} quote.`);
  if (current) tokens.push(current);
  return tokens;
}
function option(tokens, ...names) {
  for (const name of names) {
    const i = tokens.indexOf(name);
    if (i >= 0) return tokens[i + 1] ?? true;
  }
  return null;
}
function has(tokens, ...names) {
  return names.some((name) => tokens.includes(name));
}
function ensureNetwork(name) {
  if (!state.networks.has(name))
    state.networks.set(name, { name, driver: "bridge", containers: new Set() });
  return state.networks.get(name);
}
function attach(container, name) {
  ensureNetwork(name).containers.add(container.name);
  container.networks.add(name);
}
function detachAll(container) {
  container.networks.forEach((name) =>
    state.networks.get(name)?.containers.delete(container.name),
  );
  container.networks.clear();
}
function imageName(tokens) {
  return [...tokens]
    .reverse()
    .find(
      (t) => !t.startsWith("-") && !t.includes("=") && !/^\d+:\d+$/.test(t),
    );
}

function execute(raw) {
  let tokens;
  try {
    tokens = tokenize(raw);
  } catch (error) {
    return result(
      false,
      error.message,
      "The shell could not parse this command",
      "Close the quote or remove it, then run the command again.",
    );
  }
  if (!tokens.length)
    return result(true, "", "Nothing ran", "Type a command after the prompt.");
  if (state.shell.container) return executeContainerShell(tokens, raw);
  if (tokens[0] === "help" || raw === "docker help")
    return result(
      true,
      commandReference(),
      "Command reference opened",
      "Choose a command, edit its names or flags, and run it. The sandbox accepts flexible names and values.",
      "Try docker images.",
    );
  if (tokens[0] === "clear")
    return {
      ok: true,
      clear: true,
      text: "",
      title: "Terminal cleared",
      explanation: "Runtime objects are unchanged.",
      view: "objects",
    };
  if (tokens[0] === "pwd")
    return result(
      true,
      "/home/learner/notes-api",
      "Current project directory",
      "Build context '.' refers to this virtual folder.",
      "Try ls.",
      "files",
    );
  if (tokens[0] === "ls")
    return result(
      true,
      Object.keys(state.files).join("  "),
      "Project files listed",
      "These files form the build context used by docker build.",
      "Try cat Dockerfile.",
      "files",
    );
  if (tokens[0] === "cat") {
    const name = tokens[1];
    if (!name)
      return result(
        false,
        "cat: missing file operand",
        "A file name is required",
        "Use ls to see available files.",
        "cat Dockerfile",
        "files",
      );
    if (!(name in state.files))
      return result(
        false,
        `cat: ${name}: No such file`,
        `The project file does not exist`,
        `Use ls, then choose one of the listed names.`,
        "ls",
        "files",
      );
    return result(
      true,
      state.files[name],
      `${name} read`,
      `The terminal and Project files view read the same virtual file.`,
      "Edit it in Project files.",
      "files",
    );
  }
  if (tokens[0] === "curl") return curlCommand(tokens);
  if (tokens[0] !== "docker")
    return result(
      false,
      `${tokens[0]}: command not found`,
      `This sandbox focuses on Docker workflows`,
      `Use help, ls, cat, curl, or a docker command.`,
      `help`,
    );
  const group = tokens[1];
  if (group === "--version" || group === "version") return versionCommand();
  if (group === "context") return contextCommand(tokens);
  if (!state.engine.running)
    return result(
      false,
      "Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?",
      "Docker Engine is not running",
      "The Docker CLI is available, but no Engine daemon is accepting requests. Start Docker Engine in the runtime, then retry this command.",
      "Start Docker Engine, then run docker info.",
    );
  if (group === "info") return infoCommand();
  if (group === "pull") return pullCommand(tokens);
  if (group === "images" || (group === "image" && tokens[2] === "ls"))
    return imagesCommand(tokens);
  if (group === "image" && tokens[2] === "inspect")
    return inspectImageCommand(tokens[3]);
  if (group === "tag") return tagImageCommand(tokens);
  if (group === "push") return pushImageCommand(tokens);
  if (group === "image" && tokens[2] === "rm")
    return objectCommand("rmi", ["docker", "rmi", tokens[3]]);
  if (group === "build") return buildCommand(tokens);
  if (group === "history") return historyCommand(tokens);
  if (group === "run") return runContainerCommand(tokens);
  if (group === "ps" || (group === "container" && tokens[2] === "ls"))
    return psCommand(tokens);
  if (
    group === "container" &&
    [
      "stop",
      "start",
      "restart",
      "rm",
      "logs",
      "inspect",
      "stats",
      "top",
      "port",
      "exec",
    ].includes(tokens[2])
  )
    return objectCommand(tokens[2], ["docker", tokens[2], ...tokens.slice(3)]);
  if (
    [
      "stop",
      "start",
      "restart",
      "rm",
      "logs",
      "inspect",
      "stats",
      "top",
      "port",
      "exec",
      "rmi",
    ].includes(group)
  )
    return objectCommand(group, tokens);
  if (group === "volume") return volumeCommand(tokens);
  if (group === "network") return networkCommand(tokens);
  if (group === "compose") return composeCommand(tokens);
  if (group === "system") return systemCommand(tokens);
  return result(
    false,
    `docker: '${group || ""}' is not a supported command here`,
    `Docker did not recognize the command group`,
    `Check spelling or open the command reference.`,
    `docker help`,
  );
}

function executeContainerShell(tokens, raw) {
  const container = state.containers.get(state.shell.container);
  if (!container || container.status !== "running") {
    state.shell.container = null;
    state.shell.cwd = "/app";
    return result(
      false,
      "Connection to container closed",
      "The container shell ended",
      "The container stopped or was removed. Start it again before using docker exec.",
      "docker ps -a",
    );
  }
  const [command, ...args] = tokens;
  if (command === "exit") {
    const name = state.shell.container;
    state.shell.container = null;
    state.shell.cwd = "/app";
    return result(
      true,
      "logout",
      `Exited ${name}`,
      "You returned to the Docker host shell.",
      "docker ps",
    );
  }
  if (command === "pwd")
    return result(
      true,
      state.shell.cwd,
      "Working directory",
      "This path is inside the container filesystem.",
    );
  if (command === "whoami")
    return result(
      true,
      "root",
      "Container user",
      "The sandbox image runs as root unless the image or run configuration changes the user.",
    );
  if (command === "clear")
    return {
      ok: true,
      clear: true,
      text: "",
      title: "Container terminal cleared",
      explanation: "The container session is still active.",
      view: "objects",
    };
  if (command === "cd") {
    state.shell.cwd = args[0] || "/app";
    return result(
      true,
      "",
      `Changed directory to ${state.shell.cwd}`,
      "The shell directory is scoped to this container session.",
    );
  }
  if (command === "ls") {
    const path = args.find((arg) => !arg.startsWith("-")) || state.shell.cwd;
    const files =
      path === "/"
        ? ["app", "bin", "dev", "etc", "tmp", "usr"]
        : Object.keys(container.files || {});
    return result(
      true,
      files.join("  ") || "(directory is empty)",
      `Contents of ${path}`,
      "These files belong to the container image or its writable layer.",
    );
  }
  if (command === "cat") {
    const name = args.find((arg) => !arg.startsWith("-"));
    const content = container.files?.[name];
    return content == null
      ? result(
          false,
          `cat: ${name || "(missing file)"}: No such file or directory`,
          "File not found in this container",
          "The container sees the files baked into its image, not unsaved project editor changes.",
          "ls",
        )
      : result(
          true,
          content,
          `${name} read inside ${container.name}`,
          "This is the image snapshot available to the running container.",
        );
  }
  if (command === "printenv" || command === "env") {
    const values = Object.entries(container.env || {}).map(
      ([key, value]) => `${key}=${value}`,
    );
    return result(
      true,
      values.join("\n") || "(no custom environment variables)",
      "Container environment",
      "These values were set when this container was created.",
    );
  }
  if (command === "echo")
    return result(
      true,
      args.join(" "),
      "Text printed",
      "echo writes text to this shell's output stream.",
    );
  if (command === "node" && (args[0] === "-v" || args[0] === "--version"))
    return result(
      true,
      "v22.1.0",
      "Node.js version",
      "The Node runtime comes from the image's base layer.",
    );
  if (command === "ps")
    return result(
      true,
      "PID   USER   COMMAND\n1     node   node server.js\n14    root   /bin/sh",
      "Processes in container",
      "The main application is PID 1; this shell is an additional process.",
    );
  return result(
    false,
    `/bin/sh: ${command}: not found`,
    "Command not found in container",
    "This shell has a small teaching command set. Try pwd, ls, cat, printenv, echo, node -v, ps, or exit.",
    "ls",
  );
}

function versionCommand() {
  const server = state.engine.running
    ? "Server: Docker Engine · 27.5.1 · linux/amd64"
    : "Server: Cannot connect to the Docker daemon. Start Docker Engine to see server details.";
  return result(
    true,
    `Client: Docker CLI · 27.5.1\n Context: ${state.engine.context}\n${server}`,
    state.engine.running
      ? "CLI and Engine versions checked"
      : "Docker CLI is installed; Engine is offline",
    state.engine.running
      ? "The CLI and server daemon are both responding."
      : "The CLI can print its own version without an Engine, but most Docker commands need the daemon.",
    state.engine.running
      ? "Try docker info."
      : "Start Docker Engine, then run docker version again.",
  );
}

function infoCommand() {
  state.flags.engineChecked = true;
  addEvent("daemon check", "Docker Engine ready");
  return result(
    true,
    `Client: Docker CLI 27.5.1\nServer: Docker Engine 27.5.1\nStorage Driver: overlay2\nContainers: ${state.containers.size}\n Images: ${state.images.size}\nServer Version: 27.5.1\nOperating System: Learning Sandbox Linux\nContext: ${state.engine.context}`,
    "Docker Engine connection verified",
    "The CLI reached the daemon and read its current state. Commands such as pull, build, run, and ps can now use the Engine.",
    "Try docker pull nginx:alpine.",
  );
}

function contextCommand(tokens) {
  const action = tokens[2];
  if (!action || action === "ls")
    return result(
      true,
      `NAME                DESCRIPTION                         DOCKER ENDPOINT\n${state.engine.context === "desktop-linux" ? "*" : " "} desktop-linux       Docker Desktop                     unix:///var/run/docker.sock\n${state.engine.context === "default" ? "*" : " "} default             Current DOCKER_HOST based configuration  unix:///var/run/docker.sock`,
      "Docker contexts listed",
      "A context tells the CLI which Docker daemon to contact. The selected context does not start that daemon.",
      "Try docker context use desktop-linux.",
    );
  if (action === "use") {
    const name = tokens[3];
    if (!["default", "desktop-linux"].includes(name))
      return result(
        false,
        `docker: context ${name || "(missing)"} not found`,
        "Context not found",
        "Choose one of the contexts listed by docker context ls.",
        "docker context ls",
      );
    state.engine.context = name;
    addEvent("context select", name);
    return result(
      true,
      name,
      "Docker context selected",
      "The CLI will use this endpoint for Engine commands. The daemon still needs to be running.",
      "Try docker info.",
    );
  }
  return result(
    false,
    `unknown context command: ${action}`,
    "Context command not recognized",
    "Use ls to inspect contexts or use to select one.",
    "docker context ls",
  );
}

function pullCommand(tokens) {
  const name = tokens[2];
  if (!name)
    return result(
      false,
      "docker pull requires exactly 1 image name",
      "The engine needs an image reference",
      "Add a repository name such as nginx:alpine.",
      "docker pull nginx:alpine",
    );
  state.images.set(name, {
    name,
    id: uid("sha256:"),
    size: name.includes("alpine") ? "23 MB" : "148 MB",
    source: "registry",
    created: "just now",
  });
  addEvent("image pull", name);
  return result(
    true,
    `Pulling from library/${name.split(":")[0]}\nDigest: sha256:${hash(name)}\nStatus: Downloaded newer image for ${name}`,
    "Image downloaded",
    "The registry layers are now stored locally. No container has been created yet.",
    `Run it with docker run --name web ${name}.`,
  );
}
function imagesCommand(tokens = []) {
  const rows = [...state.images.values()];
  const quiet = has(tokens, "-q", "--quiet");
  return result(
    true,
    quiet
      ? rows.map((image) => image.id.slice(0, 12)).join("\n")
      : rows.length
        ? `REPOSITORY          IMAGE ID       SIZE\n${rows.map((i) => `${i.name.padEnd(19)} ${i.id.slice(0, 12).padEnd(14)} ${i.size}`).join("\n")}`
        : "REPOSITORY   IMAGE ID   SIZE\n(no local images)",
    "Local image store listed",
    rows.length
      ? "Each row is a reusable image object."
      : "Pull or build an image before a container can be created.",
    rows.length
      ? "Try docker history followed by an image name."
      : "docker pull nginx:alpine",
  );
}
function inspectImageCommand(name) {
  const image = state.images.get(name);
  if (!image)
    return result(
      false,
      `Error: No such image: ${name || "(missing)"}`,
      "Image not found",
      "List local images and copy the full repository:tag value.",
      "docker images",
    );
  return result(
    true,
    JSON.stringify(
      {
        Id: image.id,
        RepoTags: [image.name],
        Size: image.size,
        Source: image.source,
        BuildInfo:
          image.source === "build"
            ? {
                Stages: image.stages,
                RunsAsNonRoot: image.nonRoot,
                HasHealthcheck: image.healthcheck,
              }
            : undefined,
        BuildLayers:
          image.source === "build"
            ? state.layers.map((layer) => layer.instruction)
            : undefined,
      },
      null,
      2,
    ),
    "Image inspected",
    "An image contains immutable layers and build metadata. Containers add their own writable layer when created.",
    "Try docker run with this image.",
    "build",
  );
}
function buildCommand(tokens) {
  const context = tokens.at(-1),
    tag = option(tokens, "-t", "--tag") || "notes-api:latest";
  if (!context || context.startsWith("-"))
    return result(
      false,
      "docker build requires a build context",
      "Docker needs a folder, URL, or '-' as its context",
      "Use . for the current virtual project.",
      "docker build -t notes-api .",
      "files",
    );
  if (!state.files.Dockerfile)
    return result(
      false,
      "failed to read Dockerfile: no such file",
      "The build has no instruction file",
      "Create a Dockerfile in Project files.",
      "Open Project files",
      "files",
    );
  const lines = state.files.Dockerfile.split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  const baseInstruction = lines.find((line) => line.startsWith("FROM "));
  if (!baseInstruction)
    return result(
      false,
      "failed to solve: Dockerfile must include a FROM instruction",
      "The Dockerfile has no base image",
      "Add a valid FROM image:tag line before build instructions.",
      "Open Project files",
      "files",
    );
  const baseImage = baseInstruction.split(/\s+/)[1];
  if (!state.images.has(baseImage)) {
    state.images.set(baseImage, {
      name: baseImage,
      id: uid("sha256:"),
      size: "112 MB",
      source: "build base",
      created: "just now",
    });
    addEvent("base image resolved", baseImage, "info");
  }
  const allowedInstructions =
    /^(FROM|WORKDIR|COPY|ADD|RUN|ENV|ARG|EXPOSE|CMD|ENTRYPOINT|USER|LABEL|VOLUME|HEALTHCHECK|STOPSIGNAL|SHELL)\b/;
  const invalidInstruction = lines.find(
    (line) => !allowedInstructions.test(line),
  );
  if (invalidInstruction)
    return result(
      false,
      `unknown instruction: ${invalidInstruction.split(/\s+/)[0]}`,
      "Dockerfile instruction is not recognized",
      "Use a Dockerfile keyword such as FROM, COPY, RUN, EXPOSE, or CMD.",
      "Open Project files",
      "files",
    );
  if (
    lines.some((line) => line.startsWith("RUN npm ci")) &&
    !state.files["package-lock.json"]
  )
    return result(
      false,
      "npm ci can only install with an existing package-lock.json",
      "Dependency lockfile is missing",
      "npm ci needs the exact dependency lockfile. Add package-lock.json or change the Dockerfile to use npm install.",
      "Open Project files",
      "files",
    );
  let dependency = "",
    rebuilt = 0;
  state.layers = lines.map((instruction, index) => {
    const input = instruction.startsWith("COPY .")
      ? instruction +
        Object.entries(state.files)
          .map(([k, v]) => k + hash(v))
          .join("")
      : instruction.startsWith("COPY package")
        ? instruction +
          hash(state.files["package.json"] + state.files["package-lock.json"])
        : instruction;
    dependency = hash(dependency + input);
    const cached = state.buildSignatures.get(index) === dependency;
    if (!cached) rebuilt++;
    state.buildSignatures.set(index, dependency);
    return {
      index: index + 1,
      instruction,
      id: dependency,
      cached,
      size: instruction.startsWith("RUN")
        ? "36 MB"
        : instruction.startsWith("FROM")
          ? "112 MB"
          : "2.4 MB",
    };
  });
  state.buildNumber++;
  if (state.buildNumber >= 3 && rebuilt > 0 && rebuilt < lines.length)
    state.flags.sawCacheInvalidation = true;
  state.images.set(tag, {
    name: tag,
    id: `sha256:${hash(tag + dependency)}`,
    size: "151 MB",
    source: "build",
    created: "just now",
    files: { ...state.files },
    stages: lines.filter((instruction) => instruction.startsWith("FROM "))
      .length,
    nonRoot: /(?:^|\n)USER\s+(?!0(?:\s|$)|root(?:\s|$))\S+/im.test(
      lines.join("\n"),
    ),
    healthcheck: lines.some((instruction) =>
      instruction.startsWith("HEALTHCHECK "),
    ),
    healthcheckCommand:
      lines.find((instruction) => instruction.startsWith("HEALTHCHECK ")) ||
      null,
  });
  addEvent("image build", `${tag} · ${rebuilt}/${lines.length} layers rebuilt`);
  const output =
    state.layers
      .map(
        (l) => `#${l.index} ${l.cached ? "CACHED" : "DONE"} ${l.instruction}`,
      )
      .join("\n") + `\nexporting to image ${tag}`;
  return result(
    true,
    output,
    "Image built from the Dockerfile",
    `${lines.length - rebuilt} layer(s) came from cache and ${rebuilt} layer(s) were rebuilt. The Build layers tab shows why.`,
    `Try docker run -d --name notes-web ${tag}.`,
    "build",
  );
}
function tagImageCommand(tokens) {
  const source = tokens[2],
    target = tokens[3];
  const image = state.images.get(source);
  if (!source || !target)
    return result(
      false,
      "docker tag requires SOURCE_IMAGE and TARGET_IMAGE",
      "Tag arguments are missing",
      "Use `docker tag notes-api learner/notes-api:1.0.0`.",
      "docker images",
    );
  if (!image)
    return result(
      false,
      `Error response from daemon: No such image: ${source}`,
      "Source image not found",
      "Build or pull the source image, then tag it.",
      "docker images",
    );
  state.images.set(target, { ...image, name: target, created: "just now" });
  addEvent("image tag", `${source} → ${target}`);
  return result(
    true,
    `Tagged ${source} as ${target}`,
    "Image tag created",
    "A tag is another name for this image ID; it does not rebuild or copy the image layers.",
    `docker push ${target}`,
  );
}
function pushImageCommand(tokens) {
  const name = tokens[2],
    image = state.images.get(name);
  if (!name)
    return result(
      false,
      "docker push requires an image reference",
      "Image reference missing",
      "Tag the local image with a registry namespace first.",
      "docker tag notes-api learner/notes-api:1.0.0",
    );
  if (!image)
    return result(
      false,
      `tag does not exist: ${name}`,
      "Image tag not found",
      "Create the registry tag before pushing.",
      "docker images",
    );
  state.flags.imagePushed = true;
  addEvent("image push", name);
  return result(
    true,
    `The push refers to repository [${name.split(":")[0]}]\n${image.id.slice(0, 12)}: Pushed\n${name.split(":").at(-1)}: digest: sha256:${hash(image.id + name)} size: 1324`,
    "Image pushed to modeled registry",
    "This is a local teaching simulation. No network request or registry account was used.",
    "Explain which immutable image digest your release points to.",
    "build",
  );
}
function historyCommand(tokens) {
  const name = tokens[2];
  if (!state.images.has(name))
    return result(
      false,
      `Error: No such image: ${name || "(missing)"}`,
      "The image is not in the local store",
      "Run docker images and choose an existing image.",
      "docker images",
    );
  const layers = state.layers.length
    ? state.layers
    : [
        {
          id: hash(name),
          instruction: "registry image layers",
          size: state.images.get(name).size,
        },
      ];
  return result(
    true,
    `IMAGE          CREATED BY                         SIZE\n${layers
      .slice()
      .reverse()
      .map(
        (l) =>
          `${l.id.slice(0, 12).padEnd(14)} ${l.instruction.slice(0, 34).padEnd(34)} ${l.size}`,
      )
      .join("\n")}`,
    "Image history inspected",
    "A Docker image is a stack of ordered filesystem and configuration layers.",
    "Open Build layers for a visual view.",
    "build",
  );
}
function runContainerCommand(tokens) {
  const image = imageName(tokens);
  if (!image || image === "run")
    return result(
      false,
      "docker run requires at least 1 image argument",
      "No container template was selected",
      "Put the image name last, after runtime flags.",
      "docker run -d --name notes-web notes-api",
    );
  if (
    !state.images.has(image) &&
    !["postgres:16", "redis:7-alpine"].includes(image)
  )
    return result(
      false,
      `Unable to find image '${image}' locally\nError response from daemon: pull access denied`,
      "The engine cannot create the container",
      "Build the application image or pull a public image first.",
      `docker build -t ${image} .`,
    );
  if (!state.images.has(image))
    state.images.set(image, {
      name: image,
      id: uid("sha256:"),
      size: "146 MB",
      source: "registry",
      created: "just now",
    });
  const name =
    option(tokens, "--name") || `container-${state.containers.size + 1}`;
  if (state.containers.has(name))
    return result(
      false,
      `Conflict. The container name "/${name}" is already in use.`,
      `Container names must be unique`,
      `Start, remove, or choose another name for the existing container.`,
      `docker ps -a`,
    );
  const ports = [],
    mounts = [],
    env = {};
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "-p" || tokens[i] === "--publish") {
      const [host, container] = String(tokens[++i] || "").split(":");
      if (!host || !container)
        return result(
          false,
          "invalid publish opts format",
          "A port mapping needs host:container",
          "Example: -p 8080:3000.",
          "-p 8080:3000",
        );
      if (
        [...state.containers.values()].some(
          (c) => c.status === "running" && c.ports.some((p) => p.host === host),
        )
      )
        return result(
          false,
          `Bind for 0.0.0.0:${host} failed: port is already allocated`,
          `Another running container owns this host port`,
          `Choose a different host port or stop the container using it.`,
          `docker ps`,
        );
      ports.push({ host, container });
    }
    if (tokens[i] === "-v" || tokens[i] === "--volume") {
      const [source, target] = String(tokens[++i] || "").split(":");
      if (!source || !target)
        return result(
          false,
          "invalid volume specification",
          "A mount needs source:target",
          "Example: -v db-data:/var/lib/postgresql/data.",
          "docker volume create db-data",
        );
      if (!state.volumes.has(source))
        state.volumes.set(source, {
          name: source,
          driver: "local",
          created: "just now",
        });
      mounts.push({ source, target });
    }
    if (tokens[i] === "-e" || tokens[i] === "--env") {
      const pair = String(tokens[++i] || "");
      const split = pair.indexOf("=");
      if (split < 1)
        return result(
          false,
          "invalid environment variable",
          "Environment input needs KEY=value",
          "Example: -e NODE_ENV=production.",
          "-e NODE_ENV=production",
        );
      env[pair.slice(0, split)] = pair.slice(split + 1);
    }
  }
  const imageMetadata = state.images.get(image);
  const healthCommand =
    option(tokens, "--health-cmd") || imageMetadata?.healthcheckCommand || "";
  const healthcheck = Boolean(
    imageMetadata?.healthcheck || has(tokens, "--health-cmd"),
  );
  const health =
    healthcheck && /(?:exit\s+1|\bfalse\b)/i.test(healthCommand)
      ? "unhealthy"
      : healthcheck
        ? "healthy"
        : "none";
  const requestedNetwork = option(tokens, "--network");
  if (requestedNetwork && !state.networks.has(requestedNetwork))
    return result(
      false,
      `network ${requestedNetwork} not found`,
      "The requested network does not exist",
      "Create it first or omit --network to use bridge.",
      `docker network create ${requestedNetwork}`,
    );
  const container = {
    id: uid("c"),
    name,
    image,
    files: {
      ...(state.images.get(image)?.files ||
        (image.includes("notes") ? state.files : {})),
    },
    status: "running",
    health,
    healthcheck,
    restart: option(tokens, "--restart") || "no",
    memory: option(tokens, "--memory") || null,
    cpus: option(tokens, "--cpus") || null,
    user:
      option(tokens, "--user") || (imageMetadata?.nonRoot ? "node" : "root"),
    readOnly: has(tokens, "--read-only"),
    capDrop: option(tokens, "--cap-drop") || null,
    ports,
    mounts,
    env,
    networks: new Set(),
    logs: [
      `${name} | process started`,
      ` ${name} | listening on 0.0.0.0:${image.includes("postgres") ? "5432" : "3000"}`,
    ],
    created: "just now",
    exitCode: null,
  };
  state.containers.set(name, container);
  attach(container, requestedNetwork || "bridge");
  addEvent("container create", `${name} from ${image}`);
  addEvent("container start", name);
  return result(
    true,
    container.id,
    "Container created and started",
    `The engine created a writable layer, stored runtime settings, attached ${requestedNetwork || "bridge"}, and started the image's default process.`,
    ports.length
      ? "Open Network to inspect the published path."
      : "Use docker ps to verify it.",
    ports.length ? "network" : "objects",
  );
}
function psCommand(tokens) {
  const all = has(tokens, "-a", "--all");
  const quiet = has(tokens, "-q", "--quiet");
  const rows = [...state.containers.values()].filter(
    (c) => all || c.status === "running",
  );
  return result(
    true,
    rows.length
      ? quiet
        ? rows.map((c) => c.id.slice(0, 12)).join("\n")
        : `CONTAINER ID  IMAGE             STATUS       PORTS                    NAMES\n${rows
            .map(
              (c) =>
                `${c.id.slice(0, 12).padEnd(13)} ${c.image.padEnd(17)} ${(c.status === "running" ? `Up${c.healthcheck ? ` (${c.health})` : ""}` : "Exited (0)").padEnd(19)} ${c.ports
                  .map((p) => `0.0.0.0:${p.host}->${p.container}/tcp`)
                  .join(", ")
                  .padEnd(24)} ${c.name}`,
            )
            .join("\n")}`
      : quiet
        ? ""
        : "CONTAINER ID  IMAGE  STATUS  PORTS  NAMES\n(no matching containers)",
    all ? "All containers listed" : "Running containers listed",
    all
      ? "Stopped containers remain until removed."
      : "Use -a when you also need stopped containers.",
    all ? "Try docker start on a stopped container." : "docker ps -a",
  );
}
function objectCommand(action, tokens) {
  if (action === "rmi") {
    const name = tokens[2];
    if ([...state.containers.values()].some((c) => c.image === name))
      return result(
        false,
        `conflict: unable to remove ${name}; image is being used by a container`,
        "The image still has dependent containers",
        "Remove those containers before the image.",
        "docker ps -a",
      );
    const removed = state.images.delete(name);
    if (removed) addEvent("image remove", name);
    return removed
      ? result(
          true,
          `Untagged: ${name}`,
          "Image removed",
          "Container objects and images have separate lifecycles.",
        )
      : result(
          false,
          `No such image: ${name}`,
          "Nothing was removed",
          "List local images before removing one.",
          "docker images",
        );
  }
  const name =
    action === "exec" || action === "rm" || action === "logs"
      ? tokens.find(
          (t, i) =>
            i > 1 &&
            !t.startsWith("-") &&
            t !== "sh" &&
            t !== "bash" &&
            !/^\d+$/.test(t),
        )
      : tokens[2];
  const c = state.containers.get(name);
  if (!c)
    return result(
      false,
      `Error response from daemon: No such container: ${name || "(missing)"}`,
      "The container name does not exist",
      "List all containers and copy a valid name.",
      "docker ps -a",
    );
  if (action === "stop") {
    if (c.status !== "running")
      return result(
        false,
        `${name} is not running`,
        "The process is already stopped",
        "Start it or remove the container.",
        `docker start ${name}`,
      );
    c.status = "stopped";
    c.exitCode = 0;
    state.flags.lifecycleStopped = true;
    addEvent("container stop", name);
    return result(
      true,
      name,
      "Container stopped",
      "The process ended, but the container configuration and writable layer remain.",
      `docker start ${name}`,
    );
  }
  if (action === "start") {
    if (c.status === "running")
      return result(
        false,
        `${name} is already running`,
        "Start only applies to stopped containers",
        "Use restart if you need a process restart.",
        `docker restart ${name}`,
      );
    c.status = "running";
    c.exitCode = null;
    if (state.flags.lifecycleStopped) state.flags.lifecycleRecovered = true;
    addEvent("container start", name);
    return result(
      true,
      name,
      "Existing container started",
      "Docker reused this container's saved ports, mounts, environment, and writable layer.",
      "docker inspect " + name,
    );
  }
  if (action === "restart") {
    c.status = "running";
    c.logs.push(`${name} | process restarted`);
    addEvent("container restart", name);
    return result(
      true,
      name,
      "Container process restarted",
      "The same container object stopped and started with its existing configuration.",
      "docker logs " + name,
    );
  }
  if (action === "rm") {
    if (c.status === "running" && !has(tokens, "-f", "--force"))
      return result(
        false,
        `cannot remove container "${name}": container is running`,
        `Docker protects running containers from accidental deletion`,
        `Stop it first, or use -f when you intentionally want a forced removal.`,
        `docker stop ${name}`,
      );
    detachAll(c);
    state.containers.delete(name);
    addEvent("container remove", name);
    return result(
      true,
      name,
      "Container removed",
      "The image and named volumes still exist as separate objects.",
      "docker images",
    );
  }
  if (action === "logs") state.flags.readLogs = true;
  if (action === "logs")
    return result(
      true,
      has(tokens, "--tail")
        ? c.logs
            .slice(-Math.max(0, Number(option(tokens, "--tail") || 10)))
            .join("\n")
        : c.logs.join("\n"),
      "Container logs read",
      "Docker collects stdout and stderr from the main container process.",
      "Use --follow in a real terminal to stream new lines.",
    );
  if (action === "inspect") {
    if (Object.keys(c.env).length) state.flags.inspectedEnv = true;
    if (c.status === "running") state.flags.inspectedRunning = true;
    if (c.healthcheck) state.flags.healthChecked = true;
    if (c.name === "guarded-api") state.flags.inspectedGuarded = true;
    if (c.name === "hardened-api") state.flags.inspectedHardened = true;
    if (c.name === "broken-api") state.flags.debuggedBadPort = true;
    return result(
      true,
      JSON.stringify(
        {
          Id: c.id,
          Name: `/${c.name}`,
          Config: {
            Image: c.image,
            User: c.user,
            Env: Object.entries(c.env).map(([k, v]) => `${k}=${v}`),
          },
          State: {
            Status: c.status,
            Running: c.status === "running",
            Health: c.health,
            ExitCode: c.exitCode ?? 0,
          },
          HostConfig: {
            RestartPolicy: { Name: c.restart },
            Memory: c.memory,
            NanoCpus: c.cpus,
            ReadonlyRootfs: c.readOnly,
            CapDrop: c.capDrop ? [c.capDrop] : [],
          },
          NetworkSettings: {
            Ports: Object.fromEntries(
              c.ports.map((p) => [
                `${p.container}/tcp`,
                [{ HostIp: "0.0.0.0", HostPort: p.host }],
              ]),
            ),
            Networks: Object.fromEntries(
              [...c.networks].map((n) => [
                n,
                {
                  IPAddress: `172.20.0.${[...state.containers.keys()].indexOf(c.name) + 2}`,
                },
              ]),
            ),
          },
          Mounts: c.mounts,
        },
        null,
        2,
      ),
      "Container configuration inspected",
      "Inspect shows what the engine actually applied, which is often more useful than the command you intended to run.",
      c.name === "broken-api"
        ? "The app listens on 3000, but this container maps host 9090 to 9999. Recreate it with -p 9090:3000."
        : "Compare Config, State, Ports, Networks, and Mounts.",
      c.ports.length ? "network" : "objects",
    );
  }
  if (action === "stats")
    return result(
      true,
      `NAME         CPU %    MEM USAGE / LIMIT    NET I/O\n${c.name.padEnd(13)} 0.18%    34.2MiB / 1GiB       1.2kB / 860B`,
      "Live resource sample",
      "A real docker stats stream updates continuously. This sandbox shows a representative snapshot.",
      "Stop the stream with Ctrl+C in a real terminal.",
    );
  if (action === "top")
    return result(
      true,
      `PID   USER   COMMAND\n1     node   node server.js`,
      "Container processes listed",
      "The container remains alive while its PID 1 process remains alive.",
      "docker logs " + name,
    );
  if (action === "port")
    return result(
      true,
      c.ports.length
        ? c.ports
            .map((p) => `${p.container}/tcp -> 0.0.0.0:${p.host}`)
            .join("\n")
        : "(no published ports)",
      "Published ports inspected",
      "Only published ports create a host-to-container path.",
      "Open Network for the visual route.",
      "network",
    );
  if (action === "exec") {
    if (c.status !== "running")
      return result(
        false,
        `Container ${name} is not running`,
        `exec needs a live container process`,
        `Start the container before opening a second process inside it.`,
        `docker start ${name}`,
      );
    const nameIndex = tokens.indexOf(name, 2);
    const command = tokens.slice(nameIndex + 1);
    const shellIndex = command.findIndex(
      (token) => token === "sh" || token === "bash",
    );
    if (shellIndex >= 0 && !command.includes("-c")) {
      state.shell.container = name;
      state.shell.cwd = "/app";
      addEvent("container exec", `${name} · interactive shell`);
      return result(
        true,
        `Connected to ${name}.\nTry pwd, ls, cat server.js, printenv, or exit.`,
        `Interactive shell opened in ${name}`,
        "docker exec starts an additional process inside this running container. Commands now run in the container until you type exit.",
        "Try ls.",
      );
    }
    const shellCommand = command.filter(
      (token) => !["-it", "-i", "-t", "sh", "bash"].includes(token),
    );
    if (!shellCommand.length)
      return result(
        false,
        "docker exec requires a command",
        "No process was provided",
        "Add sh for an interactive session or a command such as ls.",
        `docker exec -it ${name} sh`,
      );
    const commandResult = executeContainerShellFor(name, shellCommand);
    return result(
      commandResult.ok,
      commandResult.text,
      `Command ran inside ${name}`,
      commandResult.explanation,
      commandResult.next,
    );
  }
}
function executeContainerShellFor(name, tokens) {
  const previous = state.shell;
  state.shell = { container: name, cwd: "/app" };
  const response = executeContainerShell(tokens, tokens.join(" "));
  state.shell = previous;
  return response;
}
function volumeCommand(tokens) {
  const action = tokens[2],
    name = tokens[3];
  if (action === "ls")
    return result(
      true,
      `DRIVER  VOLUME NAME\n${[...state.volumes.values()].map((v) => `local   ${v.name}`).join("\n") || "(no named volumes)"}`,
      "Named volumes listed",
      "Volumes have a lifecycle independent from containers.",
      "docker volume create db-data",
    );
  if (action === "create") {
    if (!name)
      return result(
        false,
        "volume name is required",
        "Docker needs a name for the storage object",
        "Provide a short reusable name.",
        "docker volume create db-data",
      );
    if (!state.volumes.has(name)) {
      state.volumes.set(name, { name, driver: "local", created: "just now" });
      addEvent("volume create", name);
    }
    return result(
      true,
      name,
      "Named volume ready",
      "The volume exists but stores data only after a container mounts and writes to it.",
      `docker run -d --name notes-db -v ${name}:/var/lib/postgresql/data postgres:16`,
    );
  }
  if (action === "inspect") {
    const v = state.volumes.get(name);
    return v
      ? result(
          true,
          JSON.stringify(
            {
              Name: name,
              Driver: "local",
              Mountpoint: `/var/lib/docker/volumes/${name}/_data`,
            },
            null,
            2,
          ),
          "Volume inspected",
          "The mount point is engine-managed; containers access it through a mount target.",
        )
      : result(
          false,
          `no such volume: ${name}`,
          "The volume does not exist",
          "List or create it first.",
          "docker volume ls",
        );
  }
  if (action === "rm") {
    const used = [...state.containers.values()].some((c) =>
      c.mounts.some((m) => m.source === name),
    );
    if (used)
      return result(
        false,
        `remove ${name}: volume is in use`,
        "A container still references this volume",
        "Remove that container first. Stopping it is not enough.",
        "docker ps -a",
      );
    const removed = state.volumes.delete(name);
    if (removed) addEvent("volume remove", name);
    return removed
      ? result(
          true,
          name,
          "Volume removed",
          "Its stored sandbox data is now gone.",
        )
      : result(
          false,
          `no such volume: ${name}`,
          "Nothing was removed",
          "Use docker volume ls.",
          "docker volume ls",
        );
  }
  return result(
    false,
    `unknown volume command: ${action || ""}`,
    "Volume subcommand not recognized",
    "Use create, ls, inspect, or rm.",
    "docker volume ls",
  );
}
function networkCommand(tokens) {
  const action = tokens[2],
    name = tokens[3];
  if (action === "ls")
    return result(
      true,
      `NETWORK ID  NAME       DRIVER\n${[...state.networks.values()].map((n) => `${hash(n.name).slice(0, 10)}  ${n.name.padEnd(10)} ${n.driver}`).join("\n")}`,
      "Networks listed",
      "User-defined bridge networks include automatic container-name DNS.",
      "docker network create app-net",
      "network",
    );
  if (action === "create") {
    if (!name)
      return result(
        false,
        "network name is required",
        "Docker needs a network name",
        "Provide one after create.",
        "docker network create app-net",
      );
    if (!state.networks.has(name)) {
      state.networks.set(name, {
        name,
        driver: "bridge",
        containers: new Set(),
      });
      addEvent("network create", name);
    }
    return result(
      true,
      hash(name),
      "Network created",
      "It has no members until containers join during run or with network connect.",
      `docker network connect ${name} notes-web`,
      "network",
    );
  }
  if (action === "connect") {
    const containerName = tokens[4],
      network = state.networks.get(name),
      c = state.containers.get(containerName);
    if (!network)
      return result(
        false,
        `network ${name} not found`,
        "The target network does not exist",
        "Create it first.",
        `docker network create ${name}`,
      );
    if (!c)
      return result(
        false,
        `container ${containerName} not found`,
        "The network member must be an existing container",
        "List containers and use a valid name.",
        "docker ps -a",
      );
    attach(c, name);
    addEvent("network connect", `${containerName} → ${name}`);
    return result(
      true,
      "",
      "Container connected to network",
      `${containerName} can now resolve other members of ${name} by name.`,
      `docker network inspect ${name}`,
      "network",
    );
  }
  if (action === "disconnect") {
    const containerName = tokens[4];
    const network = state.networks.get(name);
    const container = state.containers.get(containerName);
    if (!network)
      return result(
        false,
        `network ${name} not found`,
        "Network not found",
        "List networks or create this one first.",
        "docker network ls",
      );
    if (!container || !network.containers.has(containerName))
      return result(
        false,
        `container ${containerName || "(missing)"} is not connected to ${name}`,
        "No matching network endpoint",
        "Inspect the network and choose a current member.",
        `docker network inspect ${name}`,
      );
    network.containers.delete(containerName);
    container.networks.delete(name);
    addEvent("network disconnect", `${containerName} ← ${name}`);
    return result(
      true,
      "",
      "Container disconnected",
      `${containerName} no longer shares private traffic or Docker DNS on ${name}.`,
      `docker network inspect ${name}`,
      "network",
    );
  }
  if (action === "inspect") {
    const n = state.networks.get(name);
    return n
      ? result(
          true,
          JSON.stringify(
            { Name: n.name, Driver: n.driver, Containers: [...n.containers] },
            null,
            2,
          ),
          "Network inspected",
          "The member list is the set of containers that can use this network's DNS and private traffic.",
          "Open Network for the topology.",
          "network",
        )
      : result(
          false,
          `network ${name} not found`,
          "The network does not exist",
          "List networks first.",
          "docker network ls",
        );
  }
  if (action === "rm") {
    const n = state.networks.get(name);
    if (!n)
      return result(
        false,
        `network ${name} not found`,
        "Nothing was removed",
        "List networks first.",
        "docker network ls",
      );
    if (n.containers.size)
      return result(
        false,
        `network ${name} has active endpoints`,
        "Containers are still connected",
        "Remove or disconnect the containers before removing the network.",
        `docker network inspect ${name}`,
      );
    state.networks.delete(name);
    addEvent("network remove", name);
    return result(
      true,
      name,
      "Network removed",
      "Its private address space and DNS scope were removed.",
      "docker network ls",
      "network",
    );
  }
  return result(
    false,
    `unknown network command: ${action || ""}`,
    "Network subcommand not recognized",
    "Use create, ls, connect, inspect, or rm.",
    "docker network ls",
  );
}
function composeCommand(tokens) {
  const action = tokens[2];
  if (action === "config") {
    state.flags.composeConfigValidated = true;
    return result(
      true,
      state.files["compose.yaml"],
      "Compose model rendered",
      "This is the project definition Compose will turn into engine objects.",
      "docker compose up -d",
      "files",
    );
  }
  if (action === "up") {
    const occupiedPort = [...state.containers.values()].find(
      (container) =>
        container.status === "running" &&
        !container.name.startsWith("notes-api-") &&
        container.ports.some((port) => port.host === "8080"),
    );
    if (occupiedPort)
      return result(
        false,
        "Bind for 0.0.0.0:8080 failed: port is already allocated",
        "Compose cannot publish its app port",
        `Stop ${occupiedPort.name} or edit compose.yaml to use a different host port.`,
        `docker stop ${occupiedPort.name}`,
        "files",
      );
    state.images.set(
      "notes-api",
      state.images.get("notes-api") || {
        name: "notes-api",
        id: uid("sha256:"),
        size: "151 MB",
        source: "compose build",
        created: "just now",
      },
    );
    state.images.set("postgres:16", {
      name: "postgres:16",
      id: uid("sha256:"),
      size: "248 MB",
      source: "registry",
      created: "just now",
    });
    state.volumes.set("notes-api_db-data", {
      name: "notes-api_db-data",
      driver: "local",
      created: "just now",
    });
    const network = ensureNetwork("notes-api_default");
    const services = [
      ["notes-api-app", "notes-api", [{ host: "8080", container: "3000" }], []],
      [
        "notes-api-db",
        "postgres:16",
        [],
        [{ source: "notes-api_db-data", target: "/var/lib/postgresql/data" }],
      ],
    ];
    for (const [name, image, ports, mounts] of services) {
      if (state.containers.has(name)) {
        const existing = state.containers.get(name);
        if (existing.status !== "running") {
          existing.status = "running";
          existing.exitCode = null;
          existing.logs.push(`${name} | started by compose`);
          attach(existing, network.name);
          addEvent("compose start", name);
        }
        continue;
      }
      const container = {
        id: uid("c"),
        name,
        image,
        files: name.endsWith("app") ? { ...state.files } : {},
        status: "running",
        ports,
        mounts,
        env: name.endsWith("app") ? { DATABASE_HOST: "db" } : {},
        networks: new Set(),
        logs: [
          `${name} | started`,
          `${name} | ${name.endsWith("db") ? "database ready" : "listening on 3000"}`,
        ],
        created: "just now",
        exitCode: null,
      };
      state.containers.set(name, container);
      attach(container, network.name);
      addEvent("compose start", name);
    }
    state.compose.running = true;
    return result(
      true,
      "[+] Running 4/4\n ✔ Network notes-api_default  Created\n ✔ Volume notes-api_db-data   Created\n ✔ Container notes-api-db     Started\n ✔ Container notes-api-app    Started",
      "Compose project is running",
      "Compose translated one YAML model into images, containers, a network, a volume, environment, and a published port.",
      "curl http://localhost:8080",
      "network",
    );
  }
  if (action === "ps")
    return result(
      true,
      [...state.containers.values()]
        .filter((c) => c.name.startsWith("notes-api-"))
        .map(
          (c) =>
            `${c.name.padEnd(18)} ${c.status.padEnd(9)} ${c.ports.map((p) => `${p.host}->${p.container}`).join(",")}`,
        )
        .join("\n") || "(project is not running)",
      "Compose services listed",
      "This view filters engine containers to the current project.",
      "docker compose logs",
    );
  if (action === "logs")
    return result(
      true,
      [...state.containers.values()]
        .filter((c) => c.name.startsWith("notes-api-"))
        .flatMap((c) => c.logs)
        .join("\n") || "no running project",
      "Compose logs combined",
      "Compose prefixes output so several service streams remain distinguishable.",
      "docker compose ps",
    );
  if (action === "down") {
    for (const [name, container] of [...state.containers])
      if (name.startsWith("notes-api-")) {
        detachAll(container);
        state.containers.delete(name);
        addEvent("compose remove", name);
      }
    state.networks.delete("notes-api_default");
    state.compose.running = false;
    return result(
      true,
      "[+] Removed project containers and network",
      "Compose project stopped and removed",
      "The named volume remains by default so database data can survive the next up.",
      "Use docker compose up -d to recreate it.",
      "objects",
    );
  }
  return result(
    false,
    `unknown compose command: ${action || ""}`,
    "Compose subcommand not recognized",
    "Use config, up -d, ps, logs, or down.",
    "docker compose config",
  );
}
function systemCommand(tokens) {
  if (tokens[2] === "df") {
    state.flags.reviewedDisk = true;
    const size = [...state.images.values()].reduce(
      (sum, i) => sum + parseInt(i.size),
      0,
    );
    return result(
      true,
      `TYPE            TOTAL  ACTIVE  SIZE\nImages          ${state.images.size}      ${new Set([...state.containers.values()].map((c) => c.image)).size}       ${size || 0} MB\nContainers      ${state.containers.size}      ${[...state.containers.values()].filter((c) => c.status === "running").length}       ${state.containers.size * 4} MB\nLocal Volumes   ${state.volumes.size}      ${[...state.volumes.keys()].filter((v) => [...state.containers.values()].some((c) => c.mounts.some((m) => m.source === v))).length}       ${state.volumes.size * 24} MB\nBuild Cache     ${state.layers.length}      0       ${state.layers.length * 6} MB`,
      "Docker disk usage summarized",
      "Objects consume storage independently and have different cleanup rules.",
      "Inspect before removing unused data.",
    );
  }
  if (tokens[2] === "prune")
    return result(
      false,
      "Prune preview: unused stopped containers, dangling images, and build cache",
      "Cleanup requires deliberate confirmation",
      "This teaching sandbox does not auto-delete several object types at once. Remove known objects individually so their lifecycles stay visible.",
      "docker ps -a",
    );
  return result(
    false,
    "unknown system command",
    "System subcommand not recognized",
    "Use docker system df or docker system prune.",
    "docker system df",
  );
}
function curlCommand(tokens) {
  const url = tokens[1] || "",
    match = url.match(/localhost:(\d+)/),
    host = match?.[1] || "80",
    c = [...state.containers.values()].find(
      (item) =>
        item.status === "running" && item.ports.some((p) => p.host === host),
    );
  if (!c)
    return result(
      false,
      `curl: (7) Failed to connect to localhost port ${host}: Connection refused`,
      `No running container owns that host port`,
      `Check docker ps and the left side of each -p host:container mapping.`,
      `docker ps`,
    );
  const mapping = c.ports.find((p) => p.host === host);
  if (mapping.container !== "3000" && c.image.includes("notes")) {
    if (c.name === "broken-api") state.flags.debuggedBadPort = true;
    return result(
      false,
      `curl: (52) Empty reply from server`,
      `Traffic reached the container, but the target port has no Notes API process`,
      `The Notes API listens on container port 3000. Recreate the container with ${host}:3000.`,
      `docker inspect ${c.name}`,
      "network",
    );
  }
  state.flags.curlSuccess = true;
  c.logs.push(`${c.name} | GET / 200`);
  addEvent(
    "http request",
    `localhost:${host} → ${c.name}:${mapping.container}`,
  );
  return result(
    true,
    `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"ok":true,"service":"notes-api","container":"${c.name}"}`,
    "Published service reached",
    "The request traveled from the host port through Docker’s forwarding rule to the container process.",
    `docker logs ${c.name}`,
    "network",
  );
}
function commandReference() {
  return `ENGINE & CLIENT\n  docker version · docker info · docker context ls · docker context use NAME\nPROJECT\n  ls · cat Dockerfile · pwd · clear\nIMAGES\n  docker pull IMAGE · docker build -t TAG . · docker images [-q] · docker image inspect IMAGE · docker history IMAGE · docker tag SOURCE TARGET · docker push IMAGE · docker rmi IMAGE\nCONTAINERS\n  docker run -d --name NAME [--restart POLICY] [--memory LIMIT] [--cpus N] [--user UID] [--read-only] [-p HOST:CONTAINER] [-e KEY=VALUE] [-v SOURCE:TARGET] [--network NET] IMAGE\n  docker ps [-a] [-q] · docker stop|start|restart|rm [-f] NAME · docker logs [--tail N] NAME · docker inspect|stats|top|port NAME · docker exec -it NAME sh\n  In a container shell: pwd · ls · cat FILE · cd DIR · printenv · echo TEXT · node -v · ps · exit\nSTORAGE & NETWORK\n  docker volume create|ls|inspect|rm · docker network create|ls|connect|disconnect|inspect|rm\nCOMPOSE & SYSTEM\n  docker compose config|up -d|ps|logs|down · docker system df|prune · curl http://localhost:PORT`;
}

function renderChapter(index) {
  activeChapter = index;
  try { localStorage.setItem("docker-course-state", JSON.stringify({ active: index })); } catch {}
  const lesson = lessons[index];
  const level =
    index < 4
      ? "FOUNDATION"
      : index < 12
        ? "APPLIED PRACTICE"
        : "INTERVIEW-READY";
  $$("#chapterNav button").forEach((b, i) =>
    b.classList.toggle("active", i === index),
  );
  $("#lessonKicker").textContent = `${lesson.kicker} · ${level}`;
  $("#lessonTitle").textContent = lesson.title;
  $("#lessonSummary").textContent = lesson.summary;
  $("#lessonTags").innerHTML = lesson.tags
    .map((t) => `<span>${escapeHtml(t)}</span>`)
    .join("");
  $("#lessonModelTitle").textContent = lesson.modelTitle;
  $("#lessonModel").textContent = lesson.model;
  $("#conceptStrip").innerHTML = lesson.concepts
    .map(
      ([title, text]) =>
        `<article><b>${escapeHtml(title)}</b><p>${escapeHtml(text)}</p></article>`,
    )
    .join("");
  const guide = lessonGuides[index];
  $("#lessonContext").innerHTML =
    `<div class="lesson-context-head"><span>WHY THIS MATTERS</span><b>${level}</b></div><p class="context-explanation">${escapeHtml(guide.why)}</p><div class="context-cards"><article><b>Where you will use it</b><p>${escapeHtml(guide.realUse)}</p></article><article><b>Common mistake</b><p>${escapeHtml(guide.commonTrap)}</p></article></div><div class="context-check"><span>LEARNING CHECK</span><p>${escapeHtml(guide.checkpoint)}</p></div>`;
  $("#missionTitle").textContent = lesson.mission.title;
  $("#missionPrompt").textContent = lesson.mission.prompt;
  $("#missionSteps").innerHTML = lesson.mission.steps
    .map((s) => `<span>${escapeHtml(s)}</span>`)
    .join("");
  $("#missionHint").textContent = lesson.mission.hint;
  $("#loadMission").textContent = "Load starting command";
  $("#chapterCounter").textContent =
    `${String(index + 1).padStart(2, "0")} / ${lessons.length}`;
  $("#previousChapter").disabled = index === 0;
  $("#nextChapter").textContent =
    index === lessons.length - 1 ? "Go to final checks ↓" : "Next chapter →";
  $("#capstone").hidden = index !== lessons.length - 1;
  updateMission();
  if (index === lessons.length - 1) renderCapstone();
}
function updateMission() {
  const done = lessons[activeChapter].mission.check(state);
  $("#chapterMission").classList.toggle("complete", done);
  $("#missionState").textContent = done ? "✓ COMPLETE" : "NOT STARTED";
}
function renderAll() {
  renderEngine();
  renderCourseProgress();
  renderObjects();
  renderFiles();
  renderNetwork();
  renderBuild();
  renderEvents();
  updateMission();
  renderCapstone();
}
function renderCourseProgress() {
  const complete = lessons.filter((lesson) =>
    lesson.mission.check(state),
  ).length;
  $("#progressText").textContent =
    `${String(complete).padStart(2, "0")} / ${lessons.length}`;
  $("#progressFill").style.width = `${(complete / lessons.length) * 100}%`;
}
function renderEngine() {
  const online = state.engine.running;
  const labStatus = $("#labStatus");
  labStatus.classList.toggle("offline", !online);
  labStatus.classList.toggle("online", online);
  $("#labRuntimeStatus").textContent = online
    ? "DOCKER ENGINE RUNNING"
    : "DOCKER ENGINE OFF";
  $("#engineBadge").classList.toggle("offline", !online);
  $("#engineBadge").classList.toggle("online", online);
  $("#engineBadge").innerHTML =
    `<i></i>DOCKER ENGINE ${online ? "RUNNING" : "OFF"}`;
  $("#startEngine").textContent = online
    ? "Stop Docker Engine"
    : "Start Docker Engine";
  $("#startEngine").classList.toggle("is-running", online);
  $("#startEngine").disabled = engineBusy || commandBusy;
  $("#resetRuntime").disabled = engineBusy || commandBusy;
  const offlineButton = $("#engineOffline [data-start-engine]");
  if (offlineButton) offlineButton.disabled = engineBusy || online;
  $("#engineOffline").hidden = online;
  $(".engine-panel").classList.toggle("is-offline", !online);
  $("#terminalInput").disabled = commandBusy || engineBusy;
  $("#terminalForm button[aria-label='Run command']").disabled =
    commandBusy || engineBusy;
  $(".panel-bar b").textContent = state.shell.container
    ? `root@${state.shell.container}:/app`
    : "learner@docker-lab:~/notes-api";
  $(".terminal-prompt label").textContent = state.shell.container
    ? `root@${state.shell.container}:/app #`
    : "learner@lab:~/notes-api $";
  $("#terminalInput").placeholder = state.shell.container
    ? "Try: ls, cat server.js, printenv, or exit"
    : "Try: docker build -t notes-api .";
}
function renderObjects() {
  const containers = [...state.containers.values()],
    running = containers.filter((c) => c.status === "running");
  $("#engineSummary").innerHTML = [
    ["ENGINE", state.engine.running ? "READY" : "OFFLINE"],
    ["RUNNING", running.length],
    ["NETWORKS", state.networks.size],
    ["VOLUMES", state.volumes.size],
  ]
    .map(([l, v]) => `<article><span>${l}</span><b>${v}</b></article>`)
    .join("");
  $("#containerCount").textContent = containers.length;
  $("#imageCount").textContent = state.images.size;
  $("#volumeCount").textContent = state.volumes.size;
  $("#objectCount").textContent =
    state.images.size +
    containers.length +
    state.volumes.size +
    state.networks.size;
  $("#containerList").innerHTML = containers.length
    ? containers
        .map(
          (c) =>
            `<article class="container-card"><div class="container-identity"><span class="container-icon">▰</span><div><b><i class="state-dot ${c.status === "running" ? "running" : ""}"></i>${escapeHtml(c.name)}</b><small>${escapeHtml(c.image)} · ${c.status}${c.ports.length ? " · " + c.ports.map((p) => p.host + "→" + p.container).join(", ") : ""}</small></div></div><div class="container-actions">${c.status === "running" ? `<button data-cmd="docker stop ${escapeHtml(c.name)}">Stop</button>` : `<button data-cmd="docker start ${escapeHtml(c.name)}">Start</button>`}<button data-cmd="docker logs ${escapeHtml(c.name)}">Logs</button><button data-cmd="docker inspect ${escapeHtml(c.name)}">Inspect</button><button data-cmd="docker rm ${escapeHtml(c.name)}">Remove</button></div></article>`,
        )
        .join("")
    : '<div class="empty-object">No containers yet. Try <code>docker run</code> after pulling or building an image.</div>';
  $("#imageList").innerHTML = state.images.size
    ? [...state.images.values()]
        .map(
          (i) =>
            `<div class="compact-item"><b>${escapeHtml(i.name)}</b><small>${i.size}</small></div>`,
        )
        .join("")
    : '<div class="empty-object">No images</div>';
  $("#volumeList").innerHTML = state.volumes.size
    ? [...state.volumes.values()]
        .map(
          (v) =>
            `<div class="compact-item"><b>${escapeHtml(v.name)}</b><small>${[...state.containers.values()].filter((c) => c.mounts.some((m) => m.source === v.name)).length} mount(s)</small></div>`,
        )
        .join("")
    : '<div class="empty-object">No volumes</div>';
  $$(".container-actions button").forEach(
    (b) => (b.onclick = () => runCommand(b.dataset.cmd)),
  );
}
function renderFiles() {
  const tabs = $("#fileTabs");
  tabs.innerHTML = Object.keys(state.files)
    .map(
      (name) =>
        `<button class="${name === activeFile ? "active" : ""}" data-file="${escapeHtml(name)}">${escapeHtml(name)}</button>`,
    )
    .join("");
  tabs.querySelectorAll("button").forEach(
    (b) =>
      (b.onclick = () => {
        if (fileDirty && !confirm("Discard unsaved changes?")) return;
        activeFile = b.dataset.file;
        fileDirty = false;
        renderFiles();
      }),
  );
  $("#activeFileName").textContent = activeFile;
  if (!fileDirty) $("#fileEditor").value = state.files[activeFile];
  $("#fileDirty").textContent = fileDirty ? "UNSAVED" : "SAVED";
  $("#fileDirty").className = fileDirty ? "dirty" : "";
}
function renderNetwork() {
  const userNetworks = [...state.networks.values()];
  $("#networkCanvas").innerHTML =
    `<div class="network-host"><span>HOST MACHINE · localhost</span>${userNetworks
      .map(
        (n) =>
          `<section class="network-zone"><header><b>${escapeHtml(n.name)}</b><span>${n.driver} network · Docker DNS</span></header><div class="network-nodes">${
            [...n.containers].length
              ? [...n.containers]
                  .map((name, i) => {
                    const c = state.containers.get(name);
                    return `<article class="network-node"><b>${escapeHtml(name)}</b><small>172.20.${userNetworks.indexOf(n)}.${i + 2}</small><small>${c?.status || "removed"}</small></article>${i < [...n.containers].length - 1 ? '<span class="network-arrow">↔</span>' : ""}`;
                  })
                  .join("")
              : '<article class="network-node"><b>No members</b><small>connect a container</small></article>'
          }</div></section>`,
      )
      .join("")}</div>`;
  const mappings = [...state.containers.values()].flatMap((c) =>
    c.ports.map((p) => ({ name: c.name, ...p, status: c.status })),
  );
  $("#portTable").innerHTML = mappings.length
    ? mappings
        .map(
          (p) =>
            `<div class="port-row"><span>localhost:${p.host}</span><i>→</i><span>${escapeHtml(p.name)}:${p.container} · ${p.status}</span></div>`,
        )
        .join("")
    : '<div class="empty-object">No host ports published.</div>';
}
function renderBuild() {
  if (!state.layers.length) {
    $("#buildEmpty").hidden = false;
    $("#layerList").innerHTML = "";
    return;
  }
  $("#buildEmpty").hidden = true;
  $("#layerList").innerHTML = state.layers
    .map(
      (l) =>
        `<article class="layer-item"><span>${String(l.index).padStart(2, "0")}</span><div><b>${escapeHtml(l.instruction)}</b><small>${l.id} · ${l.size}</small></div><em class="${l.cached ? "" : "rebuilt"}">${l.cached ? "CACHED" : "REBUILT"}</em></article>`,
    )
    .join("");
}
function renderEvents() {
  $("#eventStream").innerHTML = state.events.length
    ? state.events
        .map(
          (e) =>
            `<div class="event-row ${e.type}"><time>${e.time}</time><i></i><span><b>${escapeHtml(e.action)}</b> · ${escapeHtml(e.target)}</span></div>`,
        )
        .join("")
    : '<div class="diagnostic-empty"><p>Engine events will stream here as objects change.</p></div>';
}
function showDiagnostic(r, command) {
  $("#diagnosticContent").innerHTML =
    `<div class="coach-card ${r.ok ? "success" : "error"}"><b>${escapeHtml(r.title)}</b><p>${escapeHtml(r.explanation)}</p>${r.next ? `<code>${escapeHtml(r.next)}</code>` : ""}</div>`;
  if (r.view) switchView(r.view);
}
function renderCapstone() {
  if (!$("#capstoneMissions")) return;
  const completed = capstoneTasks.filter((task) => task.check(state)).length;
  $("#capstoneProgress").textContent =
    `${completed} / ${capstoneTasks.length} goals complete`;
  $("#capstoneMissions").innerHTML = capstoneTasks
    .map((task, i) => {
      const done = task.check(state);
      return `<article class="capstone-card ${done ? "complete" : ""}"><div class="capstone-card-top"><span>${done ? "✓ COMPLETE" : `GOAL ${String(i + 1).padStart(2, "0")}`}</span><small>${escapeHtml(task.level)}</small></div><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(task.prompt)}</p><details><summary>What counts as done?</summary><p>${escapeHtml(task.verify)}</p></details><details><summary>Need a hint?</summary><p>${escapeHtml(task.hint)}</p></details><button data-cmd="${escapeHtml(task.command)}">Load example command into terminal</button></article>`;
    })
    .join("");
  $$("#capstoneMissions button").forEach(
    (b) =>
      (b.onclick = () => {
        $("#terminalInput").value = b.dataset.cmd;
        $("#runtime").scrollIntoView({ behavior: "smooth", block: "start" });
        $("#terminalInput").focus();
      }),
  );
  renderDockerInterviewQuestions();
}
function renderDockerInterviewQuestions() {
  const holder = $("#dockerInterviewQuestions");
  if (!holder) return;
  holder.innerHTML = dockerInterviewQuestions
    .map((question, questionIndex) => {
      const selected = dockerInterviewAnswers.has(questionIndex)
        ? dockerInterviewAnswers.get(questionIndex)
        : dockerInterviewReviewed.has(questionIndex)
          ? question.answer
          : null;
      const correct = selected === question.answer;
      const feedback =
        selected == null
          ? "Choose an answer to reveal the reasoning."
          : correct
            ? `Correct. ${question.explanation}`
            : `Not quite. The strongest answer is: ${question.options[question.answer]}. ${question.explanation}`;
      return `<article class="interview-question ${correct ? "reviewed" : ""}"><span>QUESTION ${String(questionIndex + 1).padStart(2, "0")}</span><h3>${escapeHtml(question.prompt)}</h3><div class="interview-options">${question.options
        .map((option, optionIndex) => {
          const className =
            selected == null
              ? ""
              : optionIndex === question.answer
                ? "is-answer"
                : optionIndex === selected
                  ? "is-wrong"
                  : "";
          return `<button type="button" data-question="${questionIndex}" data-option="${optionIndex}" aria-pressed="${selected === optionIndex}" class="${className}">${escapeHtml(option)}</button>`;
        })
        .join(
          "",
        )}</div><p class="interview-feedback ${selected == null ? "" : correct ? "correct" : "try-again"}" aria-live="polite">${escapeHtml(feedback)}</p></article>`;
    })
    .join("");
  $("#dockerInterviewScore").textContent =
    `${dockerInterviewReviewed.size} / ${dockerInterviewQuestions.length} correct`;
  holder.querySelectorAll("button[data-question]").forEach((button) => {
    button.onclick = () => {
      const q = Number(button.dataset.question);
      const answer = Number(button.dataset.option);
      dockerInterviewAnswers.set(q, answer);
      if (answer === dockerInterviewQuestions[q].answer) {
        dockerInterviewReviewed.add(q);
        localStorage.setItem(
          "docker-interview-reviewed",
          JSON.stringify([...dockerInterviewReviewed]),
        );
      }
      renderDockerInterviewQuestions();
    };
  });
}
function switchView(name) {
  $$(".engine-tabs button").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === name),
  );
  $$(".engine-view").forEach((v) =>
    v.classList.toggle("active", v.id === `view-${name}`),
  );
}
function appendTerminal(command, r) {
  if (r.clear) {
    $("#terminalOutput").innerHTML = "";
    return;
  }
  const entry = document.createElement("div");
  entry.className = `terminal-entry ${r.ok ? "" : "error"}`;
  entry.innerHTML = `<div class="terminal-command"><span>$</span>${escapeHtml(command)}</div><pre class="terminal-result">${escapeHtml(r.text)}</pre>`;
  $("#terminalOutput").append(entry);
  $("#terminalOutput").scrollTop = $("#terminalOutput").scrollHeight;
}
function operationStages(command) {
  let tokens;
  try {
    tokens = tokenize(command);
  } catch {
    return ["Parse the entered command", "Return a shell syntax error"];
  }
  if (state.shell.container)
    return [
      "Start a process inside the container",
      "Read the container filesystem",
      "Return the process output",
    ];
  if (["version", "--version", "context"].includes(tokens[1]))
    return [
      "Read local Docker CLI configuration",
      "Return version or context details",
    ];
  if (tokens[0] !== "docker")
    return ["Read the command", "Run it in the project sandbox"];
  if (
    !state.engine.running &&
    !["version", "--version", "context", "help"].includes(tokens[1])
  )
    return ["CLI sends a request", "Check whether Docker Engine is reachable"];
  if (tokens[1] === "build") {
    const instructions = (state.files.Dockerfile || "")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
    return [
      "Read Dockerfile and build context",
      "Resolve the base image",
      ...instructions.map((line, index) => `Build layer ${index + 1}: ${line}`),
      "Export image and write build cache",
    ];
  }
  if (tokens[1] === "pull")
    return [
      "Contact image registry",
      "Download image layers",
      "Verify and store image",
    ];
  if (tokens[1] === "run")
    return [
      "Find the requested image",
      "Create container configuration",
      "Attach network and mounts",
      "Start the container process",
    ];
  if (tokens[1] === "compose" && tokens[2] === "up")
    return [
      "Read and resolve Compose file",
      "Prepare project network and volumes",
      "Create service containers",
      "Start services and collect status",
    ];
  if (["stop", "start", "restart", "rm"].includes(tokens[1]))
    return [
      "Find the container",
      "Apply the lifecycle change",
      "Refresh container state",
    ];
  if (["volume", "network"].includes(tokens[1]))
    return [
      "Validate the requested object",
      "Update Docker object store",
      "Refresh the visual state",
    ];
  if (tokens[1] === "info" || tokens[1] === "ps")
    return [
      "Send request to the selected context",
      "Read current Engine state",
      "Format CLI response",
    ];
  return [
    "Send command to Docker Engine",
    "Apply the requested operation",
    "Refresh the visual state",
  ];
}
function createCommandEntry(command, stages) {
  const entry = document.createElement("div");
  entry.className = "terminal-entry is-running";
  const prompt = state.shell.container
    ? `root@${state.shell.container}:${state.shell.cwd} #`
    : "learner@docker-lab:~/notes-api $";
  entry.innerHTML = `<div class="terminal-command"><span>${escapeHtml(prompt)}</span><code class="terminal-command-text"></code></div><div class="terminal-activity" role="status" aria-live="polite" hidden><i></i><span></span></div><pre class="terminal-result"></pre>`;
  $("#terminalOutput").append(entry);
  $("#terminalOutput").scrollTop = $("#terminalOutput").scrollHeight;
  return entry;
}
async function animateCommand(entry, command, stages) {
  const typed = entry.querySelector(".terminal-command-text");
  for (const char of command) {
    typed.textContent += char;
    if (char === " " || char === ".") await pause(8);
    $("#terminalOutput").scrollTop = $("#terminalOutput").scrollHeight;
  }
  const activity = entry.querySelector(".terminal-activity");
  const label = activity.querySelector("span");
  activity.hidden = false;
  for (const stage of stages) {
    label.textContent = stage;
    $("#terminalOutput").scrollTop = $("#terminalOutput").scrollHeight;
    await pause(stages.length > 6 ? 170 : 230);
  }
}
async function finishCommandEntry(entry, r) {
  if (r.clear) {
    $("#terminalOutput").innerHTML = "";
    return;
  }
  entry.classList.remove("is-running");
  entry.classList.toggle("error", !r.ok);
  entry.querySelector(".terminal-activity").remove();
  const output = entry.querySelector(".terminal-result");
  const lines = String(r.text || "").split("\n");
  for (let i = 0; i < lines.length; i++) {
    output.textContent += `${i ? "\n" : ""}${lines[i]}`;
    if (i < lines.length - 1) await pause(24);
    $("#terminalOutput").scrollTop = $("#terminalOutput").scrollHeight;
  }
  $("#terminalOutput").scrollTop = $("#terminalOutput").scrollHeight;
}
async function runCommand(raw) {
  if (commandBusy || engineBusy) return;
  const commands = String(raw || "")
    .split(/\n|;(?![^"']*["'])/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!commands.length) return;
  commandBusy = true;
  $("#terminalOutput .terminal-welcome")?.remove();
  renderEngine();
  try {
    for (const command of commands) {
      history.push(command);
      historyIndex = history.length;
      state.lastCommand = command;
      const stages = operationStages(command);
      const entry = createCommandEntry(command, stages);
      await animateCommand(entry, command, stages);
      const r = execute(command);
      await finishCommandEntry(entry, r);
      showDiagnostic(r, command);
      if (!r.ok) addEvent("command error", command, "error");
      renderAll();
    }
  } finally {
    commandBusy = false;
    renderAll();
    saveDockerLabState();
  }
}

async function toggleEngine() {
  if (engineBusy || commandBusy) return;
  engineBusy = true;
  renderEngine();
  const button = $("#startEngine");
  const offlineButton = $("#engineOffline [data-start-engine]");
  if (state.engine.running) {
    const stages = [
      "Stop accepting new CLI requests",
      "Stop running container processes",
      "Shut down the Docker daemon",
    ];
    $("#engineBadge").innerHTML = "<i></i>DOCKER ENGINE STOPPING";
    button.textContent = "Stopping Engine…";
    $("#terminalInput").disabled = true;
    for (const stage of stages) {
      addEvent("engine shutdown", stage, "info");
      await pause(430);
    }
    for (const container of state.containers.values()) {
      if (container.status === "running") {
        container.status = "stopped";
        container.exitCode = 0;
        addEvent("container stopped", container.name, "info");
      }
    }
    state.shell.container = null;
    state.shell.cwd = "/app";
    state.engine.running = false;
    state.flags.engineChecked = false;
    state.compose.running = false;
    $("#engineStartupSteps").innerHTML =
      "<span>1 · Start Docker Desktop</span><span>2 · Wait for the daemon</span><span>3 · Check the connection</span>";
    addEvent("engine stopped", "Docker daemon offline");
    $("#diagnosticContent").innerHTML =
      `<div class="coach-card"><b>Docker Engine stopped</b><p>The containers have stopped with the daemon. Their objects and images are still listed when the Engine starts again.</p><code>Start Docker Engine, then run docker ps -a</code></div>`;
  } else {
    const stages = [
      "Start Docker Desktop",
      "Start the Linux engine backend",
      "Start the Docker daemon",
      "Wait for the API socket",
    ];
    $("#engineBadge").innerHTML = "<i></i>DOCKER ENGINE STARTING";
    button.textContent = "Starting Engine…";
    if (offlineButton) offlineButton.disabled = true;
    $("#engineStartupSteps").innerHTML = stages
      .map((stage) => `<span>${escapeHtml(stage)}</span>`)
      .join("");
    const steps = [...$("#engineStartupSteps").querySelectorAll("span")];
    for (let index = 0; index < stages.length; index++) {
      steps.forEach((step, stepIndex) => {
        step.classList.toggle("done", stepIndex < index);
        step.classList.toggle("active", stepIndex === index);
      });
      addEvent("engine startup", stages[index], "info");
      await pause(520);
    }
    steps.forEach((step) => {
      step.classList.remove("active");
      step.classList.add("done");
    });
    state.engine.running = true;
    addEvent("engine ready", `${state.engine.context} · API available`);
    $("#diagnosticContent").innerHTML =
      `<div class="coach-card success"><b>Docker Engine is ready</b><p>The CLI can now reach the daemon. Confirm its version and current state before pulling or building images.</p><code>docker info</code></div>`;
  }
  engineBusy = false;
  renderAll();
  saveDockerLabState();
}

const suggestions = [
  "docker pull nginx:alpine",
  "docker build -t notes-api .",
  "docker tag notes-api learner/notes-api:1.0.0",
  "docker push learner/notes-api:1.0.0",
  "docker run -d --name guarded-api --restart unless-stopped --memory 256m --cpus 0.50 notes-api",
  "docker images",
  "docker run -d --name notes-web notes-api",
  "docker run -d --name notes-public -p 8080:3000 notes-api",
  "docker ps",
  "docker ps -a",
  "docker logs notes-web",
  "docker inspect notes-web",
  "docker logs --tail 5 notes-web",
  "docker volume create db-data",
  "docker network create app-net",
  "docker compose config",
  "docker compose up -d",
  "docker compose ps",
  "docker system df",
  "curl http://localhost:8080",
  "cat Dockerfile",
];
function updateSuggestions() {
  const value = $("#terminalInput").value.trim();
  const matches = value
    ? suggestions.filter((s) => s.startsWith(value) && s !== value).slice(0, 5)
    : [];
  $("#commandSuggestions").hidden = !matches.length;
  $("#commandSuggestions").innerHTML = matches
    .map((s) => `<button type="button">${escapeHtml(s)}</button>`)
    .join("");
  $("#commandSuggestions")
    .querySelectorAll("button")
    .forEach(
      (b) =>
        (b.onclick = () => {
          $("#terminalInput").value = b.textContent;
          $("#commandSuggestions").hidden = true;
          $("#terminalInput").focus();
        }),
    );
}

lessons.forEach((lesson, index) => {
  const b = document.createElement("button");
  b.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><b>${escapeHtml(lesson.title)}</b>`;
  b.onclick = () => {
    renderChapter(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  $("#chapterNav").append(b);
});
$("#terminalOutput").innerHTML =
  '<div class="terminal-welcome"><b>The Docker Engine starts off.</b><p>That is why <code>docker info</code> can fail on a fresh machine. Start the modeled engine, then check its connection before building or pulling images.</p><div class="welcome-actions"><button type="button" data-start-engine>Start Docker Engine</button><button type="button" data-cmd="docker version">Check CLI version</button><button type="button" data-cmd="docker context ls">List contexts</button></div></div>';
$("#terminalOutput").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-cmd]");
  if (button) runCommand(button.dataset.cmd);
  if (event.target.closest("button[data-start-engine]")) toggleEngine();
});
$("#startEngine").onclick = toggleEngine;
$("#engineOffline").addEventListener("click", (event) => {
  if (event.target.closest("[data-start-engine]")) toggleEngine();
});
$("#terminalForm").onsubmit = (e) => {
  e.preventDefault();
  const input = $("#terminalInput");
  runCommand(input.value);
  input.value = "";
  updateSuggestions();
};
$("#terminalInput").oninput = updateSuggestions;
$("#terminalInput").onkeydown = (e) => {
  if (e.key === "ArrowUp" && history.length) {
    e.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    e.currentTarget.value = history[historyIndex];
  }
  if (e.key === "ArrowDown" && history.length) {
    e.preventDefault();
    historyIndex = Math.min(history.length, historyIndex + 1);
    e.currentTarget.value = history[historyIndex] || "";
  }
  if (e.key === "Tab") {
    e.preventDefault();
    const first = $("#commandSuggestions button");
    if (first) {
      e.currentTarget.value = first.textContent;
      $("#commandSuggestions").hidden = true;
    }
  }
};
$$(".engine-tabs button").forEach(
  (b) => (b.onclick = () => switchView(b.dataset.view)),
);
$("#fileEditor").oninput = () => {
  fileDirty = true;
  $("#fileDirty").textContent = "UNSAVED";
  $("#fileDirty").className = "dirty";
};
$("#saveFile").onclick = () => {
  state.files[activeFile] = $("#fileEditor").value;
  fileDirty = false;
  addEvent("file save", activeFile);
  saveDockerLabState();
  renderFiles();
  showDiagnostic(
    result(
      true,
      "",
      `${activeFile} saved`,
      "The next build or Compose command will use this content.",
      "Run the related command.",
      "files",
    ),
  );
};
$("#loadMission").onclick = () => {
  $("#terminalInput").value = lessons[activeChapter].mission.start;
  $("#runtime").scrollIntoView({ behavior: "smooth", block: "start" });
  $("#terminalInput").focus();
  updateSuggestions();
};
$("#previousChapter").onclick = () =>
  renderChapter(Math.max(0, activeChapter - 1));
$("#nextChapter").onclick = () => {
  if (activeChapter < lessons.length - 1) {
    renderChapter(activeChapter + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else $("#capstone").scrollIntoView({ behavior: "smooth" });
};
$("#showHelp").onclick = () => runCommand("help");
$("#clearEvents").onclick = () => {
  state.events = [];
  renderEvents();
};
$("#resetRuntime").onclick = () => {
  state = newState();
  saveDockerLabState();
  history = [];
  historyIndex = 0;
  activeFile = "Dockerfile";
  fileDirty = false;
  $("#engineStartupSteps").innerHTML =
    "<span>1 · Start Docker Desktop</span><span>2 · Wait for the daemon</span><span>3 · Check the connection</span>";
  $("#terminalOutput").innerHTML =
    '<div class="terminal-welcome"><b>Lab reset · Docker Engine is off.</b><p>Start the modeled engine and check that the CLI can reach it before creating Docker objects.</p><div class="welcome-actions"><button type="button" data-start-engine>Start Docker Engine</button><button type="button" data-cmd="docker version">Check CLI version</button><button type="button" data-cmd="docker context ls">List contexts</button></div></div>';
  $("#diagnosticContent").innerHTML =
    '<div class="diagnostic-empty"><span>?</span><p>Run a command to begin a new session.</p></div>';
  renderAll();
};
renderChapter(0);
renderAll();
window.__learningDirtyKeys?.clear();
