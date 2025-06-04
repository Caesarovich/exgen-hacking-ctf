// @refresh reload
import { StartClient, mount } from "@solidjs/start/client";

// biome-ignore lint/style/noNonNullAssertion: This is a valid assertion as we expect the element to exist.
mount(() => <StartClient />, document.getElementById("app")!);
