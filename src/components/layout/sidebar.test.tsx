import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "./Sidebar";

// Mock next/link as it doesn't work out of the box in vitest
vi.mock("next/link", () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => {
      return <a href={href}>{children}</a>;
    },
  };
});

describe("Sidebar Component", () => {
  it("should render the brand name", () => {
    render(<Sidebar />);
    expect(screen.getByText("WhatSaaS")).toBeDefined();
  });

  it("should contain essential navigation links", () => {
    render(<Sidebar />);
    const links = ["لوحة التحكم", "جهات الاتصال", "المحادثات", "الإعدادات"];
    links.forEach(link => {
      expect(screen.getByText(link)).toBeDefined();
    });
  });

  it("should display the correct version info", () => {
    render(<Sidebar />);
    expect(screen.getByText(/v1.0.5/i)).toBeDefined();
  });
});
