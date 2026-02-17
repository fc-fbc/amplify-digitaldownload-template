import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request A Screening",
  description: " Submit your request here to book a film screening.",
};

export default function RequestScreeningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>{children}</>
  );
}
