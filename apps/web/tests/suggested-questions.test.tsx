import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SuggestedQuestions } from "@/features/chat/suggested-questions";

describe("SuggestedQuestions", () => {
  it("invokes onSelect with the clicked question's text", async () => {
    const onSelect = vi.fn();
    render(<SuggestedQuestions questions={["Why should I hire you?"]} onSelect={onSelect} />);
    await userEvent.click(screen.getByText("Why should I hire you?"));
    expect(onSelect).toHaveBeenCalledWith("Why should I hire you?");
  });

  it("renders nothing when there are no questions", () => {
    const { container } = render(<SuggestedQuestions questions={[]} onSelect={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
