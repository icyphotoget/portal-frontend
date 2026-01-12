"use client";

export default function PrivacySettingsButton({
  className = "",
  children = "Manage Privacy Settings",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("fp:openPrivacySettings"))}
      className={className}
    >
      {children}
    </button>
  );
}
