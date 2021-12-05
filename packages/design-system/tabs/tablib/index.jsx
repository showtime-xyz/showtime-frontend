import React,{useContext} from 'react'
import {ScrollView, Pressable, View, Animated} from 'react-native'
import PagerView from 'react-native-pager-view';
import Reanimated, {useSharedValue,useDerivedValue,scrollTo,useAnimatedRef, useAnimatedScrollHandler,useAnimatedStyle} from 'react-native-reanimated';
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

const Root = ({Header, children, tabBarHeight, tabItemWidth,  initialIndex, onIndexChange: onIndexChangeProp}) => {
    const pagerRef = React.useRef();
    const tabBarRef = React.useRef();
    let listChild
    let restChildren = [];
    let prevIndex = useSharedValue(initialIndex ?? 0);
    const position = React.useRef(new Animated.Value(0)).current
    const offset = React.useRef(new Animated.Value(0)).current
    const scrollY = useSharedValue(0);
    const translateY = useSharedValue(0);
    const [headerHeight, setHeaderHeight] = React.useState(0);


    const onIndexChange = (newIndex) => {
        if (newIndex > prevIndex.value) {
            tabBarRef.current.scrollTo({x: tabItemWidth * (newIndex + 1) })
        } else {
            tabBarRef.current.scrollTo({x: tabItemWidth  * (newIndex - 1) })
        }
        prevIndex.value = newIndex;
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


    return <TabContext.Provider value={{tabBarHeight,index:prevIndex, translateY,scrollY, offset, position, headerHeight, initialIndex,tabBarRef, onIndexChange,pagerRef}}>
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
    const {tabBarHeight, tabBarRef} = useContext(TabContext)
    const newChildren = React.Children.map(children, (c, index) => {
        return React.cloneElement(c, {index})
    })

    return  <ScrollView bounces={false} ref={tabBarRef} showsHorizontalScrollIndicator={false} horizontal style={{height: tabBarHeight}} {...props}>
        {newChildren}
        </ScrollView>
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
    const {pagerRef} = useContext(TabContext)
   return <Pressable onPress={() => {
    pagerRef.current.setPage(index)
   }} {...props}>
        {children}
    </Pressable>
}

const TabScrollView = React.forwardRef(({children, ...props}, ref) => {
    const {headerHeight, tabBarHeight, translateY, index } = useContext(TabContext)
    const elementIndex = React.useContext(TabIndexContext).index;
    const aref = useAnimatedRef();
   
    const scrollHandler = useAnimatedScrollHandler((e) =>{
        // only current scrollview controls the header translate, other scrollviews sync their scroll posisions
        if (elementIndex === index.value) {
            translateY.value = Math.min(0,Math.max(-headerHeight, -e.contentOffset.y))
        }
    })

    useDerivedValue(() => {
        if (index.value !== elementIndex) {
            scrollTo(aref, 0, -1 * translateY.value, false);
        }
    });

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