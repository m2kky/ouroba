import { redirect } from "next/navigation";

export default function HomePage({ params }: { params: { locale: string } }) {
  // Since this is the Admin Dashboard app, we don't serve a public frontend here.
  // Redirect any visitors directly to the admin login or dashboard.
  redirect(`/${params.locale}/admin`);
}
