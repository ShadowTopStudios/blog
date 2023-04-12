import { Container } from "./Container.tsx";
import { site } from "../data/site.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

// get api keys - replace with env variables later
const settings = JSON.parse(await Deno.readTextFile("settings.json"));

export function HomeHeader(props: any) {
  console.log(props);
  /*
   so. if you need to check and run logic on each page load,
   add it here before the return statement.
   DO NOT ADD LOGIC OUTSIDE THIS FUNCTION AS IT ONLY RUNS ONCE.
  */

  let userProfile = localStorage?.getItem('profile_info');
  // console.log(userProfile);

  if(userProfile !== null){
    console.log("user is logged in");
    userProfile = JSON.parse(userProfile);
  }

  // urlencode OAuth login url
  let google_oauth_url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  google_oauth_url.searchParams.set('scope', 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email');
  google_oauth_url.searchParams.set('redirect_uri', settings.redirect_url);
  google_oauth_url.searchParams.set('response_type', 'code');
  google_oauth_url.searchParams.set('client_id', settings.client_id);
  google_oauth_url.searchParams.set('access_type', 'online');
  const authUrl = google_oauth_url.toString();
  
  return (
    <header
      class="bg-blue-200 relative min-h-[30vh]"
    >
      <Container>
        <h1 class="text-4xl lg:text-8xl font-bold absolute bottom-6 flex items-center">
          {site.title}
        </h1>
      </Container>
      {props.name != "" ? 
        <a href="authLogin" class="absolute top-6 right-6 text-xl font-bold hover:text-underline">Logged in: {props.name}</a>: 
        <a href={authUrl} class="absolute top-6 right-6 text-xl font-bold hover:text-underline">LOGIN</a>}
    </header>
  );
}
