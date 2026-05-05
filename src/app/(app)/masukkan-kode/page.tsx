import { redirect } from "next/navigation";

export default function MasukkanKodeRedirect() {
  redirect("/dashboard?pair=true");
}
