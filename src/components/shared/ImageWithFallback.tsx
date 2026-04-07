"use client";

import Image, { type ImageProps } from "next/image";
import * as React from "react";

type PlaceholderType = "bar" | "staff" | "blog" | "event";

type Props = Omit<ImageProps, "src"> & {
  src?: string | null;
  placeholderType: PlaceholderType;
};

const getPlaceholderSrc = (placeholderType: PlaceholderType) =>
  `/images/placeholders/${placeholderType}-placeholder.webp`;

export const ImageWithFallback = ({
  src,
  alt,
  placeholderType,
  ...props
}: Props) => {
  const placeholderSrc = getPlaceholderSrc(placeholderType);
  const [currentSrc, setCurrentSrc] = React.useState<string>(
    src ?? placeholderSrc,
  );

  React.useEffect(() => {
    setCurrentSrc(src ?? placeholderSrc);
  }, [src, placeholderSrc]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => setCurrentSrc(placeholderSrc)}
    />
  );
};
