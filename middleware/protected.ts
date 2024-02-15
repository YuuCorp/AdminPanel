export default defineNuxtRouteMiddleware(async () => {
	const user = useUser();
	console.log(user.value)
	if (!user.value) return navigateTo("/api/oauth/discord");
});
