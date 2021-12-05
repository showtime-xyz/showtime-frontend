import React,{useContext} from 'react'
import {Pressable, View, Animated, useWindowDimensions} from 'react-native'
import {PagerView} from 'react-native-pager-view';
import Reanimated, {useSharedValue,useDerivedValue,scrollTo,useAnimatedRef, runOnJS, useAnimatedReaction, Extrapolate, interpolate,useAnimatedScrollHandler,useAnimatedStyle} from 'react-native-reanimated';
const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);
export const TabContext = React.createContext();
const TabIndexContext = React.createContext();

export default function mergeRef(
    refs) {
    return (value) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(value);
        } else if (ref != null) {
          ref.current = value;
        }
      });
    };
  }

const Root = ({Header, children, tabBarHeight, initialIndex, onIndexChange: onIndexChangeProp}) => {
    const pagerRef = React.useRef();
    const tabBarRef = React.useRef();
    let listChild
    let restChildren = [];
    let index = useSharedValue(initialIndex ?? 0);
    const position = React.useRef(new Animated.Value(0)).current
    const offset = React.useRef(new Animated.Value(0)).current
    const scrollY = useSharedValue(0);
    const translateY = useSharedValue(0);
    const [headerHeight, setHeaderHeight] = React.useState(0);
    const requestOtherViewsToSyncTheirScrollPosition = useSharedValue(false);
    const tablistScrollRef = useAnimatedRef();
    const tabItemLayouts = [];

    const onIndexChange = (newIndex) => {
       
        index.value = newIndex;
        onIndexChangeProp(newIndex)
    }

     React.Children.forEach(children, c  => {
        if (c.type === List) {
            listChild = c;
        } else {
            restChildren.push(c)
        }
    })
    const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{translateY: translateY.value}],
		}
	}, [headerHeight])


    return <TabContext.Provider value={{tabBarHeight,index,tabItemLayouts, tablistScrollRef, requestOtherViewsToSyncTheirScrollPosition, translateY,scrollY, offset, position, headerHeight, initialIndex,tabBarRef, onIndexChange,pagerRef}}>
        <Reanimated.View style={[{position:'absolute', zIndex:1}, animatedStyle]} pointerEvents="box-none">
            <View onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)} pointerEvents="box-none">
                <Header />
            </View>
            {listChild}
        </Reanimated.View>
        {headerHeight ? restChildren : null}
    </TabContext.Provider>
}

const List = ({children, ...props}) => {
    const {tabBarHeight, tablistScrollRef, index, tabItemLayouts } = useContext(TabContext)
    const newChildren = React.Children.map(children, (c, index) => {
        return React.cloneElement(c, {index})
    })
    
    const listWidth = useSharedValue(0);
    const windowWidth = useWindowDimensions().width;
    const prevIndex = useSharedValue(0);

    const scrollTo = (x) => {
        tablistScrollRef.current.scrollTo({x})
    }

    useDerivedValue(() => {
        if (prevIndex.value) {
            const itemLayoutX = tabItemLayouts[index.value].value.x;
            const itemWidth = tabItemLayouts[index.value].value.width;
            runOnJS(scrollTo)(itemLayoutX - windowWidth / 2 + itemWidth / 2)
        }
        prevIndex.value = index.value;
    }, [windowWidth])
   

    return  <Reanimated.ScrollView onLayout={(e) => {
        listWidth.value = e.nativeEvent.layout.width
    }} bounces={false} ref={tablistScrollRef} showsHorizontalScrollIndicator={false} horizontal style={{height: tabBarHeight}} {...props}>
        {newChildren}
        </Reanimated.ScrollView>
}

List.displayName = "List"


const Pager = ({children}) => {
    const {initialIndex, onIndexChange} = useContext(TabContext)
    const {tabBarHeight,pagerRef, position , offset} = useContext(TabContext)
    const newChildren = React.Children.map(children, (c,i) => {
        return <TabIndexContext.Provider value={{index:i}}>
            {c}
        </TabIndexContext.Provider>
    })
    return <AnimatedPagerView style={{flex:1 }} ref={pagerRef} onPageScroll={Animated.event(
        [
          {
            nativeEvent: {
              position: position,
              offset: offset,
            },
          },
        ],
        { useNativeDriver: true }
      )
    } initialPage={initialIndex} onPageSelected={(e) => onIndexChange(e.nativeEvent.position)}>
        {newChildren}
    </AnimatedPagerView>
}

const Content = ({children, ...props}) => {
    const {headerHeight, tabBarHeight} = useContext(TabContext)

    return <View {...props} style={{paddingTop: headerHeight + tabBarHeight}}>
        {children}
    </View>
}

const Trigger = ({children, index, ...props}) => {
    const {pagerRef, tabItemLayouts} = useContext(TabContext)
    tabItemLayouts[index] = useSharedValue(); 

    return <Pressable onLayout={e => {
    tabItemLayouts[index].value = e.nativeEvent.layout
   }} onPress={() => {
    pagerRef.current.setPage(index)
   }} {...props}>
        {children}
    </Pressable>
}

const TabScrollView = React.forwardRef(({children, ...props}, ref) => {
    const {headerHeight, requestOtherViewsToSyncTheirScrollPosition, tabBarHeight, translateY, index } = useContext(TabContext)
    const elementIndex = React.useContext(TabIndexContext).index;
    const aref = useAnimatedRef();
    const scrollY = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler({
        onBeginDrag() {
            requestOtherViewsToSyncTheirScrollPosition.value = false
        },
        onMomentumBegin() {
            requestOtherViewsToSyncTheirScrollPosition.value = false
        },
        onScroll(e) {
            // only current scrollview controls the header translate, other scrollviews sync their scroll posisions
            if (elementIndex === index.value) {
                scrollY.value = e.contentOffset.y 
                translateY.value = interpolate(scrollY.value, [0, headerHeight], [0, -headerHeight], Extrapolate.CLAMP)
            }
        },
        onEndDrag() {
            requestOtherViewsToSyncTheirScrollPosition.value = true
        },
        onMomentumEnd() {
            requestOtherViewsToSyncTheirScrollPosition.value = true
        }
    })

    useDerivedValue(( ) => {
        if (index.value !== elementIndex && requestOtherViewsToSyncTheirScrollPosition.value) {
            const nextScrollY = -1 * translateY.value;
            // if another tab just started showing header or scroll is less than translated header. 
            if (nextScrollY < headerHeight || scrollY.value < nextScrollY) {
                scrollTo(aref, 0, nextScrollY , false);
            } 
        }  
    })


    return <Reanimated.ScrollView scrollEventThrottle={16} onScroll={scrollHandler} ref={mergeRef([aref, ref])} contentContainerStyle={{paddingTop: tabBarHeight + headerHeight}} {...props}>
        {children}
    </Reanimated.ScrollView>
})

export const Tabs = {
    Root,
    List,
    Pager,
    Trigger,
    View: Content,
    ScrollView: TabScrollView
}


// const mounted = React.useRef(false);

    // React.useEffect(() => {
    //     if (mounted.current) {
    //         pagerRef.current.setPage(index)
    //     } else {
    //         // Set initial page without animation
    //         console.log("eef ", index)
    //         pagerRef.current.setPageWithoutAnimation(index)
    //         mounted.current = true
    //     }
    // },[index])