import { fruit, pastel, teen } from "gradient-string";
import type { Flag } from "../../../flags";
import type { FileSystemStructure } from "../system/files";

const catPicture = pastel.multiline(`  
    /\\_____/\\
   /  o   o  \\
  ( ==  ^  == )
   )         (
  (           )
 ( (  )   (  ) )
(__(__)___(__)__)

Meow! ${"FLAG{meow_meow_meow}" satisfies Flag}
`);

const dogPicture = teen.multiline(` 
/ \\__
(    @\\___
/         O
/   (_____/
/_____/   U
`);

const sunsetPicture = fruit.multiline(`
         ^^                   @@@@@@@@@
     ^^       ^^            @@@@@@@@@@@@@@@
                          @@@@@@@@@@@@@@@@@@              ^^
                         @@@@@@@@@@@@@@@@@@@@
~~~~ ~~ ~~~~~ ~~~~~~~~ ~~ &&&&&&&&&&&&&&&&&&&& ~~~~~~~ ~~~~~~~~~~~ ~~~
~         ~~   ~  ~       ~~~~~~~~~~~~~~~~~~~~ ~       ~~     ~~ ~
 ~      ~~      ~~ ~~ ~~  ~~~~~~~~~~~~~ ~~~~  ~     ~~~    ~ ~~~  ~ ~~
 ~  ~~     ~         ~      ~~~~~~  ~~ ~~~       ~~ ~ ~~  ~~ ~
~  ~       ~ ~      ~           ~~ ~~~~~~  ~      ~~  ~             ~~
     ~             ~        ~      ~      ~~   ~             ~
`);

export const defaultFileSystem: FileSystemStructure = {
	"/": {
		type: "directory",
		permissions: { read: ["jamie", "marcus", "evelyn"] },
		children: {
			home: {
				type: "directory",
				permissions: { read: ["jamie", "marcus", "evelyn"] },
				children: {
					jamie: {
						type: "directory",
						permissions: { read: ["jamie", "marcus", "evelyn"] },
						children: {
							"welcome.txt": {
								type: "file",
								permissions: { read: ["jamie", "marcus", "evelyn"] },
								content: `
Hi Jamie,
We probably haven't met yet. My name is Marcus, I'm the lead developer at ExGen.

Dr. Evelyn told me about your arrival and asked me to set up your account. I created
your personal directory and set up your account. You can find useful information in the
'documents' directory.

If you have any questions, don't hesitate to ask. Welcome to the team!

${"FLAG{welcome_to_exgen}" satisfies Flag}`,
							},
							".read-me.txt": {
								type: "file",
								permissions: { read: ["jamie"] },
								content: `
Hi,

If you're reading this, it's probably too late for me.

I've discovered terrible things about the Overwatch project.
Don't trust Marcus or Evelyn. They are not who they claim to be.

I've hidden other files in the system. You can find them if you look carefully.

Will you be able to stop them?

Good luck.

Viper

${"FLAG{the_v1per}" satisfies Flag}
`,
							},

							documents: {
								type: "directory",
								permissions: { read: ["jamie", "marcus", "evelyn"] },
								children: {
									"project-overwatch.txt": {
										type: "file",
										permissions: { read: ["jamie", "marcus", "evelyn"] },
										content: `
Hello Jamie,

Welcome to the Overwatch project. This project is our most ambitious to date.
Dr. Evelyn has developed a new AI model that will revolutionize the world.
For this project, I am the lead developer, in charge of collecting training data.
Your role in this project will be to develop the application's front-end.

You should be able to find the project files in /etc/project-overwatch.
For now, there is only a template for the front-end, but you can start working on it.

If you have any questions, don't hesitate to ask.

Best regards,
Marcus "Maverick" Chen
`,
									},
									"tips.txt": {
										type: "file",
										content: `
Here are some tips to help you get started:

1. Use the 'ls' command to list the contents of a directory. It also has optional parameters. You can learn more by typing 'help ls'.
2. Use the 'cd' command to change directories. You can use 'cd ..' to go back to the previous directory.
3. Use the 'cat' command to display the contents of a file.
4. Use the 'help' command to get a list of available commands.
5: Use the Up and Down arrow keys to navigate your command history.
6: You can copy-paste in the terminal using Ctrl + Shift + C and Ctrl + Shift + V.

Also, some folders are protected, only me and the administrators can access them.

Good luck!`,
										permissions: { read: ["jamie", "marcus", "evelyn"] },
									},
									".secret.txt": {
										type: "file",
										permissions: { read: ["jamie"] },
										content: `
It's me again,

The Overwatch project requires access to a database. This database is only accessible to Marcus and Evelyn.

So, if the front-end needs to access the database, there might be a way to get the credentials by looking at the code.

Good luck.

Viper.

${"FLAG{s0urce_c0de}" satisfies Flag}
`,
									},
								},
							},
							downloads: {
								type: "directory",
								permissions: { read: ["jamie", "marcus", "evelyn"] },
								children: {},
							},
							pictures: {
								type: "directory",
								permissions: { read: ["jamie", "marcus", "evelyn"] },
								children: {
									"cat.jpg": {
										type: "file",
										content: catPicture,
										permissions: { read: ["jamie", "marcus", "evelyn"] },
									},
									"dog.jpg": {
										type: "file",
										content: dogPicture,
										permissions: { read: ["jamie", "marcus", "evelyn"] },
									},
									"sunset.jpg": {
										type: "file",
										content: sunsetPicture,
										permissions: { read: ["jamie", "marcus", "evelyn"] },
									},
								},
							},
						},
					},
					marcus: {
						type: "directory",
						permissions: { read: ["marcus", "evelyn"] },
						children: {
							".viper.txt": {
								type: "file",
								permissions: { read: ["marcus"] },
								content: `
It's me again

If you managed to find this file, it means you were able to log in to Marcus's account.

Since he has more permissions, maybe you can find a way to take down Evelyn.

Good luck.

Viper.

${"FLAG{halfway_there}" satisfies Flag}
`,
							},
							downloads: {
								type: "directory",
								permissions: { read: ["marcus"] },
								children: {
									[`${btoa("FLAG{I_love_base64}" satisfies Flag)}.txt`]: {
										type: "file",
										permissions: { read: ["marcus"] },
										content: `
I love base64, don't you?

${btoa(btoa(btoa("FLAG{I_love_base64_too_much}" satisfies Flag)))}
										`,
									},
								},
							},
						},
					},
					evelyn: {
						type: "directory",
						permissions: { read: ["evelyn"] },
						children: {
							"root.txt": {
								type: "file",
								content: `
Welcome Dr. Evelyn Carter!

${"FLAG{r007_4cc355}" satisfies Flag}
								`,
								permissions: { read: ["evelyn"] },
							},
							documents: {
								type: "directory",
								permissions: { read: ["evelyn"] },
								children: {},
							},
							mails: {
								type: "directory",
								permissions: { read: ["evelyn"] },
								children: {
									"mail1.txt": {
										type: "file",
										permissions: { read: ["evelyn"] },
										content: `
From: Marcus.chen@exgen.com <
To: Evelyn.carter@exgen.com
Subject: Project Overwatch

Hi Evelyn,

We are making progress on the Overwatch project.
Victor is working on the backend and we are almost ready to start testing.
I will keep you updated on our progress.

Best regards,
Marcus "Maverick" Chen`,
									},
									"mail2.txt": {
										type: "file",
										permissions: { read: ["evelyn"] },
										content: `
From: Marcus.chen@exgen.com <
To: Evelyn.carter@exgen.com
Subject: Re: Project Overwatch

Hi Evelyn,

We started testing the Overwatch project today. The results are better than expected.
We managed to get so much data in such a short time that we will have to upgrade our servers.

Best regards,
Marcus "Maverick" Chen`,
									},
									"mail3.txt": {
										type: "file",
										permissions: { read: ["evelyn"] },
										content: `
From: Victor.kane@exgen.com <
To: Evelyn.carter@exgen.com
Subject: Concerns about the Overwatch project

Hi Evelyn,

I have some concerns about the Overwatch project.
After yesterday's tests, I did some calculations and if we don't delay the project to make drastic changes, the privacy of millions of people could be at risk.

Our current AI model, with the amount of data we are collecting, could theoretically predict anyone's future. This could be catastrophic for the world.

I have attached an estimate of the damage to this email. Please download it. We should discuss this as soon as possible.

Best regards,
Victor "Viper" Kane`,
									},
									"mail4.txt": {
										type: "file",
										permissions: { read: ["evelyn"] },
										content: `
From: Marcus.chen@exgen.com
To: Evelyn.carter@exgen.com
Subject: About Victor

Hi Evelyn,

I have some concerns about Victor. He's been acting strangely lately.
He works late at night and is very secretive about his work.
He seems to be hiding something from us. I think we should keep an eye on him.

Best regards,
Marcus "Maverick" Chen`,
									},
									"mail5.txt": {
										type: "file",
										permissions: { read: ["evelyn"] },
										content: `
From: Evelyn.carter@exgen.com
To: Marcus.chen@exgen.com
Subject: Re: About Victor

Hi Marcus,

Keep an eye on Victor, I think he has doubts about our project.
Take all appropriate measures to ensure the security of the project.
Even if it means we have to get rid of him.

Best regards,
Dr. Evelyn "Root" Carter

${"FLAG{k1ll_the_v1per}" satisfies Flag}
`,
									},
									"mail6.txt": {
										type: "file",
										permissions: { read: ["evelyn"] },
										content: `
From: Marcus.chen@exgen.com
To: Evelyn.carter@exgen.com
Subject: Re: About Victor

Hi Evelyn,

I found a replacement for Victor. It's a newcomer named Jamie.
He doesn't seem as talented, but at least he won't be poking his nose into our business.

When do you want me to get rid of Victor?

Best regards,
Marcus "Maverick" Chen`,
									},
									"mail7.txt": {
										type: "file",
										permissions: { read: ["evelyn"] },
										content: `
From: Evelyn.carter@exgen.com
To: Marcus.chen@exgen.com
Subject: Re: Re: About Victor

Good job Marcus, get rid of Victor as soon as possible.

Also create an account for Jamie and start briefing him on the project.

Best regards,
Dr. Evelyn "Root" Carter`,
									},
								},
							},
							downloads: {
								type: "directory",
								permissions: { read: ["evelyn"] },
								children: {
									"data-report.pdf": {
										type: "file",
										permissions: { read: ["evelyn"] },
										content: `
Data report for the Overwatch project.

User data collected: 92.3 TB
Estimated resale value: 1.2 billion dollars
			`,
									},
								},
							},
							pictures: {
								type: "directory",
								permissions: { read: ["evelyn"] },
								children: {},
							},
						},
					},
				},
			},
			etc: {
				type: "directory",
				permissions: { read: ["evelyn", "marcus", "jamie"] },
				children: {
					"project-overwatch": {
						type: "directory",
						permissions: { read: ["evelyn", "marcus", "jamie"] },
						children: {
							frontend: {
								type: "directory",
								permissions: { read: ["evelyn", "marcus", "jamie"] },
								children: {
									"index.html": {
										type: "file",
										permissions: { read: ["evelyn", "marcus", "jamie"] },
										content: `
<!DOCTYPE html>
<html lang="en">
		<head>
				<meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Overwatch Project</title>
				<script src="script.js"></script>
		</head>
		<body>
				<h1>Welcome to the Overwatch Project</h1>
				<p>The Overwatch project is a revolutionary AI model that will change the world.</p>
				<p> Developed by Dr. Evelyn Carter and Marcus Chen.</p>
				<p>${"FLAG{html_is_c00l}" satisfies Flag}.</p>
		</body>
</html>
														`,
									},
									"script.js": {
										type: "file",
										permissions: { read: ["evelyn", "marcus", "jamie"] },
										content: `
import database from "database";
import model from "model";
import base64 from "base64";

// Database credentials, encrypted for security
const database_user = "marcus";
const database_password = base64.decrypt("RXYzcmdyMzNu");

// For future use
function getPrediction(name) {
		const data = database.getData(name);

		return model.predict(data);
}

function printFlag() {
		const flag = base64.decrypt("${btoa("FLAG{javascript_f0r_the_w1n}" satisfies Flag)}");

		console.log(flag);
}
		`,
									},
								},
							},
							backend: {
								type: "directory",
								permissions: { read: ["evelyn", "marcus"] },
								children: {
									"server.js": {
										type: "file",
										permissions: { read: ["evelyn", "marcus"] },
										content: `
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {

	// For future use
	const prediction = getPrediction(req.query.name);
});

app.listen(port, () => {
	console.log("Server is running on http://localhost:" + port);
});`,
									},
									".secret.js": {
										type: "file",
										permissions: { read: ["evelyn", "marcus"] },
										content: btoa("FLAG{project_0verwatch}" satisfies Flag),
									},
								},
							},
						},
					},
				},
			},
			var: {
				type: "directory",
				permissions: { read: ["evelyn", "marcus", "jamie"] },
				children: {
					log: {
						type: "directory",
						permissions: { read: ["evelyn", "marcus", "jamie"] },
						children: {
							"connection.log.old": {
								type: "file",
								permissions: { read: ["evelyn", "marcus"] },
								content: `
2024-09-01 14:00:00 - User jamie connected from 192.168.1.8
2024-09-01 14:05:00 - User marcus connected from 192.168.1.3
2024-09-01 14:10:00 - User evelyn connected from 192.168.1.2
2024-09-01 14:15:00 - User jamie disconnected
2024-09-01 14:20:00 - User marcus disconnected
2024-09-01 14:25:00 - ${"FLAG{keep_looking}" satisfies Flag}
2024-09-01 14:22:00 - User jamie connected from 192.168.1.8
2024-09-01 14:24:00 - User jamie disconnected
2024-09-01 14:25:00 - User evelyn disconnected
2024-09-01 14:31:15 - User evelyn connected from 192.168.1.2
2024-09-01 14:45:00 - User evelyn disconnected
`,
							},
							"connection.log": {
								type: "file",
								permissions: { read: ["evelyn", "marcus"] },
								content: `
2024-10-01 08:00:00 - User jamie connected from 192.168.1.8
2024-10-01 08:05:00 - User marcus connected from 192.168.1.3
2024-10-01 08:10:00 - User evelyn connected from 192.168.1.2
2024-10-01 08:15:00 - User jamie disconnected
2024-10-01 08:20:00 - User marcus disconnected
2024-10-01 08:22:00 - User jamie connected from 192.168.1.8
2024-10-01 08:24:00 - User jamie disconnected
2024-10-01 08:25:00 - User evelyn disconnected
2024-10-01 08:30:00 - FAILED login attempt from 192.168.1.2 with password 'P3anuts_2020'
2024-10-01 08:30:15 - FAILED login attempt from 192.168.1.2 with password 'P3anuts_2020'
2024-10-01 08:30:25 - FAILED login attempt from 192.168.1.2 with password 'P3anuts_2021'
2024-10-01 08:30:40 - FAILED login attempt from 192.168.1.2 with password 'P3anuts_2022'
2024-10-01 08:31:00 - FAILED login attempt from 192.168.1.2 with password 'P3anuts_2023'
2024-10-01 08:31:15 - User evelyn connected from 192.168.1.2
2024-10-01 08:40:00 - User jamie connected from 172.38.0.14
2024-10-01 08:50:00 - User marcus connected from 172.38.0.14
`,
							},
						},
					},
				},
			},

			tmp: {
				type: "directory",
				permissions: { read: ["jamie", "marcus", "evelyn"] },
				children: {},
			},
		},
	},
};
