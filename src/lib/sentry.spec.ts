import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Sentry Configuration", () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.resetModules();
  });

  it("should not initialize Sentry in development", async () => {
    process.env.NODE_ENV = "development";
    
    const sentryMock = {
      init: vi.fn(),
    };
    
    vi.doMock("@sentry/nextjs", () => sentryMock);
    
    // Import the config files after mocking
    await import("../../sentry.server.config");
    
    // In development, Sentry.init should not be called
    expect(sentryMock.init).not.toHaveBeenCalled();
  });

  it("should initialize Sentry in production", async () => {
    process.env.NODE_ENV = "production";
    
    const sentryMock = {
      init: vi.fn(),
    };
    
    vi.doMock("@sentry/nextjs", () => sentryMock);
    
    // Import the config files after mocking
    await import("../../sentry.server.config");
    
    // In production, Sentry.init should be called
    expect(sentryMock.init).toHaveBeenCalled();
  });
});
