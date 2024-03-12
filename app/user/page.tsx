import { createClient } from "@/utils/supabase/server";
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { UserInfo } from "@/components/UserInfo";
import { Button } from "@/components/ui/button";

export default async function ProtectedPage() {
  const supabase = createClient();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/auth");
  };

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
        <Button onClick={signOut}>登出</Button>
      </div>
    </div>
  );
}