export function getFlags() {
	"use server";
	const flags = {
		"FLAG{meow_meow_meow}": 50,
		"FLAG{welcome_to_exgen}": 100,
		"FLAG{r007_4cc355}": 500,
		"FLAG{k1ll_the_v1per}": 150,
		"FLAG{the_v1per}": 200,
		"FLAG{html_is_c00l}": 100,
		"FLAG{javascript_f0r_the_w1n}": 100,
		"FLAG{keep_looking}": 50,
		"FLAG{halfway_there}": 50,
		"FLAG{I_love_base64}": 50,
		"FLAG{I_love_base64_too_much}": 100,
		"FLAG{project_0verwatch}": 150,
		"FLAG{s0urce_c0de}": 50,
	} as const satisfies Record<string, number>;

	return flags;
}

export type Flag = keyof ReturnType<typeof getFlags>;
export type FlagValue = ReturnType<typeof getFlags>[Flag];

export function isFlag(flag: string): flag is Flag {
	return Object.keys(getFlags()).includes(flag);
}

export function getFlagValue(flag: Flag): number {
	return getFlags()[flag];
}

export function getTotalFlagValue() {
	"use server";
	return Object.values(getFlags()).reduce((acc, value) => acc + value, 0);
}
