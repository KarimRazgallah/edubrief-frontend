"use client";

import React from "react";
import NewsletterForm from "./NewsletterForm";

interface NewsletterFormContainerProps {
  variant?: "default" | "compact";
}

export default function NewsletterFormContainer({
  variant = "compact",
}: NewsletterFormContainerProps) {
  return <NewsletterForm variant={variant} />;
}
