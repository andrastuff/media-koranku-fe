import type { HTMLAttributes } from "react";

type ArticleImageFrameProps = HTMLAttributes<HTMLDivElement>;

export default function ArticleImageFrame({
  className = "",
  ...props
}: ArticleImageFrameProps) {
  return (
    <div
      className={`article-image-frame relative overflow-hidden ${className}`}
      {...props}
    />
  );
}
