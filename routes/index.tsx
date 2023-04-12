
import { Handlers, PageProps } from "$fresh/server.ts";
import { listPosts, Post } from "../utils/posts.ts";
import { State } from "../utils/state.ts";
import { Container } from "../components/Container.tsx";
import { HomeHeader } from "../components/HomeHeader.tsx";
import { PostPreview } from "../components/PostPreview.tsx";

// get api keys
const settings = JSON.parse(await Deno.readTextFile("settings.json"));

interface Data extends State {
  posts: Post[];
  name: string;
}

export const handler: Handlers<Data, State> = { 
  async GET(_req: any, ctx: { render: (arg0: any) => any; state: any; }) {
    // parseUrl(_req.url);
    console.log(_req.headers);
    const headers = _req.headers;
    const cookies = headers.get("cookie");
    console.log(cookies);
    let name = "";
    cookies?.split(";").forEach((cookie) => {
      // console.log(cookie);
      let thing = cookie.toString();
      if(thing.includes("name=")){
        console.log(thing.split("=")[1]);
        name = thing.split("=")[1];
      }
      // const temp = cookie.split("=")[0];
      // const temp2 = cookie.split("=")[1];
      // // if name is access_token, set it in state
      // if(cookie.split("=")[0].toString() === "id"){
      //   console.log(temp2);
      // }else{
      //   // console.log(typeof cookie.split("=")[0] );
      // }
            // console.log(name, value);
    });
    // grab each cookie and pass in its name and value to ctx.render
    // ctx.render({ ...ctx.state, cookieName: cookieValue });

    const posts = await listPosts();
    return ctx.render({ ...ctx.state, posts, name });
  },
};

export default function Home(props: PageProps<Data>) {
  const { posts, name } = props.data;
  console.log(props.data);
  return (
    <>
     <HomeHeader name={name} />
     <main>
      <Container>

        <ul class="mt-16">
          {posts.map((post: Post) => <PostPreview post={post} />)}
        </ul>
      </Container>
     </main>
    </>
  );
}

// async function parseUrl(url: string) {
//   console.log(url);
//   url = url.split('?')[1];
//   let searchParams = new URLSearchParams(url);

//   if(searchParams.get("code") !== null){
//     let access_token = await getAccessToken(settings.client_id, settings.client_secret, settings.redirect_url, searchParams.get("code"));
//     let profile_info = await getProfileInfo(access_token);

//     // save profile info to database at some point.

//     //save profile info to local storage
//     if(access_token !== null && profile_info !== null){
//       localStorage.setItem('profile_info', JSON.stringify(profile_info));
//     }
//   }

// }

// function getCookie(name: string) {
//   var nameEQ = name + "=";
//   var ca = document.cookie.split(';');
//   for(var i=0;i < ca.length;i++) {
//       var c = ca[i];
//       while (c.charAt(0)==' ') c = c.substring(1,c.length);
//       if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
//   }
//   return null;
// }