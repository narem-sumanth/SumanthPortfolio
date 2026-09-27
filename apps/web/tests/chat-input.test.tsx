import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ChatSourceOption } from "@portfolio/types";
import { ChatInput } from "@/features/chat/chat-input";

const defaultProps: { sources: ChatSourceOption[]; onToggleSource: () => void } = {
  sources: ["portfolio", "github"],
  onToggleSource: vi.fn(),
};

/** ChatInput is a controlled component; tests need a stateful wrapper to drive it like a real parent would. */
function ControlledChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = React.useState("");
  return <ChatInput value={value} onValueChange={setValue} onSend={onSend} {...defaultProps} />;
}

describe("ChatInput", () => {
  it("sends the message on Enter and clears the field", () => {
    const onSend = vi.fn();
    render(<ControlledChatInput onSend={onSend} />);
    const textarea = screen.getByPlaceholderText("Ask me anything…");

    fireEvent.change(textarea, { target: { value: "Tell me about your projects" } });
    fireEvent.keyDown(textarea, { key: "Enter" });

    expect(onSend).toHaveBeenCalledWith("Tell me about your projects");
    expect((textarea as HTMLTextAreaElement).value).toBe("");
  });

  it("does not send on Shift+Enter", () => {
    const onSend = vi.fn();
    render(<ControlledChatInput onSend={onSend} />);
    const textarea = screen.getByPlaceholderText("Ask me anything…");

    fireEvent.change(textarea, { target: { value: "line one" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not send an empty message", () => {
    const onSend = vi.fn();
    render(<ControlledChatInput onSend={onSend} />);
    fireEvent.keyDown(screen.getByPlaceholderText("Ask me anything…"), { key: "Enter" });
    expect(onSend).not.toHaveBeenCalled();
  });
});
