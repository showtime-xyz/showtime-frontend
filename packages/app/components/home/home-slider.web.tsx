import React, { useRef, useState, useCallback, memo } from "react";
import { useWindowDimensions } from "react-native";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { clamp } from "@showtime-xyz/universal.utils";

import { Controller } from "app/lib/carousel/controller";
import { CarouselProps } from "app/lib/carousel/types";

import { breakpoints } from "design-system/theme";

type Props = Pick<CarouselProps, "data" | "height" | "renderItem"> & {
  slidesPerView?: number;
};

export const HomeSlider = memo(function HomeSlider({
  data,
  renderItem,
  height,
  slidesPerView = 2.2,
}: Props) {
  const swiperRef = useRef(null);
  const [allowSlideNext, setAllowSlideNext] = useState(
    data.length > Math.floor(slidesPerView)
  );
  const [allowSlidePrev, setAllowSlidePrev] = useState(false);
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const onProgress = useCallback(
    (_: any, progress: number) => {
      if (!isMdWidth) return;
      if (progress <= 0) {
        setAllowSlidePrev(false);
      } else if (progress >= 1) {
        setAllowSlideNext(false);
      } else {
        setAllowSlideNext(true);
        setAllowSlidePrev(true);
      }
    },
    [isMdWidth]
  );
  return (
    <>
      <Swiper
        height={height}
        slidesPerView={slidesPerView}
        className="h-full w-full"
        spaceBetween={16}
        slidesOffsetBefore={isMdWidth ? 0 : 16}
        slidesOffsetAfter={isMdWidth ? 0 : 16}
        ref={swiperRef}
        onProgress={onProgress}
      >
        {data.map((item, index) => (
          <SwiperSlide
            className="flex items-center justify-center"
            style={{ height }}
            key={index.toString()}
          >
            {renderItem({
              item,
              index,
              animationValue: { value: 0 },
            })}
          </SwiperSlide>
        ))}
      </Swiper>

      <Controller
        allowSlideNext={allowSlideNext}
        allowSlidePrev={allowSlidePrev}
        prev={() => {
          const prevIndex = (swiperRef.current as any)?.swiper.realIndex ?? 0;
          (swiperRef.current as any)?.swiper.slideTo(
            clamp(prevIndex - Math.floor(slidesPerView), 0, data.length - 1)
          );
        }}
        next={() => {
          const prevIndex = (swiperRef.current as any)?.swiper.realIndex ?? 0;

          (swiperRef.current as any)?.swiper.slideTo(
            clamp(prevIndex + Math.floor(slidesPerView), 0, data.length - 1)
          );
        }}
      />
    </>
  );
});
