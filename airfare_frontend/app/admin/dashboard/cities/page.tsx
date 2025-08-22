// app/admin/dashboard/cities/page.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import City from "../../../Components/City";
import { Suspense } from "react";

const Page = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token");

  if (!token) {
    redirect("/admin/login");
  }

  return (
    // <Suspense fallback={<div>Loading cities...</div>}>
    <City />
    // {/* </Suspense> */}
  );
};

export default Page;
