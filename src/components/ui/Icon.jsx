/** Lightweight inline SVG icon set — no external icon dependency */
const paths = {
  search: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
    />
  ),
  bell: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
    />
  ),
  user: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 21a8 8 0 1 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
    />
  ),
  plus: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  ),
  mail: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16v12H4V6Zm0 0 8 7 8-7"
    />
  ),
  lock: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z"
    />
  ),
  eye: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
    />
  ),
  "eye-off": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m3 3 18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2M9.9 5.1A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.2 4.1M6.1 6.1C3.7 7.8 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.2 3.6-.6"
    />
  ),
  mapPin: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
    />
  ),
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"
    />
  ),
  check: (
    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
  ),
  heart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s-7-4.4-9.5-8.5C.5 9 2.5 5 6.5 5c2 0 3.5 1.2 5.5 3.2C14 6.2 15.5 5 17.5 5c4 0 6 4 4 7.5C19 16.6 12 21 12 21Z"
    />
  ),
  cart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3h2l.8 3M7 13h10l3-8H6.2M7 13 5.8 6M7 13l-1.5 5h12M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
    />
  ),
  message: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5A8 8 0 1 1 21 12Z"
    />
  ),
  bolt: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
    />
  ),
  arrow: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
  ),
  laptop: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16v10H4V6Zm-2 12h20"
    />
  ),
  keyboard: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 7h16v10H4V7Zm3 3h.01M10 10h.01M14 10h.01M17 10h.01M7 14h10"
    />
  ),
  mouse: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3a5 5 0 0 1 5 5v5a5 5 0 0 1-10 0V8a5 5 0 0 1 5-5Zm0 0v4"
    />
  ),
  monitor: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 5h16v11H4V5Zm4 14h8M12 16v3"
    />
  ),
  shirt: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 5 4 8v3l3-1v9h10V10l3 1V8l-4-3-2 2h-2L8 5Z"
    />
  ),
  sofa: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 12V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M4 12h16v6H4v-6Z"
    />
  ),
  gamepad: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 10h12a4 4 0 0 1 0 8H6a4 4 0 0 1 0-8Zm3 2v4m-2-2h4m7-1h.01M17 15h.01"
    />
  ),
  book: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z"
    />
  ),
  more: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 12h.01M12 12h.01M19 12h.01"
    />
  ),
  box: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8 12 3 3 8l9 5 9-5Zm0 0v8l-9 5-9-5V8"
    />
  ),
  truck: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7h11v10H3V7Zm11 3h4l3 3v4h-7V10ZM7 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
    />
  ),
  tag: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 12 12 4H5v7l8 8 7-7ZM8.5 8.5h.01"
    />
  ),
  phone: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 3h4l2 5-2.5 1.5a12 12 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z"
    />
  ),
  info: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16v-4m0-4h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
    />
  ),
  camera: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 8h3l2-2h6l2 2h3v12H4V8Zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
    />
  ),
  ban: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.9 4.9 14.2 14.2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  ),
  clock: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  ),
  star: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m12 3 2.5 6.5L21 11l-5 4.2L17.5 22 12 18.5 6.5 22 8 15.2 3 11l6.5-1.5L12 3Z"
    />
  ),
  x: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
  ),
  logout: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
    />
  ),
};

export default function Icon({
  name,
  className = "",
  strokeWidth = 1.8,
  filled = false,
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={["size-5 shrink-0", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {paths[name] ?? paths.more}
    </svg>
  );
}
