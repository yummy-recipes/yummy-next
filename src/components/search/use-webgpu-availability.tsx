import { useEffect, useState } from "react";

async function isWebGPUSupported() {
  if (!("gpu" in navigator)) {
    return {
      supported: false,
      reason: "WebGPU is not supported on this browser.",
    };
  }

  try {
    // Attempt to request an adapter for WebGPU
    const adapter = await (navigator as any).gpu.requestAdapter();
    if (!adapter) {
      return {
        supported: false,
        reason:
          "WebGPU is not available due to platform restrictions or lack of hardware support.",
      };
    }

    // If we get an adapter, return success
    return { supported: true, reason: "WebGPU is supported and enabled." };
  } catch (error) {
    // If any error occurs, handle it gracefully
    return {
      supported: false,
      reason: `WebGPU initialization failed: ${(error as Error).message}`,
    };
  }
}

export function useWebGPUAvailability() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    isWebGPUSupported().then(({ supported }) => {
      setIsAvailable(supported);
    });
  }, []);

  return { isWebGPUAvailable: isAvailable };
}
