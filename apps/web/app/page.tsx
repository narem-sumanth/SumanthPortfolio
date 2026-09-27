import { ChatView } from "@/features/chat/chat-view";
import { getProfileSafe } from "@/lib/serverApi";

export default async function HomePage() {
  const profile = await getProfileSafe();
  return <ChatView profile={profile} />;
}
