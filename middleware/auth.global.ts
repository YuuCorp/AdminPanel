import type { user } from "~/composables/auth";

export default defineNuxtRouteMiddleware(async () => {
	const user = useUser();

	if (user.value) return;

	try {
		const data = await useRequestFetch()("/api/auth/me");

		// to avoid fully overwriting the user if an error occured, but
		// rather overwrite sections
		user.value = {
			...(user.value ?? {}),
			...(data ?? {}),
		} as user;
	} catch {
		user.value = null;
	}
})
