import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf6ef",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: 100,
              borderRadius: 9999,
              backgroundColor: "#4f7965",
            }}
          >
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path
                fill="#faf6ef"
                d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 5.62 6.54 11.63 6.82 11.89a1 1 0 0 0 1.36 0c.28-.26 6.82-6.27 6.82-11.89C19.5 5.36 16.14 2 12 2Z"
              />
              <circle cx="12" cy="9.5" r="2.9" fill="#4f7965" />
            </svg>
          </div>
          <div
            style={{
              fontSize: 66,
              fontWeight: 700,
              color: "#2f3532",
              letterSpacing: "-0.02em",
            }}
          >
            Project Resource Map
          </div>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 30,
            fontWeight: 600,
            color: "#4f7965",
            textAlign: "center",
          }}
        >
          Find free support services & guides for cancer patients
        </div>
        <div
          style={{
            marginTop: 44,
            width: 220,
            height: 8,
            borderRadius: 9999,
            backgroundColor: "#c99a94",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
