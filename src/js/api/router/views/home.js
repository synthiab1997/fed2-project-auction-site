import { authGuard } from "../../utilities/authGuard";
import { setLogoutListener } from "../../ui/global/logout";
import { onReadAllPosts } from "../../ui/post/read";

authGuard();
setLogoutListener();
onReadAllPosts();