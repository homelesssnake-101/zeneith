import User from "@repo/ui/User";
import getuser  from "../../../actions/user";

import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
export default async function UserPage() {
    const user = await getuser();
    return <User user={user} />
}
