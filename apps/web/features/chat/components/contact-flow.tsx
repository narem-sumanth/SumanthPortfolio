"use client";

import { ContactCard, type ContactCardValues } from "@portfolio/ui";
import { useApiClient, track } from "@/features/shell";

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
