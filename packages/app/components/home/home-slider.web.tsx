import React, { useRef, useState, useCallback } from "react";
import { useWindowDimensions } from "react-native";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { Controller } from "app/lib/carousel/controller";
import { CarouselProps } from "app/lib/carousel/types";

import { breakpoints } from "design-system/theme";

type Props = Pick<CarouselProps, "data" | "height" | "renderItem">;

export function HomeSlider({ data, renderItem, height }: Props) {
  const swiperRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [allowSlideNext, setAllowSlideNext] = useState(false);
  const [allowSlidePrev, setAllowSlidePrev] = useState(false);
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const onProgress = useCallback(
    (_: any) => {
      if (!isMdWidth) return;
      setAllowSlideNext(_.allowSlideNext);
      setAllowSlidePrev(_.allowSlidePrev);
    },
    [isMdWidth]
  );
  return (
    <>
      <Swiper
        height={height}
        slidesPerView={isMdWidth ? 3.5 : 2.2}
        className="h-full w-full"
        spaceBetween={16}
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
        prev={() => (swiperRef.current as any)?.swiper.slidePrev()}
        next={() => (swiperRef.current as any)?.swiper.slideNext()}
      />
    </>
  );
}
