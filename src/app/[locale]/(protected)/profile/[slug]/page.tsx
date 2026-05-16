import { ProfilePage } from "@/feature/profile/components/ProfilePage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <ProfilePage personId={slug} />;
}
