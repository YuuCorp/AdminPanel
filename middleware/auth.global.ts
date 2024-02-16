export default defineNuxtRouteMiddleware(async () => {
	const user = useUser()
	const data = await useRequestFetch()("/api/auth/me");
	user.value = data;
})
