"use client";

import { ContactCard, type ContactCardValues } from "@portfolio/ui";
import { useApiClient } from "@/components/api-provider";
import { track } from "@/lib/analytics";

export function ContactFlow() {
  const apiClient = useApiClient();
  return (
    <ContactCard
      onSubmit={async (values: ContactCardValues) => {
        track("contact_submitted");
        await apiClient.submitContact(values);
      }}
    />
  );
}
