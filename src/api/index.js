import api, { signApi, initRequest } from "@/libs/api";
import env from "@/config/env";
import hook from "@/config/request/hook";
import options from "@/config/request/options";
import * as rights from "@/config/urls/rights";
import * as safe from "@/config/urls/safe";
import * as info from "@/config/urls/info";
import * as develop from "@/config/urls/develop";
import * as manage from "@/config/urls/manage";
import * as ppt from "@/config/urls/ppt";
import * as image from "@/config/urls/image";
initRequest({
  baseURL: env.baseURL,
  timeout: env.timeout,
});

initRequest(hook, "hook");
initRequest(options, "options");

signApi(rights);
signApi(safe);
signApi(develop);
signApi(info);
signApi(manage);
signApi(ppt);
signApi(image);

export default api;
export { signApi };
