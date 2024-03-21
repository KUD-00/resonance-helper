import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserInfo } from "@/components/UserInfo";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  const {
    data, error
  } = await supabase.from("profiles").select()

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full py-6 font-bold border text-center">
        只有登陆后才能看到本界面
      </div>
      <div className="flex-col flex items-center gap-10">
        {data && <UserInfo info={data[0]} />}
      </div>
    </div>
  );
}
