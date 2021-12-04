import React,{useContext} from 'react'
import {ScrollView, Pressable, View} from 'react-native'
import PagerView from 'react-native-pager-view';
const TabContext = React.createContext();

const Root = ({Header, children, tabBarHeight, headerHeight, initialIndex, onIndexChange}) => {
    const pagerRef = React.useRef();
    let listChild
    let restChildren = [];

     React.Children.forEach(children, c  => {
         console.log("f ", c)
        if (c.type === List) {
            listChild = c;
        } else {
            restChildren.push(c)
        }
    })

    return <TabContext.Provider value={{tabBarHeight, headerHeight, initialIndex, onIndexChange,pagerRef}}>
        <View style={{position:'absolute', zIndex:1}} pointerEvents="box-none">
            <Header />
            {listChild}
        </View>
        {restChildren}  
    </TabContext.Provider>
}

const List = ({children, ...props}) => {
    const {tabBarHeight} = useContext(TabContext)
    const newChildren = React.Children.map(children, (c, index) => {
        return React.cloneElement(c, {index})
    })

    return  <ScrollView bounces={false} showsHorizontalScrollIndicator={false} horizontal style={{height: tabBarHeight}} {...props}>
        {newChildren}
        </ScrollView>
}

List.displayName = "List"

const Pager = ({children}) => {
    const {initialIndex, onIndexChange} = useContext(TabContext)
    const {tabBarHeight,pagerRef} = useContext(TabContext)
    return <PagerView style={{flex:1 }} ref={pagerRef} initialPage={initialIndex} onIndexChange={onIndexChange}>
        {children}
    </PagerView>
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
    const {headerHeight, tabBarHeight} = useContext(TabContext)
    return <ScrollView ref={ref} contentContainerStyle={{paddingTop: tabBarHeight + headerHeight}} {...props}>
        {children}
    </ScrollView>
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