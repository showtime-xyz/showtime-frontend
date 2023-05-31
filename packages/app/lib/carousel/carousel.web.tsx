import React, { useRef } from "react";
import { View } from "react-native";

import { Pagination, EffectFade, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

import "./carousel.css";
import { Controller } from "./controller";
import { CarouselProps } from "./types";

const paginationClassName = {
  dot: "dot-pagination",
  rectangle: "rectangle-pagination",
};
export function Carousel({
  renderItem,
  width,
  height,
  loop,
  scrollAnimationDuration = 500,
  autoPlayInterval = 2000,
  autoPlay,
  controller = false,
  controllerTw = "",
  data,
  effect,
  tw,
  pagination,
}: CarouselProps) {
  const swiperRef = useRef(null);
  const isDark = useIsDarkMode();
  return (
    <>
      <Swiper
        width={width}
        height={height}
        loop={loop}
        longSwipesMs={scrollAnimationDuration}
        autoplay={
          autoPlay
            ? {
                delay: autoPlayInterval,
                disableOnInteraction: false,
              }
            : undefined
        }
        pagination={
          pagination
            ? {
                horizontalClass:
                  paginationClassName[pagination?.variant || "dot"],
                clickable: true,
              }
            : false
        }
        modules={[Pagination, EffectFade, Autoplay]}
        style={{
          width,
          marginTop: controller ? 30 : 0,
        }}
        className={tw}
        effect={effect}
        // @ts-ignore
        ref={swiperRef}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index.toString()}>
            <View style={{ height }}>
              {renderItem({
                item,
                index,
                animationValue: { value: 0 },
              })}
            </View>
          </SwiperSlide>
        ))}
      </Swiper>

      {controller && data.length > 0 && (
        <Controller
          prev={() => (swiperRef.current as any)?.swiper.slidePrev()}
          next={() => (swiperRef.current as any)?.swiper.slideNext()}
          tw={controllerTw}
        />
      )}
    </>
  );
}
