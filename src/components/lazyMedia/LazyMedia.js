"use client";
import { useState, useEffect, useRef } from "react";

const LazyMedia = ({ type, src, alt = "", className = "", poster = "", preload = false, unoptimized = false, width = null, height = null, ...props }) => {
  const [isInViewport, setIsInViewport] = useState(preload);
  const mediaRef = useRef(null);

  useEffect(() => {
    if (!preload) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (mediaRef.current) {
        observer.observe(mediaRef.current);
      }

      return () => {
        if (mediaRef.current) observer.unobserve(mediaRef.current);
      };
    }
  }, [preload]);

  return (
    <>
      {type.toLowerCase() === "image" && (
        <img
          ref={mediaRef}
          src={isInViewport ? src : undefined}
          alt={alt}
          className={className}
          loading="lazy"
          width={width}
          height={height}
          {...props}
        />
      )}
      {type.toLowerCase() === "video" && (
        <video
          ref={mediaRef}
          src={isInViewport ? src : undefined}
          poster={poster}
          className={className}
          autoPlay
          muted
          loop
          playsInline
          width={width}
          height={height}
          {...props}
        />
      )}
    </>
  );
};


export default LazyMedia;