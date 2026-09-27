"use client";

import { ContactCard, type ContactCardValues } from "@portfolio/ui";
import { apiClient } from "@/lib/apiClient";
import { track } from "@/lib/analytics";

export function ContactFlow() {
  return (
    <ContactCard
      onSubmit={async (values: ContactCardValues) => {
        track("contact_submitted");
        await apiClient.submitContact(values);
      }}
    />
  );
}
