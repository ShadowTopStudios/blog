import { useEffect } from "preact/hooks";
import { getAccessToken, getProfileInfo } from "../utils/google_login_api.js";

// const settings = JSON.parse(await Deno.readTextFile("settings.json"));

export default function Login() {
  // figure this out......cant have it hard coded but Deno.readTextFile doesnt work on client side. 
  let props = { 
    "client_id": "327621963440-va9bpfopnrbhjaui9naakmhr48gkj93q.apps.googleusercontent.com", 
    "client_secret": "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", 
    "redirect_url": "http://localhost:8000/authLogin" 
  }

  useEffect(() => {
    const parsedData = async() =>{
      await parseUrl(new URL(globalThis.location.href).toString(), props);
    }
    parsedData().then(()=>{
        window.location.href = "http://localhost:8000";
      }
    ).catch();

	}, []);	

  return (
    <div class="flex gap-2 w-full">
      <p class="flex-grow-1 font-bold text-xl">logging in....</p>

    </div>
  );
}

async function parseUrl(url: string, props: { client_id: any; client_secret: any; redirect_url: any; }) {
  console.log(props);
  console.log(url);
  url = url.split('?')[1];
  let searchParams = new URLSearchParams(url);

  if(searchParams.get("code") !== null){
    let access_token = await getAccessToken(props.client_id, props.client_secret, props.redirect_url, searchParams.get("code"));
    let profile_info = await getProfileInfo(access_token);

    // save profile info to database at some point.

    //save profile info to local storage
    if(access_token !== null && profile_info !== null){
      console.log(profile_info);
      localStorage.setItem('profile_info', JSON.stringify(profile_info));
      // foreach varaible in profile_info, set a cookie with the name of the variable and the value of the variable.
      for (const [key, value] of Object.entries(profile_info)) {
        setCookie(key, value, 7);
      }

      return true;
    }
  }
  console.log("removing profile info");
  localStorage.removeItem("profile_info");
  deleteCookie("name");
  deleteCookie("id");
  deleteCookie("email");
  deleteCookie("picture");
  return false;
}

function setCookie(name: string|Headers,value: { name: string; value: string; path: any; domain?: any; expires?: Date; },days: number|undefined) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function deleteCookie(name: string) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
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