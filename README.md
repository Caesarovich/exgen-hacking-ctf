# ExGen hacking challenge

This is a "hacking" challenge meant for my students to learn the basics of Linux commands in a fun way.

So this challenge is not meant to be a real hacking challenge, but rather a way to learn how to use the terminal and some basic Linux commands.

I built an 'entirely' simulated environment with fake users, fake files, and fake commands to make it feel like a real Linux system.

## Where to play

You can find a live version of the challenge at : https://exgen-ctf.caesarovich.xyz/

Do not look at the source code if you want to play the challenge, as it will spoil the fun!

## Setup locally


### Build & Run locally with Bun

1. Install [BunJS](https://bun.sh/)
2. Clone the repository
3. Run `bun install` to install the dependencies
4. Run `bun run build` to build the project
5. Run `bun run start.ts` to start the server
6. Open your browser and go to `http://localhost:3000`

### Build & Run locally with Docker
1. Install [Docker](https://www.docker.com/)
2. Clone the repository
3. Run `docker build -t exgen-hacking-challenge .` to build the Docker image
4. Run this command to start the Docker container, replacing the environment variables with your own values:
```
docker run -p 3000:3000 \
	-e SESSION_SECRET=<min_32_char_long> \
	-e DB_FILE_NAME=/data/<file.sqlite> \
	-e ADMIN_USERNAME=<username> \
	-e ADMIN_PASSWORD=<password> \
	exgen-hacking-challenge
``` 
5. Open your browser and go to `http://localhost:3000`

## Tech stack

- [Bun](https://bun.sh/) for the JavaScript runtime
- [SolidJS](https://solidjs.com/) for the frontend framework
- [Kobalte](https://kobalte.dev/) for the component library
- [SolidStart](https://start.solidjs.com/) for the full-stack framework
- [TailwindCSS](https://tailwindcss.com/) for the styling
- [DaisyUI](https://daisyui.com/) for the TailwindCSS component library
- [TypeScript](https://www.typescriptlang.org/) for the type system
- [XTerm](https://xtermjs.org/) for the terminal emulator, connected to a fake backend by WebSocket
- [Biome](https://biomejs.dev/) for the code formatter and linter
- [Solid Primitives](https://primitives.solidjs.community/) for some useful SolidJS primitives
- [Drizzle](https://orm.drizzle.team/) for the database ORM
- [SQLite](https://www.sqlite.org/index.html) for the database


## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.