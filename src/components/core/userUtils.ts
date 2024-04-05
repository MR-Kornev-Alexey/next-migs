import {useSelector} from "react-redux";
import {RootState} from "@/store/store";

let userEmail,username, userRole;
const user = useSelector((state: RootState) => state.mainUser.value);
if (user){
  const { name, email, role } = JSON.parse(user);
  username = name;
  userEmail = email;
  userRole = role;
}

export { userEmail,username, userRole}
