import * as React from "react";
import { cn } from "../lib/cn";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  onClick?: () => void;
}

export function NavigationRail({ items, className }: { items: NavItem[]; className?: string }) {
  return (
    <nav className={cn("flex items-center gap-1 rounded-full border border-border bg-elevated p-1", className)}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={item.onClick}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-foreground-muted transition-colors",
            item.active && "bg-accent-soft text-accent",
            !item.active && "hover:text-foreground",
          )}
        >
          <item.icon className="h-3.5 w-3.5" />
          {item.label}
        </a>
      ))}
    </nav>
  );
}
