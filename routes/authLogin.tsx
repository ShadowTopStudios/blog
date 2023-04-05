
import { Handlers, PageProps } from "$fresh/server.ts";
import { getAccessToken, getProfileInfo } from "../utils/google_login_api.js";
import { Container } from "../components/Container.tsx";
// import { setCookie } from "https://deno.land/std@0.182.0/http/cookie.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import Login from "../islands/Login.tsx";
import { setCookie } from "$std/http/cookie.ts";

// get api keys
const settings = JSON.parse(await Deno.readTextFile("settings.json"));

export const handler: Handlers = { 
    async GET(_req: any, ctx: { render: (arg0: any) => any; state: any; }) {
        // console.log(await parseUrl(_req.url));
        // const res = new Response("OK", { status: 307, headers: { "Location": "/" } });
        // setCookie(res.headers, {
        //     name: "access_token",
        //     value: "asdasdasd",
        //     maxAge: 365 * 24 * 60 * 60,
        //     httpOnly: true,
        //     sameSite: "Strict",
        //     path: "/",
        // });
        // console.log("");
        
        return ctx.render({ });
    },
    // async POST(req) {
    //     // const form = await req.formData();
    //     // const locale = form.get("locale");
    //     const resp = new Response("", {
    //         status: 303,
    //         headers: { Location: "/settings" },
    //     });
    //     //if (typeof locale === "string") {
    //         setCookie(resp.headers, { name: "locale", value: "test2" });
    //     //}
    //     return resp;
    // },
};

// export async function handler(_req: Request): Promise<Response> {

//     // if(_req.url === "/"){
//     //     localStorage.removeItem("profile_info");
//     // }

//     await parseUrl(_req.url)
//         .then((res) => {
//             return res;
//         }).catch((err) => {
//             console.log(err);
//         });

//         return Response.redirect("http://localhost:8000", 302);
//   }

// export const handler: Handlers = { 
//     async GET(_req: any, ctx: { render: (arg0: any) => any; state: any; }) {
//         const loggedIn = await parseUrl(_req.url);
//         if(loggedIn){
//             // return redirect('/');
//         }
//         return ctx.render({ });
//     },
// };

export default function Home(props: PageProps) {
const { posts } = props.data;

return (
    <>
    <main>
    <Container>
        <Login />
        <ul class="mt-16">
            logged in, redirecting
        </ul>
    </Container>
    </main>
    </>
);
}

async function parseUrl(url: string) {
    // console.log(url);
    url = url.split('?')[1];
    let searchParams = new URLSearchParams(url);
  
    if(searchParams.get("code") !== null){
      let access_token = await getAccessToken(settings.client_id, settings.client_secret, settings.redirect_url, searchParams.get("code"));
      let profile_info = await getProfileInfo(access_token);
  
      // save profile info to database at some point.
  
      //save profile info to local storage
      if(access_token !== null && profile_info !== null){
        localStorage.setItem('profile_info', JSON.stringify(profile_info));
        return true;
      }
    }
    console.log("removing profile info");
    localStorage.removeItem("profile_info");
    return false;
  }
