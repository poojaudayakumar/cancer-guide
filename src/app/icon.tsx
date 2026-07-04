import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
          backgroundColor: "#4f7965",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            fill="#faf6ef"
            d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 5.62 6.54 11.63 6.82 11.89a1 1 0 0 0 1.36 0c.28-.26 6.82-6.27 6.82-11.89C19.5 5.36 16.14 2 12 2Z"
          />
          <circle cx="12" cy="9.5" r="2.9" fill="#4f7965" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
